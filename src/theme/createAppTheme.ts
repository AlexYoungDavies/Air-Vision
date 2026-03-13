import { createTheme } from '@mui/material/styles';
import type { AccentKey } from './accents';
import { getPrimaryPaletteForAccent, getBackgroundPaletteForAccent } from './accents';

const BASE_OPTIONS = {
  palette: {
    mode: 'light' as const,
    background: {
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
};

export function createAppTheme(accentKey: AccentKey) {
  const primary = getPrimaryPaletteForAccent(accentKey);
  const background = getBackgroundPaletteForAccent(accentKey);
  return createTheme({
    ...BASE_OPTIONS,
    palette: {
      ...BASE_OPTIONS.palette,
      primary,
      background: {
        ...BASE_OPTIONS.palette.background,
        default: background.default,
        gradientStart: background.gradientStart,
        gradientEnd: background.gradientEnd,
      } as typeof BASE_OPTIONS.palette.background,
    },
  });
}
