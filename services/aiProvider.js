/**
 * aiProvider.js — Camada de abstração da IA
 *
 * Para trocar o provedor de IA (Groq → OpenAI → Gemini → etc),
 * basta alterar APENAS este arquivo. O resto do sistema não muda.
 */

const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Configuração do modelo — altere aqui para trocar
const AI_CONFIG = {
  model: 'llama-3.3-70b-versatile',
  max_tokens: 400,
  temperature: 0.8,
};

/**
 * Gera resposta da IA
 * @param {string} systemPrompt - Instruções do sistema (personalidade + contexto)
 * @param {Array}  historico     - [{role: 'user'|'assistant', content: string}]
 * @returns {Promise<string>}
 */
async function gerarResposta(systemPrompt, historico) {
  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...historico,
    ];

    const completion = await groq.chat.completions.create({
      model: AI_CONFIG.model,
      messages,
      max_tokens: AI_CONFIG.max_tokens,
      temperature: AI_CONFIG.temperature,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('[AI] Erro ao gerar resposta:', error.message);
    throw new Error('Falha ao processar resposta da IA');
  }
}

module.exports = { gerarResposta };
