import type { SxProps, Theme } from '@mui/material/styles';
import type { FieldSize, FieldVariant } from '../../theme/buttonStyleConstants';
import {
  BUTTON_HEIGHTS,
  FIELD_BORDER_RADIUS,
  FIELD_FILLED_BG_DARK,
  FIELD_FILLED_BG_HOVER_DARK,
  FIELD_FILLED_BG_HOVER_LIGHT,
  FIELD_FILLED_BG_LIGHT,
  FIELD_OUTLINE_BORDER_DARK,
  FIELD_OUTLINE_BORDER_HOVER_DARK,
  FIELD_OUTLINE_BORDER_HOVER_LIGHT,
  FIELD_OUTLINE_BORDER_LIGHT,
} from '../../theme/buttonStyleConstants';

export function getFieldFilledBg(mode: 'light' | 'dark') {
  return mode === 'dark' ? FIELD_FILLED_BG_DARK : FIELD_FILLED_BG_LIGHT;
}

export function getFieldFilledBgHover(mode: 'light' | 'dark') {
  return mode === 'dark' ? FIELD_FILLED_BG_HOVER_DARK : FIELD_FILLED_BG_HOVER_LIGHT;
}

export function getFieldOutlineBorder(mode: 'light' | 'dark') {
  return mode === 'dark' ? FIELD_OUTLINE_BORDER_DARK : FIELD_OUTLINE_BORDER_LIGHT;
}

export function getFieldOutlineBorderHover(mode: 'light' | 'dark') {
  return mode === 'dark' ? FIELD_OUTLINE_BORDER_HOVER_DARK : FIELD_OUTLINE_BORDER_HOVER_LIGHT;
}

export function getFieldShellSx(
  size: FieldSize,
  variant: FieldVariant = 'outlined',
): SxProps<Theme> {
  const height = BUTTON_HEIGHTS[size];
  return {
    height,
    minHeight: height,
    borderRadius: `${FIELD_BORDER_RADIUS}px`,
    fontSize: 14,
    ...(variant === 'filled'
      ? {
          bgcolor: (theme) => getFieldFilledBg(theme.palette.mode),
          '& fieldset': { border: 'none' },
          '&:hover:not(.Mui-disabled):not(.Mui-focused)': {
            bgcolor: (theme) => getFieldFilledBgHover(theme.palette.mode),
          },
        }
      : {
          bgcolor: 'background.paper',
          '& fieldset': {
            borderColor: (theme) => getFieldOutlineBorder(theme.palette.mode),
          },
          '&:hover:not(.Mui-disabled):not(.Mui-focused) fieldset': {
            borderColor: (theme) => getFieldOutlineBorderHover(theme.palette.mode),
          },
        }),
  };
}

export const fieldLabelSx: SxProps<Theme> = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: '18px',
  color: 'text.secondary',
  mb: 0.5,
  textAlign: 'left',
};

export const labeledFieldWrapperSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
};
