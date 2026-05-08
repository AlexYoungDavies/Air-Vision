import type { SxProps, Theme } from '@mui/material/styles';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CheckRounded from '@mui/icons-material/CheckRounded';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import type { AccentKey, PaletteMode } from '../../theme/accents';
import { ACCENT_KEYS, ACCENT_OPTIONS } from '../../theme/accents';

export interface AppearancePickerPanelProps {
  accentKey: AccentKey;
  onAccentChange: (key: AccentKey) => void;
  mode: PaletteMode;
  onModeChange: (mode: PaletteMode) => void;
  /** Tighter spacing for nested menus / small popovers */
  compact?: boolean;
  sx?: SxProps<Theme>;
}

export function AppearancePickerPanel({
  accentKey,
  onAccentChange,
  mode,
  onModeChange,
  compact = false,
  sx,
}: AppearancePickerPanelProps) {
  const pad = compact ? 1.5 : 2;
  const labelSx = {
    display: 'block',
    fontWeight: 700,
    fontSize: 11,
    color: 'text.secondary',
    mb: compact ? 1 : 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  } as const;

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, value: PaletteMode | null) => {
    if (value != null) onModeChange(value);
  };

  const swatchSize = compact ? 28 : 40;
  const swatchRadius = compact ? '8px' : '10px';

  return (
    <Box
      sx={[
        { p: pad, minWidth: compact ? 220 : 200 },
        ...(Array.isArray(sx) ? sx : sx != null ? [sx] : []),
      ]}
    >
      <Typography component="span" variant="caption" sx={labelSx}>
        Accent
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: compact ? 0.75 : 1,
          justifyContent: 'space-between',
          mb: compact ? 1.5 : 2,
          overflowX: 'auto',
          pb: 0.25,
          mx: -0.25,
          px: 0.25,
        }}
      >
        {ACCENT_KEYS.map((key) => {
          const { label, swatch } = ACCENT_OPTIONS[key];
          const isSelected = accentKey === key;
          return (
            <Box
              key={key}
              component="button"
              type="button"
              onClick={() => onAccentChange(key)}
              aria-label={`Accent ${label}`}
              aria-pressed={isSelected}
              sx={{
                width: swatchSize,
                height: swatchSize,
                minWidth: swatchSize,
                flexShrink: 0,
                borderRadius: swatchRadius,
                border: '2px solid',
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: swatch,
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
                '&:hover': {
                  transform: 'scale(1.06)',
                  borderColor: isSelected ? 'primary.dark' : 'text.secondary',
                  boxShadow: 1,
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
                    fontSize: compact ? 16 : 22,
                    color: key === 'yellow' ? 'rgba(0,0,0,0.7)' : '#fff',
                    filter: key === 'yellow' ? 'none' : 'drop-shadow(0 0 1px rgba(0,0,0,0.3))',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      <Typography component="span" variant="caption" sx={labelSx}>
        Theme
      </Typography>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        aria-label="Theme mode"
        size="small"
        fullWidth
        sx={{
          bgcolor: 'grey.200',
          p: 0.5,
          borderRadius: 2,
          gap: 0.5,
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none',
            borderRadius: 1.5,
            flex: 1,
            py: compact ? 0.5 : 0.75,
            textTransform: 'none',
            fontSize: compact ? 12 : 13,
            fontWeight: 500,
            color: 'text.secondary',
            bgcolor: 'transparent',
            '&.Mui-selected': {
              bgcolor: 'background.paper',
              color: 'primary.main',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' },
            },
            '&:hover': {
              bgcolor: 'action.hover',
            },
          },
        }}
      >
        <ToggleButton value="light" aria-label="Light mode" disableRipple>
          <LightModeOutlined sx={{ fontSize: compact ? 16 : 18, mr: 0.5 }} />
          Light
        </ToggleButton>
        <ToggleButton value="dark" aria-label="Dark mode" disableRipple>
          <DarkModeOutlined sx={{ fontSize: compact ? 16 : 18, mr: 0.5 }} />
          Dark
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
