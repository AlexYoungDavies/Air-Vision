import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.tsx'

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

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009769',
      dark: '#00563c',
      light: 'rgba(0, 102, 70, 0.1)',
    },
    background: {
      default: '#F7FCFB',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: '#666666',
      disabled: '#808080',
    },
    divider: '#e6e6e6',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Satoshi", "Inter", "Helvetica", "Arial", sans-serif',
    body2: {
      fontSize: 14,
      lineHeight: 22 / 14,
      fontWeight: 400,
    },
    caption: {
      fontSize: 12,
      lineHeight: 18 / 12,
      fontWeight: 700,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '& td, & th': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  },
})

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<pre style="padding:20px;font-family:sans-serif;">Error: #root element not found.</pre>'
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (err) {
    rootEl.innerHTML = `<pre style="padding:20px;font-family:sans-serif;white-space:pre-wrap;">Render error: ${err instanceof Error ? err.message : String(err)}</pre>`
  }
}
