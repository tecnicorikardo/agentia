const { extrairDadosWebhook, enviarMensagem } = require('../services/whatsappService');
const { gerarResposta } = require('../services/openaiService');
const { buscarConversa, salvarMensagem, detectarIntencao } = require('../services/conversationService');
const { buscarFiado, buscarVendasCliente, listarProdutos, registrarVenda } = require('../services/gestaoService');

// Anti-spam
const ultimaMensagem = new Map();
const INTERVALO_MINIMO_MS = 2000;

/**
 * Normaliza texto: minúsculo, sem acentos, sem pontuação
 */
function normalizar(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detecta se a IA confirmou um pedido e quais produtos estão na resposta
 */
function extrairPedidoConfirmado(respostaIA, produtos) {
  const texto = normalizar(respostaIA);

  // Verifica se a IA confirmou o pedido
  const confirmou = /confirm|registr|anot|pedido feito|pedido recebido|vou separar|anotei|perfeito|otimo|combinado|certo|anotado/.test(texto);
  if (!confirmou) {
    console.log(`[Webhook] IA nao confirmou pedido. Resposta: "${respostaIA.substring(0, 80)}"`);
    return null;
  }

  console.log(`[Webhook] IA confirmou pedido. Buscando produtos na resposta...`);
  const itensPedido = [];

  for (const produto of produtos) {
    const nomeProd = normalizar(produto.name || produto.nome || '');
    if (!nomeProd) continue;

    // Busca parcial: qualquer palavra significativa do nome do produto
    const palavras = nomeProd.split(' ').filter(p => p.length > 2);
    const encontrou = palavras.some(palavra => texto.includes(palavra));

    if (encontrou) {
      // Tenta extrair quantidade antes ou depois do nome
      const primeiraP = palavras[0];
      const regexQtd = new RegExp(`(\\d+)\\s*(?:x\\s*)?${primeiraP}|${primeiraP}\\s*(?:x\\s*)?(\\d+)`);
      const match = texto.match(regexQtd);
      const quantidade = match ? parseInt(match[1] || match[2]) || 1 : 1;

      console.log(`[Webhook] Produto detectado: "${produto.name}" x${quantidade}`);
      itensPedido.push({
        produtoId: produto.id,
        nome: produto.name || produto.nome,
        quantidade,
      });
    }
  }

  if (itensPedido.length === 0) {
    console.log(`[Webhook] Nenhum produto encontrado na resposta da IA`);
    return null;
  }

  // Detecta método de pagamento
  let paymentMethod = 'dinheiro';
  if (/pix/.test(texto)) paymentMethod = 'pix';
  else if (/cartao|credito|debito/.test(texto)) paymentMethod = 'cartao';
  else if (/fiado/.test(texto)) paymentMethod = 'fiado';

  return { itens: itensPedido, paymentMethod };
}

/**
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
    console.log(`[Webhook] Intencao para ${numero}: ${intencao}`);

    // Busca produtos e fiado em paralelo (vendas recentes ignoradas por falta de índice)
    const [produtos, fiadoInfo] = await Promise.all([
      listarProdutos(),
      buscarFiado(numero),
    ]);

    const contextoProdutos = produtos.length
      ? produtos.map(p => `- ${p.name ?? p.nome} | R$ ${Number(p.salePrice ?? p.price ?? 0).toFixed(2)}${p.description ? ` | ${p.description}` : ''}`).join('\n')
      : '';

    const contextoExtra = {
      fiado: fiadoInfo.saldo,
    };

    const historicoAtual = [...historico, { role: 'user', content: mensagem }];

    console.log(`[Webhook] Gerando resposta IA para ${numero}...`);
    const resposta = await gerarResposta(historicoAtual, contextoProdutos, contextoExtra);

    // Detecta pedido confirmado na RESPOSTA DA IA e registra venda
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
          console.error(`[Webhook] Erro ao registrar venda: ${e.message}`);
        }
      }
    }

    const novoStatus = determinarStatus(intencao, conversa.status);
    await salvarMensagem(numero, mensagem, resposta, novoStatus);
    console.log(`[Webhook] Historico salvo para ${numero}`);

    await enviarMensagem(numero, resposta);
    console.log(`[Webhook] Ciclo completo para ${numero}`);

  } catch (error) {
    console.error(`[Webhook] ERRO CRITICO no processamento: ${error.message}`);
  }
}

function determinarStatus(intencao, statusAtual) {
  if (statusAtual === 'fechado') return 'fechado';
  if (intencao === 'pedido') return 'negociando';
  if (intencao === 'preco' || intencao === 'interesse') return 'interessado';
  return statusAtual || 'novo';
}

module.exports = { receberMensagem };
