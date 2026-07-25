const { generateQuestion } = require('./questionGenerator.service');
const logger = require('../utils/logger');

// Rotate question types to ensure variety across a session
const QUESTION_TYPE_ROTATION = ['conceptual', 'practical', 'scenario', 'conceptual', 'behavioral'];

const calculateNextDifficulty = (sessionHistory) => {
  if (!sessionHistory?.length) return 'intermediate';

  // Weight recent performance more than older scores
  const recent = sessionHistory.slice(-3);
  const avgScore = recent.reduce((sum, s) => sum + (s.score ?? 5), 0) / recent.length;

  if (avgScore >= 8.5) return 'advanced';
  if (avgScore >= 6)   return 'intermediate';
  return 'beginner';
};

const selectNextQuestionType = (sessionHistory, jobRole) => {
  if (!sessionHistory?.length) return 'conceptual';

  // For job-role sessions include behavioral questions; for topic sessions skip them
  const types = jobRole
    ? QUESTION_TYPE_ROTATION
    : QUESTION_TYPE_ROTATION.filter((t) => t !== 'behavioral');

  return types[sessionHistory.length % types.length];
};

const generateAdaptiveQuestion = async ({ topic, jobRole, sessionHistory = [], currentDifficulty }) => {
  const nextDifficulty = currentDifficulty || calculateNextDifficulty(sessionHistory);
  const nextType = selectNextQuestionType(sessionHistory, jobRole);
  const previousQuestions = sessionHistory.map((s) => s.question).filter(Boolean);

  const avgScore = sessionHistory.length > 0
    ? (sessionHistory.reduce((s, h) => s + (h.score ?? 5), 0) / sessionHistory.length).toFixed(1)
    : null;

  logger.debug('Adaptive selection', { nextDifficulty, nextType, avgScore, historyLen: sessionHistory.length });

  const question = await generateQuestion({
    topic,
    jobRole,
    difficulty: nextDifficulty,
    questionType: nextType,
    previousQuestions,
  });

  return {
    ...question,
    adjusted_difficulty: nextDifficulty,
    session_progress: {
      questions_answered: sessionHistory.length,
      average_score: avgScore,
      performance_trend: sessionHistory.length >= 3
        ? (sessionHistory.slice(-3).reduce((s, h) => s + (h.score ?? 5), 0) / 3).toFixed(1)
        : null,
    },
  };
};

module.exports = { generateAdaptiveQuestion, calculateNextDifficulty };
