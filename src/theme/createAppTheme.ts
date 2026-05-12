import { createTheme } from '@mui/material/styles';
import type { PaletteOptions } from '@mui/material/styles';
import type { AccentKey, PaletteMode } from './accents';
import { getPrimaryPaletteForAccent, getBackgroundPaletteForAccent } from './accents';
import { VISIT_NOTE_BUTTON_EXEMPT_CLASS } from './buttonStyleConstants';

/**
 * Semantic palettes for badges, chips, and alerts.
 *
 * Convention used across the app:
 *   bgcolor: 'X.light'   → pastel surface
 *   color:   'X.dark'    → saturated darker text
 *
 * Light mode: `light` is a true pastel hex; `dark` is a saturated darker hex.
 * Dark mode:  `light` is a translucent overlay (composites to a subtle tint
 *             on top of the dark surface); `dark` is a saturated lighter hex
 *             so it reads as text on the overlay. The `light`/`dark`
 *             semantics intentionally invert in dark mode so the same
 *             `bgcolor/color` pairing works without per-site mode checks.
 *
 * `main` stays a saturated mid-tone in both modes for indicators,
 * borders, and icon accents.
 */
const LIGHT_SEMANTIC = {
  error: { light: '#FDECEC', main: '#D32F2F', dark: '#A21515', contrastText: '#fff' },
  warning: { light: '#FDF1DC', main: '#B85A02', dark: '#7A3E00', contrastText: '#fff' },
  success: { light: '#E6F4EA', main: '#2E7D32', dark: '#1B5E20', contrastText: '#fff' },
  info: { light: '#E3F2FD', main: '#0277BD', dark: '#01579B', contrastText: '#fff' },
};

const DARK_SEMANTIC = {
  error: { light: 'rgba(244, 67, 54, 0.18)', main: '#F44336', dark: '#FCA5A5', contrastText: '#fff' },
  warning: { light: 'rgba(255, 167, 38, 0.18)', main: '#FFA726', dark: '#FFCC80', contrastText: 'rgba(0, 0, 0, 0.87)' },
  success: { light: 'rgba(102, 187, 106, 0.18)', main: '#66BB6A', dark: '#A5D6A7', contrastText: 'rgba(0, 0, 0, 0.87)' },
  info: { light: 'rgba(41, 182, 246, 0.18)', main: '#29B6F6', dark: '#90CAF9', contrastText: 'rgba(0, 0, 0, 0.87)' },
};

const LIGHT_BASE = {
  palette: {
    mode: 'light' as const,
    ...LIGHT_SEMANTIC,
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

/**
 * MUI's standard <Alert> in dark mode pulls text color from `palette.X.light`
 * which we redefine as a translucent overlay. Pin the text color, icon color,
 * and bg explicitly so each severity stays legible.
 */
const DARK_ALERT_OVERRIDES = {
  standardError: {
    backgroundColor: DARK_SEMANTIC.error.light,
    color: DARK_SEMANTIC.error.dark,
    '& .MuiAlert-icon': { color: DARK_SEMANTIC.error.main },
  },
  standardWarning: {
    backgroundColor: DARK_SEMANTIC.warning.light,
    color: DARK_SEMANTIC.warning.dark,
    '& .MuiAlert-icon': { color: DARK_SEMANTIC.warning.main },
  },
  standardSuccess: {
    backgroundColor: DARK_SEMANTIC.success.light,
    color: DARK_SEMANTIC.success.dark,
    '& .MuiAlert-icon': { color: DARK_SEMANTIC.success.main },
  },
  standardInfo: {
    backgroundColor: DARK_SEMANTIC.info.light,
    color: DARK_SEMANTIC.info.dark,
    '& .MuiAlert-icon': { color: DARK_SEMANTIC.info.main },
  },
};

const DARK_BASE = {
  palette: {
    mode: 'dark' as const,
    ...DARK_SEMANTIC,
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
      styleOverrides: DARK_ALERT_OVERRIDES,
    },
  },
};

/** Global button / icon-button standards: 8px radius, no elevation, no ripple, sizes 28 / 36 / 44. */
const BUTTON_STANDARD_COMPONENTS = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxSizing: 'border-box',
        boxShadow: 'none',
        textTransform: 'none',
        '&:hover': { boxShadow: 'none' },
        '&:active': { boxShadow: 'none' },
        '&.Mui-focusVisible': { boxShadow: 'none' },
      },
      contained: {
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
        '&:active': { boxShadow: 'none' },
      },
      sizeSmall: {
        [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS})`]: {
          minHeight: 28,
          height: 28,
          paddingLeft: 12,
          paddingRight: 12,
        },
      },
      sizeMedium: {
        [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS})`]: {
          minHeight: 36,
          height: 36,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
      sizeLarge: {
        [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS})`]: {
          minHeight: 44,
          height: 44,
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxSizing: 'border-box',
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
      },
      sizeSmall: {
        [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS})`]: {
          // Square hit area: MUI default minWidth (e.g. 48px) would make width > height.
          width: 28,
          minWidth: 28,
          maxWidth: 28,
          height: 28,
          minHeight: 28,
          maxHeight: 28,
          padding: 0,
          flexShrink: 0,
        },
      },
      sizeMedium: {
        [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS})`]: {
          width: 36,
          minWidth: 36,
          maxWidth: 36,
          height: 36,
          minHeight: 36,
          maxHeight: 36,
          padding: 0,
          flexShrink: 0,
        },
      },
      sizeLarge: {
        [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS})`]: {
          width: 44,
          minWidth: 44,
          maxWidth: 44,
          height: 44,
          minHeight: 44,
          maxHeight: 44,
          padding: 0,
          flexShrink: 0,
        },
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxShadow: 'none',
        textTransform: 'none',
        '&:hover': { boxShadow: 'none' },
      },
      sizeSmall: {
        minHeight: 28,
        height: 28,
        paddingLeft: 10,
        paddingRight: 10,
      },
      sizeMedium: {
        minHeight: 36,
        height: 36,
        paddingLeft: 12,
        paddingRight: 12,
      },
      sizeLarge: {
        minHeight: 44,
        height: 44,
        paddingLeft: 14,
        paddingRight: 14,
      },
    },
  },
} as const;

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
    components: {
      ...base.components,
      ...BUTTON_STANDARD_COMPONENTS,
    },
  });
}
