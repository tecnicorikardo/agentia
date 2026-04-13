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
    {
      nome: 'Plano Básico',
      preco: 97.0,
      descricao: 'Acesso a funcionalidades essenciais por 30 dias',
      categoria: 'assinatura',
      ativo: true,
    },
    {
      nome: 'Plano Pro',
      preco: 197.0,
      descricao: 'Acesso completo com suporte prioritário por 30 dias',
      categoria: 'assinatura',
      ativo: true,
    },
    {
      nome: 'Plano Anual',
      preco: 997.0,
      descricao: 'Acesso completo por 12 meses com 40% de desconto',
      categoria: 'assinatura',
      ativo: true,
    },
  ];

  for (const produto of produtos) {
    await db.collection(COLECAO).add(produto);
  }

  console.log('[Produto] Seed de produtos criado com sucesso!');
}

module.exports = { obterContextoProdutos, seedProdutos };
