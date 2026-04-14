const { listarConversas } = require('../services/conversationService');
const { enviarMensagem } = require('../services/whatsappService');

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
 * Envio manual de mensagem (uso administrativo)
 */
async function enviarManual(req, res) {
  try {
    const { numero, mensagem } = req.body;

    if (!numero || !mensagem) {
      return res.status(400).json({ erro: 'Campos "numero" e "mensagem" são obrigatórios' });
    }

    await enviarMensagem(numero, mensagem);
    res.status(200).json({ status: 'enviado', numero });
  } catch (error) {
    console.error('[Conversations] Erro ao enviar manual:', error.message);
    res.status(500).json({ erro: 'Falha ao enviar mensagem' });
  }
}

module.exports = { listar, enviarManual };
