/**
 * openaiService.js
 *
 * Mantido com este nome por compatibilidade, mas agora delega
 * para aiProvider.js — troque o provedor de IA lá, não aqui.
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');
const { buscarInfoLoja, obterContextoProdutos: _obterContextoProdutos } = require('./gestaoService');

/**
 * Monta o system prompt dinamicamente com dados reais da loja no Bloquinho
 */
async function montarSystemPrompt() {
  const loja = await buscarInfoLoja();
  const nomeLoja = loja.storeName || 'nossa loja';
  const endereco = loja.address || '';
  const telefone = loja.phone || '';
  const pix = loja.pixKey || '';

  let prompt = `Você é um atendente virtual animado e simpático da loja "${nomeLoja}"! 😊
Seu objetivo é atender os clientes, tirar dúvidas e fechar pedidos.

Informações da loja:
- Nome: ${nomeLoja}`;

  if (endereco) prompt += `\n- Endereço: ${endereco}`;
  if (telefone) prompt += `\n- Telefone: ${telefone}`;
  if (pix) prompt += `\n- Chave PIX: ${pix}`;

  prompt += `

Diretrizes:
- Responda SEMPRE em português brasileiro
- Seja animado e simpático, use emojis com moderação
- Respostas curtas e objetivas (máximo 3 linhas)
- Pergunte o nome do cliente no primeiro contato
- Quando o cliente escolher, confirme o pedido e o endereço de entrega
- Sugira produtos complementares quando fizer sentido
- Nunca invente produtos ou preços fora do cardápio informado
- Se perguntarem algo fora do cardápio, diga gentilmente que não temos no momento
- Se o cliente perguntar sobre fiado, informe o saldo atual se disponível`;

  return prompt;
}

/**
 * Gera resposta da IA com contexto real da loja
 * @param {Array}  historico        - Histórico de mensagens
 * @param {string} contextoProdutos - Produtos formatados (pode vir de fora ou buscar aqui)
 * @param {Object} contextoExtra    - Dados adicionais (fiado, vendas, etc)
 * @returns {Promise<string>}
 */
async function gerarResposta(historico, contextoProdutos = '', contextoExtra = {}) {
  const produtos = contextoProdutos || await _obterContextoProdutos();
  let systemContent = await montarSystemPrompt();

  if (produtos) {
    systemContent += `\n\nCardápio / Produtos disponíveis:\n${produtos}`;
  } else {
    systemContent += `\n\nAinda não há produtos cadastrados. Informe ao cliente que o cardápio está sendo atualizado.`;
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
