import { useEffect } from 'react';
import { MicrophonePermission } from './components/voice/MicrophonePermission';
import { SpeechRecognition } from './components/voice/SpeechRecognition';
import { VoiceRecorder } from './components/voice/VoiceRecorder';
import { AudioUploader } from './components/voice/AudioUploader';
import { InterviewTimer } from './components/interview/InterviewTimer';
import { InterviewProgress } from './components/interview/InterviewProgress';
import { SessionSummary } from './components/interview/SessionSummary';
import { ReportPreview } from './components/report/ReportPreview';
import { useInterviewSession } from './hooks/useInterviewSession';
import './App.css';

function AppContent() {
  const { startSession, saveTextResponse, saveVoiceResponse, isIdle } = useInterviewSession();

  // Bootstrap a demo session on first load so Progress has data to display
  useEffect(() => {
    if (isIdle) {
      startSession({ candidateName: 'Demo User', totalQuestions: 10 });
      // Add a couple of dummy responses for the report preview
      saveTextResponse(0, 'I have 5 years of experience in React and Node.js.');
      saveVoiceResponse(0, 'blob:http://localhost/dummy-voice-url');
      saveTextResponse(1, 'My greatest strength is problem solving under pressure.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app-shell">
      <div className="app-panels">
        <InterviewProgress />
        <SessionSummary />
        <ReportPreview
          score={82}
          feedback="Strong performance overall. The candidate demonstrated clear communication skills and a solid grasp of core concepts. Responses were well-structured and thoughtful."
          suggestions={[
            'Provide more concrete examples when discussing past experience.',
            'Deepen knowledge of system design principles.',
            'Work on conciseness — some answers were slightly verbose.',
          ]}
        />
        <InterviewTimer initialDuration={1800} />
        <MicrophonePermission />
        <SpeechRecognition />
        <VoiceRecorder />
        <AudioUploader />
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
