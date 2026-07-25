const { callClaude } = require('./anthropic.service');
const { parseClaudeJSON } = require('../utils/parseJSON');
const logger = require('../utils/logger');

const buildRoadmapPrompt = ({ topic, jobRole, currentLevel, targetRole, timeframe }) => {
  const context = jobRole ? `Target Role: ${jobRole}` : `Topic: ${topic}`;

  return `You are an expert career coach and learning strategist. Create a detailed, actionable learning roadmap.

${context}
Current Skill Level: ${currentLevel || 'beginner'}
Goal / Target: ${targetRole || jobRole || topic}
Timeframe: ${timeframe || '3 months'}

Return a JSON object with this exact structure — no extra text, just valid JSON:
{
  "title": "Roadmap title",
  "overview": "2-3 sentence overview of the learning journey and what the learner will achieve",
  "total_duration": "${timeframe || '3 months'}",
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "e.g., 3 weeks",
      "focus": "Main learning focus of this phase",
      "topics": ["topic1", "topic2", "topic3"],
      "skills_to_acquire": ["skill1", "skill2"],
      "resources": [
        { "title": "Resource name", "type": "<book|course|tutorial|documentation|practice>", "estimated_time": "X hours" }
      ],
      "projects": ["Hands-on project idea 1"],
      "milestones": ["Concrete milestone to verify phase completion"],
      "assessment": "How to know you've truly finished this phase"
    }
  ],
  "key_technologies": ["tech1", "tech2"],
  "career_outcomes": ["outcome1", "outcome2"],
  "tips": ["Practical tip for success"],
  "weekly_schedule": {
    "study_hours_per_day": 2,
    "days_per_week": 5,
    "total_hours": 60
  }
}

Create 3-5 phases that progressively build on each other. Be specific and realistic.`;
};

const generateRoadmap = async ({ topic, jobRole, currentLevel, targetRole, timeframe }) => {
  const prompt = buildRoadmapPrompt({ topic, jobRole, currentLevel, targetRole, timeframe });

  const { text } = await callClaude(prompt, {
    systemPrompt: 'You are an expert career coach. Create detailed, actionable learning roadmaps. Respond with valid JSON only — no markdown, no preamble.',
    maxTokens: 5000,
    useThinking: true,
  });

  const parsed = parseClaudeJSON(text);

  if (!parsed?.phases) {
    logger.warn('Could not parse roadmap JSON from Claude');
    return {
      title: `Learning Roadmap: ${topic || jobRole}`,
      overview: text,
      total_duration: timeframe || '3 months',
      prerequisites: [],
      phases: [],
      key_technologies: [],
      career_outcomes: [],
      tips: ['Start with fundamentals', 'Build projects to reinforce learning'],
      weekly_schedule: { study_hours_per_day: 2, days_per_week: 5, total_hours: 60 },
    };
  }

  return parsed;
};

module.exports = { generateRoadmap };
