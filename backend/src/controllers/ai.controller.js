const { generateQuestion } = require('../services/questionGenerator.service');
const { evaluateAnswer } = require('../services/answerEvaluator.service');
const { generateFeedback } = require('../services/feedbackGenerator.service');
const { generateAdaptiveQuestion } = require('../services/adaptiveDifficulty.service');
const { generateRoadmap } = require('../services/roadmapGenerator.service');
const { recommendResources } = require('../services/resourceRecommender.service');
const { success, error } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI-powered study and interview coaching — all powered by Claude Opus
 */

/**
 * @swagger
 * /ai/generate-question:
 *   post:
 *     summary: Generate a single practice or interview question
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "React Hooks"
 *               job_role:
 *                 type: string
 *                 example: "Senior Frontend Developer"
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 default: intermediate
 *               question_type:
 *                 type: string
 *                 enum: [conceptual, practical, scenario, behavioral]
 *                 default: conceptual
 *               previous_questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Questions to avoid repeating
 */
const generateQuestionController = async (req, res, next) => {
  try {
    const { topic, job_role, difficulty, question_type, previous_questions } = req.body;

    if (!topic && !job_role) {
      return error(res, 'Either topic or job_role is required.', 400);
    }

    logger.info('Generating question', { topic, job_role, difficulty, question_type });

    const question = await generateQuestion({
      topic,
      jobRole: job_role,
      difficulty,
      questionType: question_type,
      previousQuestions: previous_questions || [],
    });

    return success(res, question, 'Question generated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /ai/evaluate-answer:
 *   post:
 *     summary: Evaluate a user's answer and return a score with detailed feedback
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question, user_answer]
 *             properties:
 *               question:
 *                 type: string
 *               user_answer:
 *                 type: string
 *               expected_concepts:
 *                 type: array
 *                 items:
 *                   type: string
 *               topic:
 *                 type: string
 *               difficulty:
 *                 type: string
 */
const evaluateAnswerController = async (req, res, next) => {
  try {
    const { question, user_answer, expected_concepts, topic, difficulty } = req.body;

    if (!question) return error(res, 'question is required.', 400);
    if (!user_answer) return error(res, 'user_answer is required.', 400);

    logger.info('Evaluating answer', { topic, difficulty, answerLength: user_answer.length });

    const evaluation = await evaluateAnswer({
      question,
      userAnswer: user_answer,
      expectedConcepts: expected_concepts || [],
      topic,
      difficulty,
    });

    return success(res, evaluation, 'Answer evaluated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /ai/generate-feedback:
 *   post:
 *     summary: Generate comprehensive personalized feedback for a completed session
 *     tags: [AI]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               job_role:
 *                 type: string
 *               session_history:
 *                 type: array
 *               overall_score:
 *                 type: number
 *               weaknesses:
 *                 type: array
 *                 items:
 *                   type: string
 */
const generateFeedbackController = async (req, res, next) => {
  try {
    const { topic, job_role, session_history, overall_score, weaknesses } = req.body;

    logger.info('Generating feedback', { topic, job_role, sessionLength: session_history?.length });

    const feedback = await generateFeedback({
      topic,
      jobRole: job_role,
      sessionHistory: session_history || [],
      overallScore: overall_score,
      weaknesses: weaknesses || [],
    });

    return success(res, feedback, 'Feedback generated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /ai/adaptive-next-question:
 *   post:
 *     summary: Get the next question auto-adjusted to the user's current performance level
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               job_role:
 *                 type: string
 *               session_history:
 *                 type: array
 *                 description: Array of {question, score, topic, type} objects
 *               current_difficulty:
 *                 type: string
 *                 description: Override difficulty (optional — system calculates if omitted)
 */
const adaptiveNextQuestionController = async (req, res, next) => {
  try {
    const { topic, job_role, session_history, current_difficulty } = req.body;

    if (!topic && !job_role) {
      return error(res, 'Either topic or job_role is required.', 400);
    }

    logger.info('Generating adaptive question', { topic, job_role, historyLength: session_history?.length });

    const question = await generateAdaptiveQuestion({
      topic,
      jobRole: job_role,
      sessionHistory: session_history || [],
      currentDifficulty: current_difficulty,
    });

    return success(res, question, 'Adaptive question generated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /ai/generate-roadmap:
 *   post:
 *     summary: Generate a personalized multi-phase learning roadmap
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "Machine Learning"
 *               job_role:
 *                 type: string
 *                 example: "Data Scientist"
 *               current_level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               target_role:
 *                 type: string
 *               timeframe:
 *                 type: string
 *                 example: "3 months"
 */
const generateRoadmapController = async (req, res, next) => {
  try {
    const { topic, job_role, current_level, target_role, timeframe } = req.body;

    if (!topic && !job_role) {
      return error(res, 'Either topic or job_role is required.', 400);
    }

    logger.info('Generating roadmap', { topic, job_role, current_level, timeframe });

    const roadmap = await generateRoadmap({
      topic,
      jobRole: job_role,
      currentLevel: current_level,
      targetRole: target_role,
      timeframe,
    });

    return success(res, roadmap, 'Roadmap generated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /ai/recommend-resources:
 *   post:
 *     summary: Get curated learning resource recommendations based on weak areas
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               job_role:
 *                 type: string
 *               weak_areas:
 *                 type: array
 *                 items:
 *                   type: string
 *               skill_level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               learning_style:
 *                 type: string
 *                 example: "visual"
 */
const recommendResourcesController = async (req, res, next) => {
  try {
    const { topic, job_role, weak_areas, skill_level, learning_style } = req.body;

    if (!topic && !job_role) {
      return error(res, 'Either topic or job_role is required.', 400);
    }

    const resources = await recommendResources({
      topic,
      jobRole: job_role,
      weakAreas: weak_areas || [],
      skillLevel: skill_level,
      learningStyle: learning_style,
    });

    return success(res, resources, 'Resources recommended successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateQuestionController,
  evaluateAnswerController,
  generateFeedbackController,
  adaptiveNextQuestionController,
  generateRoadmapController,
  recommendResourcesController,
};
