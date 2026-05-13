import { IconButton, Tooltip } from '@mui/material';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';

export interface AppIconButtonProps extends Omit<IconButtonProps, 'size'> {
  /** Tooltip text shown on hover. When provided, the button is wrapped in a Tooltip. */
  tooltip?: string;
  /** Icon element (e.g. <DownloadOutlined fontSize="small" />). */
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  /**
   * Marks the button as visually active (e.g. when its corresponding panel is open).
   * Applies a subtle filled background and accent color so the user can tell which
   * panel/toggle is currently engaged.
   */
  active?: boolean;
}

/**
 * Standard icon button used across the app. Use this for all icon-only actions
 * (e.g. table row actions, toolbar buttons) so styling stays consistent.
 */
export function AppIconButton({
  tooltip,
  children,
  size = 'small',
  sx,
  active = false,
  ...rest
}: AppIconButtonProps) {
  const activeSx: SxProps<Theme> | false =
    active && {
      bgcolor: 'action.selected',
      color: 'primary.main',
      '&:hover': { bgcolor: 'action.selected' },
    };

  const mergedSx: SxProps<Theme> = [
    activeSx,
    ...(Array.isArray(sx) ? sx : [sx]),
  ].filter(Boolean) as SxProps<Theme>;

  const button = (
    <IconButton
      size={size}
      aria-label={rest['aria-label'] ?? (typeof tooltip === 'string' ? tooltip : undefined)}
      sx={mergedSx}
      {...rest}
    >
      {children}
    </IconButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }
  return button;
}
