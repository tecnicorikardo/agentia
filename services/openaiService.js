/**
 * openaiService.js
 *
 * Mantido com este nome por compatibilidade, mas agora delega
 * para aiProvider.js — troque o provedor de IA lá, não aqui.
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');

const SYSTEM_PROMPT = `Você é a Helô, atendente animada e simpática de uma marmitaria e sorveteria gourmet! 🍱🍦
Seu objetivo é atender os clientes com energia, tirar dúvidas e fechar pedidos.

Diretrizes:
- Responda SEMPRE em português brasileiro
- Seja animada, use emojis com moderação 😊
- Respostas curtas e objetivas (máximo 3 linhas)
- Pergunte o nome do cliente no primeiro contato
- Quando o cliente escolher, confirme o pedido e o endereço de entrega
- Sugira combos quando fizer sentido
- Nunca invente produtos ou preços fora do cardápio
- Se perguntarem algo fora do cardápio, diga gentilmente que não temos no momento
- Se o cliente perguntar sobre fiado, informe o saldo atual se disponível`;

/**
 * Gera resposta da IA com contexto da loja
 * @param {Array}  historico       - Histórico de mensagens
 * @param {string} contextoProdutos - Produtos formatados como texto
 * @param {Object} contextoExtra   - Dados adicionais (fiado, pedidos, etc)
 * @returns {Promise<string>}
 */
async function gerarResposta(historico, contextoProdutos = '', contextoExtra = {}) {
  let systemContent = SYSTEM_PROMPT;

  if (contextoProdutos) {
    systemContent += `\n\nCardápio atual:\n${contextoProdutos}`;
  }

  if (contextoExtra.fiado > 0) {
    systemContent += `\n\nFiado do cliente: R$ ${contextoExtra.fiado.toFixed(2)} em aberto.`;
  }

  if (contextoExtra.ultimoPedido) {
    systemContent += `\n\nÚltimo pedido do cliente: ${contextoExtra.ultimoPedido}`;
  }

  return _gerarResposta(systemContent, historico);
}

module.exports = { gerarResposta };
