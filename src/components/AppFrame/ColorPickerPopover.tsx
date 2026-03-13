import { Box, Popover, Typography } from '@mui/material';
import CheckRounded from '@mui/icons-material/CheckRounded';
import type { AccentKey } from '../../theme/accents';
import { ACCENT_KEYS, ACCENT_OPTIONS } from '../../theme/accents';

export interface ColorPickerPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null | undefined;
  onClose: () => void;
  selectedAccentKey: AccentKey;
  onSelectAccent: (key: AccentKey) => void;
}

export function ColorPickerPopover({
  open,
  anchorEl,
  onClose,
  selectedAccentKey,
  onSelectAccent,
}: ColorPickerPopoverProps) {
  const handleSelect = (key: AccentKey) => {
    onSelectAccent(key);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            borderRadius: 2,
          },
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          minWidth: 200,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 700,
            color: 'text.secondary',
            mb: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Accent color
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {ACCENT_KEYS.map((key) => {
            const { label, swatch } = ACCENT_OPTIONS[key];
            const isSelected = selectedAccentKey === key;
            return (
              <Box
                key={key}
                component="button"
                type="button"
                onClick={() => handleSelect(key)}
                aria-label={`Select ${label}`}
                aria-pressed={isSelected}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: swatch,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    transform: 'scale(1.08)',
                    borderColor: isSelected ? 'primary.dark' : 'text.secondary',
                    boxShadow: 2,
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineOffset: 2,
                    outlineColor: 'primary.main',
                  },
                }}
              >
                {isSelected && (
                  <CheckRounded
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      m: 'auto',
                      fontSize: 22,
                      color: key === 'yellow' ? 'rgba(0,0,0,0.7)' : '#fff',
                      filter: key === 'yellow' ? 'none' : 'drop-shadow(0 0 1px rgba(0,0,0,0.3))',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Popover>
  );
}
