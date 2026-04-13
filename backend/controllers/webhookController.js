const { extrairDadosWebhook, enviarMensagem } = require('../services/whatsappService');
const { gerarResposta } = require('../services/openaiService');
const { buscarConversa, salvarMensagem, detectarIntencao } = require('../services/conversationService');
const { obterContextoProdutos } = require('../services/produtoService');

// Controle anti-spam: armazena timestamps das últimas mensagens por número
const ultimaMensagem = new Map();
const INTERVALO_MINIMO_MS = 3000; // 3 segundos entre mensagens do mesmo cliente

/**
 * Processa mensagem recebida via webhook do WhatsApp
 */
async function receberMensagem(req, res) {
  // Responde imediatamente ao webhook para evitar timeout
  res.status(200).json({ status: 'recebido' });

  try {
    const dados = extrairDadosWebhook(req.body);
    if (!dados) return; // Ignora eventos irrelevantes

    const { numero, mensagem } = dados;

    // Anti-spam: ignora se a última mensagem foi há menos de 3s
    const agora = Date.now();
    const ultima = ultimaMensagem.get(numero) || 0;
    if (agora - ultima < INTERVALO_MINIMO_MS) {
      console.log(`[Webhook] Anti-spam ativado para ${numero}`);
      return;
    }
    ultimaMensagem.set(numero, agora);

    console.log(`[Webhook] Mensagem de ${numero}: "${mensagem}"`);

    // 1. Busca histórico do cliente
    const conversa = await buscarConversa(numero);
    const historico = conversa.historico || [];

    // 2. Detecta intenção para ajustar estratégia
    const intencao = detectarIntencao(mensagem);
    console.log(`[Webhook] Intenção detectada: ${intencao}`);

    // 3. Busca contexto de produtos
    const contextoProdutos = await obterContextoProdutos();

    // 4. Adiciona mensagem atual ao histórico temporário
    const historicoAtual = [...historico, { role: 'user', content: mensagem }];

    // 5. Gera resposta com IA
    const resposta = await gerarResposta(historicoAtual, contextoProdutos);

    // 6. Determina novo status da conversa
    const novoStatus = determinarStatus(intencao, conversa.status);

    // 7. Salva no Firebase
    await salvarMensagem(numero, mensagem, resposta, novoStatus);

    // 8. Envia resposta ao cliente (já inclui delay humano interno)
    await enviarMensagem(numero, resposta);

    console.log(`[Webhook] Resposta enviada para ${numero}`);
  } catch (error) {
    console.error('[Webhook] Erro ao processar mensagem:', error.message);
  }
}

/**
 * Determina o status da conversa com base na intenção e status atual
 */
function determinarStatus(intencao, statusAtual) {
  if (statusAtual === 'fechado') return 'fechado';
  if (intencao === 'pedido') return 'negociando';
  if (intencao === 'preco' || intencao === 'interesse') return 'interessado';
  return statusAtual || 'novo';
}

module.exports = { receberMensagem };
