const { callClaude } = require('./anthropic.service');
const { buildFeedbackGeneratorPrompt } = require('../prompts/feedbackGenerator.prompt');
const { parseClaudeJSON } = require('../utils/parseJSON');
const logger = require('../utils/logger');

const generateFeedback = async ({ topic, jobRole, sessionHistory = [], overallScore, weaknesses = [] }) => {
  const prompt = buildFeedbackGeneratorPrompt({ topic, jobRole, sessionHistory, overallScore, weaknesses });

  const { text } = await callClaude(prompt, {
    systemPrompt: 'You are an expert learning coach. Provide comprehensive, actionable feedback. Respond with valid JSON only — no markdown, no preamble.',
    maxTokens: 4096,
    useThinking: true,
  });

  const parsed = parseClaudeJSON(text);

  if (!parsed) {
    logger.warn('Could not parse feedback JSON from Claude');
    return {
      overall_assessment: text,
      performance_level: 'developing',
      strengths: [],
      areas_for_improvement: [],
      specific_gaps: [],
      recommended_resources: [],
      study_plan: { immediate: [], short_term: [], long_term: [] },
      motivational_message: 'Keep practicing — consistent effort leads to mastery!',
      next_session_focus: topic || jobRole || 'Continue your current topic',
    };
  }

  return parsed;
};

module.exports = { generateFeedback };
