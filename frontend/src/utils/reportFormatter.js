/**
 * formatInterviewReport
 * 
 * Takes the raw session data from InterviewSessionContext and formats it
 * into a clean, structured object ready to be rendered as a report or exported.
 */
export function formatInterviewReport(session) {
  if (!session) return null;

  const completion =
    session.totalQuestions > 0
      ? Math.round((session.questionsAnswered / session.totalQuestions) * 100)
      : 0;

  // Combine voice and text responses into a unified array
  // Assuming keys are question indices
  const allQuestionIndices = new Set([
    ...Object.keys(session.textResponses || {}),
    ...Object.keys(session.voiceResponses || {})
  ]);

  const responses = Array.from(allQuestionIndices)
    .sort((a, b) => Number(a) - Number(b))
    .map(idx => ({
      questionNumber: parseInt(idx, 10) + 1,
      textResponse: session.textResponses?.[idx] || null,
      hasVoiceResponse: !!session.voiceResponses?.[idx]
    }));

  return {
    candidateName: session.candidateName || 'Anonymous Candidate',
    date: session.interviewStartTime 
      ? new Date(session.interviewStartTime).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      : 'N/A',
    durationSeconds: session.timeElapsed,
    completionPercentage: completion,
    totalQuestions: session.totalQuestions,
    questionsAnswered: session.questionsAnswered,
    status: session.sessionStatus,
    responses
  };
}
