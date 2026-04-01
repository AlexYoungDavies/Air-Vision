import { forwardRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { MicrophoneIcon, PauseRecordingIcon, PlayRecordingIcon, StopRecordingIcon } from '../icons';

const soundWavePulse = keyframes`
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
`;

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Six bars inside the 28px-tall header row */
function ScribeLiveWaveBars({ animated }: { animated: boolean }) {
  const opacities = [1, 1, 0.75, 0.5, 0.35, 0.22];
  return (
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '2px',
        height: 16,
        flexShrink: 0,
      }}
    >
      {opacities.map((op, i) => (
        <Box
          key={i}
          sx={{
            width: 2,
            height: 9,
            borderRadius: 0.5,
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.contrastText,
                animated ? op : op * 0.45,
              ),
            transformOrigin: 'center bottom',
            transform: animated ? undefined : 'scaleY(0.5)',
            ...(animated
              ? {
                  animation: `${soundWavePulse} 0.55s ease-in-out infinite`,
                  animationDelay: `${i * 0.07}s`,
                }
              : {}),
          }}
        />
      ))}
    </Box>
  );
}

const ROW_H = 28;
const ICON_BTN = 22;

export interface ScribeLiveActivityBarProps {
  phase: 'recording' | 'paused';
  seconds: number;
  onPause: () => void;
  onResume: () => void;
  /** Clears session and opens Scribe to this appointment (idle). */
  onFinish: () => void;
  /** Main body (not pause/stop) — open Scribe panel and return to recording screen */
  onNavigateToRecording: () => void;
}

export const ScribeLiveActivityBar = forwardRef<HTMLDivElement, ScribeLiveActivityBarProps>(
  function ScribeLiveActivityBar(
    {
      phase,
      seconds,
      onPause,
      onResume,
      onFinish,
      onNavigateToRecording,
    }: ScribeLiveActivityBarProps,
    ref,
  ) {
    const isRecording = phase === 'recording';
    const label = isRecording
      ? `Scribe recording in progress, ${formatTimer(seconds)}. Click to return to recording.`
      : `Scribe recording paused at ${formatTimer(seconds)}. Click to return to recording.`;

    return (
      <Box
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={label}
      onClick={onNavigateToRecording}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigateToRecording();
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        height: ROW_H,
        minHeight: ROW_H,
        maxHeight: ROW_H,
        pl: 1,
        pr: 0.25,
        py: 0,
        borderRadius: '8px',
        bgcolor: 'primary.dark',
        color: 'primary.contrastText',
        cursor: 'pointer',
        boxShadow: 'none',
        flexShrink: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
        '&:hover': {
          filter: (t) => (t.palette.mode === 'dark' ? 'brightness(1.08)' : 'brightness(0.95)'),
        },
      }}
    >
      <MicrophoneIcon sx={{ fontSize: 16, color: 'inherit', flexShrink: 0 }} />
      <ScribeLiveWaveBars animated={isRecording} />
      <Typography
        sx={{
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          fontSize: 12,
          lineHeight: 1,
          color: 'inherit',
          minWidth: '2.5rem',
        }}
      >
        {formatTimer(seconds)}
      </Typography>
      <IconButton
        size="small"
        aria-label={isRecording ? 'Pause recording' : 'Resume recording'}
        onClick={(e) => {
          e.stopPropagation();
          if (isRecording) onPause();
          else onResume();
        }}
        sx={{
          color: 'inherit',
          width: ICON_BTN,
          height: ICON_BTN,
          minWidth: ICON_BTN,
          minHeight: ICON_BTN,
          p: 0,
          borderRadius: '6px',
          '&:hover': { bgcolor: (t) => alpha(t.palette.primary.contrastText, 0.12) },
        }}
      >
        {isRecording ? (
          <PauseRecordingIcon sx={{ fontSize: 16 }} />
        ) : (
          <PlayRecordingIcon sx={{ fontSize: 16 }} />
        )}
      </IconButton>
      <IconButton
        size="small"
        aria-label="Finish recording"
        onClick={(e) => {
          e.stopPropagation();
          onFinish();
        }}
        sx={{
          color: 'inherit',
          width: ICON_BTN,
          height: ICON_BTN,
          minWidth: ICON_BTN,
          minHeight: ICON_BTN,
          p: 0,
          mr: 0.25,
          borderRadius: '6px',
          '&:hover': { bgcolor: (t) => alpha(t.palette.primary.contrastText, 0.12) },
        }}
      >
        <StopRecordingIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
    );
  },
);
