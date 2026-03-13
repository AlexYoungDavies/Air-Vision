import { Box, Paper, Typography } from '@mui/material';

const CALLOUT_BASE = {
  bgcolor: 'primary.light',
  borderRadius: 2,
  p: 2,
  boxShadow: 'none',
  border: 'none',
} as const;

const VARIANTS = {
  large: {
    minHeight: 100,
    valueFontSize: 80,
    labelFontSize: 20,
  },
  small: {
    minHeight: 88,
    valueFontSize: 40,
    labelFontSize: 16,
  },
} as const;

export type CalloutVariant = keyof typeof VARIANTS;

export interface CalloutProps {
  /** Numeric or short value shown prominently (e.g. count). */
  value: React.ReactNode;
  /** Label below the value (e.g. "Patients Today", "Pending Tasks"). */
  label: string;
  /** Size variant: large (80/20px) or small (40/16px). */
  variant: CalloutVariant;
}

/**
 * Callout card showing a value and label. Two size variants:
 * - large: value 80px, label 20px (e.g. Patients Today, Notes to close)
 * - small: value 40px, label 16px (e.g. Pending Tasks, New Messages)
 */
export function Callout({ value, label, variant }: CalloutProps) {
  const { minHeight, valueFontSize, labelFontSize } = VARIANTS[variant];
  return (
    <Paper
      variant="outlined"
      sx={{
        ...CALLOUT_BASE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
      }}
    >
      <Typography sx={{ fontSize: valueFontSize, fontWeight: 700, lineHeight: 1.1, color: 'primary.main' }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: labelFontSize, fontWeight: 400, color: 'text.secondary', mt: 0.5 }}>
        {label}
      </Typography>
    </Paper>
  );
}
