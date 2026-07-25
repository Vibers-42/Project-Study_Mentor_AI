const { callClaude } = require('./anthropic.service');
const { buildAnswerEvaluatorPrompt } = require('../prompts/answerEvaluator.prompt');
const { parseClaudeJSON } = require('../utils/parseJSON');
const logger = require('../utils/logger');

const evaluateAnswer = async ({ question, userAnswer, expectedConcepts = [], topic, difficulty }) => {
  const prompt = buildAnswerEvaluatorPrompt({ question, userAnswer, expectedConcepts, topic, difficulty });

  const { text } = await callClaude(prompt, {
    systemPrompt: 'You are an expert technical evaluator. Evaluate answers objectively and respond with valid JSON only — no markdown, no preamble.',
    maxTokens: 3000,
    useThinking: true,
  });

  const parsed = parseClaudeJSON(text);

  if (parsed?.score === undefined) {
    logger.warn('Could not parse evaluation JSON from Claude');
    return {
      score: 5,
      grade: 'C',
      percentage: 50,
      strengths: ['Answer provided'],
      weaknesses: ['Evaluation could not be fully parsed'],
      missing_concepts: [],
      accuracy_assessment: 'Unable to fully assess',
      completeness_assessment: 'Unable to fully assess',
      feedback_summary: text,
      better_answer: 'Please review the topic fundamentals and try again.',
      follow_up_recommendation: 'same',
    };
  }

  return parsed;
};

module.exports = { evaluateAnswer };
