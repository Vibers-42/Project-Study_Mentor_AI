import { useRef, useEffect } from 'react';
import { useRecorder } from '../../hooks/useRecorder';
import './VoiceRecorder.css';

/**
 * Format milliseconds → mm:ss.t
 */
function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const secs = String(totalSec % 60).padStart(2, '0');
  const tenths = Math.floor((ms % 1000) / 100);
  return `${mins}:${secs}.${tenths}`;
}

/**
 * VoiceRecorder – A production-ready audio recorder component.
 * Uses the MediaRecorder API exclusively (no external libraries).
 *
 * @param {(rec: {audioURL: string, duration: number, mimeType: string}) => void} [onRecordingComplete]
 *        Called once a recording is stopped, so a parent can attach it to an answer.
 */
export function VoiceRecorder({ onRecordingComplete }) {
  const {
    status,
    duration,
    audioURL,
    error,
    mimeType,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteRecording,
  } = useRecorder({ mimeType: 'audio/webm' });

  const audioRef = useRef(null);

  const isIdle = status === 'idle';
  const isRecording = status === 'recording';
  const isPaused = status === 'paused';
  const isStopped = status === 'stopped';
  const isActive = isRecording || isPaused;

  /* ── Notify parent when a recording finishes ── */
  useEffect(() => {
    if (status === 'stopped' && audioURL) {
      onRecordingComplete?.({ audioURL, duration, mimeType });
    }
    // `duration` is intentionally excluded — it is final once status is 'stopped'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, audioURL]);

  /* ── Download helper ── */
  const handleDownload = () => {
    if (!audioURL) return;
    const ext = mimeType.includes('webm') ? 'webm' : mimeType.includes('ogg') ? 'ogg' : 'mp4';
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = `recording-${Date.now()}.${ext}`;
    a.click();
  };

  return (
    <div className="vr-panel" id="voice-recorder-panel">
      {/* Header */}
      <div className="vr-header">
        <h2 className="vr-title">
          <span className="vr-title-icon">🎙️</span>
          Voice Recorder
        </h2>

        {isActive && (
          <div className={`vr-status-badge ${isPaused ? 'vr-status-paused' : ''}`} id="recorder-status">
            <span className={`vr-status-dot ${isPaused ? 'paused' : ''}`} />
            <span className="vr-status-label">
              {isPaused ? '⏸ Paused' : '🔴 Recording'}
            </span>
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="vr-timer-wrapper">
        <div className={`vr-timer ${isRecording ? 'vr-timer-active' : ''}`} id="recording-duration">
          {formatDuration(duration)}
        </div>

        {/* Waveform visualiser placeholder – pulses when recording */}
        {isActive && (
          <div className="vr-wave" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="vr-wave-bar"
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="vr-error" id="recorder-error" role="alert">
          <span className="vr-error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="vr-controls" id="recorder-controls">
        {/* Start – visible when idle or stopped */}
        {(isIdle || isStopped) && (
          <button
            id="btn-start-recording"
            className="vr-btn vr-btn-start"
            onClick={startRecording}
            aria-label="Start recording"
          >
            <span className="vr-btn-icon">🎙</span>
            Start
          </button>
        )}

        {/* Pause – visible when recording */}
        {isRecording && (
          <button
            id="btn-pause-recording"
            className="vr-btn vr-btn-pause"
            onClick={pauseRecording}
            aria-label="Pause recording"
          >
            <span className="vr-btn-icon">⏸</span>
            Pause
          </button>
        )}

        {/* Resume – visible when paused */}
        {isPaused && (
          <button
            id="btn-resume-recording"
            className="vr-btn vr-btn-resume"
            onClick={resumeRecording}
            aria-label="Resume recording"
          >
            <span className="vr-btn-icon">▶</span>
            Resume
          </button>
        )}

        {/* Stop – visible when recording or paused */}
        {isActive && (
          <button
            id="btn-stop-recording"
            className="vr-btn vr-btn-stop"
            onClick={stopRecording}
            aria-label="Stop recording"
          >
            <span className="vr-btn-icon">⏹</span>
            Stop
          </button>
        )}

        {/* Delete – visible when stopped */}
        {isStopped && (
          <button
            id="btn-delete-recording"
            className="vr-btn vr-btn-delete"
            onClick={deleteRecording}
            aria-label="Delete recording"
          >
            <span className="vr-btn-icon">🗑</span>
            Delete
          </button>
        )}

        {/* Download – visible when stopped with audio */}
        {isStopped && audioURL && (
          <button
            id="btn-download-recording"
            className="vr-btn vr-btn-download"
            onClick={handleDownload}
            aria-label="Download recording"
          >
            <span className="vr-btn-icon">⬇</span>
            Download
          </button>
        )}
      </div>

      {/* Playback */}
      {isStopped && audioURL && (
        <div className="vr-playback" id="recorder-playback">
          <audio
            ref={audioRef}
            src={audioURL}
            controls
            className="vr-audio-player"
          />
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;
