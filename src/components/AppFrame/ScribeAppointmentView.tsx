import { useEffect, useMemo, useState } from 'react';
import { Box, Button, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import type { MockScribeVisit } from '../../data/mockTodaysVisits';
import {
  MicrophoneIcon,
  PauseRecordingIcon,
  PlayRecordingIcon,
  StopBlockedRecordingIcon,
  StopRecordingIcon,
} from '../icons';
import { ScribeRecordingEmblem } from './ScribeRecordingEmblem';

type RecordingUiPhase = 'idle' | 'recording' | 'paused';

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function AudioLevelMock() {
  const [heights, setHeights] = useState([0.45, 0.72, 0.55, 0.28, 0.2]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeights((prev) =>
        prev.map((_, i) => {
          const base = [0.35, 0.65, 0.5, 0.25, 0.18][i];
          const jitter = (Math.sin(Date.now() / 200 + i * 1.7) + 1) * 0.12;
          return Math.min(0.95, base + jitter);
        }),
      );
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 0.5, height: 24 }}>
      {heights.map((h, i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: `${h * 100}%`,
            minHeight: 4,
            borderRadius: 0.5,
            bgcolor: (t) => (i < 3 ? t.palette.primary.main : alpha(t.palette.text.secondary, 0.22)),
            transition: 'height 0.1s ease-out',
          }}
        />
      ))}
    </Box>
  );
}

export interface ScribeAppointmentViewProps {
  visit: MockScribeVisit;
  onBack: () => void;
}

export function ScribeAppointmentView({ visit, onBack }: ScribeAppointmentViewProps) {
  const [phase, setPhase] = useState<RecordingUiPhase>('idle');
  const [seconds, setSeconds] = useState(0);
  const [mic, setMic] = useState('MacBook Pro Microphone');

  useEffect(() => {
    if (phase !== 'recording') return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const emblemPhase = phase === 'recording' ? 'pulse' : 'flower';

  const timerLabel = useMemo(() => formatTimer(seconds), [seconds]);

  const handleMicChange = (e: SelectChangeEvent<string>) => setMic(e.target.value);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        px: 1.5,
        pb: 2,
      }}
    >
      <Box sx={{ flexShrink: 0, pt: 0.5, pb: 1.5 }}>
        <Button
          variant="text"
          size="small"
          onClick={onBack}
          startIcon={<ChevronLeftOutlined sx={{ fontSize: 20 }} />}
          sx={{
            color: 'primary.main',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            px: 0,
            minWidth: 0,
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Back to List
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '100%',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 17, lineHeight: 1.3 }}>
              {visit.patientName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, mb: 2.5, display: 'block' }}>
              {visit.visitType}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 1 }}>
              <ScribeRecordingEmblem phase={emblemPhase} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                mt: 1,
                mb: phase === 'paused' ? 1 : 1.5,
              }}
            >
              {timerLabel}
            </Typography>

            {phase === 'paused' && (
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
                Recording Paused
              </Typography>
            )}

            {phase !== 'paused' && <AudioLevelMock />}

            <Select
              value={mic}
              onChange={handleMicChange}
              variant="standard"
              disableUnderline
              sx={{
                mt: phase === 'paused' ? 1 : 1.5,
                fontSize: 12,
                color: 'text.secondary',
                '& .MuiSelect-select': { py: 0.5, pr: '24px !important', textAlign: 'center' },
                '&::before, &::after': { display: 'none' },
                minWidth: 200,
              }}
            >
              <MenuItem value="MacBook Pro Microphone">MacBook Pro Microphone</MenuItem>
              <MenuItem value="External USB Microphone">External USB Microphone</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box sx={{ width: '100%', flexShrink: 0, pt: 1, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {phase === 'idle' && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<MicrophoneIcon />}
              onClick={() => {
                setSeconds(0);
                setPhase('recording');
              }}
              sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: 1.5 }}
            >
              Begin Recording
            </Button>
          )}

          {phase === 'recording' && (
            <>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                startIcon={<PauseRecordingIcon />}
                onClick={() => setPhase('paused')}
                sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: 1.5 }}
              >
                Pause
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<StopRecordingIcon />}
                onClick={() => {
                  setPhase('idle');
                  setSeconds(0);
                }}
                sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: 1.5 }}
              >
                Finish
              </Button>
            </>
          )}

          {phase === 'paused' && (
            <>
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<PlayRecordingIcon />}
                  onClick={() => setPhase('recording')}
                  sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: 1.5, flex: 1 }}
                >
                  Resume
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<StopRecordingIcon />}
                  onClick={() => {
                    setPhase('idle');
                    setSeconds(0);
                  }}
                  sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: 1.5, flex: 1 }}
                >
                  Finish
                </Button>
              </Box>
              <Button
                variant="text"
                color="inherit"
                size="medium"
                startIcon={<StopBlockedRecordingIcon sx={{ fontSize: 18 }} />}
                onClick={onBack}
                sx={{
                  alignSelf: 'center',
                  mt: 0.5,
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: 13,
                  '&:hover': {
                    bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
                  },
                }}
              >
                Cancel Recording
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
