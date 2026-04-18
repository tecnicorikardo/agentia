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

    console.log(`[WhatsApp] Preparando envio para ${numero}...`);
    await delayHumano(tempoAleatorio());

    // Evolution API v2 usa campo "text" direto (não "textMessage")
    const url = `${BASE_URL}/message/sendText/${INSTANCE}`;
    
    const response = await axios.post(
      url,
      { number: numero, text: mensagem },
      {
        headers: { apikey: API_KEY, 'Content-Type': 'application/json' },
        timeout: 15000, // Aumentado para 15s para evitar timeout em redes lentas
      }
    );

    console.log(`[WhatsApp] Sucesso ao enviar para ${numero}`);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error(`[WhatsApp] ERRO no envio para ${numero}:`, JSON.stringify(errorData, null, 2));
    
    // Log extra se for erro de timeout
    if (error.code === 'ECONNABORTED') {
      console.error(`[WhatsApp] Timeout ao conectar com a API em: ${BASE_URL}`);
    }
    
    throw new Error('Falha ao enviar mensagem via WhatsApp');
  }
}

function extrairDadosWebhook(payload) {
  try {
    const data = payload?.data || payload;
    if (!data) {
      console.log('[Webhook] Payload vazio ou inválido');
      return null;
    }

    const evento = payload?.event || '';
    const remoteJid = data?.key?.remoteJid || '';
    const fromMe = data?.key?.fromMe === true;
    const tipo = data?.messageType;

    console.log(`[Webhook] Evento: ${evento} | JID: ${remoteJid} | FromMe: ${fromMe} | Tipo: ${tipo}`);

    // Só processa evento de mensagem recebida (case-insensitive)
    if (evento && evento.toLowerCase() !== 'messages.upsert') return null;

    // Ignora mensagens enviadas pelo próprio bot
    if (fromMe) return null;

    if (tipo !== 'conversation' && tipo !== 'extendedTextMessage') {
       console.log(`[Webhook] Tipo de mensagem ignorado: ${tipo}`);
       return null;
    }

    const mensagem =
      data?.message?.conversation ||
      data?.message?.extendedTextMessage?.text;

    if (!mensagem) {
      console.log('[Webhook] Mensagem sem conteúdo de texto');
      return null;
    }

    // Limpa o JID para obter apenas o número (remove @s.whatsapp.net, @lid, etc.)
    const numero = remoteJid.replace(/@.*$/, '');

    console.log(`[WhatsApp] Mensagem extraída de ${numero}: "${mensagem}"`);
    return { numero, mensagem };
  } catch (error) {
    console.error('[WhatsApp] Erro ao extrair dados do webhook:', error.message);
    return null;
  }
}

module.exports = { enviarMensagem, extrairDadosWebhook };

