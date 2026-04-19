/**
 * gestaoService.js — Integração com Bloquinho Digital
 *
 * Estrutura Firestore:
 *   users/{uid}/products/{id}
 *   users/{uid}/customers/{id}
 *   users/{uid}/sales/{id}
 *   users/{uid}/settings/store_profile
 *
 * O ID da loja = UID do Firebase Auth do dono.
 * Configurado via BLOQUINHO_OWNER_UID no .env
 */

const { db } = require('../config/firebase');

const OWNER_UID = process.env.BLOQUINHO_OWNER_UID;

// Referência base — tudo parte daqui
const lojaRef = () => db.collection('users').doc(OWNER_UID);

// ─────────────────────────────────────────
// LOJA
// ─────────────────────────────────────────

/**
 * Busca perfil da loja
 * @returns {Promise<Object>}
 */
async function buscarInfoLoja() {
  try {
    const doc = await lojaRef().collection('settings').doc('store_profile').get();
    return doc.exists ? doc.data() : {};
  } catch (error) {
    console.error('[Gestao] Erro ao buscar loja:', error.message);
    return {};
  }
}

// ─────────────────────────────────────────
// PRODUTOS
// ─────────────────────────────────────────

/**
 * Busca todos os produtos ativos da loja
 * @returns {Promise<Array>}
 */
async function listarProdutos() {
  try {
    // Bloquinho usa showInWeb=true para produtos visíveis
    const snapshot = await lojaRef()
      .collection('products')
      .where('showInWeb', '==', true)
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
    .map((p) => {
      const preco = p.salePrice ?? p.price ?? p.preco ?? 0;
      const nome = p.name ?? p.nome ?? 'Produto';
      const desc = p.description ?? p.descricao ?? '';
      return `- ${nome} | R$ ${Number(preco).toFixed(2)}${desc ? ` | ${desc}` : ''}`;
    })
    .join('\n');
}

// ─────────────────────────────────────────
// CLIENTES
// ─────────────────────────────────────────

/**
 * Busca cliente pelo número de WhatsApp
 * @param {string} numero
 * @returns {Promise<Object|null>}
 */
async function buscarCliente(numero) {
  try {
    const snapshot = await lojaRef()
      .collection('customers')
      .where('phone', '==', numero)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error('[Gestao] Erro ao buscar cliente:', error.message);
    return null;
  }
}

/**
 * Cria ou atualiza cliente
 * @param {string} numero
 * @param {string} nome
 * @returns {Promise<string>} ID do cliente
 */
async function upsertCliente(numero, nome = '') {
  try {
    const cliente = await buscarCliente(numero);
    if (cliente) return cliente.id;

    const docRef = await lojaRef().collection('customers').add({
      phone: numero,
      name: nome,
      origem: 'whatsapp',
      criadoEm: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('[Gestao] Erro ao upsert cliente:', error.message);
    return null;
  }
}

// ─────────────────────────────────────────
// VENDAS
// ─────────────────────────────────────────

/**
 * Registra uma venda no Bloquinho e dá baixa no estoque
 * @param {string} clienteNumero
 * @param {string} clienteNome
 * @param {Array}  itens  - [{produtoId, nome, quantidade, precoUnitario}]
 * @param {string} obs
 * @param {string} paymentMethod - 'dinheiro' | 'pix' | 'fiado' | 'cartao'
 * @returns {Promise<string>} ID da venda
 */
async function registrarVenda(clienteNumero, clienteNome = '', itens, obs = '', paymentMethod = 'dinheiro') {
  try {
    const total = itens.reduce((acc, i) => acc + i.quantidade * i.precoUnitario, 0);

    // Cria ou busca cliente
    let clienteId = null;
    const clienteSnap = await lojaRef().collection('customers')
      .where('phone', '==', clienteNumero).limit(1).get();

    if (clienteSnap.empty) {
      const novoCliente = await lojaRef().collection('customers').add({
        name: clienteNome || 'Cliente WhatsApp',
        phone: clienteNumero,
        origem: 'whatsapp',
        createdAt: new Date().toISOString(),
      });
      clienteId = novoCliente.id;
    } else {
      clienteId = clienteSnap.docs[0].id;
    }

    // Monta itens no formato do Bloquinho
    const saleItems = itens.map(i => ({
      productId: i.produtoId || '',
      name: i.nome,
      quantity: i.quantidade,
      unitPrice: i.precoUnitario,
      total: i.quantidade * i.precoUnitario,
    }));

    // Cria a venda
    const venda = {
      customerId: clienteId,
      customerName: clienteNome || 'Cliente WhatsApp',
      customerPhone: clienteNumero,
      items: saleItems,
      total,
      paymentMethod,
      status: paymentMethod === 'fiado' ? 'fiado' : 'completed',
      notes: obs,
      origem: 'whatsapp',
      createdAt: new Date().toISOString(),
      userId: OWNER_UID,
    };

    const vendaRef = await lojaRef().collection('sales').add(venda);
    console.log(`[Gestao] Venda criada: ${vendaRef.id} | R$ ${total.toFixed(2)}`);

    // Dá baixa no estoque de cada item
    for (const item of itens) {
      if (!item.produtoId) continue;
      const prodRef = lojaRef().collection('products').doc(item.produtoId);
      const prod = await prodRef.get();
      if (prod.exists && prod.data().stock != null) {
        const novoEstoque = Math.max(0, prod.data().stock - item.quantidade);
        await prodRef.update({ stock: novoEstoque });
        console.log(`[Gestao] Estoque atualizado: ${item.nome} → ${novoEstoque}`);
      }
    }

    return vendaRef.id;
  } catch (error) {
    console.error('[Gestao] Erro ao registrar venda:', error.message);
    throw error;
  }
}

/**
 * Busca vendas recentes de um cliente
 * @param {string} clienteNumero
 * @returns {Promise<Array>}
 */
async function buscarVendasCliente(clienteNumero) {
  try {
    const snapshot = await lojaRef()
      .collection('sales')
      .where('clientePhone', '==', clienteNumero)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('[Gestao] Erro ao buscar vendas:', error.message);
    return [];
  }
}

// ─────────────────────────────────────────
// FIADO
// ─────────────────────────────────────────

/**
 * Busca saldo de fiado de um cliente
 * @param {string} clienteNumero
 * @returns {Promise<{saldo: number, registros: Array}>}
 */
async function buscarFiado(clienteNumero) {
  try {
    // Fiado = vendas com status 'fiado' ou campo fiado=true
    const snapshot = await lojaRef()
      .collection('sales')
      .where('clientePhone', '==', clienteNumero)
      .where('status', '==', 'fiado')
      .get();

    const registros = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const saldo = registros.reduce((acc, r) => acc + (r.total || 0), 0);

    return { saldo, registros };
  } catch (error) {
    console.error('[Gestao] Erro ao buscar fiado:', error.message);
    return { saldo: 0, registros: [] };
  }
}

module.exports = {
  buscarInfoLoja,
  listarProdutos,
  obterContextoProdutos,
  buscarCliente,
  upsertCliente,
  registrarVenda,
  buscarVendasCliente,
  buscarFiado,
};
