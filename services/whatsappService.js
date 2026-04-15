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
    // Ignora números com @lid (IDs internos do WhatsApp — não são enviáveis)
    if (!numero || numero.includes('@') || numero.length < 10) {
      console.log(`[WhatsApp] Número inválido ignorado: ${numero}`);
      return null;
    }

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
    console.error('[WhatsApp] Erro ao enviar mensagem:', error.response?.data || error.message);
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
    const data = payload?.data || payload;
    if (!data) return null;

    const tipo = data?.messageType;
    if (tipo !== 'conversation' && tipo !== 'extendedTextMessage') return null;

    // Ignora mensagens enviadas pelo próprio bot
    if (data?.key?.fromMe) return null;

    const mensagem =
      data?.message?.conversation ||
      data?.message?.extendedTextMessage?.text;
    if (!mensagem) return null;

    // Usa o sender (número real) se remoteJid for @lid (ID interno do WhatsApp)
    const remoteJid = data?.key?.remoteJid || '';
    let numero;
    if (remoteJid.includes('@lid')) {
      // sender contém o número real: "5521994655341@s.whatsapp.net"
      numero = payload?.sender?.replace('@s.whatsapp.net', '') ||
               payload?.data?.sender?.replace('@s.whatsapp.net', '');
    } else {
      numero = remoteJid.replace('@s.whatsapp.net', '');
    }

    if (!numero) return null;

    console.log(`[WhatsApp] Mensagem de ${numero}: "${mensagem}"`);
    return { numero, mensagem };
  } catch (error) {
    console.error('[WhatsApp] Erro ao extrair dados do webhook:', error.message);
    return null;
  }
}

module.exports = { enviarMensagem, extrairDadosWebhook };
