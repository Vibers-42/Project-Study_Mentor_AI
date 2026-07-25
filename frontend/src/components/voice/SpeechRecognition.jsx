import { useEffect } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import './SpeechRecognition.css';

/**
 * SpeechRecognition – A production-ready, self-contained voice-to-text panel.
 * Uses the Web Speech API exclusively (no external libraries).
 *
 * @param {(transcript: string) => void} [onTranscriptChange]
 *        Called with the finalised transcript whenever it changes, so a parent
 *        (e.g. the Interview page) can use the speech as the submitted answer.
 */
export function SpeechRecognition({ onTranscriptChange }) {
  const {
    transcript,
    interimTranscript,
    listening,
    supported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: 'en-US',
    continuous: true,
    interimResults: true,
  });

  /* ── Push transcript up to the parent ──
     Includes the live interim text so the parent's answer box always reflects
     what has been said — otherwise words Chrome hasn't finalised yet would be
     lost when the user submits. */
  useEffect(() => {
    const composed = transcript + (interimTranscript ? ` ${interimTranscript}` : '');
    onTranscriptChange?.(composed.trim());
  }, [transcript, interimTranscript, onTranscriptChange]);

  /* ── Unsupported browser ── */
  if (!supported) {
    return (
      <div className="sr-panel sr-unsupported" id="speech-recognition-panel">
        <div className="sr-unsupported-icon">⚠️</div>
        <p className="sr-unsupported-text">
          Speech Recognition is not supported in this browser.
        </p>
        <p className="sr-unsupported-hint">
          Please use Chrome, Edge, or another Chromium-based browser.
        </p>
      </div>
    );
  }

  /* ── Compose display text: finalised + live interim ── */
  const displayText =
    transcript + (interimTranscript ? ` ${interimTranscript}` : '');

  return (
    <div className="sr-panel" id="speech-recognition-panel">
      {/* Header */}
      <div className="sr-header">
        <h2 className="sr-title">
          <span className="sr-title-icon">🎙️</span>
          Voice Input
        </h2>

        {/* Listening indicator */}
        {listening && (
          <div className="sr-listening-badge" id="listening-indicator">
            <span className="sr-pulse" />
            <span className="sr-listening-label">🎤 Listening…</span>
          </div>
        )}
      </div>

      {/* Transcript area */}
      <div className="sr-transcript-wrapper">
        <textarea
          id="speech-transcript"
          className="sr-transcript"
          readOnly
          value={displayText}
          placeholder="Your speech will appear here…"
          rows={8}
        />
        {interimTranscript && (
          <span className="sr-interim-indicator">live</span>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="sr-error" id="speech-error" role="alert">
          <span className="sr-error-icon">⚠</span>
          <span>Error: {error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="sr-controls" id="speech-controls">
        <button
          id="btn-start-listening"
          className="sr-btn sr-btn-start"
          onClick={startListening}
          disabled={listening}
          aria-label="Start listening"
        >
          <span className="sr-btn-icon">▶</span>
          Start Listening
        </button>

        <button
          id="btn-stop-listening"
          className="sr-btn sr-btn-stop"
          onClick={stopListening}
          disabled={!listening}
          aria-label="Stop listening"
        >
          <span className="sr-btn-icon">■</span>
          Stop
        </button>

        <button
          id="btn-clear-transcript"
          className="sr-btn sr-btn-clear"
          onClick={resetTranscript}
          disabled={listening}
          aria-label="Clear transcript"
        >
          <span className="sr-btn-icon">✕</span>
          Clear
        </button>
      </div>

      {/* Character counter */}
      <div className="sr-meta">
        <span className="sr-char-count">{transcript.length} characters</span>
      </div>
    </div>
  );
}

export default SpeechRecognition;
