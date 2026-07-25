import { useInterviewSession } from '../../hooks/useInterviewSession';
import { SESSION_STATUS } from '../../context/InterviewSessionContext';
import './SessionSummary.css';

/* ── Helpers ── */

/** Format an ISO date string → "Jul 25, 2026 · 12:05 PM" */
function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format elapsed seconds → "hh:mm:ss" or "mm:ss" */
function formatElapsed(totalSeconds) {
  if (!totalSeconds) return '00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Map sessionStatus → display config */
const STATUS_CONFIG = {
  [SESSION_STATUS.COMPLETED]: {
    label: 'Completed',
    icon: '✅',
    className: 'ss-tag-completed',
  },
  [SESSION_STATUS.ACTIVE]: {
    label: 'In Progress',
    icon: '🟢',
    className: 'ss-tag-active',
  },
  [SESSION_STATUS.PAUSED]: {
    label: 'In Progress',
    icon: '🟡',
    className: 'ss-tag-paused',
  },
  [SESSION_STATUS.IDLE]: {
    label: 'Not Started',
    icon: '⚪',
    className: 'ss-tag-idle',
  },
};

/* ── Sub-components ── */

function StatCard({ id, icon, label, value, accent }) {
  return (
    <div className={`ss-stat-card ${accent ? 'ss-stat-accent' : ''}`} id={id}>
      <span className="ss-stat-icon">{icon}</span>
      <span className="ss-stat-value">{value}</span>
      <span className="ss-stat-label">{label}</span>
    </div>
  );
}

function InfoRow({ label, value, id }) {
  return (
    <div className="ss-info-row" id={id}>
      <span className="ss-info-label">{label}</span>
      <span className="ss-info-value">{value}</span>
    </div>
  );
}

/* ── Main component ── */

/**
 * SessionSummary
 *
 * Dashboard-style summary card driven entirely from InterviewSessionContext.
 * Place anywhere inside <InterviewSessionProvider>.
 */
export function SessionSummary() {
  const {
    candidateName,
    interviewStartTime,
    interviewEndTime,
    questionsAnswered,
    totalQuestions,
    timeElapsed,
    voiceResponses,
    textResponses,
    sessionStatus,
  } = useInterviewSession();

  const completion =
    totalQuestions > 0
      ? Math.min(100, Math.round((questionsAnswered / totalQuestions) * 100))
      : 0;

  const voiceCount = Object.keys(voiceResponses).length;
  const textCount = Object.keys(textResponses).length;

  const statusConfig =
    STATUS_CONFIG[sessionStatus] ?? STATUS_CONFIG[SESSION_STATUS.IDLE];

  const isIdle = sessionStatus === SESSION_STATUS.IDLE;

  return (
    <div className="ss-panel" id="session-summary-panel">
      {/* ── Header ── */}
      <div className="ss-header">
        <div className="ss-header-left">
          <h2 className="ss-title">
            <span className="ss-title-icon">📋</span>
            Session Summary
          </h2>
          {candidateName && (
            <p className="ss-candidate" id="summary-candidate-name">
              {candidateName}
            </p>
          )}
        </div>
        <div
          className={`ss-status-tag ${statusConfig.className}`}
          id="summary-status"
        >
          <span>{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* ── Stat grid ── */}
      <div className="ss-stat-grid">
        <StatCard
          id="stat-questions-answered"
          icon="✍️"
          label="Answered"
          value={`${questionsAnswered} / ${totalQuestions}`}
          accent
        />
        <StatCard
          id="stat-voice-responses"
          icon="🎙️"
          label="Voice"
          value={voiceCount}
        />
        <StatCard
          id="stat-text-responses"
          icon="📝"
          label="Text"
          value={textCount}
        />
        <StatCard
          id="stat-completion"
          icon="📊"
          label="Complete"
          value={`${completion}%`}
          accent={completion === 100}
        />
      </div>

      {/* ── Duration bar ── */}
      <div className="ss-duration-section">
        <div className="ss-duration-header">
          <span className="ss-duration-label">⏱ Duration</span>
          <span className="ss-duration-value" id="summary-duration">
            {formatElapsed(timeElapsed)}
          </span>
        </div>
        <div className="ss-duration-track">
          <div
            className="ss-duration-fill"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* ── Detail rows ── */}
      <div className="ss-info-section">
        <InfoRow
          id="summary-start-time"
          label="Start Time"
          value={isIdle ? '—' : formatDateTime(interviewStartTime)}
        />
        <InfoRow
          id="summary-end-time"
          label="End Time"
          value={formatDateTime(interviewEndTime)}
        />
        <InfoRow
          id="summary-total-questions"
          label="Total Questions"
          value={totalQuestions || '—'}
        />
        <InfoRow
          id="summary-session-status"
          label="Status"
          value={
            <span className={`ss-inline-tag ${statusConfig.className}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
          }
        />
      </div>
    </div>
  );
}

export default SessionSummary;
