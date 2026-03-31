import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CheckRounded from '@mui/icons-material/CheckRounded';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import { useAccent } from '../../theme/AppThemeProvider';
import { ACCENT_KEYS, ACCENT_OPTIONS } from '../../theme/accents';
import type { PaletteMode } from '../../theme/accents';

export function PreferencesPage() {
  const { accentKey, setAccentKey, mode, setMode } = useAccent();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'auto',
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Preferences
      </Typography>

      {/* Appearance (light / dark) */}
      <Box sx={{ mb: 4 }}>
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
          Appearance
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, value: PaletteMode | null) => value != null && setMode(value)}
          aria-label="Theme mode"
          sx={{
            '& .MuiToggleButtonGroup-grouped': {
              border: 1,
              borderColor: 'divider',
              px: 2,
              py: 1,
              textTransform: 'none',
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
            <LightModeOutlined sx={{ fontSize: 18, mr: 0.75 }} />
            Light
          </ToggleButton>
          <ToggleButton value="dark" aria-label="Dark mode">
            <DarkModeOutlined sx={{ fontSize: 18, mr: 0.75 }} />
            Dark
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* App theme (accent color) */}
      <Box sx={{ mb: 4 }}>
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
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {ACCENT_KEYS.map((key) => {
            const { label, swatch } = ACCENT_OPTIONS[key];
            const isSelected = accentKey === key;
            return (
              <Box
                key={key}
                component="button"
                type="button"
                onClick={() => setAccentKey(key)}
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

      {/* Prototype credits and legal */}
      <Box
        sx={{
          mt: 'auto',
          pt: 4,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Prototype made by <strong>Alex Young-Davies</strong>.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Ideas and development contributed to by Natasha Gunther, Harshil Sheth, Johnathon, Zuniga,
          Ruzbeh Irani, Herui Chen, Cyvian Chen, Aayush Gandhi, and more from the Air team.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            mb: 1,
          }}
        >
          This prototype is property of Commure Athelas, and CANNOT be shared externally without
          explicit permission from the Air team.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          This is not a marketing tool; it is a vision prototype to help guide the team and envision
          what&apos;s possible in 1–2 years.
        </Typography>
      </Box>
    </Box>
  );
}
