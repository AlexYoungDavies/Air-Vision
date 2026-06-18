import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type ListItemButtonProps,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

export const NAV_MENU_ITEM_HEIGHT = 28;

export interface AppNavMenuItemProps extends ListItemButtonProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

/** Sidebar navigation row used in the main app shell. */
export function AppNavMenuItem({ label, icon, active = false, sx, ...rest }: AppNavMenuItemProps) {
  return (
    <ListItemButton
      sx={[
        {
          height: NAV_MENU_ITEM_HEIGHT,
          minHeight: NAV_MENU_ITEM_HEIGHT,
          maxHeight: NAV_MENU_ITEM_HEIGHT,
          py: 0,
          px: 1,
          gap: 0.75,
          borderRadius: 1,
          bgcolor: active ? (theme) => alpha(theme.palette.primary.main, 0.2) : 'transparent',
          '&:hover': {
            bgcolor: active
              ? (theme) => alpha(theme.palette.primary.main, 0.25)
              : 'action.hover',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      <ListItemIcon
        sx={{
          minWidth: 18,
          justifyContent: 'center',
          color: active ? 'primary.dark' : 'text.secondary',
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: 14,
          lineHeight: '22px',
          fontWeight: active ? 500 : 400,
          color: active ? 'primary.dark' : 'text.secondary',
        }}
      />
    </ListItemButton>
  );
}
