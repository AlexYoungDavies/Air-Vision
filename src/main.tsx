import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import 'react-material-symbols/outlined' // Material Symbols outlined style (weight 300 applied in components)
import './index.css'
import App from './App.tsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009769',
      dark: '#00563c',
      light: 'rgba(0, 102, 70, 0.1)',
    },
    background: {
      default: '#f7f7f7',
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
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
