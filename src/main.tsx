import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
            <h2 className="font-playfair text-2xl font-bold text-amber-300">
              LAV Invitations
            </h2>
            <p className="text-xs text-neutral-400">
              Ocurrió una interrupción temporal al cargar la experiencia.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  localStorage.removeItem('lav_invitations_data_v1');
                  window.location.hash = '';
                  window.location.reload();
                }}
                className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-amber-400"
              >
                Reiniciar y Recargar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
