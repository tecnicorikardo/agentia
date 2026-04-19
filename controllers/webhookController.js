const { extrairDadosWebhook, enviarMensagem } = require('../services/whatsappService');
const { gerarResposta } = require('../services/openaiService');
const { buscarConversa, salvarMensagem, detectarIntencao } = require('../services/conversationService');
const { obterContextoProdutos, buscarFiado, buscarVendasCliente } = require('../services/gestaoService');

// Controle anti-spam: armazena timestamps das últimas mensagens por número
const ultimaMensagem = new Map();
const INTERVALO_MINIMO_MS = 2000; // Reduzido para 2 segundos para ser mais responsivo

/**
 * Processa mensagem recebida via webhook do WhatsApp
 */
async function receberMensagem(req, res) {
  // Responde imediatamente ao webhook para evitar timeout na Evolution API
  res.status(200).json({ status: 'recebido' });

  try {
    const dados = extrairDadosWebhook(req.body);
    if (!dados) return; // Ignora se não houver dados úteis (ou se for do bot)

    const { numero, mensagem } = dados;

    // Anti-spam: ignora se a última mensagem foi há menos de INTERVALO_MINIMO_MS
    const agora = Date.now();
    const ultima = ultimaMensagem.get(numero) || 0;
    if (agora - ultima < INTERVALO_MINIMO_MS) {
      console.log(`[Webhook] Anti-spam: ignorando mensagem de ${numero}`);
      return;
    }
    ultimaMensagem.set(numero, agora);

    // 1. Busca histórico do cliente
    console.log(`[Webhook] Processando mensagem de ${numero}...`);
    const conversa = await buscarConversa(numero);
    const historico = conversa.historico || [];

    // 2. Detecta intenção
    const intencao = detectarIntencao(mensagem);
    console.log(`[Webhook] Intenção para ${numero}: ${intencao}`);

    // 3. Busca contexto de produtos e dados do cliente em paralelo
    const [contextoProdutos, fiadoInfo, vendasRecentes] = await Promise.all([
      obterContextoProdutos(),
      buscarFiado(numero),
      buscarVendasCliente(numero),
    ]);

    // 4. Monta contexto extra para a IA
    const contextoExtra = {
      fiado: fiadoInfo.saldo,
      ultimoPedido: vendasRecentes[0]
        ? `${vendasRecentes[0].items?.map(i => i.nome).join(', ')} — R$ ${vendasRecentes[0].total?.toFixed(2)}`
        : null,
    };

    // 5. Adiciona mensagem atual ao histórico temporário
    const historicoAtual = [...historico, { role: 'user', content: mensagem }];

    // 6. Gera resposta com IA
    console.log(`[Webhook] Gerando resposta IA para ${numero}...`);
    const resposta = await gerarResposta(historicoAtual, contextoProdutos, contextoExtra);

    // 7. Determina novo status
    const novoStatus = determinarStatus(intencao, conversa.status);

    // 8. Salva no Firebase
    await salvarMensagem(numero, mensagem, resposta, novoStatus);
    console.log(`[Webhook] Histórico salvo para ${numero}`);

    // 9. Envia resposta ao cliente
    await enviarMensagem(numero, resposta);
    console.log(`[Webhook] Ciclo completo para ${numero}`);

  } catch (error) {
    console.error(`[Webhook] ERRO CRÍTICO no processamento:`, error.message);
  }
}

/**
 * Determina o status da conversa com base na intenção e status atual
 */
function determinarStatus(intencao, statusAtual) {
  if (statusAtual === 'fechado') return 'fechado';
  if (intencao === 'pedido') return 'negociando';
  if (intencao === 'preco' || intencao === 'interesse') return 'interessado';
  return statusAtual || 'novo';
}

module.exports = { receberMensagem };

