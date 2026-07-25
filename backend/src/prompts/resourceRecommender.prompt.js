const buildResourceRecommenderPrompt = ({ topic, jobRole, weakAreas, skillLevel, learningStyle }) => {
  const context = jobRole ? `Job Role: ${jobRole}` : `Topic: ${topic}`;
  const weakLine = weakAreas?.length > 0
    ? `\nAreas needing attention: ${weakAreas.join(', ')}`
    : '';

  return `You are an expert learning resource curator. Recommend the most relevant, high-quality resources for the learner below.

${context}
Current Skill Level: ${skillLevel || 'intermediate'}
Preferred Learning Style: ${learningStyle || 'mixed'}${weakLine}

Return a JSON object with this exact structure — no extra text, just valid JSON:
{
  "resources": [
    {
      "title": "Resource title",
      "type": "<article|video|book|course|documentation|practice|tool>",
      "platform": "Platform or publisher (e.g., MDN, Udemy, O'Reilly)",
      "description": "What you will learn and why it's valuable",
      "difficulty": "<beginner|intermediate|advanced>",
      "estimated_time": "e.g., 4 hours or 3 weeks",
      "free": true,
      "key_topics": ["topic1", "topic2"]
    }
  ],
  "learning_path": {
    "phase_1": { "title": "Foundation", "resource_indices": [0, 1], "goal": "What you'll achieve" },
    "phase_2": { "title": "Applied Skills", "resource_indices": [2, 3], "goal": "What you'll achieve" },
    "phase_3": { "title": "Mastery", "resource_indices": [4, 5], "goal": "What you'll achieve" }
  },
  "quick_wins": ["Quick action 1 (doable today)", "Quick action 2"],
  "estimated_total_time": "e.g., 6 weeks at 1 hour/day"
}

Include 5-7 resources. Prioritize reputable, widely respected sources. Mix free and paid options.`;
};

module.exports = { buildResourceRecommenderPrompt };
