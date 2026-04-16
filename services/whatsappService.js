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

    // remoteJid quando fromMe=false é quem mandou a mensagem
    // MAS na Evolution API v1, em alguns casos o remoteJid é o próprio bot
    // Nesse caso, o número do cliente está em payload.sender
    const remoteJid = data?.key?.remoteJid || '';
    const senderField = (payload?.sender || '').replace('@s.whatsapp.net', '');
    const numeroConectado = process.env.NUMERO_CONECTADO || '';

    let numero = remoteJid
      .replace('@s.whatsapp.net', '')
      .replace('@lid', '');

    // Se remoteJid for o próprio número conectado, usa o sender
    if (numero === numeroConectado || numero === senderField) {
      // Tenta outros campos
      const participant = (data?.key?.participant || '').replace('@s.whatsapp.net', '');
      if (participant && participant.length >= 8) {
        numero = participant;
      } else {
        console.log('[WhatsApp] Não foi possível identificar o remetente');
        return null;
      }
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
