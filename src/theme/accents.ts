import type { PaletteOptions } from '@mui/material/styles';

export const ACCENT_KEYS = ['green', 'blue', 'yellow', 'lilac', 'orange', 'teal', 'pink'] as const;
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
  teal: {
    main: '#588796',
    dark: '#3d6571',
    light: 'rgba(88, 135, 150, 0.1)',
    contrastText: '#fff',
  },
  pink: {
    main: '#9B6B70',
    dark: '#7a5559',
    light: 'rgba(155, 107, 112, 0.12)',
    contrastText: '#fff',
  },
};

/** Dark mode: slightly lighter primary.main for legibility on dark surfaces. */
export const ACCENT_PRIMARY_PALETTES_DARK: Record<
  AccentKey,
  { main: string; dark: string; light: string; contrastText: string }
> = {
  green: { main: '#00b377', dark: '#009769', light: 'rgba(0, 179, 119, 0.2)', contrastText: '#fff' },
  blue: { main: '#42a5f5', dark: '#2196F3', light: 'rgba(66, 165, 245, 0.2)', contrastText: '#fff' },
  yellow: { main: '#ffca28', dark: '#FFC107', light: 'rgba(255, 202, 40, 0.2)', contrastText: '#1a1a1a' },
  lilac: { main: '#c4b5e0', dark: '#B39DDB', light: 'rgba(196, 181, 224, 0.25)', contrastText: '#fff' },
  orange: { main: '#ffa726', dark: '#FF9800', light: 'rgba(255, 167, 38, 0.2)', contrastText: '#fff' },
  teal: { main: '#6b9ba8', dark: '#588796', light: 'rgba(107, 155, 168, 0.2)', contrastText: '#fff' },
  pink: { main: '#b07d82', dark: '#9B6B70', light: 'rgba(176, 125, 130, 0.2)', contrastText: '#fff' },
};

/** Tonal surface variants: app frame background and home page gradient (light mode). */
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
  teal: {
    default: '#F2F7F9',
    gradientStart: '#e5f0f4',
    gradientEnd: '#cce2ea',
  },
  pink: {
    default: '#FBF8F9',
    gradientStart: '#f5eef0',
    gradientEnd: '#eddde0',
  },
};

/** Dark mode surface variants per accent. */
export const ACCENT_BACKGROUND_PALETTES_DARK: Record<
  AccentKey,
  { default: string; gradientStart: string; gradientEnd: string }
> = {
  green: {
    default: '#0d1614',
    gradientStart: '#0f1c19',
    gradientEnd: '#132a23',
  },
  blue: {
    default: '#0d1216',
    gradientStart: '#0f161c',
    gradientEnd: '#131f2a',
  },
  yellow: {
    default: '#1a1810',
    gradientStart: '#1f1c12',
    gradientEnd: '#2a2618',
  },
  lilac: {
    default: '#141218',
    gradientStart: '#18151d',
    gradientEnd: '#1f1a28',
  },
  orange: {
    default: '#1a1412',
    gradientStart: '#1f1815',
    gradientEnd: '#2a1f18',
  },
  teal: {
    default: '#0d1416',
    gradientStart: '#0f181c',
    gradientEnd: '#132228',
  },
  pink: {
    default: '#1a1416',
    gradientStart: '#1f181a',
    gradientEnd: '#2a1f22',
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
  teal: { label: 'Teal', swatch: '#588796' },
  pink: { label: 'Pink', swatch: '#9B6B70' },
};

export function getPrimaryPaletteForAccent(
  accent: AccentKey,
  mode: PaletteMode = 'light'
): PaletteOptions['primary'] {
  return mode === 'dark' ? ACCENT_PRIMARY_PALETTES_DARK[accent] : ACCENT_PRIMARY_PALETTES[accent];
}

export type PaletteMode = 'light' | 'dark';

export function getBackgroundPaletteForAccent(
  accent: AccentKey,
  mode: PaletteMode = 'light'
): { default: string; gradientStart: string; gradientEnd: string } {
  return mode === 'dark' ? ACCENT_BACKGROUND_PALETTES_DARK[accent] : ACCENT_BACKGROUND_PALETTES[accent];
}
