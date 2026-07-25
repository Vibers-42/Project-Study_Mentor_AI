import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { InterviewSessionProvider } from './context/InterviewSessionContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InterviewSessionProvider>
      <App />
    </InterviewSessionProvider>
  </StrictMode>,
)
