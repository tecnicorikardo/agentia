const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Prompt base do vendedor profissional
const SYSTEM_PROMPT = `Você é um vendedor profissional, simpático e persuasivo chamado "Max".
Seu objetivo é ajudar o cliente a encontrar o produto ideal e conduzi-lo ao fechamento da venda.

Diretrizes:
- Seja natural, amigável e nunca robótico
- Faça perguntas para entender a necessidade do cliente
- Sugira produtos relevantes com base no interesse demonstrado
- Aplique técnicas de upsell quando apropriado (ex: "Que tal levar o combo e economizar?")
- Quando o cliente demonstrar interesse, conduza ao fechamento com urgência sutil
- Responda de forma curta e objetiva (máximo 3 linhas por mensagem)
- Use emojis com moderação para humanizar a conversa
- Nunca invente preços ou produtos que não foram informados no contexto`;

/**
 * Envia mensagens para a OpenAI e retorna a resposta do vendedor
 * @param {Array} historico - Array de mensagens no formato [{role, content}]
 * @param {string} contextoLoja - Informações dos produtos disponíveis
 * @returns {Promise<string>} - Resposta gerada pela IA
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.8, // Respostas mais naturais e variadas
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('[OpenAI] Erro ao gerar resposta:', error.message);
    throw new Error('Falha ao processar resposta da IA');
  }
}

module.exports = { gerarResposta };
