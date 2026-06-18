import { alpha, type Theme } from '@mui/material/styles';
import type { PaletteMode } from './accents';
import {
  BUTTON_LINK_CLASS,
  NEUTRAL_BUTTON_BORDER_DARK,
  NEUTRAL_BUTTON_BORDER_LIGHT,
  VISIT_NOTE_BUTTON_EXEMPT_CLASS,
} from './buttonStyleConstants';

type TactileShadowSet = {
  default: string;
  hover: string;
  active: string;
};

const LIGHT_PRIMARY_SHADOWS: TactileShadowSet = {
  default:
    '0 1px 2px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.26), inset 0 -1px 0 rgba(0, 0, 0, 0.16)',
  hover:
    '0 2px 3px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.18)',
  active:
    '0 1px 1px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.14)',
};

const DARK_PRIMARY_SHADOWS: TactileShadowSet = {
  default:
    '0 1px 2px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 -1px 0 rgba(0, 0, 0, 0.38)',
  hover:
    '0 2px 3px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.42)',
  active:
    '0 1px 1px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(0, 0, 0, 0.45), inset 0 -1px 0 rgba(255, 255, 255, 0.08)',
};

const LIGHT_NEUTRAL_SHADOWS: TactileShadowSet = {
  default:
    '0 1px 2px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(0, 0, 0, 0.07)',
  hover:
    '0 2px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(0, 0, 0, 0.09)',
  active:
    '0 1px 1px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 -1px 0 rgba(255, 255, 255, 0.55)',
};

const DARK_NEUTRAL_SHADOWS: TactileShadowSet = {
  default:
    '0 1px 2px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.32)',
  hover:
    '0 2px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.36)',
  active:
    '0 1px 1px rgba(0, 0, 0, 0.28), inset 0 1px 2px rgba(0, 0, 0, 0.38), inset 0 -1px 0 rgba(255, 255, 255, 0.05)',
};

export function getNeutralBorderColor(mode: PaletteMode) {
  return mode === 'dark' ? NEUTRAL_BUTTON_BORDER_DARK : NEUTRAL_BUTTON_BORDER_LIGHT;
}

function getPrimaryShadows(mode: PaletteMode): TactileShadowSet {
  return mode === 'dark' ? DARK_PRIMARY_SHADOWS : LIGHT_PRIMARY_SHADOWS;
}

function getNeutralShadows(mode: PaletteMode): TactileShadowSet {
  return mode === 'dark' ? DARK_NEUTRAL_SHADOWS : LIGHT_NEUTRAL_SHADOWS;
}

function tactileShadowOverrides(shadows: TactileShadowSet) {
  return {
    [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS})`]: {
      boxShadow: shadows.default,
      '&:hover': { boxShadow: shadows.hover },
      '&:active': { boxShadow: shadows.active },
      '&.Mui-disabled': { boxShadow: 'none' },
    },
  };
}

function tactileNeutralSurface(mode: PaletteMode, paperBg: string, borderColor: string) {
  const shadows = getNeutralShadows(mode);
  return {
    backgroundColor: paperBg,
    borderColor,
    [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS}):not(.${BUTTON_LINK_CLASS})`]: {
      boxShadow: shadows.default,
      '&:hover': {
        boxShadow: shadows.hover,
        backgroundColor: paperBg,
        borderColor,
      },
      '&:active': {
        boxShadow: shadows.active,
        backgroundColor: paperBg,
        borderColor,
      },
      '&.Mui-disabled': {
        boxShadow: 'none',
        backgroundColor: 'transparent',
      },
    },
  };
}

/** Raised primary (contained) buttons — outer drop shadow + inset top highlight / bottom shade. */
export function getTactilePrimaryButtonStyles(mode: PaletteMode) {
  return tactileShadowOverrides(getPrimaryShadows(mode));
}

/** Neutral outlined buttons — paper surface with subtle depth and light outline. */
export function getTactileNeutralButtonStyles(mode: PaletteMode, paperBg: string) {
  return tactileNeutralSurface(mode, paperBg, getNeutralBorderColor(mode));
}

/** Neutral text buttons (e.g. Cancel) — surfaced with border and tactile depth. */
export function getTactileNeutralTextInheritStyles(mode: PaletteMode, paperBg: string) {
  const borderColor = getNeutralBorderColor(mode);
  return {
    ...tactileNeutralSurface(mode, paperBg, borderColor),
    border: `1px solid ${borderColor}`,
  };
}

/** Tertiary / ghost — accent label only, no bg or border in default state. */
export function getTertiaryButtonStyles(theme: Theme) {
  return {
    color: 'primary.main',
    bgcolor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    [`&:not(.${VISIT_NOTE_BUTTON_EXEMPT_CLASS}):not(.${BUTTON_LINK_CLASS})`]: {
      boxShadow: 'none',
      '&:hover': {
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        boxShadow: 'none',
        border: 'none',
      },
      '&:active': {
        bgcolor: alpha(theme.palette.primary.main, 0.12),
        boxShadow: 'none',
        border: 'none',
      },
      '&.Mui-disabled': {
        color: 'action.disabled',
        bgcolor: 'transparent',
        boxShadow: 'none',
      },
    },
  };
}
