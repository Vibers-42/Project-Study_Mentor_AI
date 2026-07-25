const buildQuestionGeneratorPrompt = ({ topic, jobRole, difficulty, questionType, previousQuestions = [] }) => {
  const context = jobRole ? `Job Role: ${jobRole}` : `Topic: ${topic}`;
  const avoidSection = previousQuestions.length > 0
    ? `\n\nDo NOT repeat any of these previously asked questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';

  return `You are an expert technical interviewer and educator. Generate exactly ONE high-quality ${questionType || 'conceptual'} question for the context below.

${context}
Difficulty: ${difficulty || 'intermediate'}${avoidSection}

Return a JSON object with this exact structure — no extra text, no markdown, just valid JSON:
{
  "question": "The full question text",
  "topic": "Specific concept or sub-topic being tested",
  "difficulty": "${difficulty || 'intermediate'}",
  "type": "${questionType || 'conceptual'}",
  "hints": ["Hint 1 (subtle)", "Hint 2 (more direct)"],
  "expected_concepts": ["concept1", "concept2", "concept3"],
  "follow_up_questions": ["Follow-up question 1", "Follow-up question 2"],
  "time_limit_minutes": 5
}

Question type guide:
- conceptual: Understanding of theory, definitions, trade-offs
- practical: Write code or design a solution
- scenario: Real-world problem that requires applied judgment
- behavioral: Past experience in STAR format (for job roles)

Difficulty guide:
- beginner: Core fundamentals, no prior experience assumed
- intermediate: Applied knowledge, 1-2 years experience expected
- advanced: Deep expertise, architectural thinking, edge cases`;
};

module.exports = { buildQuestionGeneratorPrompt };
