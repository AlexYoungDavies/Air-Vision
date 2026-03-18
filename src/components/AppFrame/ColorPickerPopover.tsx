import { Box, Popover, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CheckRounded from '@mui/icons-material/CheckRounded';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import type { AccentKey, PaletteMode } from '../../theme/accents';
import { ACCENT_KEYS, ACCENT_OPTIONS } from '../../theme/accents';
import { useAccent } from '../../theme/AppThemeProvider';

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
  const { mode, setMode } = useAccent();

  const handleSelect = (key: AccentKey) => {
    onSelectAccent(key);
    onClose();
  };

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, value: PaletteMode | null) => {
    if (value != null) setMode(value);
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
            borderRadius: '12px',
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
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Appearance
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="Theme mode"
          size="small"
          fullWidth
          sx={{
            mb: 2,
            '& .MuiToggleButtonGroup-grouped': {
              border: 1,
              borderColor: 'divider',
              py: 0.75,
              textTransform: 'none',
              fontSize: 13,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.dark',
                borderColor: 'primary.main',
                '&:hover': { bgcolor: 'primary.light' },
              },
            },
          }}
        >
          <ToggleButton value="light" aria-label="Light mode">
            <LightModeOutlined sx={{ fontSize: 16, mr: 0.5 }} />
            Light
          </ToggleButton>
          <ToggleButton value="dark" aria-label="Dark mode">
            <DarkModeOutlined sx={{ fontSize: 16, mr: 0.5 }} />
            Dark
          </ToggleButton>
        </ToggleButtonGroup>
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
                  borderRadius: '10px',
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
