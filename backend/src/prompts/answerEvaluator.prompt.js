const buildAnswerEvaluatorPrompt = ({ question, userAnswer, expectedConcepts = [], topic, difficulty }) => {
  const conceptsLine = expectedConcepts.length > 0
    ? `\nKey concepts expected: ${expectedConcepts.join(', ')}`
    : '';

  return `You are an expert technical evaluator. Evaluate the answer below objectively and constructively.

QUESTION: ${question}
TOPIC: ${topic || 'General'}
DIFFICULTY: ${difficulty || 'intermediate'}${conceptsLine}

USER'S ANSWER:
${userAnswer || '[No answer provided]'}

Return a JSON object with this exact structure — no extra text, just valid JSON:
{
  "score": <integer 0-10>,
  "grade": "<A|B|C|D|F>",
  "percentage": <integer 0-100>,
  "strengths": ["What the user did well (specific)"],
  "weaknesses": ["What was incorrect or insufficient (specific)"],
  "missing_concepts": ["Important concepts not mentioned"],
  "accuracy_assessment": "One sentence on factual correctness",
  "completeness_assessment": "One sentence on how complete the answer was",
  "feedback_summary": "2-3 sentences of overall, constructive feedback",
  "better_answer": "A concise model answer covering the key points",
  "follow_up_recommendation": "<easier|same|harder>"
}

Grading scale:
- A (9-10): Covers all key concepts accurately and clearly
- B (7-8): Covers most concepts, minor gaps
- C (5-6): Covers basics but missing important points
- D (3-4): Significant gaps or inaccuracies
- F (0-2): Incorrect, irrelevant, or no answer

Be specific, fair, and encouraging. The goal is learning, not just scoring.`;
};

module.exports = { buildAnswerEvaluatorPrompt };
