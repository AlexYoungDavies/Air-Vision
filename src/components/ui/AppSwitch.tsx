import { Switch, type SwitchProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

export type AppSwitchSize = 'small' | 'medium';

export interface AppSwitchProps extends Omit<SwitchProps, 'size'> {
  /** small (S): 28px hitbox · medium (M): 36px hitbox */
  size?: AppSwitchSize;
}

/** Tight elevation on the knob */
const SWITCH_KNOB_SHADOW = '0 1px 2px rgba(0, 0, 0, 0.14)';

/** S — 28px hitbox, 48×24 track, 20px knob, 2px inset padding */
const SWITCH_S = {
  hitboxHeight: 28,
  trackWidth: 48,
  trackHeight: 24,
  knobSize: 20,
  inset: 2,
} as const;

/** M — 36px hitbox, 56×32 track, 28px knob, 2px inset padding */
const SWITCH_M = {
  hitboxHeight: 36,
  trackWidth: 56,
  trackHeight: 32,
  knobSize: 28,
  inset: 2,
} as const;

function getTrackOffBg(mode: 'light' | 'dark') {
  return mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
}

function getTrackInsetShadow(mode: 'light' | 'dark') {
  return mode === 'dark' ? 'inset 0 1px 1px rgba(0, 0, 0, 0.22)' : 'inset 0 1px 1px rgba(0, 0, 0, 0.1)';
}

function buildSwitchSizeSx({
  hitboxHeight,
  trackWidth,
  trackHeight,
  knobSize,
  inset,
}: {
  hitboxHeight: number;
  trackWidth: number;
  trackHeight: number;
  knobSize: number;
  inset: number;
}): SxProps<Theme> {
  const trackOffsetY = (hitboxHeight - trackHeight) / 2;
  const trackRadius = trackHeight / 2;
  const knobTravel = trackWidth - inset * 2 - knobSize;

  return {
    width: trackWidth,
    height: hitboxHeight,
    p: 0,
    padding: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSwitch-switchBase': {
      position: 'absolute',
      top: trackOffsetY,
      left: 0,
      width: trackWidth,
      height: trackHeight,
      p: 0,
      padding: `${inset}px`,
      margin: 0,
      boxSizing: 'border-box',
      borderRadius: `${trackRadius}px`,
      transform: 'translateX(0)',
      transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&.Mui-checked': {
        transform: `translateX(${knobTravel}px)`,
        color: 'primary.main',
        '& .MuiSwitch-thumb': {
          bgcolor: 'background.paper',
        },
      },
      '&.Mui-disabled': {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        boxShadow: 'none',
      },
    },
    '& .MuiSwitch-thumb': {
      width: knobSize,
      height: knobSize,
      minWidth: knobSize,
      minHeight: knobSize,
      bgcolor: 'background.paper',
      boxShadow: SWITCH_KNOB_SHADOW,
      boxSizing: 'border-box',
    },
    '& .MuiSwitch-track': {
      position: 'absolute',
      borderRadius: `${trackRadius}px`,
      opacity: 1,
      width: trackWidth,
      height: trackHeight,
      top: trackOffsetY,
      left: 0,
      bgcolor: (theme) => getTrackOffBg(theme.palette.mode),
      boxShadow: (theme) => getTrackInsetShadow(theme.palette.mode),
      transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      bgcolor: 'primary.main',
      boxShadow: (theme) => getTrackInsetShadow(theme.palette.mode),
    },
    '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.45,
    },
  };
}

const SWITCH_SIZE_SX: Record<AppSwitchSize, SxProps<Theme>> = {
  small: buildSwitchSizeSx(SWITCH_S),
  medium: buildSwitchSizeSx(SWITCH_M),
};

/** Inset-knob switch — thumb stays inside the track with subtle elevation. */
export function AppSwitch({ size = 'small', sx, ...rest }: AppSwitchProps) {
  return (
    <Switch
      sx={[SWITCH_SIZE_SX[size], ...(Array.isArray(sx) ? sx : [sx])].filter(Boolean) as SxProps<Theme>}
      {...rest}
    />
  );
}
