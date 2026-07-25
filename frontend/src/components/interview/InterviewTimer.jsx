import { useTimer } from '../../hooks/useTimer';
import './InterviewTimer.css';

/**
 * InterviewTimer Component
 *
 * A reusable, production-ready countdown timer for interview sessions.
 * Features a large time display, status indicators, and full playback controls.
 *
 * @param {Object} props
 * @param {number} [props.initialDuration=1800] - Duration in seconds (default 30 mins)
 * @param {Function} [props.onComplete] - Callback fired when timer reaches 0
 */
export function InterviewTimer({ initialDuration = 1800, onComplete }) {
  const {
    isRunning,
    isPaused,
    isFinished,
    formatTime,
    start,
    pause,
    resume,
    reset,
    stop,
  } = useTimer({ initialDuration, onComplete });

  const isIdle = !isRunning && !isPaused && !isFinished;

  /* ── Status display logic ── */
  let statusText = 'Ready';
  let statusClass = 'it-status-idle';

  if (isRunning) {
    statusText = 'Running';
    statusClass = 'it-status-running';
  } else if (isPaused) {
    statusText = 'Paused';
    statusClass = 'it-status-paused';
  } else if (isFinished) {
    statusText = 'Finished';
    statusClass = 'it-status-finished';
  }

  return (
    <div className="it-panel" id="interview-timer-panel">
      {/* Header */}
      <div className="it-header">
        <h2 className="it-title">
          <span className="it-title-icon">⏱️</span>
          Interview Timer
        </h2>
        <div className={`it-status-badge ${statusClass}`} id="timer-status">
          <span className="it-status-dot"></span>
          <span className="it-status-label">{statusText}</span>
        </div>
      </div>

      {/* Timer Display */}
      <div className="it-display-wrapper">
        <div
          className={`it-time-display ${
            isRunning ? 'it-time-running' : isFinished ? 'it-time-finished' : ''
          }`}
          id="timer-display"
        >
          {formatTime()}
        </div>
      </div>

      {/* Controls */}
      <div className="it-controls" id="timer-controls">
        {/* Show Start only if not running/paused/finished */}
        {(isIdle || isFinished) && (
          <button
            className="it-btn it-btn-start"
            onClick={isFinished ? reset : start}
            aria-label={isFinished ? 'Restart timer' : 'Start timer'}
          >
            <span className="it-btn-icon">{isFinished ? '🔄' : '▶'}</span>
            {isFinished ? 'Restart' : 'Start'}
          </button>
        )}

        {/* Pause/Resume toggle */}
        {(isRunning || isPaused) && (
          <button
            className={`it-btn ${isPaused ? 'it-btn-resume' : 'it-btn-pause'}`}
            onClick={isPaused ? resume : pause}
            aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
          >
            <span className="it-btn-icon">{isPaused ? '▶' : '⏸'}</span>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}

        {/* Stop button (shown if running or paused) */}
        {(isRunning || isPaused) && (
          <button
            className="it-btn it-btn-stop"
            onClick={stop}
            aria-label="Stop timer"
          >
            <span className="it-btn-icon">⏹</span>
            Stop
          </button>
        )}

        {/* Reset button */}
        <button
          className="it-btn it-btn-reset"
          onClick={reset}
          disabled={isIdle}
          aria-label="Reset timer"
        >
          <span className="it-btn-icon">↺</span>
          Reset
        </button>
      </div>
    </div>
  );
}

export default InterviewTimer;
