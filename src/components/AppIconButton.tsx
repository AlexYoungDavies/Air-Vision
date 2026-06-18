import { IconButton, Tooltip } from '@mui/material';
import type { IconButtonProps } from '@mui/material/IconButton';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import {
  BUTTON_BORDER_RADIUS_BY_SIZE,
  ICON_BUTTON_VARIANT_CLASS,
  VISIT_NOTE_BUTTON_EXEMPT_CLASS,
} from '../theme/buttonStyleConstants';
import { getTactilePrimaryButtonStyles } from '../theme/buttonTactileStyles';

export type AppIconButtonVariant = 'primary' | 'secondary' | 'emphasis';

export interface AppIconButtonProps extends Omit<IconButtonProps, 'size'> {
  tooltip?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: AppIconButtonVariant;
  /** @deprecated Prefer `variant="emphasis"` for panel-open state. */
  active?: boolean;
}

function variantSx(variant: AppIconButtonVariant, theme: Theme): SxProps<Theme> {
  switch (variant) {
    case 'secondary':
      return {
        color: 'primary.main',
        bgcolor: 'transparent',
        boxShadow: 'none',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          boxShadow: 'none',
        },
      };
    case 'emphasis':
      return {
        color: 'primary.contrastText',
        bgcolor: 'primary.main',
        ...getTactilePrimaryButtonStyles(theme.palette.mode),
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      };
    case 'primary':
    default:
      return {
        color: 'text.secondary',
        bgcolor: 'transparent',
        boxShadow: 'none',
        '&:hover': {
          bgcolor: 'action.hover',
          boxShadow: 'none',
        },
      };
  }
}

/**
 * Standard icon button used across the app. Use this for all icon-only actions
 * (e.g. table row actions, toolbar buttons) so styling stays consistent.
 */
export function AppIconButton({
  tooltip,
  children,
  size = 'small',
  variant: variantProp,
  sx,
  active = false,
  className,
  ...rest
}: AppIconButtonProps) {
  const variant: AppIconButtonVariant = variantProp ?? (active ? 'emphasis' : 'primary');
  const radius = BUTTON_BORDER_RADIUS_BY_SIZE[size];

  const mergedSx: SxProps<Theme> = [
    (theme: Theme) => ({
      borderRadius: `${radius}px`,
      ...(className?.includes(VISIT_NOTE_BUTTON_EXEMPT_CLASS) ? {} : variantSx(variant, theme)),
    }),
    ...(Array.isArray(sx) ? sx : [sx]),
  ].filter(Boolean) as SxProps<Theme>;

  const button = (
    <IconButton
      size={size}
      className={[ICON_BUTTON_VARIANT_CLASS[variant], className].filter(Boolean).join(' ')}
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
