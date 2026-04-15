const axios = require('axios');

const BASE_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE = process.env.EVOLUTION_INSTANCE;

// Delay simulado para parecer mais humano (entre 1s e 3s)
const delayHumano = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tempoAleatorio = () => Math.floor(Math.random() * 2000) + 1000;

/**
 * Envia mensagem de texto via Evolution API
 * @param {string} numero - Número do destinatário (ex: 5511999999999)
 * @param {string} mensagem - Texto a enviar
 */
async function enviarMensagem(numero, mensagem) {
  try {
    // Simula digitação humana antes de responder
    await delayHumano(tempoAleatorio());

    const response = await axios.post(
      `${BASE_URL}/message/sendText/${INSTANCE}`,
      {
        number: numero,
        textMessage: { text: mensagem },
      },
      {
        headers: {
          apikey: API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log(`[WhatsApp] Mensagem enviada para ${numero}`);
    return response.data;
  } catch (error) {
    console.error('[WhatsApp] Erro ao enviar mensagem:', error.message);
    throw new Error('Falha ao enviar mensagem via WhatsApp');
  }
}

/**
 * Extrai dados relevantes do payload do webhook da Evolution API
 * @param {Object} payload - Body recebido no webhook
 * @returns {Object|null} - { numero, mensagem } ou null se inválido
 */
function extrairDadosWebhook(payload) {
  try {
    // Loga payload completo para debug
    console.log('[WhatsApp] Payload recebido:', JSON.stringify(payload, null, 2));

    // Evolution API v1 envia: { event, instance, data: { key, messageType, message, ... } }
    // Tenta estrutura v1 primeiro, depois v2
    const data = payload?.data || payload;
    if (!data) return null;

    const tipo = data?.messageType;
    if (tipo !== 'conversation' && tipo !== 'extendedTextMessage') {
      console.log('[WhatsApp] Tipo de mensagem ignorado:', tipo);
      return null;
    }

    const numero = data?.key?.remoteJid?.replace('@s.whatsapp.net', '');
    const mensagem =
      data?.message?.conversation ||
      data?.message?.extendedTextMessage?.text;

    // Ignora mensagens enviadas pelo próprio bot
    const fromMe = data?.key?.fromMe;
    if (fromMe) {
      console.log('[WhatsApp] Mensagem própria ignorada');
      return null;
    }
    if (!numero || !mensagem) {
      console.log('[WhatsApp] Número ou mensagem ausente:', { numero, mensagem });
      return null;
    }

    return { numero, mensagem };
  } catch (error) {
    console.error('[WhatsApp] Erro ao extrair dados do webhook:', error.message);
    return null;
  }
}

module.exports = { enviarMensagem, extrairDadosWebhook };
