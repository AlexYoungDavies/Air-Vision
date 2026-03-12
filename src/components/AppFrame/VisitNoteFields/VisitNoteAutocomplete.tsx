import { Autocomplete, TextField } from '@mui/material';
import type { AutocompleteProps } from '@mui/material';
import { VisitNoteFieldWrapper } from './VisitNoteFieldWrapper';
import { baseInputSx } from './visitNoteFieldStyles';

export interface VisitNoteAutocompleteProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    'renderInput'
  > {
  label: string;
  errorMessage?: string;
  placeholder?: string;
  showLabel?: boolean;
}

export function VisitNoteAutocomplete<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  label,
  errorMessage,
  disabled,
  placeholder = 'Add here',
  showLabel = true,
  ...autocompleteProps
}: VisitNoteAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const hasError = !!errorMessage;
  return (
    <VisitNoteFieldWrapper label={label} error={errorMessage} disabled={disabled} showLabel={showLabel}>
      <Autocomplete
        disabled={disabled}
        {...autocompleteProps}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            placeholder={placeholder}
            error={hasError}
          />
        )}
        sx={{
          minWidth: 160,
          '& .MuiInputBase-root': {
            ...baseInputSx,
            height: 28,
            minHeight: 28,
          },
          '& .MuiInputBase-input': {
            py: 0,
            px: 1.5,
            fontSize: 14,
            height: 28,
            boxSizing: 'border-box',
          },
          '& .MuiAutocomplete-endAdornment': {
            right: 8,
          },
          ...autocompleteProps.sx,
        }}
      />
    </VisitNoteFieldWrapper>
  );
}
