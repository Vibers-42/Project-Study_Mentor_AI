const buildFeedbackGeneratorPrompt = ({ topic, jobRole, sessionHistory, overallScore, weaknesses }) => {
  const context = jobRole ? `Job Role: ${jobRole}` : `Topic: ${topic}`;
  const weaknessLine = weaknesses?.length > 0
    ? `\nIdentified weak areas: ${weaknesses.join(', ')}`
    : '';
  const historyLines = sessionHistory?.length > 0
    ? `\nSession history (${sessionHistory.length} questions):\n${sessionHistory.map((s, i) =>
        `  Q${i + 1}: Score ${s.score ?? '?'}/10 | Topic: ${s.topic || 'General'} | Type: ${s.type || 'N/A'}`
      ).join('\n')}`
    : '\nNo session history provided.';

  return `You are an expert learning coach. Generate comprehensive, personalized feedback based on a study session.

${context}
Overall Score: ${overallScore ?? 'N/A'}/10${weaknessLine}${historyLines}

Return a JSON object with this exact structure — no extra text, just valid JSON:
{
  "overall_assessment": "2-3 paragraph assessment of the user's performance, strengths, and growth areas",
  "performance_level": "<beginner|developing|proficient|advanced|expert>",
  "strengths": ["Specific strength 1", "Specific strength 2"],
  "areas_for_improvement": ["Area 1", "Area 2", "Area 3"],
  "specific_gaps": [
    {
      "concept": "Concept name",
      "description": "What specifically needs work",
      "priority": "<high|medium|low>"
    }
  ],
  "recommended_resources": [
    {
      "title": "Resource title",
      "type": "<article|video|book|course|documentation|practice>",
      "description": "Why this helps and what to focus on",
      "estimated_time": "e.g., 2 hours"
    }
  ],
  "study_plan": {
    "immediate": ["Do this today"],
    "short_term": ["Do this this week"],
    "long_term": ["Achieve this in a month"]
  },
  "motivational_message": "A personalized, encouraging message (2-3 sentences)",
  "next_session_focus": "What topic/skill to focus on next"
}`;
};

module.exports = { buildFeedbackGeneratorPrompt };
