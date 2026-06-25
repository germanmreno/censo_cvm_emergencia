import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center bg-cvm-background p-4">
          <div className="max-w-md w-full bg-white border border-cvm-emergency/30 rounded-lg p-6 text-center shadow-sm">
            <AlertTriangle className="h-10 w-10 text-cvm-emergency mx-auto mb-3" />
            <h1 className="text-xl font-bold text-cvm-secondary mb-2">
              Ocurrió un error inesperado
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              {this.state.error?.message || 'Por favor, recarga la página e inténtalo de nuevo.'}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-md bg-cvm-primary text-white text-sm font-semibold hover:bg-cvm-primary-dark transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
