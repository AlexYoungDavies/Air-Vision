import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { VisitNoteFieldWrapper } from './VisitNoteFieldWrapper';
import { baseInputSx } from './visitNoteFieldStyles';

export interface VisitNoteDateFieldProps extends Omit<TextFieldProps, 'variant' | 'size'> {
  label: string;
  errorMessage?: string;
  showLabel?: boolean;
}

export function VisitNoteDateField({
  label,
  errorMessage,
  error,
  disabled,
  placeholder = 'mm/dd/yyyy',
  showLabel = true,
  ...textFieldProps
}: VisitNoteDateFieldProps) {
  return (
    <VisitNoteFieldWrapper label={label} error={errorMessage} disabled={disabled} showLabel={showLabel}>
      <TextField
        type="date"
        variant="outlined"
        size="small"
        placeholder={placeholder}
        error={!!error || !!errorMessage}
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        {...textFieldProps}
        sx={{
          width: 'fit-content',
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
