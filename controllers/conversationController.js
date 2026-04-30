const { listarConversas } = require('../services/conversationService');
const { enviarMensagem } = require('../services/telegramService');

/**
 * Lista todas as conversas para o painel administrativo
 */
async function listar(req, res) {
  try {
    const conversas = await listarConversas();
    res.status(200).json({ total: conversas.length, conversas });
  } catch (error) {
    console.error('[Conversations] Erro ao listar:', error.message);
    res.status(500).json({ erro: 'Falha ao buscar conversas' });
  }
}

/**
 * Envio manual de mensagem via Telegram (uso administrativo)
 * Body: { chatId: "123456789", mensagem: "texto" }
 */
async function enviarManual(req, res) {
  try {
    const { chatId, mensagem } = req.body;

    if (!chatId || !mensagem) {
      return res.status(400).json({ erro: 'Campos "chatId" e "mensagem" são obrigatórios' });
    }

    await enviarMensagem(chatId, mensagem);
    res.status(200).json({ status: 'enviado', chatId });
  } catch (error) {
    console.error('[Conversations] Erro ao enviar manual:', error.message);
    res.status(500).json({ erro: 'Falha ao enviar mensagem' });
  }
}

module.exports = { listar, enviarManual };
