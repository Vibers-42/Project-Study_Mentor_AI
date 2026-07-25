import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Resolve the browser-specific SpeechRecognition constructor once.
 * Returns null when the API is unavailable.
 */
const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

/**
 * useSpeechRecognition – React hook for browser-native speech-to-text.
 *
 * @param {Object}  options
 * @param {string}  [options.language='en-US']
 * @param {boolean} [options.continuous=true]
 * @param {boolean} [options.interimResults=true]
 * @returns {{ transcript, interimTranscript, listening, supported, error,
 *             startListening, stopListening, resetTranscript }}
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
  // Accumulates finalised text across multiple `onresult` firings
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    if (!supported) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        finalTranscriptRef.current += final;
        setTranscript(finalTranscriptRef.current);
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      // 'aborted' fires when we call stop() – not a real error
      if (event.error === 'aborted') return;
      setError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [supported, language, continuous, interimResults]);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || listening) return;

    setError(null);
    setListening(true);

    try {
      recognition.start();
    } catch {
      // Calling start() while already started throws – safely ignore
    }
  }, [listening]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.stop();
    setListening(false);
    setInterimTranscript('');
  }, []);

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
