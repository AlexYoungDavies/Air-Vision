import { Box, Popover, Typography } from '@mui/material';
import type { AccentKey } from '../../theme/accents';
import { useAccent } from '../../theme/AppThemeProvider';
import { AppearancePickerPanel } from './AppearancePickerPanel';

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
      <Box>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 700,
            color: 'text.secondary',
            px: 2,
            pt: 2,
            pb: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Appearance
        </Typography>
        <AppearancePickerPanel
          accentKey={selectedAccentKey}
          onAccentChange={(key) => {
            onSelectAccent(key);
            onClose();
          }}
          mode={mode}
          onModeChange={setMode}
          sx={{ pt: 1.5, px: 2, pb: 2, minWidth: 200 }}
        />
      </Box>
    </Popover>
  );
}
