const { db } = require('../config/firebase');

const COLECAO = 'conversas';
const MAX_HISTORICO = 20;

async function buscarConversa(clienteId) {
  try {
    const docRef = db.collection(COLECAO).doc(clienteId);
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

async function salvarMensagem(clienteId, mensagemCliente, respostaIA, status = 'interessado') {
  try {
    const docRef = db.collection(COLECAO).doc(clienteId);
    const doc = await docRef.get();
    const dados = doc.exists ? doc.data() : { historico: [] };

    const historico = dados.historico || [];
    historico.push({ role: 'user', content: mensagemCliente });
    historico.push({ role: 'assistant', content: respostaIA });

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

async function listarConversas() {
  try {
    // SEM orderBy — evita exigência de índice composto no Firestore
    // Ordenação feita em memória após a busca
    const snapshot = await db.collection(COLECAO).limit(100).get();

    const conversas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      historico: undefined,
      totalMensagens: (doc.data().historico || []).length,
    }));

    return conversas.sort((a, b) =>
      (b.atualizadoEm || '').localeCompare(a.atualizadoEm || '')
    );
  } catch (error) {
    console.error('[Conversa] Erro ao listar conversas:', error.message);
    throw error;
  }
}

function detectarIntencao(mensagem) {
  const texto = mensagem.toLowerCase();
  if (/quanto custa|pre[cç]o|valor|promo[cç][aã]o|desconto/.test(texto)) return 'preco';
  if (/quero|gostei|me interessa|comprar|pedir/.test(texto)) return 'pedido';
  if (/tem|existe|dispon[ií]vel|op[cç][oõ]es|cat[aá]logo/.test(texto)) return 'interesse';
  return 'geral';
}

module.exports = { buscarConversa, salvarMensagem, listarConversas, detectarIntencao };
