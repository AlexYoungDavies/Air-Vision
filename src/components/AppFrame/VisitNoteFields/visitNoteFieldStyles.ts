/**
 * Shared styles for visit note input fields.
 * Spec: label left, no borders, placeholder, light grey bg when hovered/engaged,
 * error state, 28px height, 6px border radius.
 */

export const FIELD_HEIGHT = 28;
export const FIELD_BORDER_RADIUS = 6;
/** Label (heading) width for all visit note fields. Left item in the 2-item horizontal layout. */
export const LABEL_WIDTH = 180;
/** Spacing between label and field in the horizontal layout. */
export const LABEL_FIELD_GAP = 24;

export const baseInputSx = {
  height: FIELD_HEIGHT,
  minHeight: FIELD_HEIGHT,
  borderRadius: `${FIELD_BORDER_RADIUS}px`,
  border: 'none',
  backgroundColor: 'transparent',
  '& .MuiInputBase-input::placeholder': {
    color: 'text.disabled',
    opacity: 1,
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&:hover': {
    backgroundColor: 'action.hover',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  },
  '&.Mui-focused': {
    backgroundColor: 'transparent',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  },
  '&.Mui-error': {
    backgroundColor: 'error.light',
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'error.main' },
  },
  '&.Mui-error:hover': {
    backgroundColor: 'error.light',
  },
  '&.Mui-disabled': {
    backgroundColor: 'action.disabledBackground',
    color: 'text.disabled',
  },
} as const;

export const fieldRowSx = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: `${LABEL_FIELD_GAP}px`,
  mb: 0,
  '& .visit-note-field-label': {
    width: LABEL_WIDTH,
    flexShrink: 0,
    fontWeight: 600,
    fontSize: 14,
    color: 'primary.dark',
    pt: '6px', // align with 28px input baseline
    lineHeight: 1.4,
  },
  '& .visit-note-field-label.disabled': {
    color: 'text.disabled',
  },
  '& .visit-note-error': {
    fontSize: 12,
    color: 'error.main',
    mt: 0.5,
    ml: 0,
  },
} as const;
