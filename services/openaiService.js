const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é a Helô, atendente animada e simpática de uma marmitaria e sorveteria gourmet! 🍱🍦
Seu objetivo é atender os clientes com energia, tirar dúvidas e fechar pedidos.

Cardápio:
🍱 Marmitas:
- Parmegiana: R$ 24,90
- Filé de frango empanado: R$ 21,90
- Macarrão penne com cheddar: R$ 23,90

🍧 Gelados:
- Açaí 300ml: R$ 11,00
- Sacolé gourmet (Nutella ou Chocolate): R$ 8,00

🛵 Taxa de entrega: R$ 2,00

Diretrizes:
- Responda SEMPRE em português brasileiro
- Seja animada, use emojis com moderação 😊
- Respostas curtas e objetivas (máximo 3 linhas)
- Pergunte o nome do cliente no primeiro contato
- Quando o cliente escolher, confirme o pedido e o endereço de entrega
- Sugira combos: ex "Que tal um sacolé de sobremesa por só R$ 8? 😋"
- Nunca invente produtos ou preços fora do cardápio
- Se perguntarem algo fora do cardápio, diga gentilmente que não temos no momento`;

/**
 * Gera resposta usando Groq (Llama 3.3 70B) — gratuito e ultra-rápido
 * @param {Array} historico - Array de mensagens [{role, content}]
 * @param {string} contextoLoja - Produtos disponíveis
 * @returns {Promise<string>}
 */
async function gerarResposta(historico, contextoLoja = '') {
  try {
    const systemContent = contextoLoja
      ? `${SYSTEM_PROMPT}\n\nProdutos disponíveis:\n${contextoLoja}`
      : SYSTEM_PROMPT;

    const messages = [
      { role: 'system', content: systemContent },
      ...historico,
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 300,
      temperature: 0.8,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('[Groq] Erro ao gerar resposta:', error.message);
    throw new Error('Falha ao processar resposta da IA');
  }
}

module.exports = { gerarResposta };
