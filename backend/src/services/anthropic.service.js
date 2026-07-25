const groq = require('../config/groq');
const { parseClaudeJSON } = require('../utils/parseJSON');
const logger = require('../utils/logger');

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Call the Groq LLM and return { text, usage }.
 * Keeps the same callClaude() export signature so no other files need changing.
 * Uses response_format: json_object to force clean JSON output.
 */
const callClaude = async (userPrompt, options = {}) => {
  const {
    systemPrompt = 'You are a helpful AI assistant. Always respond with valid JSON when asked.',
    maxTokens = 4096,
    // useThinking is accepted but ignored — Groq doesn't support it
  } = options;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    });

    const text = completion.choices?.[0]?.message?.content ?? '';
    const usage = completion.usage;

    logger.debug('Groq response', {
      inputTokens:  usage?.prompt_tokens,
      outputTokens: usage?.completion_tokens,
    });

    return { text, usage };
  } catch (err) {
    logger.error('Groq API error', { message: err.message, status: err.status });
    throw err;
  }
};

module.exports = { callClaude };
