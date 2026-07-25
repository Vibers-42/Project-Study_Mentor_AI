const { callClaude } = require('./anthropic.service');
const { buildQuestionGeneratorPrompt } = require('../prompts/questionGenerator.prompt');
const { parseClaudeJSON } = require('../utils/parseJSON');
const logger = require('../utils/logger');

const generateQuestion = async ({ topic, jobRole, difficulty = 'intermediate', questionType = 'conceptual', previousQuestions = [] }) => {
  const prompt = buildQuestionGeneratorPrompt({ topic, jobRole, difficulty, questionType, previousQuestions });

  const { text } = await callClaude(prompt, {
    systemPrompt: 'You are an expert technical interviewer. Generate exactly one question and respond with valid JSON only — no markdown, no preamble.',
    maxTokens: 2048,
    useThinking: true,
  });

  const parsed = parseClaudeJSON(text);

  if (!parsed?.question) {
    logger.warn('Could not parse question JSON from Claude, returning text fallback');
    return {
      question: text,
      topic: topic || jobRole || 'General',
      difficulty,
      type: questionType,
      hints: [],
      expected_concepts: [],
      follow_up_questions: [],
      time_limit_minutes: 5,
    };
  }

  return parsed;
};

module.exports = { generateQuestion };
