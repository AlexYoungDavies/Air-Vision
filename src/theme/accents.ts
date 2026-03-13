import type { PaletteOptions } from '@mui/material/styles';

export const ACCENT_KEYS = ['green', 'blue', 'yellow', 'lilac', 'orange'] as const;
export type AccentKey = (typeof ACCENT_KEYS)[number];

/** Primary palette overrides per accent. Used for theme.palette.primary. */
export const ACCENT_PRIMARY_PALETTES: Record<
  AccentKey,
  { main: string; dark: string; light: string; contrastText: string }
> = {
  green: {
    main: '#009769',
    dark: '#00563c',
    light: 'rgba(0, 102, 70, 0.1)',
    contrastText: '#fff',
  },
  blue: {
    main: '#2196F3',
    dark: '#1565C0',
    light: 'rgba(33, 150, 243, 0.1)',
    contrastText: '#fff',
  },
  yellow: {
    main: '#FFC107',
    dark: '#FF8F00',
    light: 'rgba(255, 193, 7, 0.15)',
    contrastText: '#1a1a1a',
  },
  lilac: {
    main: '#B39DDB',
    dark: '#7E57C2',
    light: 'rgba(179, 157, 219, 0.2)',
    contrastText: '#fff',
  },
  orange: {
    main: '#FF9800',
    dark: '#E65100',
    light: 'rgba(255, 152, 0, 0.15)',
    contrastText: '#fff',
  },
};

/** Tonal surface variants: app frame background and home page gradient. */
export const ACCENT_BACKGROUND_PALETTES: Record<
  AccentKey,
  { default: string; gradientStart: string; gradientEnd: string }
> = {
  green: {
    default: '#F7FCFB',
    gradientStart: '#f3faf8',
    gradientEnd: '#d7f1ea',
  },
  blue: {
    default: '#F5FAFE',
    gradientStart: '#e8f4fd',
    gradientEnd: '#cce5fa',
  },
  yellow: {
    default: '#FFFDF7',
    gradientStart: '#fff9e8',
    gradientEnd: '#fff0c2',
  },
  lilac: {
    default: '#F9F7FC',
    gradientStart: '#f0ebf8',
    gradientEnd: '#e6ddf2',
  },
  orange: {
    default: '#FFF8F5',
    gradientStart: '#fff0e8',
    gradientEnd: '#ffe0d0',
  },
};

/** Display label and swatch color for the color picker UI. */
export const ACCENT_OPTIONS: Record<
  AccentKey,
  { label: string; swatch: string }
> = {
  green: { label: 'Green', swatch: '#009769' },
  blue: { label: 'Blue', swatch: '#2196F3' },
  yellow: { label: 'Yellow', swatch: '#FFC107' },
  lilac: { label: 'Lilac', swatch: '#B39DDB' },
  orange: { label: 'Orange', swatch: '#FF9800' },
};

export function getPrimaryPaletteForAccent(accent: AccentKey): PaletteOptions['primary'] {
  return ACCENT_PRIMARY_PALETTES[accent];
}

export function getBackgroundPaletteForAccent(accent: AccentKey) {
  return ACCENT_BACKGROUND_PALETTES[accent];
}
