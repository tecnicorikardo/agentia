const { extrairDadosWebhook, enviarMensagem } = require('../services/telegramService');
const { gerarResposta } = require('../services/openaiService');
const { buscarConversa, salvarMensagem, detectarIntencao } = require('../services/conversationService');
const { avaliarResposta } = require('../services/studyService');
const { db } = require('../config/firebase');

// chat_id do dono — recebe as mensagens do scheduler e tem modo estudo ativo
const CHAT_ID_DONO = process.env.TELEGRAM_CHAT_ID || '';
const OWNER_UID = process.env.BLOQUINHO_OWNER_UID || 'avQGpnMx29ZO7NtdRjvUHLEGhAL2';

async function getIndiceEstudo() {
  try {
    const doc = await db.collection('users').doc(OWNER_UID)
      .collection('agent_context').doc('study_scheduler').get();
    if (!doc.exists) return 0;
    const proximo = doc.data().indiceAtual || 0;
    const { TOPICOS } = require('../services/studyService');
    return (proximo - 1 + TOPICOS.length) % TOPICOS.length;
  } catch {
    return 0;
  }
}

// Anti-spam por chat_id
const ultimaMensagem = new Map();
const INTERVALO_MINIMO_MS = 2000;

async function receberMensagem(req, res) {
  // Telegram exige resposta 200 rápida para não reenviar o update
  res.status(200).json({ ok: true });

  try {
    const dados = extrairDadosWebhook(req.body);
    if (!dados) return;

    const { chatId, mensagem } = dados;

    // Anti-spam
    const agora = Date.now();
    const ultima = ultimaMensagem.get(chatId) || 0;
    if (agora - ultima < INTERVALO_MINIMO_MS) {
      console.log(`[Webhook] Anti-spam: ignorando mensagem de ${chatId}`);
      return;
    }
    ultimaMensagem.set(chatId, agora);

    console.log(`[Webhook] Processando mensagem de chat_id ${chatId}...`);
    const conversa = await buscarConversa(chatId);
    const historico = conversa.historico || [];
    const intencao = detectarIntencao(mensagem);

    console.log(`[Webhook] Intenção para ${chatId}: ${intencao}`);

    const historicoAtual = [...historico, { role: 'user', content: mensagem }];

    // Modo estudo: se for o chat do dono e status 'estudando', avalia resposta
    let resposta;
    if (chatId === CHAT_ID_DONO && conversa.status === 'estudando') {
      const indice = await getIndiceEstudo();
      resposta = await avaliarResposta(historicoAtual, indice);
    } else {
      resposta = await gerarResposta(historicoAtual);
    }

    const novoStatus = determinarStatus(intencao, conversa.status);
    await salvarMensagem(chatId, mensagem, resposta, novoStatus);
    console.log(`[Webhook] Histórico salvo para ${chatId}`);

    await enviarMensagem(chatId, resposta);
    console.log(`[Webhook] Ciclo completo para ${chatId}`);

  } catch (error) {
    console.error(`[Webhook] ERRO CRÍTICO: ${error.message}`);
  }
}

function determinarStatus(intencao, statusAtual) {
  if (statusAtual === 'fechado') return 'fechado';
  if (intencao === 'pedido') return 'negociando';
  if (intencao === 'preco' || intencao === 'interesse') return 'interessado';
  return statusAtual || 'novo';
}

module.exports = { receberMensagem };
