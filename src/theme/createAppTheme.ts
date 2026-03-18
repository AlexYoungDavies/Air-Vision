import { createTheme } from '@mui/material/styles';
import type { PaletteOptions } from '@mui/material/styles';
import type { AccentKey, PaletteMode } from './accents';
import { getPrimaryPaletteForAccent, getBackgroundPaletteForAccent } from './accents';

const LIGHT_BASE = {
  palette: {
    mode: 'light' as const,
    background: {
      paper: '#ffffff',
      default: '#f5f5f5',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      surfaceOverlay: 'rgba(255, 255, 255, 0.5)',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: '#666666',
      disabled: '#808080',
    },
    divider: '#e6e6e6',
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  components: {
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
};

const DARK_BASE = {
  palette: {
    mode: 'dark' as const,
    background: {
      paper: '#1e1e1e',
      default: '#121212',
      backdrop: 'rgba(0, 0, 0, 0.6)',
      surfaceOverlay: 'rgba(255, 255, 255, 0.06)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '& td, & th': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardWarning: {
          backgroundColor: 'rgba(255, 152, 0, 0.16)',
          color: 'rgba(255, 255, 255, 0.9)',
          '& .MuiAlert-icon': { color: '#ffb74d' },
        },
      },
    },
  },
};

const SHARED_OPTIONS = {
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
  },
};

export function createAppTheme(accentKey: AccentKey, mode: PaletteMode = 'light') {
  const primary = getPrimaryPaletteForAccent(accentKey, mode);
  const background = getBackgroundPaletteForAccent(accentKey, mode);
  const base = mode === 'dark' ? DARK_BASE : LIGHT_BASE;
  return createTheme({
    ...SHARED_OPTIONS,
    ...base,
    palette: {
      ...base.palette,
      primary,
      background: {
        ...base.palette.background,
        default: background.default,
        gradientStart: background.gradientStart,
        gradientEnd: background.gradientEnd,
      } as unknown as PaletteOptions['background'],
    },
  });
}
