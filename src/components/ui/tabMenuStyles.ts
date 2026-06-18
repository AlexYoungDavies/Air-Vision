import type { SxProps, Theme } from '@mui/material/styles';
import { BUTTON_BORDER_RADIUS } from '../../theme/buttonStyleConstants';

/** In-page section tabs (e.g. patient profile overview sub-tabs). */
export const pillTabsSx: SxProps<Theme> = {
  minHeight: 0,
  '& .MuiTab-root': {
    minHeight: 0,
    py: 0.75,
    px: 1.5,
    fontSize: 14,
    fontWeight: 400,
    textTransform: 'none',
    borderRadius: `${BUTTON_BORDER_RADIUS}px !important`,
    color: 'text.secondary',
  },
  '& .Mui-selected': {
    bgcolor: 'primary.light',
    color: 'primary.dark',
    fontWeight: 600,
  },
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiTabs-flexContainer': { gap: 0.5 },
};

/** Page-level navigation tabs (e.g. automations, remittances). */
export const underlineTabsSx: SxProps<Theme> = {
  minHeight: 0,
  '& .MuiTabs-flexContainer': { gap: 0 },
  '& .MuiTabs-indicator': { height: 2 },
  '& .MuiTab-root': {
    minHeight: 0,
    minWidth: 'unset',
    py: 1.5,
    px: 2,
    textTransform: 'none',
    fontWeight: 500,
    fontSize: 14,
  },
};
