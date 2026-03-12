import { Box, Typography } from '@mui/material';
import { fieldRowSx, LABEL_WIDTH } from './visitNoteFieldStyles';

export interface VisitNoteFieldWrapperProps {
  label: string;
  /** Optional subheading shown under the label (e.g. "Auto-calculated"). */
  sublabel?: string;
  error?: string;
  disabled?: boolean;
  children: React.ReactNode;
  /** If true, label and field stack vertically (e.g. for full-width text areas). Default false = label left, field right. */
  stackLabel?: boolean;
  /** If false, the label is hidden (field only). Default true. */
  showLabel?: boolean;
}

export function VisitNoteFieldWrapper({
  label,
  sublabel,
  error,
  disabled,
  children,
  stackLabel = false,
  showLabel = true,
}: VisitNoteFieldWrapperProps) {
  const hasLabel = showLabel && label.length > 0;
  return (
    <Box sx={{ ...fieldRowSx, flexDirection: stackLabel ? 'column' : 'row', alignItems: stackLabel ? 'stretch' : 'flex-start' }}>
      {hasLabel && (
        <Box sx={{ width: LABEL_WIDTH, flexShrink: 0 }}>
          <Typography
            component="label"
            className={`visit-note-field-label${disabled ? ' disabled' : ''}`}
          >
            {label}
          </Typography>
          {sublabel && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              {sublabel}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
        {error && (
          <Typography className="visit-note-error" component="span">
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
