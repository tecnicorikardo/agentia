const { db } = require('../config/firebase');

const COLECAO = 'conversas';
const MAX_HISTORICO = 20; // Limita histórico para não estourar tokens

/**
 * Busca ou cria uma conversa para o cliente
 * @param {string} clienteId - Número do WhatsApp do cliente
 * @returns {Promise<Object>} - Dados da conversa
 */
async function buscarConversa(clienteId) {
  try {
    const docRef = db.collection(COLECAO).doc(clienteId);
    const doc = await docRef.get();

    if (!doc.exists) {
      // Cria nova conversa
      const novaConversa = {
        clienteId,
        historico: [],
        status: 'novo',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      await docRef.set(novaConversa);
      return novaConversa;
    }

    return doc.data();
  } catch (error) {
    console.error('[Conversa] Erro ao buscar conversa:', error.message);
    throw error;
  }
}

/**
 * Salva nova mensagem no histórico e atualiza status
 * @param {string} clienteId
 * @param {string} mensagemCliente
 * @param {string} respostaIA
 * @param {string} status - 'novo' | 'interessado' | 'negociando' | 'fechado'
 */
async function salvarMensagem(clienteId, mensagemCliente, respostaIA, status = 'interessado') {
  try {
    const docRef = db.collection(COLECAO).doc(clienteId);
    const doc = await docRef.get();
    const dados = doc.exists ? doc.data() : { historico: [] };

    const historico = dados.historico || [];

    // Adiciona as novas mensagens
    historico.push({ role: 'user', content: mensagemCliente });
    historico.push({ role: 'assistant', content: respostaIA });

    // Mantém apenas as últimas MAX_HISTORICO mensagens (evita custo excessivo de tokens)
    const historicoLimitado = historico.slice(-MAX_HISTORICO);

    await docRef.set(
      {
        historico: historicoLimitado,
        status,
        atualizadoEm: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('[Conversa] Erro ao salvar mensagem:', error.message);
    throw error;
  }
}

/**
 * Lista todas as conversas (para painel administrativo)
 * @returns {Promise<Array>}
 */
async function listarConversas() {
  try {
    const snapshot = await db
      .collection(COLECAO)
      .orderBy('atualizadoEm', 'desc')
      .limit(100)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Remove histórico completo para não sobrecarregar a listagem
      historico: undefined,
      totalMensagens: (doc.data().historico || []).length,
    }));
  } catch (error) {
    console.error('[Conversa] Erro ao listar conversas:', error.message);
    throw error;
  }
}

/**
 * Detecta intenção do cliente para ajustar estratégia de venda
 * @param {string} mensagem
 * @returns {string} - 'preco' | 'interesse' | 'pedido' | 'geral'
 */
function detectarIntencao(mensagem) {
  const texto = mensagem.toLowerCase();

  if (/quanto custa|preço|valor|promoção|desconto/.test(texto)) return 'preco';
  if (/quero|gostei|me interessa|comprar|pedir/.test(texto)) return 'pedido';
  if (/tem|existe|disponível|opções|catálogo/.test(texto)) return 'interesse';

  return 'geral';
}

module.exports = { buscarConversa, salvarMensagem, listarConversas, detectarIntencao };
