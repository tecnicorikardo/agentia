const axios = require('axios');

const BASE_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE = process.env.EVOLUTION_INSTANCE;

const delayHumano = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tempoAleatorio = () => Math.floor(Math.random() * 2000) + 1000;

async function enviarMensagem(numero, mensagem) {
  try {
    if (!numero || numero.length < 8) {
      console.log(`[WhatsApp] Número inválido ignorado: ${numero}`);
      return null;
    }

    await delayHumano(tempoAleatorio());

    // Se for @lid, envia direto com o JID completo
    const destino = numero.includes('@') ? numero : numero;

    const response = await axios.post(
      `${BASE_URL}/message/sendText/${INSTANCE}`,
      { number: destino, textMessage: { text: mensagem } },
      {
        headers: { apikey: API_KEY, 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    console.log(`[WhatsApp] Mensagem enviada para ${destino}`);
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

    // Log completo para debug
    console.log('[DEBUG] event:', payload?.event,
      '| remoteJid:', data?.key?.remoteJid,
      '| fromMe:', data?.key?.fromMe,
      '| sender:', payload?.sender,
      '| participant:', data?.key?.participant,
      '| tipo:', data?.messageType);

    // Só processa evento de mensagem recebida
    const evento = payload?.event || '';
    if (evento && evento !== 'messages.upsert') return null;

    const tipo = data?.messageType;
    if (tipo !== 'conversation' && tipo !== 'extendedTextMessage') return null;

    // CRÍTICO: ignora mensagens enviadas pelo próprio bot
    if (data?.key?.fromMe === true) {
      console.log('[WhatsApp] Ignorando mensagem própria (fromMe=true)');
      return null;
    }

    const mensagem =
      data?.message?.conversation ||
      data?.message?.extendedTextMessage?.text;
    if (!mensagem) return null;

    // Mantém o JID completo para envio (incluindo @lid ou @s.whatsapp.net)
    const remoteJid = data?.key?.remoteJid || '';
    const numero = remoteJid; // Usa o JID completo diretamente

    if (!numero || numero.length < 8) {
      console.log('[WhatsApp] JID inválido:', remoteJid);
      return null;
    }

    if (!numero || numero.length < 8) {
      console.log('[WhatsApp] Número inválido:', remoteJid);
      return null;
    }

    console.log(`[WhatsApp] Mensagem de ${numero}: "${mensagem}"`);
    return { numero, mensagem };
  } catch (error) {
    console.error('[WhatsApp] Erro ao extrair dados do webhook:', error.message);
    return null;
  }
}

module.exports = { enviarMensagem, extrairDadosWebhook };
