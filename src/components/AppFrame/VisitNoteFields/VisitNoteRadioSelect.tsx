import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { VisitNoteFieldWrapper } from './VisitNoteFieldWrapper';
import { FIELD_BORDER_RADIUS } from './visitNoteFieldStyles';

export interface VisitNoteRadioSelectOption {
  value: string;
  label: string;
}

export interface VisitNoteRadioSelectProps {
  label: string;
  options: VisitNoteRadioSelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  errorMessage?: string;
  disabled?: boolean;
  /** Optional hint shown under the label (e.g. "Selection required"). Shown in red when errorMessage is set. */
  hint?: string;
  /** Layout of options: horizontal (default) or vertical. */
  orientation?: 'horizontal' | 'vertical';
  sx?: SxProps<Theme>;
  showLabel?: boolean;
}

export function VisitNoteRadioSelect({
  label,
  options,
  value,
  onChange,
  errorMessage,
  disabled = false,
  hint,
  orientation = 'horizontal',
  sx,
  showLabel = true,
}: VisitNoteRadioSelectProps) {
  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    onChange(value === optionValue ? null : optionValue);
  };

  return (
    <VisitNoteFieldWrapper label={label} error={errorMessage} disabled={disabled} showLabel={showLabel}>
      <Box sx={[{ display: 'flex', flexDirection: 'column', gap: 0.5 }, ...(sx ? (Array.isArray(sx) ? sx : [sx]) : [])]}>
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
          role="radiogroup"
          aria-label={label}
          sx={{
            display: 'flex',
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
            gap: 1,
            listStyle: 'none',
            m: 0,
            p: 0,
          }}
        >
          {options.map((opt) => {
            const selected = value === opt.value;
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
                  role="radio"
                  aria-checked={selected}
                  onClick={() => handleSelect(opt.value)}
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
                    fontFamily: 'inherit',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: disabled ? 'default' : 'pointer',
                    transition: 'border-color 0.15s, color 0.15s, background-color 0.15s',
                    ...(disabled
                      ? {
                          borderColor: selected ? 'grey.400' : 'transparent',
                          backgroundColor: selected ? 'grey.300' : 'grey.200',
                          color: 'text.disabled',
                        }
                      : selected
                        ? {
                            borderColor: 'primary.main',
                            backgroundColor: 'primary.light',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              filter: 'brightness(0.97)',
                            },
                          }
                        : {
                            borderColor: 'transparent',
                            backgroundColor: 'transparent',
                            color: 'text.secondary',
                            '&:hover': {
                              backgroundColor: 'grey.200',
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
