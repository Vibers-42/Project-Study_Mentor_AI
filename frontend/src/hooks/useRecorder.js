import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useRecorder – React hook for browser-native audio recording via MediaRecorder.
 *
 * @param {Object}  options
 * @param {string}  [options.mimeType='audio/webm']
 * @returns {{ status, duration, audioURL, error,
 *             startRecording, pauseRecording, resumeRecording,
 *             stopRecording, deleteRecording }}
 */
export function useRecorder({ mimeType = 'audio/webm' } = {}) {
  const [status, setStatus] = useState('idle'); // idle | recording | paused | stopped
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);

  // Resolve a supported MIME type (fallback chain)
  const resolvedMimeType = (() => {
    if (typeof MediaRecorder === 'undefined') return mimeType;
    const candidates = [mimeType, 'audio/webm', 'audio/webm;codecs=opus', 'audio/ogg', 'audio/mp4'];
    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
  })();

  /* ── Timer helpers ── */
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current);
      setDuration(elapsed);
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const pauseTimer = useCallback(() => {
    stopTimer();
    elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
  }, [stopTimer]);

  /* ── Core actions ── */
  const startRecording = useCallback(async () => {
    setError(null);

    if (typeof MediaRecorder === 'undefined') {
      setError('MediaRecorder API is not supported in this browser.');
      return;
    }

    if (!resolvedMimeType) {
      setError('No supported audio MIME type found in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType: resolvedMimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: resolvedMimeType });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setStatus('stopped');

        // Release mic
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.onerror = (e) => {
        setError(e.error?.message || 'Recording error');
        setStatus('idle');
        stopTimer();
      };

      mediaRecorderRef.current = recorder;

      // Revoke previous URL
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }

      // Reset duration tracking
      elapsedBeforePauseRef.current = 0;
      setDuration(0);

      recorder.start();
      setStatus('recording');
      startTimer();
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please allow access and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError(err.message || 'Failed to start recording.');
      }
    }
  }, [resolvedMimeType, audioURL, startTimer, stopTimer]);

  const pauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== 'recording') return;

    recorder.pause();
    setStatus('paused');
    pauseTimer();
  }, [pauseTimer]);

  const resumeRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== 'paused') return;

    recorder.resume();
    setStatus('recording');
    startTimer();
  }, [startTimer]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;

    // Read recorder.state directly to avoid stale React status closure
    if (recorder.state === 'recording') {
      elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
    }

    recorder.stop();
    stopTimer();
    setDuration(elapsedBeforePauseRef.current);
  }, [stopTimer]);

  const deleteRecording = useCallback(() => {
    // Stop any active recording first
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      stopTimer();
    }

    // Release mic
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Revoke blob URL
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    chunksRef.current = [];
    mediaRecorderRef.current = null;
    elapsedBeforePauseRef.current = 0;

    setAudioURL(null);
    setDuration(0);
    setStatus('idle');
    setError(null);
  }, [audioURL, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      // Revoke any blob URL to prevent memory leaks — the component is about
      // to be destroyed (e.g. keyed remount on question change), so React
      // will not reference this URL after unmount.
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  // audioURL must NOT be in deps — this cleanup should only run on unmount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    duration,
    audioURL,
    error,
    mimeType: resolvedMimeType,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteRecording,
  };
}

export default useRecorder;
