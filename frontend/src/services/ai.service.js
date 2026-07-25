import api from './api';

/** Generate a single study/interview question */
export const generateQuestion = async ({ topic, job_role, difficulty, question_type, previous_questions }) => {
  const res = await api.post('/ai/generate-question', { topic, job_role, difficulty, question_type, previous_questions });
  return res.data.data;
};

/** Evaluate a user's answer — returns score, strengths, weaknesses, better_answer */
export const evaluateAnswer = async ({ question, user_answer, expected_concepts, topic, difficulty }) => {
  const res = await api.post('/ai/evaluate-answer', { question, user_answer, expected_concepts, topic, difficulty });
  return res.data.data;
};

/** Generate comprehensive session feedback */
export const generateFeedback = async ({ topic, job_role, session_history, overall_score, weaknesses }) => {
  const res = await api.post('/ai/generate-feedback', { topic, job_role, session_history, overall_score, weaknesses });
  return res.data.data;
};

/** Adaptive next question based on session history */
export const adaptiveNextQuestion = async ({ topic, job_role, session_history, current_difficulty }) => {
  const res = await api.post('/ai/adaptive-next-question', { topic, job_role, session_history, current_difficulty });
  return res.data.data;
};

/** Generate a personalized learning roadmap */
export const generateRoadmap = async ({ topic, job_role, current_level, target_role, timeframe }) => {
  const res = await api.post('/ai/generate-roadmap', { topic, job_role, current_level, target_role, timeframe });
  return res.data.data;
};

/** Recommend curated resources based on weak areas */
export const recommendResources = async ({ topic, job_role, weak_areas, skill_level, learning_style }) => {
  const res = await api.post('/ai/recommend-resources', { topic, job_role, weak_areas, skill_level, learning_style });
  return res.data.data;
};
