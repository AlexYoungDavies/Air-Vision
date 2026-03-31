import { useState, type ComponentProps } from 'react';
import { Box, Typography, List, ListItemButton, SvgIcon } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import { AppIconButton } from '../AppIconButton';
import { MOCK_TODAYS_VISITS } from '../../data/mockTodaysVisits';
import { ACCENT_PRIMARY_PALETTES } from '../../theme/accents';

const PANEL_WIDTH = 280;

function TapeReelIcon(props: ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: 20, color: 'text.secondary', flexShrink: 0, ...props.sx }}>
      <circle cx="8" cy="12" r="3.5" />
      <circle cx="16" cy="12" r="3.5" />
      <path d="M11.5 12h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </SvgIcon>
  );
}

function formatDateHeader(d: Date): string {
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  const ord =
    day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  return `${weekday} ${month} ${day}${ord}`;
}

export interface ScribePanelProps {
  onClose: () => void;
}

export function ScribePanel({ onClose }: ScribePanelProps) {
  const [dayOffset, setDayOffset] = useState(0);
  const displayDate = new Date();
  displayDate.setHours(0, 0, 0, 0);
  displayDate.setDate(displayDate.getDate() + dayOffset);

  return (
    <Box
      sx={{
        width: PANEL_WIDTH,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Today&apos;s Visits
          </Typography>
          <TapeReelIcon />
        </Box>
        <AppIconButton tooltip="Close" aria-label="Close scribe panel" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseOutlined sx={{ fontSize: 20 }} />
        </AppIconButton>
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          px: 2,
          pb: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {formatDateHeader(displayDate)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <AppIconButton
            tooltip="Previous day"
            aria-label="Previous day"
            onClick={() => setDayOffset((o) => o - 1)}
            sx={{ color: 'text.secondary' }}
          >
            <ChevronLeftOutlined sx={{ fontSize: 20 }} />
          </AppIconButton>
          <AppIconButton
            tooltip="Next day"
            aria-label="Next day"
            onClick={() => setDayOffset((o) => o + 1)}
            sx={{ color: 'text.secondary' }}
          >
            <ChevronRightOutlined sx={{ fontSize: 20 }} />
          </AppIconButton>
        </Box>
      </Box>

      <List disablePadding sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 1.5, pb: 2 }}>
        {MOCK_TODAYS_VISITS.map((visit) => {
          const stripe = ACCENT_PRIMARY_PALETTES[visit.stripeAccent].main;
          return (
            <ListItemButton
              key={`${visit.patientName}-${visit.time}`}
              sx={{
                alignItems: 'stretch',
                borderRadius: 1.5,
                mb: 1,
                py: 1.25,
                px: 0,
                overflow: 'hidden',
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.03),
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              <Box
                sx={{
                  width: 4,
                  alignSelf: 'stretch',
                  flexShrink: 0,
                  bgcolor: stripe,
                  borderRadius: '4px 0 0 4px',
                  mr: 1.25,
                  ml: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0, pr: 1.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {visit.patientName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0, fontWeight: 500 }}>
                    {visit.time}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {visit.visitType}
                </Typography>
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
