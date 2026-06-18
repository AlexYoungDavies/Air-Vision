import { Box, Typography, TextField, type TextFieldProps } from '@mui/material';
import type { FieldSize, FieldVariant } from '../../theme/buttonStyleConstants';
import { fieldLabelSx, getFieldShellSx, labeledFieldWrapperSx } from './fieldStyles';

export interface AppTextFieldProps extends Omit<TextFieldProps, 'size' | 'variant' | 'label'> {
  /** small = 28px, medium = 36px, large = 44px */
  fieldSize?: FieldSize;
  fieldVariant?: FieldVariant;
  /** Optional label rendered above the field, left-aligned. */
  label?: string;
}

/** Standard text input — label above field, outlined or filled surface. */
export function AppTextField({
  fieldSize = 'small',
  fieldVariant = 'outlined',
  label,
  sx,
  slotProps,
  ...rest
}: AppTextFieldProps) {
  return (
    <Box sx={labeledFieldWrapperSx}>
      {label ? (
        <Typography component="label" sx={fieldLabelSx}>
          {label}
        </Typography>
      ) : null}
      <TextField
        variant="outlined"
        hiddenLabel
        slotProps={{
          ...slotProps,
          inputLabel: { shrink: false, ...(slotProps?.inputLabel as object) },
        }}
        sx={[
          {
            '& .MuiOutlinedInput-root': getFieldShellSx(fieldSize, fieldVariant),
            '& .MuiOutlinedInput-input': {
              py: 0,
              px: 1.5,
              height: '100%',
              boxSizing: 'border-box',
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...rest}
      />
    </Box>
  );
}
