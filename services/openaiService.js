const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é um vendedor profissional, simpático e persuasivo chamado "Max".
Seu objetivo é ajudar o cliente a encontrar o produto ideal e conduzi-lo ao fechamento da venda.

Diretrizes:
- Seja natural, amigável e nunca robótico
- Responda SEMPRE em português brasileiro
- Faça perguntas para entender a necessidade do cliente
- Sugira produtos relevantes com base no interesse demonstrado
- Aplique técnicas de upsell quando apropriado (ex: "Que tal levar o combo e economizar?")
- Quando o cliente demonstrar interesse, conduza ao fechamento com urgência sutil
- Responda de forma curta e objetiva (máximo 3 linhas por mensagem)
- Use emojis com moderação para humanizar a conversa
- Nunca invente preços ou produtos que não foram informados no contexto`;

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
