import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { VisitNoteFieldWrapper } from './VisitNoteFieldWrapper';
import { baseInputSx } from './visitNoteFieldStyles';

export interface VisitNoteTextAreaProps extends Omit<TextFieldProps, 'variant' | 'size' | 'multiline'> {
  label: string;
  errorMessage?: string;
  minRows?: number;
  showLabel?: boolean;
}

export function VisitNoteTextArea({
  label,
  errorMessage,
  error,
  disabled,
  placeholder = 'Add here',
  minRows = 2,
  showLabel = true,
  ...textFieldProps
}: VisitNoteTextAreaProps) {
  return (
    <VisitNoteFieldWrapper label={label} error={errorMessage} disabled={disabled} showLabel={showLabel}>
      <TextField
        variant="outlined"
        size="small"
        multiline
        minRows={minRows}
        placeholder={placeholder}
        error={!!error || !!errorMessage}
        disabled={disabled}
        {...textFieldProps}
        sx={{
          width: '100%',
          pt: '4px',
          pb: '4px',
          '& .MuiInputBase-root': {
            ...baseInputSx,
            minHeight: 28,
            height: 'auto',
            alignItems: 'flex-start',
            paddingTop: '6px',
            paddingBottom: '10px',
            paddingLeft: '12px',
            paddingRight: '12px',
          },
          '& .MuiInputBase-input': {
            py: 0,
            px: 0,
            fontSize: 14,
            boxSizing: 'border-box',
          },
          ...textFieldProps.sx,
        }}
      />
    </VisitNoteFieldWrapper>
  );
}
