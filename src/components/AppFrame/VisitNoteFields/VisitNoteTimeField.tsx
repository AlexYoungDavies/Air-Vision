import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { VisitNoteFieldWrapper } from './VisitNoteFieldWrapper';
import { baseInputSx } from './visitNoteFieldStyles';

export interface VisitNoteTimeFieldProps extends Omit<TextFieldProps, 'variant' | 'size'> {
  label: string;
  errorMessage?: string;
  showLabel?: boolean;
}

export function VisitNoteTimeField({
  label,
  errorMessage,
  error,
  disabled,
  placeholder = '--:--',
  showLabel = true,
  ...textFieldProps
}: VisitNoteTimeFieldProps) {
  return (
    <VisitNoteFieldWrapper label={label} error={errorMessage} disabled={disabled} showLabel={showLabel}>
      <TextField
        type="time"
        variant="outlined"
        size="small"
        placeholder={placeholder}
        error={!!error || !!errorMessage}
        disabled={disabled}
        {...textFieldProps}
        sx={{
          minWidth: 120,
          '& .MuiInputBase-root': {
            ...baseInputSx,
            height: 28,
          },
          '& .MuiInputBase-input': {
            py: 0,
            px: 1.5,
            fontSize: 14,
            height: 28,
            boxSizing: 'border-box',
          },
          ...textFieldProps.sx,
        }}
      />
    </VisitNoteFieldWrapper>
  );
}
