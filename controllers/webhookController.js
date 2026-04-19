const { extrairDadosWebhook, enviarMensagem } = require('../services/whatsappService');
const { gerarResposta } = require('../services/openaiService');
const { buscarConversa, salvarMensagem, detectarIntencao } = require('../services/conversationService');
const { obterContextoProdutos, buscarFiado, buscarVendasCliente, listarProdutos, registrarVenda } = require('../services/gestaoService');

// Anti-spam
const ultimaMensagem = new Map();
const INTERVALO_MINIMO_MS = 2000;

/**
 * Tenta extrair pedido confirmado da resposta da IA
 * Detecta padrões como "confirmo seu pedido de X" ou "pedido registrado"
 */
function extrairPedidoConfirmado(respostaIA, produtos) {
  const texto = respostaIA.toLowerCase();

  // Só processa se a IA confirmou o pedido
  const confirmou = /confirm|registr|anot|pedido feito|pedido recebido|vou separar|anotei|perfeito|ótimo|combinado/.test(texto);
  if (!confirmou) {
    console.log(`[Webhook] IA não confirmou pedido. Resposta: "${respostaIA.substring(0, 80)}..."`);
    return null;
  }

  console.log(`[Webhook] IA confirmou pedido. Buscando produtos na resposta...`);
  const itensPedido = [];

  for (const produto of produtos) {
    const nomeProd = (produto.name || produto.nome || '').toLowerCase();
    if (!nomeProd) continue;

    // Verifica se o nome do produto aparece na resposta
    if (texto.includes(nomeProd)) {
      // Tenta extrair quantidade
      const regexQtd = new RegExp(`(\\d+)\\s*(?:x\\s*)?${nomeProd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${nomeProd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(?:x\\s*)?(\\d+)`);
      const match = texto.match(regexQtd);
      const quantidade = match ? parseInt(match[1] || match[2]) || 1 : 1;

      console.log(`[Webhook] Produto detectado: ${nomeProd} x${quantidade}`);
      itensPedido.push({
        produtoId: produto.id,
        nome: produto.name || produto.nome,
        quantidade,
        precoUnitario: produto.salePrice ?? produto.price ?? produto.preco ?? 0,
      });
    }
  }

  if (itensPedido.length === 0) return null;

  // Detecta método de pagamento na resposta da IA
  let paymentMethod = 'dinheiro';
  if (/pix/.test(texto)) paymentMethod = 'pix';
  else if (/cart[aã]o|crédito|débito/.test(texto)) paymentMethod = 'cartao';
  else if (/fiado/.test(texto)) paymentMethod = 'fiado';

  return { itens: itensPedido, paymentMethod };
}/**
 * Processa mensagem recebida via webhook do WhatsApp
 */
async function receberMensagem(req, res) {
  res.status(200).json({ status: 'recebido' });

  try {
    const dados = extrairDadosWebhook(req.body);
    if (!dados) return;

    const { numero, mensagem } = dados;

    // Anti-spam
    const agora = Date.now();
    const ultima = ultimaMensagem.get(numero) || 0;
    if (agora - ultima < INTERVALO_MINIMO_MS) {
      console.log(`[Webhook] Anti-spam: ignorando mensagem de ${numero}`);
      return;
    }
    ultimaMensagem.set(numero, agora);

    console.log(`[Webhook] Processando mensagem de ${numero}...`);
    const conversa = await buscarConversa(numero);
    const historico = conversa.historico || [];

    const intencao = detectarIntencao(mensagem);
    console.log(`[Webhook] Intenção para ${numero}: ${intencao}`);

    // Busca contexto em paralelo
    const [produtos, fiadoInfo, vendasRecentes] = await Promise.all([
      listarProdutos(),
      buscarFiado(numero),
      buscarVendasCliente(numero),
    ]);

    const contextoProdutos = produtos.length
      ? produtos.map(p => `- ${p.name ?? p.nome} | R$ ${Number(p.salePrice ?? p.price ?? 0).toFixed(2)}${p.description ? ` | ${p.description}` : ''}`).join('\n')
      : '';

    const contextoExtra = {
      fiado: fiadoInfo.saldo,
      ultimoPedido: vendasRecentes[0]
        ? `${vendasRecentes[0].items?.map(i => i.name || i.nome).join(', ')} — R$ ${Number(vendasRecentes[0].total).toFixed(2)}`
        : null,
    };

    const historicoAtual = [...historico, { role: 'user', content: mensagem }];

    console.log(`[Webhook] Gerando resposta IA para ${numero}...`);
    const resposta = await gerarResposta(historicoAtual, contextoProdutos, contextoExtra);

    // Detecta se a IA confirmou um pedido na resposta e registra a venda
    // Analisa a RESPOSTA DA IA (não a mensagem do cliente)
    const pedidoDetectado = extrairPedidoConfirmado(resposta, produtos);
    if (pedidoDetectado) {
      for (const item of pedidoDetectado.itens) {
        try {
          const vendaId = await registrarVenda({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            paymentMethod: pedidoDetectado.paymentMethod,
            clienteNome: conversa.nomeCliente || '',
            clientePhone: numero,
          });
          console.log(`[Webhook] Venda registrada: ${vendaId}`);
        } catch (e) {
          console.error(`[Webhook] Erro ao registrar venda:`, e.message);
        }
      }
    }

    const novoStatus = determinarStatus(intencao, conversa.status);
    await salvarMensagem(numero, mensagem, resposta, novoStatus);
    console.log(`[Webhook] Histórico salvo para ${numero}`);

    await enviarMensagem(numero, resposta);
    console.log(`[Webhook] Ciclo completo para ${numero}`);

  } catch (error) {
    console.error(`[Webhook] ERRO CRÍTICO no processamento:`, error.message);
  }
}

function determinarStatus(intencao, statusAtual) {
  if (statusAtual === 'fechado') return 'fechado';
  if (intencao === 'pedido') return 'negociando';
  if (intencao === 'preco' || intencao === 'interesse') return 'interessado';
  return statusAtual || 'novo';
}

module.exports = { receberMensagem };
