import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          maxWidth: '480px',
          margin: '80px auto',
          padding: 'var(--space-xl)',
          textAlign: 'center',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border)',
        }}>
          <p style={{ fontSize: '32px', marginBottom: 'var(--space-md)' }}>Oops</p>
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-strong)' }}>
            Something went wrong
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: 'var(--space-lg)' }}>
            Try refreshing the page. If the problem persists, let us know via the feedback button.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              background: 'var(--orange)',
              color: 'white',
              border: '2px solid var(--orange-shadow)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
