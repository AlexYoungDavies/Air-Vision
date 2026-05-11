import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import BoltOutlined from '@mui/icons-material/BoltOutlined';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  getPreVisitSummaryForVisit,
  type MockScribeVisit,
} from '../../data/mockTodaysVisits';
import {
  AICheckIcon,
  MicrophoneIcon,
  PauseRecordingIcon,
  PlayRecordingIcon,
  StopBlockedRecordingIcon,
  StopRecordingIcon,
  UploadIcon,
} from '../icons';
import { ScribeRecordingEmblem } from './ScribeRecordingEmblem';
import type { ActiveScribeRecordingSession } from './scribeRecordingSession';
import { VISIT_NOTE_BUTTON_EXEMPT_CLASS } from '../../theme/buttonStyleConstants';

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatVisitDate(date: Dayjs): string {
  const day = date.date();
  const ord =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';
  return `${date.format('ddd MMM')} ${day}${ord}`;
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

interface CollapsibleCardProps {
  icon: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  /** When true, the title gets the brand color (used by the AI summary card). */
  emphasizeTitle?: boolean;
}

function CollapsibleCard({ icon, title, open, onToggle, children, emphasizeTitle }: CollapsibleCardProps) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '10px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
      }}
    >
      <Box
        component="button"
        onClick={onToggle}
        aria-expanded={open}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.25,
          py: 1,
          border: 0,
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
          borderBottom: open ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', color: emphasizeTitle ? 'primary.main' : 'text.secondary' }}>
          {icon}
        </Box>
        <Typography
          sx={{
            flex: 1,
            fontSize: 14,
            fontWeight: 600,
            color: emphasizeTitle ? 'primary.main' : 'text.primary',
          }}
        >
          {title}
        </Typography>
        <KeyboardArrowDownOutlined
          sx={{
            fontSize: 20,
            color: 'text.secondary',
            transition: (t) => t.transitions.create('transform', { duration: 200 }),
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </Box>
      <Collapse in={open} timeout={200} unmountOnExit>
        <Box sx={{ px: 1.5, py: 1.25 }}>{children}</Box>
      </Collapse>
    </Box>
  );
}

interface PreVisitIdleViewProps {
  visit: MockScribeVisit;
  scheduleDate: Dayjs;
  onBeginRecording: () => void;
}

function PreVisitIdleView({ visit, scheduleDate, onBeginRecording }: PreVisitIdleViewProps) {
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [precharOpen, setPrecharOpen] = useState(false);
  const [precharText, setPrecharText] = useState('');
  const [fastTranscription, setFastTranscription] = useState(false);

  const summary = useMemo(() => getPreVisitSummaryForVisit(visit), [visit]);
  const dateLabel = useMemo(() => formatVisitDate(scheduleDate), [scheduleDate]);

  return (
    <>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: 17, lineHeight: 1.3 }}>
            {visit.patientName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, fontSize: 12.5 }}>
            {visit.visitType}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12.5 }}>
            {dateLabel} • {visit.time}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <CollapsibleCard
            icon={<AICheckIcon sx={{ fontSize: 18 }} />}
            title="Pre-visit Summary"
            open={summaryOpen}
            onToggle={() => setSummaryOpen((o) => !o)}
            emphasizeTitle
          >
            <Typography sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.55 }}>
              {summary.body}
            </Typography>
            <Box sx={{ mt: 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                Summary of last visit
              </Typography>
              <Box
                sx={{
                  pl: 1.25,
                  borderLeft: 2,
                  borderColor: (t) => alpha(t.palette.text.secondary, 0.25),
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                }}
              >
                {(
                  [
                    ['Subjective', summary.lastVisit.subjective],
                    ['Objective', summary.lastVisit.objective],
                    ['Assessment', summary.lastVisit.assessment],
                    ['Plan', summary.lastVisit.plan],
                  ] as const
                ).map(([label, value]) => (
                  <Typography key={label} sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.5 }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      {label}:
                    </Box>{' '}
                    {value}
                  </Typography>
                ))}
              </Box>
            </Box>
          </CollapsibleCard>

          <CollapsibleCard
            icon={<InfoOutlined sx={{ fontSize: 18 }} />}
            title="Pre-charting Note (Optional)"
            open={precharOpen}
            onToggle={() => setPrecharOpen((o) => !o)}
          >
            <TextField
              value={precharText}
              onChange={(e) => setPrecharText(e.target.value)}
              placeholder="Add context the Scribe should know before recording…"
              multiline
              minRows={3}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: 13,
                  bgcolor: 'background.default',
                  borderRadius: '8px',
                },
              }}
            />
          </CollapsibleCard>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 0.5,
            }}
          >
            <BoltOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography sx={{ fontSize: 13, color: 'text.primary', fontWeight: 500 }}>
              Fast Transcription
            </Typography>
            <Switch
              size="small"
              checked={fastTranscription}
              onChange={(_, v) => setFastTranscription(v)}
              inputProps={{ 'aria-label': 'Fast Transcription' }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, pt: 1.5 }}>
        <Button
          variant="text"
          size="small"
          startIcon={<UploadIcon sx={{ fontSize: 18 }} />}
          sx={{
            color: 'primary.main',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Import Record
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
          startIcon={<MicrophoneIcon />}
          onClick={onBeginRecording}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            height: 56,
            minHeight: 56,
            borderRadius: '999px',
            fontSize: 15,
          }}
        >
          Start Recording
        </Button>
      </Box>
    </>
  );
}

export interface ScribeAppointmentViewProps {
  visit: MockScribeVisit;
  scheduleDate?: Dayjs;
  onBack: () => void;
  /** Lifted session when this visit is recording or paused; null before Begin or after Finish. */
  recordingForVisit: ActiveScribeRecordingSession | null;
  onBeginRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onFinishRecording: () => void;
  onCancelRecording: () => void;
}

export function ScribeAppointmentView({
  visit,
  scheduleDate,
  onBack,
  recordingForVisit,
  onBeginRecording,
  onPauseRecording,
  onResumeRecording,
  onFinishRecording,
  onCancelRecording,
}: ScribeAppointmentViewProps) {
  const [mic, setMic] = useState('MacBook Pro Microphone');

  const phase = recordingForVisit ? recordingForVisit.phase : 'idle';
  const seconds = recordingForVisit?.seconds ?? 0;
  const emblemPhase = recordingForVisit?.phase === 'recording' ? 'pulse' : 'flower';
  const timerLabel = useMemo(() => formatTimer(seconds), [seconds]);
  const effectiveDate = scheduleDate ?? dayjs();

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
      <Box sx={{ flexShrink: 0, pt: 0.5, pb: phase === 'idle' ? 0.5 : 1.5 }}>
        <Button
          onClick={onBack}
          aria-label="Back to list"
          size="small"
          startIcon={<ChevronLeftOutlined sx={{ fontSize: 20 }} />}
          sx={{
            color: 'primary.main',
            px: 0.75,
            ml: -0.75,
            fontSize: 14,
            fontWeight: 600,
            '& .MuiButton-startIcon': { mr: 0.25 },
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          Back to List
        </Button>
      </Box>

      {phase === 'idle' ? (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <PreVisitIdleView
            visit={visit}
            scheduleDate={effectiveDate}
            onBeginRecording={onBeginRecording}
          />
        </Box>
      ) : (
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
            {phase === 'recording' && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<PauseRecordingIcon />}
                  onClick={onPauseRecording}
                  sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: '8px' }}
                >
                  Pause
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<StopRecordingIcon />}
                  onClick={onFinishRecording}
                  sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: '8px' }}
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
                    onClick={onResumeRecording}
                    sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: '8px', flex: 1 }}
                  >
                    Resume
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<StopRecordingIcon />}
                    onClick={onFinishRecording}
                    sx={{ textTransform: 'none', fontWeight: 600, py: 1.25, borderRadius: '8px', flex: 1 }}
                  >
                    Finish
                  </Button>
                </Box>
                <Button
                  variant="text"
                  color="inherit"
                  size="medium"
                  startIcon={<StopBlockedRecordingIcon sx={{ fontSize: 18 }} />}
                  onClick={onCancelRecording}
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
      )}
    </Box>
  );
}
