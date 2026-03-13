import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.tsx'
import { AppThemeProvider } from './theme/AppThemeProvider'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600 }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ fontSize: 12, color: '#666' }}>
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<pre style="padding:20px;font-family:sans-serif;">Error: #root element not found.</pre>'
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <ErrorBoundary>
          <AppThemeProvider>
            <CssBaseline />
            <App />
          </AppThemeProvider>
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (err) {
    rootEl.innerHTML = `<pre style="padding:20px;font-family:sans-serif;white-space:pre-wrap;">Render error: ${err instanceof Error ? err.message : String(err)}</pre>`
  }
}
