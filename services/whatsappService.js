const axios = require('axios');

const BASE_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE = process.env.EVOLUTION_INSTANCE;

const delayHumano = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tempoAleatorio = () => Math.floor(Math.random() * 2000) + 1000;

async function enviarMensagem(numero, mensagem) {
  try {
    if (!numero || numero.includes('@') || numero.length < 10) {
      console.log(`[WhatsApp] Número inválido ignorado: ${numero}`);
      return null;
    }

    await delayHumano(tempoAleatorio());

    const response = await axios.post(
      `${BASE_URL}/message/sendText/${INSTANCE}`,
      { number: numero, textMessage: { text: mensagem } },
      {
        headers: { apikey: API_KEY, 'Content-Type': 'application/json' },
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

function extrairDadosWebhook(payload) {
  try {
    const data = payload?.data || payload;
    if (!data) return null;

    // Log resumido para debug
    console.log('[WhatsApp] remoteJid:', data?.key?.remoteJid, '| fromMe:', data?.key?.fromMe, '| sender:', payload?.sender, '| tipo:', data?.messageType);

    const tipo = data?.messageType;
    if (tipo !== 'conversation' && tipo !== 'extendedTextMessage') return null;

    // Ignora mensagens enviadas pelo próprio bot
    if (data?.key?.fromMe) return null;

    const mensagem =
      data?.message?.conversation ||
      data?.message?.extendedTextMessage?.text;
    if (!mensagem) return null;

    const remoteJid = data?.key?.remoteJid || '';

    let numero;

    if (remoteJid.includes('@lid')) {
      // Quando vem @lid, o número do cliente está em data.key.participant
      // ou podemos usar o pushName não — precisamos do número
      // Na Evolution API v1, o campo correto é data.key.participant
      const participant = data?.key?.participant || '';
      if (participant) {
        numero = participant.replace('@s.whatsapp.net', '').replace('@lid', '');
      } else {
        // Fallback: tenta extrair de outros campos
        // O remoteJid @lid não tem o número — ignora essa mensagem
        console.log('[WhatsApp] @lid sem participant — ignorando');
        return null;
      }
    } else {
      numero = remoteJid.replace('@s.whatsapp.net', '');
    }

    if (!numero || numero.length < 8) return null;

    console.log(`[WhatsApp] Mensagem de ${numero}: "${mensagem}"`);
    return { numero, mensagem };
  } catch (error) {
    console.error('[WhatsApp] Erro ao extrair dados do webhook:', error.message);
    return null;
  }
}

module.exports = { enviarMensagem, extrairDadosWebhook };
