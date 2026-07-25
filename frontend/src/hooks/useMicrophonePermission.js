import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Permission states used throughout the app.
 */
export const PERMISSION_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PROMPT: 'prompt',
  UNSUPPORTED: 'unsupported',
};

/**
 * Check whether the Permissions API supports the 'microphone' query.
 */
async function queryMicPermission() {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' });
    return result.state; // 'granted' | 'denied' | 'prompt'
  } catch {
    // Permissions API doesn't support 'microphone' in this browser
    return null;
  }
}

/**
 * useMicrophonePermission – React hook to manage microphone permission state.
 *
 * @returns {{ permissionStatus, supported, error,
 *             requestPermission, refreshPermission }}
 */
export function useMicrophonePermission() {
  const [permissionStatus, setPermissionStatus] = useState(PERMISSION_STATUS.PROMPT);
  const [error, setError] = useState(null);

  const supported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function';

  // Keep a ref to the Permissions API status object so we can listen for changes
  const permStatusRef = useRef(null);

  /* ── Initial check on mount ── */
  useEffect(() => {
    if (!supported) {
      setPermissionStatus(PERMISSION_STATUS.UNSUPPORTED);
      return;
    }

    let cancelled = false;

    (async () => {
      const state = await queryMicPermission();

      if (cancelled) return;

      if (state) {
        setPermissionStatus(state);

        // Listen for real-time permission changes (e.g. user revokes in browser settings)
        try {
          const status = await navigator.permissions.query({ name: 'microphone' });
          permStatusRef.current = status;

          status.addEventListener('change', () => {
            if (!cancelled) setPermissionStatus(status.state);
          });
        } catch {
          // Silently ignore — we already have the initial state
        }
      }
      // If queryMicPermission returned null the Permissions API isn't available;
      // we stay on 'prompt' until the user explicitly requests access.
    })();

    return () => {
      cancelled = true;
      // Clean up the permission change listener
      if (permStatusRef.current) {
        try {
          permStatusRef.current.removeEventListener('change', () => {});
        } catch {
          // noop
        }
        permStatusRef.current = null;
      }
    };
  }, [supported]);

  /* ── Request permission via getUserMedia ── */
  const requestPermission = useCallback(async () => {
    setError(null);

    if (!supported) {
      setPermissionStatus(PERMISSION_STATUS.UNSUPPORTED);
      setError('Your browser does not support microphone access.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately release the mic
      stream.getTracks().forEach((track) => track.stop());
      setPermissionStatus(PERMISSION_STATUS.GRANTED);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionStatus(PERMISSION_STATUS.DENIED);
        setError('Microphone permission was denied. Please allow access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionStatus(PERMISSION_STATUS.DENIED);
        setError('No microphone detected. Please connect a microphone and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Microphone is already in use by another application.');
      } else {
        setError(err.message || 'An unexpected error occurred while requesting microphone access.');
      }
    }
  }, [supported]);

  /* ── Refresh permission state without triggering the prompt ── */
  const refreshPermission = useCallback(async () => {
    setError(null);

    if (!supported) {
      setPermissionStatus(PERMISSION_STATUS.UNSUPPORTED);
      return;
    }

    const state = await queryMicPermission();
    if (state) {
      setPermissionStatus(state);
    }
    // If the Permissions API isn't available we can't silently refresh
  }, [supported]);

  return {
    permissionStatus,
    supported,
    error,
    requestPermission,
    refreshPermission,
  };
}

export default useMicrophonePermission;
