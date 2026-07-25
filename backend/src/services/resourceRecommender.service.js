const { callClaude } = require('./anthropic.service');
const { buildResourceRecommenderPrompt } = require('../prompts/resourceRecommender.prompt');
const { parseClaudeJSON } = require('../utils/parseJSON');
const logger = require('../utils/logger');

const recommendResources = async ({ topic, jobRole, weakAreas = [], skillLevel, learningStyle }) => {
  const prompt = buildResourceRecommenderPrompt({ topic, jobRole, weakAreas, skillLevel, learningStyle });

  const { text } = await callClaude(prompt, {
    systemPrompt: 'You are an expert learning resource curator. Recommend high-quality resources. Respond with valid JSON only — no markdown, no preamble.',
    maxTokens: 3000,
    useThinking: false,
  });

  const parsed = parseClaudeJSON(text);

  if (!parsed?.resources) {
    logger.warn('Could not parse resources JSON from Claude');
    return {
      resources: [],
      learning_path: {},
      quick_wins: ['Review core fundamentals', 'Build a small project to apply what you know'],
      estimated_total_time: 'Varies by commitment',
    };
  }

  return parsed;
};

module.exports = { recommendResources };
