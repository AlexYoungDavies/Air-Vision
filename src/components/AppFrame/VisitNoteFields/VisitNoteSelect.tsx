import { FormControl, Select, MenuItem } from '@mui/material';
import type { SelectProps } from '@mui/material';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import { VisitNoteFieldWrapper } from './VisitNoteFieldWrapper';
import { baseInputSx } from './visitNoteFieldStyles';

export interface VisitNoteSelectOption {
  value: string;
  label: string;
}

export interface VisitNoteSelectProps extends Omit<SelectProps, 'variant'> {
  label: string;
  options: VisitNoteSelectOption[];
  errorMessage?: string;
  placeholder?: string;
  showLabel?: boolean;
}

export function VisitNoteSelect({
  label,
  options,
  errorMessage,
  error,
  disabled,
  placeholder = 'Add here',
  showLabel = true,
  ...selectProps
}: VisitNoteSelectProps) {
  return (
    <VisitNoteFieldWrapper label={label} error={errorMessage} disabled={disabled} showLabel={showLabel}>
      <FormControl
        fullWidth={false}
        error={!!error || !!errorMessage}
        disabled={disabled}
        sx={{ minWidth: 160 }}
      >
        <Select
          displayEmpty
          renderValue={(v) => {
            if (v === '' || v == null) return <span className="visit-note-select-placeholder">{placeholder}</span>;
            return options.find((o) => o.value === v)?.label ?? String(v);
          }}
          IconComponent={KeyboardArrowDownOutlined}
          {...selectProps}
          sx={{
            ...baseInputSx,
            height: 28,
            minHeight: 28,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiSelect-select': {
              py: 0,
              px: 1.5,
              fontSize: 14,
              height: 28,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
            },
            '& .visit-note-select-placeholder': {
              color: 'text.disabled',
            },
            '& .MuiSelect-icon': {
              right: 8,
              fontSize: 20,
            },
            ...selectProps.sx,
          }}
        >
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </VisitNoteFieldWrapper>
  );
}
