/**
 * conversationService.js
 *
 * Gerencia histórico de conversas do agente.
 * Armazenado em: users/{ownerUid}/agent_conversations/{clienteNumero}
 *
 * Fica junto com os dados da loja no bloquinhodigital,
 * permitindo que o agente acesse produtos, vendas e conversas
 * na mesma conexão Firebase.
 */

const { db } = require('../config/firebase');

const OWNER_UID = process.env.BLOQUINHO_OWNER_UID;
const MAX_HISTORICO = 20;

// Referência base das conversas
const conversasRef = () =>
  db.collection('users').doc(OWNER_UID).collection('agent_conversations');

/**
 * Busca ou cria conversa de um cliente
 * @param {string} clienteId - Número do WhatsApp
 * @returns {Promise<Object>}
 */
async function buscarConversa(clienteId) {
  try {
    const docRef = conversasRef().doc(clienteId);
    const doc = await docRef.get();

    if (!doc.exists) {
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
 * Salva mensagem e resposta no histórico
 * @param {string} clienteId
 * @param {string} mensagemCliente
 * @param {string} respostaIA
 * @param {string} status
 */
async function salvarMensagem(clienteId, mensagemCliente, respostaIA, status = 'interessado') {
  try {
    const docRef = conversasRef().doc(clienteId);
    const doc = await docRef.get();
    const dados = doc.exists ? doc.data() : { historico: [] };

    const historico = dados.historico || [];
    historico.push({ role: 'user', content: mensagemCliente });
    historico.push({ role: 'assistant', content: respostaIA });

    await docRef.set(
      {
        historico: historico.slice(-MAX_HISTORICO),
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
 * Lista todas as conversas (painel admin)
 * @returns {Promise<Array>}
 */
async function listarConversas() {
  try {
    const snapshot = await conversasRef().limit(100).get();

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        historico: undefined,
        totalMensagens: (doc.data().historico || []).length,
      }))
      .sort((a, b) => (b.atualizadoEm || '').localeCompare(a.atualizadoEm || ''));
  } catch (error) {
    console.error('[Conversa] Erro ao listar conversas:', error.message);
    throw error;
  }
}

/**
 * Detecta intenção da mensagem do cliente
 * @param {string} mensagem
 * @returns {string}
 */
function detectarIntencao(mensagem) {
  const texto = mensagem.toLowerCase();
  if (/quanto custa|pre[cç]o|valor|promo[cç][aã]o|desconto/.test(texto)) return 'preco';
  if (/quero|gostei|me interessa|comprar|pedir/.test(texto)) return 'pedido';
  if (/tem|existe|dispon[ií]vel|op[cç][oõ]es|cat[aá]logo/.test(texto)) return 'interesse';
  if (/fiado|devo|d[ií]vida|quanto devo/.test(texto)) return 'fiado';
  return 'geral';
}

module.exports = { buscarConversa, salvarMensagem, listarConversas, detectarIntencao };
