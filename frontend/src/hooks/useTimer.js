import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useTimer – React hook for a robust countdown timer.
 *
 * @param {Object}   options
 * @param {number}   [options.initialDuration=1800] - Duration in seconds (default 30 mins)
 * @param {Function} [options.onComplete]           - Callback fired when timer reaches 0
 * @returns {{ timeRemaining, minutes, seconds, isRunning, isPaused, isFinished,
 *             formatTime, start, pause, resume, reset, stop }}
 */
export function useTimer({ initialDuration = 1800, onComplete } = {}) {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  // States: 'idle' | 'running' | 'paused' | 'stopped' | 'finished'
  const [status, setStatus] = useState('idle');
  
  const timerRef = useRef(null);

  /* ── Clear active interval safely ── */
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* ── Controls ── */
  const start = useCallback(() => {
    // Can only start if idle or stopped (not running, paused, or finished)
    if (status === 'running' || status === 'finished') return;
    if (status === 'paused') {
      // If paused, it should technically use resume(), but start() can alias it if preferred.
      // We will just set it to running anyway.
    }
    
    // If starting from stopped/idle, reset to full time (if needed)
    if (status === 'stopped' || status === 'idle' || status === 'finished') {
       if (status === 'finished') setTimeRemaining(initialDuration);
       // Otherwise it should already be at initialDuration or whatever was left when stopped.
    }
    
    setStatus('running');
  }, [status, initialDuration]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    setStatus('paused');
    clearTimer();
  }, [status, clearTimer]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    setStatus('running');
  }, [status]);

  const stop = useCallback(() => {
    clearTimer();
    setStatus('stopped');
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setTimeRemaining(initialDuration);
    setStatus('idle');
  }, [initialDuration, clearTimer]);

  /* ── Timer Effect ── */
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearTimer();
            setStatus('finished');
            // Trigger callback on the next tick to avoid state updates during render
            if (onComplete) {
              setTimeout(onComplete, 0);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    // Cleanup on unmount or status change
    return clearTimer;
  }, [status, clearTimer, onComplete]);

  /* ── Formatting helpers ── */
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const formatTime = useCallback(() => {
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    return `${m}:${s}`;
  }, [minutes, seconds]);

  return {
    timeRemaining,
    minutes,
    seconds,
    isRunning: status === 'running',
    isPaused: status === 'paused',
    isFinished: status === 'finished',
    formatTime,
    start,
    pause,
    resume,
    reset,
    stop,
  };
}

export default useTimer;
