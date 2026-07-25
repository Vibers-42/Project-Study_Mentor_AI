import { useInterviewSession } from '../../hooks/useInterviewSession';
import './InterviewProgress.css';

/**
 * InterviewProgress
 *
 * Displays current question, answered, remaining, percentage,
 * and an animated progress bar — all driven from InterviewSessionContext.
 * Drop it anywhere inside <InterviewSessionProvider> and it just works.
 */
export function InterviewProgress() {
  const {
    currentQuestionIndex,
    questionsAnswered,
    totalQuestions,
    sessionStatus,
    isIdle,
  } = useInterviewSession();

  /* ── Derived values ── */
  const currentQuestion = currentQuestionIndex + 1;
  const remaining = Math.max(0, totalQuestions - questionsAnswered);
  const percentage =
    totalQuestions > 0
      ? Math.min(100, Math.round((questionsAnswered / totalQuestions) * 100))
      : 0;

  /* ── Colour tier for progress bar ── */
  let tierClass = 'ip-bar-fill-low';
  if (percentage >= 75) tierClass = 'ip-bar-fill-high';
  else if (percentage >= 40) tierClass = 'ip-bar-fill-mid';

  return (
    <div className="ip-panel" id="interview-progress-panel">
      {/* Header */}
      <div className="ip-header">
        <h2 className="ip-title">
          <span className="ip-title-icon">📊</span>
          Progress
        </h2>
        <span className={`ip-session-badge ip-badge-${sessionStatus}`}>
          {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
        </span>
      </div>

      {/* Stat grid */}
      <div className="ip-stats" id="progress-stats">
        <div className="ip-stat" id="stat-current">
          <span className="ip-stat-value">
            {isIdle ? '—' : currentQuestion}
          </span>
          <span className="ip-stat-label">Current</span>
        </div>

        <div className="ip-divider" />

        <div className="ip-stat" id="stat-answered">
          <span className="ip-stat-value">{questionsAnswered}</span>
          <span className="ip-stat-label">Answered</span>
        </div>

        <div className="ip-divider" />

        <div className="ip-stat" id="stat-remaining">
          <span className="ip-stat-value">{remaining}</span>
          <span className="ip-stat-label">Remaining</span>
        </div>

        <div className="ip-divider" />

        <div className="ip-stat" id="stat-total">
          <span className="ip-stat-value">{totalQuestions}</span>
          <span className="ip-stat-label">Total</span>
        </div>
      </div>

      {/* Question label */}
      <p className="ip-question-label" id="progress-question-label">
        {isIdle
          ? 'No active session'
          : `Question ${currentQuestion} of ${totalQuestions}`}
      </p>

      {/* Progress bar */}
      <div
        className="ip-bar-track"
        id="progress-bar-track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Interview progress: ${percentage}%`}
      >
        <div
          className={`ip-bar-fill ${tierClass}`}
          id="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage label */}
      <div className="ip-percentage-row">
        <span className="ip-percentage-label" id="progress-percentage">
          {percentage}% complete
        </span>
        {percentage === 100 && (
          <span className="ip-complete-badge">🎉 All done!</span>
        )}
      </div>
    </div>
  );
}

export default InterviewProgress;
