import { IconButton, Tooltip } from '@mui/material';
import type { IconButtonProps } from '@mui/material/IconButton';

export interface AppIconButtonProps extends Omit<IconButtonProps, 'size'> {
  /** Tooltip text shown on hover. When provided, the button is wrapped in a Tooltip. */
  tooltip?: string;
  /** Icon element (e.g. <DownloadOutlined fontSize="small" />). */
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
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
  ...rest
}: AppIconButtonProps) {
  const button = (
    <IconButton
      size={size}
      aria-label={rest['aria-label'] ?? (typeof tooltip === 'string' ? tooltip : undefined)}
      sx={sx}
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
