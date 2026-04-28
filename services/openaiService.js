/**
 * openaiService.js
 * Delega para aiProvider.js.
 * O prompt é carregado do Firebase (editável pelo painel admin).
 * Se não houver prompt salvo, usa o padrão abaixo.
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');
const { db } = require('../config/firebase');

const OWNER_UID = process.env.BLOQUINHO_OWNER_UID || 'avQGpnMx29ZO7NtdRjvUHLEGhAL2';

const PROMPT_PADRAO = `Você é um assistente pessoal do Ricardo, estudante de TI.
Seu papel é ajudar com dúvidas, responder perguntas e apoiar os estudos.

Diretrizes:
- Responda SEMPRE em português brasileiro
- Seja direto e objetivo (máximo 3 linhas)
- NÃO mencione ofertas, produtos ou vendas
- Se não souber algo, diga honestamente
- Use emojis com moderação`;

// Cache do prompt para não buscar no Firebase a cada mensagem
let promptCache = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

async function getSystemPrompt() {
  const agora = Date.now();
  if (promptCache && agora - cacheTime < CACHE_TTL) return promptCache;

  try {
    const cfgDoc = await db.collection('users').doc(OWNER_UID)
      .collection('agent_context').doc('config').get();
    if (cfgDoc.exists && cfgDoc.data().systemPrompt) {
      promptCache = cfgDoc.data().systemPrompt;
      cacheTime = agora;
      return promptCache;
    }
  } catch (_) { /* usa padrão */ }

  return PROMPT_PADRAO;
}

async function gerarResposta(historico, contextoProdutos = '', contextoExtra = {}) {
  const systemContent = await getSystemPrompt();
  return _gerarResposta(systemContent, historico);
}

module.exports = { gerarResposta };
