import { useInterviewSession } from '../../hooks/useInterviewSession';
import { SESSION_STATUS } from '../../context/InterviewSessionContext';
import { DownloadReportButton } from './DownloadReportButton';
import './ReportPreview.css';

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

function formatDateTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDuration(secs) {
  if (!secs && secs !== 0) return null;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(m)}:${pad(s)}`;
}

function ScoreMeter({ score }) {
  const pct = Math.min(100, Math.max(0, Number(score) || 0));
  let tier = 'rp-score-low';
  let label = 'Needs Improvement';
  if (pct >= 75) { tier = 'rp-score-high'; label = 'Excellent'; }
  else if (pct >= 50) { tier = 'rp-score-mid'; label = 'Good'; }

  return (
    <div className="rp-score-meter">
      <div className={`rp-score-ring ${tier}`}>
        <svg viewBox="0 0 80 80" className="rp-score-svg" aria-hidden="true">
          <circle cx="40" cy="40" r="34" className="rp-score-track" />
          <circle
            cx="40" cy="40" r="34"
            className={`rp-score-fill ${tier}`}
            strokeDasharray={`${(pct / 100) * 213.6} 213.6`}
          />
        </svg>
        <span className={`rp-score-num ${tier}`}>{pct}</span>
      </div>
      <div className="rp-score-meta">
        <span className={`rp-score-label ${tier}`}>{label}</span>
        <span className="rp-score-sub">out of 100</span>
      </div>
    </div>
  );
}

function Placeholder({ text = 'Not available', icon = '—' }) {
  return (
    <span className="rp-placeholder">
      <span className="rp-placeholder-icon">{icon}</span> {text}
    </span>
  );
}

function InfoPair({ label, value, placeholder = 'N/A' }) {
  return (
    <div className="rp-kv">
      <span className="rp-kv-label">{label}</span>
      <span className="rp-kv-value">
        {value ?? <Placeholder text={placeholder} />}
      </span>
    </div>
  );
}

function SectionCard({ id, icon, title, children, accent }) {
  return (
    <div className={`rp-card ${accent ? 'rp-card-accent' : ''}`} id={id}>
      <div className="rp-card-header">
        <span className="rp-card-icon">{icon}</span>
        <h3 className="rp-card-title">{title}</h3>
      </div>
      <div className="rp-card-body">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */

/**
 * ReportPreview
 *
 * Dashboard-style preview of the interview report.
 * Reads all data from InterviewSessionContext.
 * Accepts optional score / feedback / suggestions props that come
 * from the AI evaluation layer (not stored in context).
 */
export function ReportPreview({
  score = null,
  feedback = '',
  suggestions = [],
}) {
  const {
    session,
    candidateName,
    interviewStartTime,
    interviewEndTime,
    questionsAnswered,
    totalQuestions,
    timeElapsed,
    voiceResponses,
    textResponses,
    sessionStatus,
    isIdle,
  } = useInterviewSession();

  const completion =
    totalQuestions > 0
      ? Math.round((questionsAnswered / totalQuestions) * 100)
      : 0;

  const voiceCount = Object.keys(voiceResponses).length;
  const textCount  = Object.keys(textResponses).length;

  const statusLabel =
    sessionStatus === SESSION_STATUS.COMPLETED ? 'Completed'   :
    sessionStatus === SESSION_STATUS.ACTIVE    ? 'In Progress' :
    sessionStatus === SESSION_STATUS.PAUSED    ? 'Paused'      :
    'Not Started';

  const statusClass =
    sessionStatus === SESSION_STATUS.COMPLETED ? 'rp-tag-completed' :
    sessionStatus === SESSION_STATUS.ACTIVE    ? 'rp-tag-active'    :
    sessionStatus === SESSION_STATUS.PAUSED    ? 'rp-tag-paused'    :
    'rp-tag-idle';

  /* Merge response indices for the response list */
  const allIdx = Array.from(
    new Set([...Object.keys(textResponses), ...Object.keys(voiceResponses)])
  ).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="rp-panel" id="interview-report-preview">

      {/* ── Top bar ── */}
      <div className="rp-topbar">
        <div className="rp-topbar-left">
          <span className="rp-topbar-icon">📋</span>
          <div>
            <h2 className="rp-main-title">Interview Report Preview</h2>
            <p className="rp-subtitle">AI Study Mentor · Confidential</p>
          </div>
        </div>
        <div className="rp-topbar-right">
          <span className={`rp-tag ${statusClass}`}>{statusLabel}</span>
          <DownloadReportButton
            score={score}
            feedback={feedback}
            suggestions={suggestions}
          />
        </div>
      </div>

      {/* ── Grid layout ── */}
      <div className="rp-grid">

        {/* ── CARD: Candidate Info ── */}
        <SectionCard id="rp-card-candidate" icon="👤" title="Candidate" accent>
          <div className="rp-candidate-name" id="rp-candidate-name">
            {candidateName || <Placeholder text="Anonymous Candidate" icon="👤" />}
          </div>
          <div className="rp-kv-list">
            <InfoPair label="Date"       value={formatDateTime(interviewStartTime)} />
            <InfoPair label="Start"      value={formatDateTime(interviewStartTime)} />
            <InfoPair label="End"        value={formatDateTime(interviewEndTime)} />
            <InfoPair label="Status"     value={statusLabel} />
          </div>
        </SectionCard>

        {/* ── CARD: Summary Stats ── */}
        <SectionCard id="rp-card-summary" icon="📊" title="Interview Summary">
          <div className="rp-stat-grid">
            <div className="rp-stat" id="rp-stat-duration">
              <span className="rp-stat-icon">⏱</span>
              <span className="rp-stat-value">
                {formatDuration(timeElapsed) ?? '—'}
              </span>
              <span className="rp-stat-label">Duration</span>
            </div>
            <div className="rp-stat" id="rp-stat-answered">
              <span className="rp-stat-icon">✍️</span>
              <span className="rp-stat-value">
                {questionsAnswered}/{totalQuestions}
              </span>
              <span className="rp-stat-label">Answered</span>
            </div>
            <div className="rp-stat" id="rp-stat-voice">
              <span className="rp-stat-icon">🎙️</span>
              <span className="rp-stat-value">{voiceCount}</span>
              <span className="rp-stat-label">Voice</span>
            </div>
            <div className="rp-stat" id="rp-stat-text">
              <span className="rp-stat-icon">📝</span>
              <span className="rp-stat-value">{textCount}</span>
              <span className="rp-stat-label">Text</span>
            </div>
          </div>

          {/* Completion bar */}
          <div className="rp-completion">
            <div className="rp-completion-header">
              <span className="rp-completion-label">Completion</span>
              <span className="rp-completion-pct" id="rp-completion-pct">
                {completion}%
              </span>
            </div>
            <div
              className="rp-bar-track"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="rp-bar-fill"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── CARD: Score ── */}
        <SectionCard id="rp-card-score" icon="🏆" title="Overall Score">
          {score !== null && score !== undefined ? (
            <ScoreMeter score={score} />
          ) : (
            <div className="rp-no-score">
              <Placeholder text="Score not yet evaluated" icon="🏆" />
            </div>
          )}
        </SectionCard>

        {/* ── CARD: AI Feedback ── */}
        <SectionCard id="rp-card-feedback" icon="🤖" title="AI Feedback">
          {feedback?.trim() ? (
            <p className="rp-feedback-text">{feedback}</p>
          ) : (
            <Placeholder text="No AI feedback available yet" icon="🤖" />
          )}
        </SectionCard>

        {/* ── CARD: Suggestions — full width ── */}
        <SectionCard id="rp-card-suggestions" icon="💡" title="Suggestions for Improvement">
          {Array.isArray(suggestions) && suggestions.length > 0 ? (
            <ol className="rp-suggestions-list" id="rp-suggestions-list">
              {suggestions.map((s, i) => (
                <li key={i} className="rp-suggestion-item">
                  <span className="rp-suggestion-num">{i + 1}</span>
                  <span className="rp-suggestion-text">{s}</span>
                </li>
              ))}
            </ol>
          ) : (
            <Placeholder text="No suggestions available yet" icon="💡" />
          )}
        </SectionCard>

        {/* ── CARD: Responses — full width ── */}
        <SectionCard id="rp-card-responses" icon="💬" title="Question Responses">
          {allIdx.length === 0 ? (
            <Placeholder text="No responses recorded yet" icon="💬" />
          ) : (
            <div className="rp-response-list" id="rp-response-list">
              {allIdx.map((idx) => {
                const qNum     = Number(idx) + 1;
                const text     = textResponses[idx] || null;
                const hasVoice = !!voiceResponses[idx];

                return (
                  <div key={idx} className="rp-response-item">
                    <div className="rp-response-meta">
                      <span className="rp-response-q-num">Q{qNum}</span>
                      {hasVoice && (
                        <span className="rp-response-voice-badge">🎙️ Voice</span>
                      )}
                    </div>
                    <div className="rp-response-content">
                      {text ? (
                        <p className="rp-response-text">{text}</p>
                      ) : (
                        <p className="rp-response-missing">
                          No text transcript recorded.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

      </div>{/* end grid */}
    </div>
  );
}

export default ReportPreview;
