/**
 * gestaoService.js — Integração com Bloquinho Digital
 *
 * Consulta produtos, pedidos, fiados e dados da loja
 * via Firestore direto (mesmo SDK já configurado no projeto).
 *
 * Estrutura Firestore:
 *   stores/{storeId}/products/{productId}
 *   orders/{orderId}
 *   stores/{storeId}
 */

const { db } = require('../config/firebase');

const STORE_ID = process.env.BLOQUINHO_STORE_ID;

// ─────────────────────────────────────────
// PRODUTOS
// ─────────────────────────────────────────

/**
 * Busca todos os produtos ativos da loja
 * @returns {Promise<Array>}
 */
async function listarProdutos() {
  try {
    const snapshot = await db
      .collection('products')
      .where('storeId', '==', STORE_ID)
      .where('ativo', '==', true)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[Gestao] Erro ao listar produtos:', error.message);
    return [];
  }
}

/**
 * Formata produtos como texto para o prompt da IA
 * @returns {Promise<string>}
 */
async function obterContextoProdutos() {
  const produtos = await listarProdutos();
  if (!produtos.length) return '';

  return produtos
    .map((p) => `- ${p.nome} | R$ ${Number(p.preco).toFixed(2)}${p.descricao ? ` | ${p.descricao}` : ''}`)
    .join('\n');
}

// ─────────────────────────────────────────
// PEDIDOS
// ─────────────────────────────────────────

/**
 * Cria um novo pedido na loja
 * @param {string} clienteNumero - Número do WhatsApp do cliente
 * @param {Array}  itens         - [{produtoId, nome, quantidade, precoUnitario}]
 * @param {string} observacao    - Observação opcional
 * @returns {Promise<string>} ID do pedido criado
 */
async function criarPedido(clienteNumero, itens, observacao = '') {
  try {
    const total = itens.reduce((acc, i) => acc + i.quantidade * i.precoUnitario, 0);

    const pedido = {
      storeId: STORE_ID,
      clienteNumero,
      itens,
      total,
      observacao,
      status: 'pendente',
      origem: 'whatsapp',
      criadoEm: new Date().toISOString(),
    };

    const docRef = await db.collection('orders').add(pedido);
    console.log(`[Gestao] Pedido criado: ${docRef.id} | Total: R$ ${total.toFixed(2)}`);
    return docRef.id;
  } catch (error) {
    console.error('[Gestao] Erro ao criar pedido:', error.message);
    throw error;
  }
}

/**
 * Busca pedidos recentes de um cliente
 * @param {string} clienteNumero
 * @returns {Promise<Array>}
 */
async function buscarPedidosCliente(clienteNumero) {
  try {
    const snapshot = await db
      .collection('orders')
      .where('storeId', '==', STORE_ID)
      .where('clienteNumero', '==', clienteNumero)
      .orderBy('criadoEm', 'desc')
      .limit(5)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[Gestao] Erro ao buscar pedidos:', error.message);
    return [];
  }
}

// ─────────────────────────────────────────
// FIADO
// ─────────────────────────────────────────

/**
 * Busca o saldo de fiado de um cliente
 * @param {string} clienteNumero
 * @returns {Promise<{saldo: number, registros: Array}>}
 */
async function buscarFiado(clienteNumero) {
  try {
    const snapshot = await db
      .collection('fiados')
      .where('storeId', '==', STORE_ID)
      .where('clienteNumero', '==', clienteNumero)
      .where('status', '==', 'aberto')
      .get();

    const registros = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const saldo = registros.reduce((acc, r) => acc + (r.valor || 0), 0);

    return { saldo, registros };
  } catch (error) {
    console.error('[Gestao] Erro ao buscar fiado:', error.message);
    return { saldo: 0, registros: [] };
  }
}

/**
 * Registra um novo fiado para o cliente
 * @param {string} clienteNumero
 * @param {number} valor
 * @param {string} descricao
 * @returns {Promise<string>} ID do registro
 */
async function registrarFiado(clienteNumero, valor, descricao) {
  try {
    const docRef = await db.collection('fiados').add({
      storeId: STORE_ID,
      clienteNumero,
      valor,
      descricao,
      status: 'aberto',
      criadoEm: new Date().toISOString(),
    });
    console.log(`[Gestao] Fiado registrado: ${docRef.id} | R$ ${valor}`);
    return docRef.id;
  } catch (error) {
    console.error('[Gestao] Erro ao registrar fiado:', error.message);
    throw error;
  }
}

// ─────────────────────────────────────────
// LOJA
// ─────────────────────────────────────────

/**
 * Busca informações da loja
 * @returns {Promise<Object>}
 */
async function buscarInfoLoja() {
  try {
    const doc = await db.collection('stores').doc(STORE_ID).get();
    return doc.exists ? doc.data() : {};
  } catch (error) {
    console.error('[Gestao] Erro ao buscar loja:', error.message);
    return {};
  }
}

module.exports = {
  listarProdutos,
  obterContextoProdutos,
  criarPedido,
  buscarPedidosCliente,
  buscarFiado,
  registrarFiado,
  buscarInfoLoja,
};
