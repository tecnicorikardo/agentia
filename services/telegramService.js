/**
 * telegramService.js
 * Substitui o whatsappService.js — usa a Bot API oficial do Telegram.
 *
 * Variáveis de ambiente necessárias:
 *   TELEGRAM_BOT_TOKEN  — token gerado pelo @BotFather
 *   TELEGRAM_CHAT_ID    — chat_id do destinatário das mensagens do scheduler
 */

const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = () => `https://api.telegram.org/bot${TOKEN}`;

/**
 * Envia mensagem de texto para um chat_id
 * @param {string|number} chatId
 * @param {string} mensagem
 */
async function enviarMensagem(chatId, mensagem) {
  try {
    if (!chatId) {
      console.log('[Telegram] chat_id inválido, ignorando envio.');
      return null;
    }
    if (!TOKEN) {
      console.error('[Telegram] TELEGRAM_BOT_TOKEN não configurado!');
      return null;
    }

    const url = `${BASE_URL()}/sendMessage`;
    const response = await axios.post(
      url,
      {
        chat_id: chatId,
        text: mensagem,
        parse_mode: 'Markdown',
      },
      { timeout: 15000 }
    );

    console.log(`[Telegram] Mensagem enviada para chat_id ${chatId}`);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error(`[Telegram] ERRO ao enviar para ${chatId}:`, JSON.stringify(errorData, null, 2));
    throw new Error('Falha ao enviar mensagem via Telegram');
  }
}

/**
 * Extrai dados de um update recebido pelo webhook do Telegram
 * Suporta mensagens de texto normais e mensagens de voz (ignoradas com aviso)
 * @param {Object} payload — body do POST enviado pelo Telegram
 * @returns {{ chatId: string, mensagem: string } | null}
 */
function extrairDadosWebhook(payload) {
  try {
    const message = payload?.message || payload?.edited_message;

    if (!message) {
      console.log('[Telegram] Update sem campo message, ignorado.');
      return null;
    }

    const chatId = String(message.chat?.id);
    const texto = message.text;

    if (!texto) {
      const tipo = message.voice ? 'voz' : message.photo ? 'foto' : message.document ? 'documento' : 'desconhecido';
      console.log(`[Telegram] Tipo de mensagem ignorado: ${tipo}`);
      return null;
    }

    console.log(`[Telegram] Mensagem de chat_id ${chatId}: "${texto}"`);
    return { chatId, mensagem: texto };
  } catch (error) {
    console.error('[Telegram] Erro ao extrair dados do webhook:', error.message);
    return null;
  }
}

/**
 * Registra o webhook do bot no Telegram (chamar uma vez na inicialização)
 * @param {string} webhookUrl — URL pública do servidor (ex: https://seu-app.railway.app/webhook)
 */
async function registrarWebhook(webhookUrl) {
  try {
    if (!TOKEN) {
      console.error('[Telegram] TELEGRAM_BOT_TOKEN não configurado — webhook não registrado.');
      return;
    }
    const url = `${BASE_URL()}/setWebhook`;
    const response = await axios.post(url, { url: webhookUrl });
    console.log('[Telegram] Webhook registrado:', response.data);
  } catch (error) {
    console.error('[Telegram] Erro ao registrar webhook:', error.response?.data || error.message);
  }
}

module.exports = { enviarMensagem, extrairDadosWebhook, registrarWebhook };
