import { useState, useRef, useEffect } from 'react';
import { useInterviewSession } from '../../hooks/useInterviewSession';
import { generateInterviewReport } from '../../services/pdfService';
import './DownloadReportButton.css';

/**
 * Format date to YYYY-MM-DD
 */
function formatDateYYYYMMDD(dateSource) {
  const dateObj = dateSource ? new Date(dateSource) : new Date();
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

  const yyyy = validDate.getFullYear();
  const mm = String(validDate.getMonth() + 1).padStart(2, '0');
  const dd = String(validDate.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Generate formatted filename: Interview_Report_<CandidateName>_<YYYY-MM-DD>.pdf
 */
function getReportFilename(candidateName, dateSource) {
  const sanitizedName = (candidateName || 'Candidate')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');
  const formattedDate = formatDateYYYYMMDD(dateSource);

  return `Interview_Report_${sanitizedName}_${formattedDate}.pdf`;
}

/**
 * DownloadReportButton
 *
 * Collects session data from InterviewSessionContext, generates a PDF using
 * `generateInterviewReport()`, and initiates download with automatic status feedback.
 */
export function DownloadReportButton({
  label = 'Download Report',
  disabled = false,
  customFilename = null,
  score = null,
  feedback = '',
  suggestions = [],
  className = '',
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const timeoutRef = useRef(null);

  const {
    candidateName,
    interviewStartTime,
    interviewEndTime,
    questionsAnswered,
    totalQuestions,
    timeElapsed,
    voiceResponses,
    textResponses,
  } = useInterviewSession();

  // Clear notification timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDownload = async () => {
    if (isGenerating || disabled) return;

    setIsGenerating(true);
    setStatusMessage(null);

    // Yield execution briefly so React updates the button state to "Downloading..."
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const formattedDateStr = interviewStartTime
        ? new Date(interviewStartTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

      const sessionData = {
        candidateName,
        date: formattedDateStr,
        interviewDuration: timeElapsed,
        questionsAnswered,
        totalQuestions,
        voiceResponses,
        textResponses,
        score,
        feedback,
        suggestions,
        startTime: interviewStartTime,
        endTime: interviewEndTime,
      };

      // 1. Generate PDF instance using generateInterviewReport
      const doc = generateInterviewReport(sessionData);

      // 2. Format filename: Interview_Report_<CandidateName>_<YYYY-MM-DD>.pdf
      const filename = customFilename || getReportFilename(candidateName, interviewStartTime);

      // 3. Trigger download
      doc.save(filename);

      setStatusMessage({
        type: 'success',
        text: 'Report downloaded successfully!',
      });
    } catch (err) {
      console.error('Failed to generate interview report PDF:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to generate PDF. Please try again.',
      });
    } finally {
      setIsGenerating(false);

      // Clear status message after 4 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    }
  };

  return (
    <div className={`drb-container ${className}`}>
      <button
        className={`drb-btn ${isGenerating ? 'drb-btn-generating' : ''}`}
        onClick={handleDownload}
        disabled={disabled || isGenerating}
        aria-label="Download interview report as PDF"
        aria-busy={isGenerating}
      >
        <span className="drb-icon" aria-hidden="true">
          {isGenerating ? '⏳' : '⬇️'}
        </span>
        <span className="drb-label">
          {isGenerating ? 'Downloading...' : label}
        </span>
      </button>

      {statusMessage && (
        <div
          className={`drb-status drb-status-${statusMessage.type}`}
          role="alert"
        >
          <span className="drb-status-icon" aria-hidden="true">
            {statusMessage.type === 'success' ? '✅' : '⚠️'}
          </span>
          <span className="drb-status-text">{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}

export default DownloadReportButton;
