import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

/* ── Constants ── */
const STORAGE_KEY = 'interview_session';

export const SESSION_STATUS = {
  IDLE: 'idle',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
};

/* ── Default session shape ── */
const DEFAULT_SESSION = {
  sessionId: null,
  candidateName: '',
  interviewStartTime: null,
  interviewEndTime: null,
  currentQuestionIndex: 0,
  questionsAnswered: 0,
  totalQuestions: 0,
  timeElapsed: 0,            // seconds
  voiceResponses: {},        // { [questionIndex]: blobUrl | transcript }
  textResponses: {},         // { [questionIndex]: string }
  sessionStatus: SESSION_STATUS.IDLE,
};

/* ── Persistence helpers ── */
function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(session) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage may be full or disabled in private mode; silently ignore
  }
}

function clearStorage() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* ── Context creation ── */
export const InterviewSessionContext = createContext(null);

/**
 * InterviewSessionProvider
 *
 * Wrap your app (or a subtree) with this provider to give any descendant
 * access to the interview session via useInterviewSession().
 */
export function InterviewSessionProvider({ children }) {
  // Restore from sessionStorage on first render; fall back to defaults
  const [session, setSession] = useState(() => {
    const stored = loadFromStorage();
    // Only restore active/paused sessions – never restore a completed one
    if (stored && stored.sessionStatus !== SESSION_STATUS.COMPLETED) {
      return stored;
    }
    return DEFAULT_SESSION;
  });

  // Keep a ref for callbacks that must close over the latest session
  const sessionRef = useRef(session);
  sessionRef.current = session;

  /* ── Persist every state change ── */
  useEffect(() => {
    if (session.sessionStatus === SESSION_STATUS.IDLE) {
      // Nothing meaningful to persist for an idle session
      clearStorage();
    } else if (session.sessionStatus === SESSION_STATUS.COMPLETED) {
      clearStorage();
    } else {
      saveToStorage(session);
    }
  }, [session]);

  /* ── Helpers ── */
  const updateSession = useCallback((patch) => {
    setSession((prev) => ({ ...prev, ...patch }));
  }, []);

  /* ── Actions ── */
  const startSession = useCallback(({ candidateName = '', totalQuestions = 0 } = {}) => {
    const newSession = {
      ...DEFAULT_SESSION,
      sessionId: generateSessionId(),
      candidateName,
      totalQuestions,
      interviewStartTime: new Date().toISOString(),
      sessionStatus: SESSION_STATUS.ACTIVE,
    };
    setSession(newSession);
    saveToStorage(newSession);
  }, []);

  const endSession = useCallback(() => {
    updateSession({
      interviewEndTime: new Date().toISOString(),
      sessionStatus: SESSION_STATUS.COMPLETED,
    });
    // clearStorage() will be triggered by the effect above
  }, [updateSession]);

  const nextQuestion = useCallback(() => {
    const { currentQuestionIndex, totalQuestions, questionsAnswered } = sessionRef.current;
    if (currentQuestionIndex >= totalQuestions - 1) return;

    updateSession({
      currentQuestionIndex: currentQuestionIndex + 1,
      questionsAnswered: Math.max(questionsAnswered, currentQuestionIndex + 1),
    });
  }, [updateSession]);

  const previousQuestion = useCallback(() => {
    const { currentQuestionIndex } = sessionRef.current;
    if (currentQuestionIndex <= 0) return;

    updateSession({ currentQuestionIndex: currentQuestionIndex - 1 });
  }, [updateSession]);

  const saveVoiceResponse = useCallback((questionIndex, response) => {
    setSession((prev) => ({
      ...prev,
      voiceResponses: { ...prev.voiceResponses, [questionIndex]: response },
    }));
  }, []);

  const saveTextResponse = useCallback((questionIndex, text) => {
    setSession((prev) => ({
      ...prev,
      textResponses: { ...prev.textResponses, [questionIndex]: text },
    }));
  }, []);

  const updateElapsedTime = useCallback((seconds) => {
    updateSession({ timeElapsed: seconds });
  }, [updateSession]);

  const resetSession = useCallback(() => {
    clearStorage();
    setSession(DEFAULT_SESSION);
  }, []);

  /* ── Context value ── */
  const value = {
    // State
    session,

    // Derived shorthand (convenience access at call site)
    sessionId: session.sessionId,
    candidateName: session.candidateName,
    interviewStartTime: session.interviewStartTime,
    interviewEndTime: session.interviewEndTime,
    currentQuestionIndex: session.currentQuestionIndex,
    questionsAnswered: session.questionsAnswered,
    totalQuestions: session.totalQuestions,
    timeElapsed: session.timeElapsed,
    voiceResponses: session.voiceResponses,
    textResponses: session.textResponses,
    sessionStatus: session.sessionStatus,

    // Status flags
    isIdle: session.sessionStatus === SESSION_STATUS.IDLE,
    isActive: session.sessionStatus === SESSION_STATUS.ACTIVE,
    isPaused: session.sessionStatus === SESSION_STATUS.PAUSED,
    isCompleted: session.sessionStatus === SESSION_STATUS.COMPLETED,

    // Actions
    startSession,
    endSession,
    nextQuestion,
    previousQuestion,
    saveVoiceResponse,
    saveTextResponse,
    updateElapsedTime,
    resetSession,
  };

  return (
    <InterviewSessionContext.Provider value={value}>
      {children}
    </InterviewSessionContext.Provider>
  );
}

export default InterviewSessionProvider;
