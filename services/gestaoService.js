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
// VENDAS — transação atômica
// ─────────────────────────────────────────

/**
 * Registra venda com baixa de estoque e lançamento financeiro
 * Tudo em uma transação Firestore atômica
 *
 * @param {Object} params
 * @param {string} params.produtoId
 * @param {number} params.quantidade
 * @param {string} params.paymentMethod - 'dinheiro' | 'pix' | 'cartao' | 'fiado' | 'emprestimo'
 * @param {string} params.clienteNome
 * @param {string} params.clientePhone
 * @param {string} [params.dueDate] - obrigatório se paymentMethod === 'emprestimo'
 * @returns {Promise<string>} ID da venda criada
 */
async function registrarVenda({ produtoId, quantidade, paymentMethod = 'dinheiro', clienteNome = '', clientePhone = '', dueDate = null }) {
  const base = lojaRef();

  // 1. Buscar produto
  const prodRef = base.collection('products').doc(produtoId);
  const prodDoc = await prodRef.get();

  if (!prodDoc.exists) throw new Error(`Produto ${produtoId} não encontrado`);

  const produto = prodDoc.data();
  if (produto.stock < quantidade) {
    throw new Error(`Estoque insuficiente: ${produto.stock} disponível, ${quantidade} solicitado`);
  }

  const total = produto.salePrice * quantidade;
  const nomeProduto = produto.name;
  const dayKey = new Date().toISOString().split('T')[0]; // "2025-04-19"
  const agora = new Date().toISOString();
  const descricao = `Venda de ${nomeProduto}`;

  // 2. Buscar ou criar cliente
  let clienteNomeFinal = clienteNome || null;
  if (clienteNome) {
    const clienteSnap = await base.collection('customers')
      .where('name', '==', clienteNome)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (clienteSnap.empty) {
      await base.collection('customers').add({
        name: clienteNome,
        phone: clientePhone || '',
        isActive: true,
        createdAt: agora,
      });
      console.log(`[Gestao] Cliente criado: ${clienteNome}`);
    }
  }

  // 3. Transação atômica
  const vendaRef = base.collection('sales').doc();
  const entradaRef = base.collection('financial_entries').doc();
  const dividaRef = base.collection('debts').doc();

  await db.runTransaction(async (t) => {
    // a) Baixa de estoque
    t.update(prodRef, { stock: produto.stock - quantidade });

    // b) Registro de venda
    t.set(vendaRef, {
      description: descricao,
      total,
      mode: 'product',
      paymentMethod,
      customerName: clienteNomeFinal,
      productName: nomeProduto,
      productId: produtoId,
      quantity: quantidade,
      dayKey,
      createdAt: agora,
    });

    const ehFiadoOuEmprestimo = paymentMethod === 'fiado' || paymentMethod === 'emprestimo';

    if (!ehFiadoOuEmprestimo) {
      // c) Lançamento financeiro (receita)
      t.set(entradaRef, {
        type: 'revenue',
        description: descricao,
        category: 'Vendas',
        amount: total,
        origin: 'sale',
        dayKey,
        createdAt: agora,
      });
    } else if (paymentMethod === 'fiado') {
      // d) Dívida (fiado)
      t.set(dividaRef, {
        customerName: clienteNomeFinal || 'Cliente nao informado',
        description: `Fiado de venda: ${descricao}`,
        category: 'Fiado',
        originalAmount: total,
        openAmount: total,
        createdAt: agora,
      });
    } else if (paymentMethod === 'emprestimo') {
      if (!dueDate) throw new Error('dueDate obrigatório para empréstimo');
      t.set(dividaRef, {
        customerName: clienteNomeFinal || 'Cliente nao informado',
        description: `Empréstimo: ${descricao}`,
        category: 'Emprestimo',
        originalAmount: total,
        openAmount: total,
        dueDate,
        createdAt: agora,
      });
    }
  });

  console.log(`[Gestao] Venda registrada: ${vendaRef.id} | ${nomeProduto} x${quantidade} | R$ ${total.toFixed(2)} | ${paymentMethod}`);
  return vendaRef.id;
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
