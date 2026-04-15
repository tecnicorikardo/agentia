const { db } = require('../config/firebase');

const COLECAO = 'produtos';

/**
 * Busca todos os produtos ativos e formata como contexto para a IA
 * @returns {Promise<string>} - Texto formatado com os produtos
 */
async function obterContextoProdutos() {
  try {
    const snapshot = await db
      .collection(COLECAO)
      .where('ativo', '==', true)
      .get();

    if (snapshot.empty) return '';

    const linhas = snapshot.docs.map((doc) => {
      const p = doc.data();
      return `- ${p.nome} | R$ ${p.preco.toFixed(2)} | ${p.descricao} | Categoria: ${p.categoria}`;
    });

    return linhas.join('\n');
  } catch (error) {
    console.error('[Produto] Erro ao buscar produtos:', error.message);
    return ''; // Não bloqueia o fluxo se falhar
  }
}

/**
 * Cria um produto de exemplo no Firebase (use para seed inicial)
 */
async function seedProdutos() {
  const produtos = [
    { nome: 'Parmegiana', preco: 24.90, descricao: 'Marmita de parmegiana', categoria: 'marmita', ativo: true },
    { nome: 'Filé de frango empanado', preco: 21.90, descricao: 'Marmita de filé de frango empanado', categoria: 'marmita', ativo: true },
    { nome: 'Macarrão penne com cheddar', preco: 23.90, descricao: 'Marmita de macarrão penne com cheddar', categoria: 'marmita', ativo: true },
    { nome: 'Açaí 300ml', preco: 11.00, descricao: 'Açaí gourmet 300ml', categoria: 'gelado', ativo: true },
    { nome: 'Sacolé gourmet Nutella', preco: 8.00, descricao: 'Sacolé gourmet sabor Nutella', categoria: 'gelado', ativo: true },
    { nome: 'Sacolé gourmet Chocolate', preco: 8.00, descricao: 'Sacolé gourmet sabor Chocolate', categoria: 'gelado', ativo: true },
  ];

  for (const produto of produtos) {
    await db.collection(COLECAO).add(produto);
  }

  console.log('[Produto] Seed de produtos criado com sucesso!');
}

module.exports = { obterContextoProdutos, seedProdutos };
