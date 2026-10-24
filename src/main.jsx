import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';

/**
 * Root Execution Entry Point:
 * Initializes React 18+ client-side mounting architecture.
 * Pulls down the native DOM container element and attaches the application component graph.
 */
createRoot(document.getElementById('root')).render(
  /* StrictMode runtime check wrap:
    Orchestrates development checks, flagging double-rendering lifecycles,
    memory allocation leaks, and legacy dependency practices.
  */
  <StrictMode>
    {/* AuthProvider: makes the logged-in user available to every component */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
