import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initSentry, SentryErrorBoundary } from './utils/sentry';

// Initialize Sentry for error tracking
initSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SentryErrorBoundary
      fallback={({ error }) => (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Errore Applicazione</h1>
            <p className="text-gray-700 mb-4">
              Si è verificato un errore imprevisto. L'errore è stato segnalato al team di sviluppo.
            </p>
            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="cursor-pointer font-semibold text-sm text-gray-600">
                Dettagli tecnici
              </summary>
              <pre className="mt-2 text-xs text-red-600 overflow-auto">{error.message}</pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Ricarica Applicazione
            </button>
          </div>
        </div>
      )}
    >
      <App />
    </SentryErrorBoundary>
  </StrictMode>
);
