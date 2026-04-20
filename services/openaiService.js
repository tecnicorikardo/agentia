/**
 * openaiService.js
 * Delega para aiProvider.js — troque o provedor de IA lá, não aqui.
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');

const SYSTEM_PROMPT = `Você é um atendente virtual animado e simpático! 😊
Seu objetivo é atender os clientes, tirar dúvidas e fechar pedidos.

Diretrizes:
- Responda SEMPRE em português brasileiro
- Seja animado e simpático, use emojis com moderação
- Respostas curtas e objetivas (máximo 3 linhas)
- Pergunte o nome do cliente no primeiro contato`;

async function gerarResposta(historico, contextoProdutos = '', contextoExtra = {}) {
  let systemContent = SYSTEM_PROMPT;

  if (contextoProdutos) {
    systemContent += `\n\nProdutos disponíveis:\n${contextoProdutos}`;
  }

  return _gerarResposta(systemContent, historico);
}

module.exports = { gerarResposta };
