import { Typography } from '@mui/material';

const LABEL_SX = {
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(163, 163, 163, 1)',
} as const;

const VALUE_SX = {
  fontSize: 12,
  fontWeight: 500,
  color: 'text.primary',
} as const;

export interface LabelValueProps {
  label: string;
  value: React.ReactNode;
}

/**
 * Reusable label: value pair with consistent typography.
 * Label: 12px, semibold, muted gray. Value: 12px, medium, primary text.
 */
export function LabelValue({ label, value }: LabelValueProps) {
  return (
    <Typography component="span" sx={{ fontSize: 12, fontWeight: 500 }}>
      <Typography component="span" sx={LABEL_SX}>
        {label}:{' '}
      </Typography>
      <Typography component="span" sx={VALUE_SX}>
        {value}
      </Typography>
    </Typography>
  );
}
