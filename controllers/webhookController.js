const { extrairDadosWebhook, enviarMensagem } = require('../services/whatsappService');
const { gerarResposta } = require('../services/openaiService');
const { buscarConversa, salvarMensagem, detectarIntencao } = require('../services/conversationService');
const { avaliarResposta } = require('../services/studyService');
const { db } = require('../config/firebase');

const NUMERO_RICARDO = process.env.STUDY_NUMERO || '5521986925971';
const OWNER_UID = process.env.BLOQUINHO_OWNER_UID || 'avQGpnMx29ZO7NtdRjvUHLEGhAL2';

async function getIndiceEstudo() {
  try {
    const doc = await db.collection('users').doc(OWNER_UID)
      .collection('agent_context').doc('study_scheduler').get();
    if (!doc.exists) return 0;
    // O índice salvo é o PRÓXIMO a enviar, então o atual é o anterior
    const proximo = doc.data().indiceAtual || 0;
    const { TOPICOS } = require('../services/studyService');
    return (proximo - 1 + TOPICOS.length) % TOPICOS.length;
  } catch {
    return 0;
  }
}

// Anti-spam
const ultimaMensagem = new Map();
const INTERVALO_MINIMO_MS = 2000;

async function receberMensagem(req, res) {
  res.status(200).json({ status: 'recebido' });

  try {
    const dados = extrairDadosWebhook(req.body);
    if (!dados) return;

    const { numero, mensagem } = dados;

    const agora = Date.now();
    const ultima = ultimaMensagem.get(numero) || 0;
    if (agora - ultima < INTERVALO_MINIMO_MS) {
      console.log(`[Webhook] Anti-spam: ignorando mensagem de ${numero}`);
      return;
    }
    ultimaMensagem.set(numero, agora);

    console.log(`[Webhook] Processando mensagem de ${numero}...`);
    const conversa = await buscarConversa(numero);
    const historico = conversa.historico || [];

    const intencao = detectarIntencao(mensagem);
    console.log(`[Webhook] Intencao para ${numero}: ${intencao}`);

    const historicoAtual = [...historico, { role: 'user', content: mensagem }];

    console.log(`[Webhook] Gerando resposta IA para ${numero}...`);

    // Modo estudo: se for o número do Ricardo, IA avalia respostas de estudo
    let resposta;
    if (numero === NUMERO_RICARDO && conversa.status === 'estudando') {
      const indice = await getIndiceEstudo();
      resposta = await avaliarResposta(historicoAtual, indice);
    } else {
      resposta = await gerarResposta(historicoAtual);
    }

    const novoStatus = determinarStatus(intencao, conversa.status);
    await salvarMensagem(numero, mensagem, resposta, novoStatus);
    console.log(`[Webhook] Historico salvo para ${numero}`);

    await enviarMensagem(numero, resposta);
    console.log(`[Webhook] Ciclo completo para ${numero}`);

  } catch (error) {
    console.error(`[Webhook] ERRO CRITICO: ${error.message}`);
  }
}

function determinarStatus(intencao, statusAtual) {
  if (statusAtual === 'fechado') return 'fechado';
  if (intencao === 'pedido') return 'negociando';
  if (intencao === 'preco' || intencao === 'interesse') return 'interessado';
  return statusAtual || 'novo';
}

module.exports = { receberMensagem };
