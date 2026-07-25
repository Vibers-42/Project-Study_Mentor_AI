import { useState, useRef, useCallback } from 'react';
import './AudioUploader.css';

const ACCEPTED_TYPES = {
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/mp4': '.m4a',
  'audio/x-m4a': '.m4a',
  'audio/webm': '.webm',
};

const ACCEPTED_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.webm'];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_SIZE_LABEL = '20 MB';

/**
 * Format bytes → human-readable string
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Format seconds → mm:ss
 */
function formatDuration(sec) {
  if (!sec || !isFinite(sec)) return '--:--';
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(Math.floor(sec % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Validate a File against accepted types and max size.
 * Returns an error string or null.
 */
function validateFile(file) {
  if (!file) return 'No file selected.';

  // Check MIME type, then fallback to extension
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const mimeOk = Object.keys(ACCEPTED_TYPES).includes(file.type);
  const extOk = ACCEPTED_EXTENSIONS.includes(ext);

  if (!mimeOk && !extOk) {
    return `Unsupported format. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`;
  }

  if (file.size > MAX_SIZE_BYTES) {
    return `File too large (${formatSize(file.size)}). Maximum is ${MAX_SIZE_LABEL}.`;
  }

  return null;
}

/**
 * Load audio duration from a File via the HTML5 Audio API.
 * Returns a Promise<number | null>.
 */
function loadAudioDuration(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();

    audio.addEventListener('loadedmetadata', () => {
      const dur = isFinite(audio.duration) ? audio.duration : null;
      URL.revokeObjectURL(url);
      resolve(dur);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      resolve(null);
    });

    audio.src = url;
  });
}

/**
 * AudioUploader – Drag-and-drop or click-to-upload audio component.
 * Accepts .mp3, .wav, .m4a, .webm (max 20 MB).
 */
export function AudioUploader() {
  const [fileData, setFileData] = useState(null); // { file, name, size, duration, url }
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const audioRef = useRef(null);

  /* ── Process a selected file ── */
  const processFile = useCallback(async (file) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Revoke previous blob URL
    if (fileData?.url) URL.revokeObjectURL(fileData.url);

    const duration = await loadAudioDuration(file);
    const url = URL.createObjectURL(file);

    setFileData({
      file,
      name: file.name,
      size: file.size,
      duration,
      url,
    });

    setLoading(false);
  }, [fileData]);

  /* ── Event handlers ── */
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so re-selecting the same file triggers onChange
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    if (fileData?.url) URL.revokeObjectURL(fileData.url);
    setFileData(null);
    setError(null);
  };

  const handleReplace = () => {
    inputRef.current?.click();
  };

  /* ── File extension label ── */
  const extLabel = fileData
    ? fileData.name.split('.').pop().toUpperCase()
    : null;

  return (
    <div className="au-panel" id="audio-uploader-panel">
      {/* Header */}
      <div className="au-header">
        <h2 className="au-title">
          <span className="au-title-icon">📁</span>
          Audio Upload
        </h2>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleInputChange}
        className="au-input-hidden"
        id="audio-file-input"
        aria-label="Upload audio file"
      />

      {/* Drop zone – shown when no file is loaded */}
      {!fileData && (
        <div
          className={`au-dropzone ${dragging ? 'au-dropzone-active' : ''}`}
          id="audio-dropzone"
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          aria-label="Click or drag to upload audio"
        >
          <div className="au-dropzone-icon">
            {loading ? (
              <span className="au-spinner" />
            ) : (
              <span className="au-upload-icon">⬆</span>
            )}
          </div>
          <p className="au-dropzone-text">
            {loading ? 'Processing…' : 'Click or drag audio file here'}
          </p>
          <p className="au-dropzone-hint">
            {ACCEPTED_EXTENSIONS.join(', ')} · Max {MAX_SIZE_LABEL}
          </p>
        </div>
      )}

      {/* File card – shown after successful upload */}
      {fileData && (
        <div className="au-file-card" id="audio-file-card">
          {/* File info row */}
          <div className="au-file-info">
            <div className="au-file-badge">{extLabel}</div>
            <div className="au-file-details">
              <span className="au-file-name" title={fileData.name}>
                {fileData.name}
              </span>
              <span className="au-file-meta">
                {formatSize(fileData.size)}
                {fileData.duration != null && (
                  <> · {formatDuration(fileData.duration)}</>
                )}
              </span>
            </div>
          </div>

          {/* Audio preview */}
          <div className="au-playback">
            <audio
              ref={audioRef}
              src={fileData.url}
              controls
              className="au-audio-player"
              id="audio-preview"
            />
          </div>

          {/* Actions */}
          <div className="au-actions">
            <button
              id="btn-replace-audio"
              className="au-btn au-btn-replace"
              onClick={handleReplace}
              aria-label="Replace file"
            >
              <span className="au-btn-icon">🔄</span>
              Replace
            </button>
            <button
              id="btn-remove-audio"
              className="au-btn au-btn-remove"
              onClick={handleRemove}
              aria-label="Remove file"
            >
              <span className="au-btn-icon">🗑</span>
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="au-error" id="audio-upload-error" role="alert">
          <span className="au-error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default AudioUploader;
