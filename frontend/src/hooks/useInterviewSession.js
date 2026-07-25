import { useContext } from 'react';
import { InterviewSessionContext } from '../context/InterviewSessionContext';

/**
 * useInterviewSession
 *
 * Convenience hook for consuming the InterviewSessionContext.
 *
 * Must be used inside an <InterviewSessionProvider> tree.
 *
 * @returns {import('../context/InterviewSessionContext').InterviewSessionContext}
 *
 * @example
 * const { sessionStatus, startSession, nextQuestion } = useInterviewSession();
 */
export function useInterviewSession() {
  const context = useContext(InterviewSessionContext);

  if (context === null) {
    throw new Error(
      'useInterviewSession must be used within an <InterviewSessionProvider>. ' +
      'Wrap your component tree (or App.jsx) with <InterviewSessionProvider>.'
    );
  }

  return context;
}

export default useInterviewSession;
