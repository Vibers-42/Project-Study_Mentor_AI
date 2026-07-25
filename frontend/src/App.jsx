import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Member 3 owns a standalone analytics frontend. Authentication is supplied by
 * the integration owner; this app only reads the agreed analytics endpoints.
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
