import { useMicrophonePermission, PERMISSION_STATUS } from '../../hooks/useMicrophonePermission';
import './MicrophonePermission.css';

const STATUS_CONFIG = {
  [PERMISSION_STATUS.GRANTED]: {
    icon: '🟢',
    label: 'Microphone Ready',
    className: 'mp-status-granted',
  },
  [PERMISSION_STATUS.PROMPT]: {
    icon: '🟡',
    label: 'Waiting for Permission',
    className: 'mp-status-prompt',
  },
  [PERMISSION_STATUS.DENIED]: {
    icon: '🔴',
    label: 'Permission Denied',
    className: 'mp-status-denied',
  },
  [PERMISSION_STATUS.UNSUPPORTED]: {
    icon: '⚪',
    label: 'Unsupported Browser',
    className: 'mp-status-unsupported',
  },
};

/**
 * MicrophonePermission – Displays mic permission state with controls to
 * request / refresh. Fully self-contained, production-ready.
 */
export function MicrophonePermission() {
  const {
    permissionStatus,
    supported,
    error,
    requestPermission,
    refreshPermission,
  } = useMicrophonePermission();

  const config = STATUS_CONFIG[permissionStatus] ?? STATUS_CONFIG[PERMISSION_STATUS.PROMPT];
  const isGranted = permissionStatus === PERMISSION_STATUS.GRANTED;
  const isDenied = permissionStatus === PERMISSION_STATUS.DENIED;
  const isUnsupported = permissionStatus === PERMISSION_STATUS.UNSUPPORTED;

  return (
    <div className="mp-panel" id="microphone-permission-panel">
      {/* Header */}
      <div className="mp-header">
        <h2 className="mp-title">
          <span className="mp-title-icon">🔒</span>
          Microphone Permission
        </h2>
      </div>

      {/* Status card */}
      <div className={`mp-status-card ${config.className}`} id="permission-status">
        <span className="mp-status-icon">{config.icon}</span>
        <div className="mp-status-info">
          <span className="mp-status-label">{config.label}</span>
          <span className="mp-status-detail">
            {isGranted && 'Your microphone is ready to use.'}
            {permissionStatus === PERMISSION_STATUS.PROMPT &&
              'Click the button below to enable microphone access.'}
            {isDenied &&
              'Access was blocked. Please update your browser settings to allow microphone use.'}
            {isUnsupported &&
              'Your browser does not support microphone access. Try Chrome or Edge.'}
          </span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mp-error" id="permission-error" role="alert">
          <span className="mp-error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="mp-controls" id="permission-controls">
        <button
          id="btn-request-permission"
          className="mp-btn mp-btn-request"
          onClick={requestPermission}
          disabled={isGranted || isUnsupported}
          aria-label="Request microphone permission"
        >
          <span className="mp-btn-icon">🎤</span>
          {isDenied ? 'Try Again' : 'Request Permission'}
        </button>

        <button
          id="btn-refresh-permission"
          className="mp-btn mp-btn-refresh"
          onClick={refreshPermission}
          disabled={isUnsupported}
          aria-label="Refresh permission status"
        >
          <span className="mp-btn-icon">🔄</span>
          Refresh Status
        </button>
      </div>

      {/* Help text for denied state */}
      {isDenied && (
        <div className="mp-help" id="permission-help">
          <p className="mp-help-title">How to re-enable:</p>
          <ol className="mp-help-steps">
            <li>Click the 🔒 or ℹ️ icon in your browser's address bar</li>
            <li>Find <strong>Microphone</strong> and set it to <strong>Allow</strong></li>
            <li>Reload the page</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default MicrophonePermission;
