import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <span className="text-4xl text-red-500 animate-pulse">!</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-serif italic">SYSTEM_CRASH_DETECTED</h1>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest max-w-md mb-8">
            An unexpected error occurred in the application kernel.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left w-full max-w-2xl overflow-auto mb-8">
            <p className="text-red-400 font-mono text-xs break-all">
              {this.state.error?.name}: {this.state.error?.message}
            </p>
            {this.state.error?.stack && (
              <pre className="mt-4 text-[10px] text-white/20 font-mono leading-relaxed">
                {this.state.error.stack}
              </pre>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/80 transition-all uppercase tracking-widest text-[10px]"
          >
            Hot_Restart_System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
