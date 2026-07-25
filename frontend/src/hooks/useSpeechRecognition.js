import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Resolve the browser-specific SpeechRecognition constructor once.
 * Returns null when the API is unavailable.
 */
const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

/** Human-readable text for the spec's error codes. */
const ERROR_MESSAGES = {
  'not-allowed':
    'Microphone access is blocked. Click the 🔒 icon in the address bar, set Microphone to Allow, then reload.',
  'service-not-allowed':
    'Speech service is blocked by the browser or an extension. Check your site permissions and reload.',
  'audio-capture': 'No microphone was found. Connect a microphone and try again.',
  network:
    'Speech recognition needs an internet connection (Chrome sends audio to Google for transcription). Check your connection.',
  'language-not-supported': 'The selected language is not supported for speech recognition.',
  'bad-grammar': 'Speech grammar error.',
};

/** Shown when the mic was previously blocked for this site. */
const PERMISSION_DENIED_MSG =
  'Microphone is blocked for this site, so Chrome will not ask again. Click the 🔒 (or ⚙/ℹ) icon at the left of the address bar → Microphone → Allow, then reload this page.';

/** Shown when start() produced no response at all — the silent no-op case. */
const NO_RESPONSE_MSG =
  'The speech engine did not respond. This usually means the microphone is blocked for this site, or the page lost focus. Check the 🔒 icon in the address bar → Microphone → Allow, keep this tab focused, then try again.';

const EMBEDDED_MSG =
  'Speech recognition is blocked inside embedded preview frames. Open this page directly in a Chrome or Edge tab (http://localhost:5173) and try again.';

const HIDDEN_PAGE_MSG =
  'This tab must be visible and focused for speech recognition to run. Click into the page, then press Start Listening.';

/** Errors that should permanently stop the session rather than auto-retry. */
const FATAL_ERRORS = new Set([
  'not-allowed',
  'service-not-allowed',
  'audio-capture',
  'language-not-supported',
]);

/**
 * useSpeechRecognition – React hook for browser-native speech-to-text.
 *
 * Notes on why this is shaped the way it is:
 *  - `start()` is called synchronously inside the click handler. Awaiting
 *    anything first (e.g. getUserMedia) drops the user-activation context and
 *    can make the call silently do nothing.
 *  - Chrome ends a session after a few seconds of silence even when
 *    `continuous` is true, so we transparently restart while the user still
 *    wants to listen.
 *  - `no-speech` / `aborted` are transient and must not kill the session.
 *
 * @param {Object}  options
 * @param {string}  [options.language='en-US']
 * @param {boolean} [options.continuous=true]
 * @param {boolean} [options.interimResults=true]
 */
export function useSpeechRecognition({
  language = 'en-US',
  continuous = true,
  interimResults = true,
} = {}) {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const supported = !!SpeechRecognitionAPI;

  const recognitionRef = useRef(null);
  // Accumulates finalised text across multiple `onresult` firings and restarts
  const finalTranscriptRef = useRef('');
  // True while the user wants to be listening — drives the auto-restart
  const shouldListenRef = useRef(false);
  // Guards against a restart storm when the engine refuses to stay open
  const restartCountRef = useRef(0);
  const restartWindowRef = useRef(0);
  // Watchdog: proves the engine actually responded to start()
  const startedRef = useRef(false);
  const watchdogRef = useRef(null);

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  /** Build a fully-wired recognition instance. */
  const createRecognition = useCallback(() => {
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      startedRef.current = true;
      clearWatchdog();
      setListening(true);
    };

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }

      if (final) {
        const prev = finalTranscriptRef.current;
        finalTranscriptRef.current =
          prev && !/\s$/.test(prev) ? `${prev} ${final}` : prev + final;
        setTranscript(finalTranscriptRef.current);
        // Speech is flowing — the engine is healthy again
        restartCountRef.current = 0;
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      const code = event.error;
      clearWatchdog();

      // 'aborted' fires when we stop() on purpose; 'no-speech' is just silence.
      // Neither is a real failure — let onend decide whether to restart.
      if (code === 'aborted' || code === 'no-speech') return;

      setError(ERROR_MESSAGES[code] || `Speech recognition error: ${code}`);

      if (FATAL_ERRORS.has(code)) {
        shouldListenRef.current = false;
        setListening(false);
      }
    };

    recognition.onend = () => {
      clearWatchdog();
      setInterimTranscript('');

      // Still wanted — Chrome simply timed the session out. Restart it.
      if (shouldListenRef.current) {
        const now = Date.now();
        if (now - restartWindowRef.current > 10000) restartCountRef.current = 0;
        restartWindowRef.current = now;
        restartCountRef.current += 1;

        if (restartCountRef.current <= 5) {
          try {
            recognition.start();
            return;
          } catch {
            // fall through and stop
          }
        } else {
          setError(
            'Speech recognition kept disconnecting. Check your microphone and internet connection, then try again.'
          );
        }
        shouldListenRef.current = false;
      }

      setListening(false);
    };

    return recognition;
  }, [language, continuous, interimResults, clearWatchdog]);

  useEffect(() => {
    if (!supported) return undefined;

    recognitionRef.current = createRecognition();

    return () => {
      const recognition = recognitionRef.current;
      shouldListenRef.current = false;
      clearWatchdog();
      recognitionRef.current = null;
      if (!recognition) return;
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // already inactive
      }
    };
  }, [supported, createRecognition, clearWatchdog]);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser. Use Chrome or Edge.');
      return;
    }

    if (!window.isSecureContext) {
      setError(
        'Speech recognition requires a secure connection. Open the app on http://localhost or over HTTPS.'
      );
      return;
    }

    // Embedded preview frames block the mic via Permissions Policy, and the
    // engine often fails there with no event at all.
    if (window.self !== window.top) {
      setError(EMBEDDED_MSG);
      return;
    }

    // Chrome will not run recognition on a hidden/backgrounded tab.
    if (document.visibilityState !== 'visible') {
      setError(HIDDEN_PAGE_MSG);
      return;
    }

    if (shouldListenRef.current) return; // already listening

    // Recreate if the instance was torn down (StrictMode remount, prior abort).
    if (!recognitionRef.current) recognitionRef.current = createRecognition();
    const recognition = recognitionRef.current;
    if (!recognition) return;

    setError(null);
    restartCountRef.current = 0;
    shouldListenRef.current = true;
    startedRef.current = false;

    // Must be synchronous — awaiting anything here loses the user gesture.
    // Chrome raises its own microphone prompt from this call when needed.
    try {
      recognition.start();
    } catch (err) {
      if (err?.name === 'InvalidStateError') return; // already started
      shouldListenRef.current = false;
      setListening(false);
      setError(err?.message || 'Could not start speech recognition.');
      return;
    }

    // Watchdog — if the engine answers with neither onstart nor onerror, the
    // click would otherwise look like it did nothing at all. Always report.
    clearWatchdog();
    watchdogRef.current = setTimeout(() => {
      watchdogRef.current = null;
      if (startedRef.current) return; // engine came up fine
      shouldListenRef.current = false;
      setListening(false);
      setError(NO_RESPONSE_MSG);
    }, 2500);

    // Non-blocking permission check purely to give a more precise message.
    // Deliberately NOT awaited before start() — that would drop the gesture.
    navigator.permissions
      ?.query({ name: 'microphone' })
      .then((status) => {
        if (status.state === 'denied') {
          clearWatchdog();
          shouldListenRef.current = false;
          setListening(false);
          setError(PERMISSION_DENIED_MSG);
        }
      })
      .catch(() => {
        /* Permissions API unsupported — the watchdog still covers us. */
      });
  }, [createRecognition, clearWatchdog]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    clearWatchdog();
    const recognition = recognitionRef.current;
    setListening(false);
    setInterimTranscript('');
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      // already inactive
    }
  }, [clearWatchdog]);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    interimTranscript,
    listening,
    supported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export default useSpeechRecognition;
