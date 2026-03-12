import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { VisitNoteFieldWrapper } from './VisitNoteFieldWrapper';
import { baseInputSx } from './visitNoteFieldStyles';

export interface VisitNoteTextFieldProps extends Omit<TextFieldProps, 'variant' | 'size'> {
  label: string;
  errorMessage?: string;
  showLabel?: boolean;
}

export function VisitNoteTextField({
  label,
  errorMessage,
  error,
  disabled,
  placeholder = 'Add here',
  showLabel = true,
  ...textFieldProps
}: VisitNoteTextFieldProps) {
  return (
    <VisitNoteFieldWrapper label={label} error={errorMessage} disabled={disabled} showLabel={showLabel}>
      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholder}
        error={!!error || !!errorMessage}
        disabled={disabled}
        {...textFieldProps}
        sx={{
          minWidth: 160,
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
