import { Box, Typography } from '@mui/material';
import { VisitNoteFieldWrapper } from './VisitNoteFieldWrapper';
import { FIELD_BORDER_RADIUS } from './visitNoteFieldStyles';

export interface VisitNoteCheckboxListOption {
  value: string;
  label: string;
}

export interface VisitNoteCheckboxListProps {
  label: string;
  options: VisitNoteCheckboxListOption[];
  value: string[];
  onChange: (value: string[]) => void;
  errorMessage?: string;
  disabled?: boolean;
  /** Optional hint shown under the label (e.g. "Select all that apply"). Shown in red when errorMessage is set. */
  hint?: string;
  showLabel?: boolean;
}

export function VisitNoteCheckboxList({
  label,
  options,
  value,
  onChange,
  errorMessage,
  disabled = false,
  hint,
  showLabel = true,
}: VisitNoteCheckboxListProps) {
  const selectedSet = new Set(value);

  const handleToggle = (optionValue: string) => {
    if (disabled) return;
    if (selectedSet.has(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <VisitNoteFieldWrapper label={label} error={errorMessage} disabled={disabled} showLabel={showLabel}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {hint && (
          <Typography
            variant="body2"
            sx={{
              fontSize: 12,
              color: errorMessage ? 'error.main' : 'text.secondary',
              mb: 0.25,
            }}
          >
            {hint}
          </Typography>
        )}
        <Box
          component="ul"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            listStyle: 'none',
            m: 0,
            p: 0,
          }}
        >
          {options.map((opt) => {
            const selected = selectedSet.has(opt.value);
            return (
              <Box
                component="li"
                key={opt.value}
                sx={{
                  flexShrink: 0,
                }}
              >
                <Box
                  component="button"
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => handleToggle(opt.value)}
                  disabled={disabled}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 1.5,
                    py: 0.75,
                    minHeight: 28,
                    borderRadius: `${FIELD_BORDER_RADIUS}px`,
                    border: '1px solid',
                    backgroundColor: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: disabled ? 'default' : 'pointer',
                    transition: 'border-color 0.15s, color 0.15s, background-color 0.15s',
                    ...(disabled
                      ? {
                          borderColor: 'action.disabled',
                          color: 'text.disabled',
                          ...(selected && {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            opacity: 0.6,
                          }),
                        }
                      : selected
                        ? {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }
                        : {
                            borderColor: 'divider',
                            color: 'text.secondary',
                            '&:hover': {
                              borderColor: 'text.secondary',
                              backgroundColor: '#EEEEEE',
                            },
                          }),
                  }}
                >
                  {opt.label}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </VisitNoteFieldWrapper>
  );
}
