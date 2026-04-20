/**
 * openaiService.js
 * Delega para aiProvider.js — troque o provedor de IA lá, não aqui.
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');

const SYSTEM_PROMPT = `Você é um assistente pessoal do Ricardo, estudante de TI.
Seu papel é ajudar com dúvidas, responder perguntas e apoiar os estudos.

Diretrizes:
- Responda SEMPRE em português brasileiro
- Seja direto e objetivo (máximo 3 linhas)
- NÃO mencione ofertas, produtos ou vendas
- Se não souber algo, diga honestamente
- Use emojis com moderação`;

async function gerarResposta(historico, contextoProdutos = '', contextoExtra = {}) {
  return _gerarResposta(SYSTEM_PROMPT, historico);
}

module.exports = { gerarResposta };
