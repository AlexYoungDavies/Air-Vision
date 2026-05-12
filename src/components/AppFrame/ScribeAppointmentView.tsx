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
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import BoltOutlined from '@mui/icons-material/BoltOutlined';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import AssignmentTurnedInOutlined from '@mui/icons-material/AssignmentTurnedInOutlined';
import {
  getMidVisitSummaryForVisit,
  getPostProcessedOutputForVisit,
  getPreVisitSummaryForVisit,
  type MockScribeMidVisitSummary,
  type MockScribeVisit,
} from '../../data/mockTodaysVisits';
import {
  AICheckIcon,
  MicrophoneIcon,
  PauseRecordingIcon,
  PlayRecordingIcon,
  StopRecordingIcon,
  UploadIcon,
} from '../icons';
import { ScribeRecordingEmblem } from './ScribeRecordingEmblem';
import { ScribeReviewView } from './ScribeReviewView';
import type { ActiveScribeRecordingSession } from './scribeRecordingSession';
import { VISIT_NOTE_BUTTON_EXEMPT_CLASS } from '../../theme/buttonStyleConstants';
import { AppIconButton } from '../AppIconButton';

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

/**
 * Pixel height of the top/bottom fade gradients applied to the Scribe
 * scrollable content area. Kept small so the gradient feels like a soft mask
 * rather than a heavy overlay.
 */
const SCROLL_FADE_HEIGHT = 24;

/**
 * Wraps content in a flex-column scroll container with subtle gradient masks
 * pinned to the top and bottom of the visible area, so content visually fades
 * in and out of the scroll viewport. The gradients fade from the Scribe panel
 * background (`background.default`) to transparent.
 *
 * Place inside a flex-column parent (it claims `flex: 1; minHeight: 0`).
 */
function ScrollFadeArea({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: SCROLL_FADE_HEIGHT,
          background: (t) =>
            `linear-gradient(to bottom, ${t.palette.background.default} 0%, ${alpha(
              t.palette.background.default,
              0,
            )} 100%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: SCROLL_FADE_HEIGHT,
          background: (t) =>
            `linear-gradient(to top, ${t.palette.background.default} 0%, ${alpha(
              t.palette.background.default,
              0,
            )} 100%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </Box>
  );
}

interface CollapsibleCardProps {
  icon?: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  /** When true, the title gets the brand color (used by the AI summary card). */
  emphasizeTitle?: boolean;
  /** Override the title font-size (px). Defaults to 14. */
  titleFontSize?: number;
  /**
   * Max height (px) for the expanded body. When set, the body becomes
   * vertically scrollable once content exceeds this height so the card
   * itself stays a predictable size on screen.
   */
  maxBodyHeight?: number;
}

function CollapsibleCard({ icon, title, open, onToggle, children, emphasizeTitle, titleFontSize = 14, maxBodyHeight }: CollapsibleCardProps) {
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
        {icon ? (
          <Box sx={{ display: 'flex', alignItems: 'center', color: emphasizeTitle ? 'primary.main' : 'text.secondary' }}>
            {icon}
          </Box>
        ) : null}
        <Typography
          sx={{
            flex: 1,
            fontSize: titleFontSize,
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
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            ...(maxBodyHeight !== undefined && {
              maxHeight: maxBodyHeight,
              overflowY: 'auto',
            }),
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

interface MidVisitSummaryCardProps {
  summary: MockScribeMidVisitSummary;
  open: boolean;
  onToggle: () => void;
}

/**
 * Card surfaced while the recording is paused. Uses the same visual shell as
 * the Pre-visit Summary so the two AI surfaces feel like a pair: rounded
 * white card, soft shadow, brand-tinted header, with a left-rule subsection
 * for orders that the scribe has staged so far.
 */
function MidVisitSummaryCard({ summary, open, onToggle }: MidVisitSummaryCardProps) {
  return (
    <CollapsibleCard
      icon={<AICheckIcon sx={{ fontSize: 18 }} />}
      title="This visit so far…"
      open={open}
      onToggle={onToggle}
      emphasizeTitle
      maxBodyHeight={400}
    >
      <Box
        component="ul"
        sx={{
          m: 0,
          pl: 2.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        {summary.bullets.map((line) => (
          <Box
            key={line}
            component="li"
            sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.55 }}
          >
            {line}
          </Box>
        ))}
      </Box>

      {summary.orders.length > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
            Orders
          </Typography>
          <Box
            sx={{
              pl: 1.25,
              borderLeft: 2,
              borderColor: (t) => alpha(t.palette.text.secondary, 0.25),
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
            }}
          >
            {summary.orders.map((order) => (
              <Box
                key={order.name}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', lineHeight: 1.4 }}>
                    {order.name}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.4 }}>
                    {order.provider}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0, mt: 0.125 }}>
                  <IconButton
                    size="small"
                    aria-label={`Confirm order ${order.name}`}
                    sx={{ color: 'primary.main' }}
                  >
                    <CheckRounded sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label={`Remove order ${order.name}`}
                    sx={{ color: 'text.secondary' }}
                  >
                    <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </CollapsibleCard>
  );
}

interface PreVisitIdleViewProps {
  visit: MockScribeVisit;
  scheduleDate: Dayjs;
  onBeginRecording: () => void;
}

type PreVisitOpenCard = 'summary' | 'precharting' | null;

function PreVisitIdleView({ visit, scheduleDate, onBeginRecording }: PreVisitIdleViewProps) {
  // Only one card may be open at a time; opening one auto-collapses the other.
  const [openCard, setOpenCard] = useState<PreVisitOpenCard>('summary');
  const toggleCard = (card: Exclude<PreVisitOpenCard, null>) =>
    setOpenCard((current) => (current === card ? null : card));
  const [precharText, setPrecharText] = useState('');
  const [fastTranscription, setFastTranscription] = useState(false);

  const summary = useMemo(() => getPreVisitSummaryForVisit(visit), [visit]);
  const dateLabel = useMemo(() => formatVisitDate(scheduleDate), [scheduleDate]);

  return (
    <>
      <ScrollFadeArea>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            py: 2,
            // Centers content vertically when it fits, scrolls naturally
            // (top-anchored) when content exceeds the viewport.
            m: 'auto 0',
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
            open={openCard === 'summary'}
            onToggle={() => toggleCard('summary')}
            emphasizeTitle
            maxBodyHeight={400}
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
            title="Pre-charting Note (Optional)"
            open={openCard === 'precharting'}
            onToggle={() => toggleCard('precharting')}
            titleFontSize={13}
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
      </ScrollFadeArea>

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
            height: 48,
            minHeight: 48,
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
  /** Lifted session when this visit is recording, paused, processing, or in
   *  preview; null before Begin Recording or after Submit / Discard. */
  recordingForVisit: ActiveScribeRecordingSession | null;
  onBeginRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  /** Provider hit "Finish" — kicks off post-processing (loading state). */
  onFinishRecording: () => void;
  /** Cancel from inside the recording or paused state. */
  onCancelRecording: () => void;
  /** Provider hit "Submit to Chart" from the post-processed preview. */
  onSubmitToChart: () => void;
  /** Provider chose Discard from the preview's More Actions menu. */
  onDiscardPostProcessed: () => void;
  /** When true, render an inline close button alongside "Back to List" (used
   *  when the panel is presented as a compact-viewport overlay popover). */
  compact?: boolean;
  /** Invoked by the inline close button (compact mode only). */
  onClose?: () => void;
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
  onSubmitToChart,
  onDiscardPostProcessed,
  compact,
  onClose,
}: ScribeAppointmentViewProps) {
  const [mic, setMic] = useState('MacBook Pro Microphone');
  const [midVisitSummaryOpen, setMidVisitSummaryOpen] = useState(true);

  const phase = recordingForVisit ? recordingForVisit.phase : 'idle';
  const seconds = recordingForVisit?.seconds ?? 0;
  // The pulse animation is reserved for active recording. Processing reuses
  // the flower formation but keeps the breathing morph subtle so the user
  // perceives the AI is "thinking" rather than capturing audio.
  const emblemPhase = recordingForVisit?.phase === 'recording' ? 'pulse' : 'flower';
  const timerLabel = useMemo(() => formatTimer(seconds), [seconds]);
  const effectiveDate = scheduleDate ?? dayjs();
  const dateLabel = useMemo(() => formatVisitDate(effectiveDate), [effectiveDate]);
  const midVisitSummary = useMemo(() => getMidVisitSummaryForVisit(visit), [visit]);
  const postProcessedOutput = useMemo(() => getPostProcessedOutputForVisit(visit), [visit]);

  const handleMicChange = (e: SelectChangeEvent<string>) => setMic(e.target.value);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        px: 1.5,
        pb: 2,
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          pt: 0.5,
          pb: phase === 'idle' ? 0.5 : 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
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
        {compact && onClose && (
          <AppIconButton
            tooltip="Close"
            aria-label="Close panel"
            onClick={onClose}
            sx={{ color: 'text.secondary', flexShrink: 0 }}
          >
            <CloseOutlined sx={{ fontSize: 18 }} />
          </AppIconButton>
        )}
      </Box>

      {phase === 'idle' && (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <PreVisitIdleView
            visit={visit}
            scheduleDate={effectiveDate}
            onBeginRecording={onBeginRecording}
          />
        </Box>
      )}

      {phase === 'processing' && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0,
            textAlign: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 17, lineHeight: 1.3 }}>
            {visit.patientName}
          </Typography>
          <ScribeRecordingEmblem phase="flower" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16 }}>
              Generating note…
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 13, maxWidth: 220 }}>
              Post-processing the recording into a structured visit note.
            </Typography>
          </Box>
        </Box>
      )}

      {phase === 'preview' && (
        <ScribeReviewView
          visit={visit}
          output={postProcessedOutput}
          onSubmitToChart={onSubmitToChart}
          onDiscard={onDiscardPostProcessed}
        />
      )}

      {(phase === 'recording' || phase === 'paused') && (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ScrollFadeArea>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                py: phase === 'paused' ? 0 : 2,
                gap: phase === 'paused' ? 1.5 : 0,
                // Center vertically while recording; let the mid-visit summary
                // card sit at the top (and scroll) when paused.
                ...(phase !== 'paused' && { m: 'auto 0' }),
              }}
            >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                maxWidth: '100%',
                flexShrink: 0,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 17, lineHeight: 1.3 }}>
                {visit.patientName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  mt: 0.5,
                  mb: phase === 'paused' ? 0 : 2.5,
                  display: 'block',
                  fontSize: 12.5,
                }}
              >
                {visit.visitType}
              </Typography>
              {phase === 'paused' && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', fontSize: 12.5 }}
                >
                  {dateLabel} • {visit.time}
                </Typography>
              )}
            </Box>

            {phase === 'paused' && (
              <Box sx={{ flexShrink: 0 }}>
                <MidVisitSummaryCard
                  summary={midVisitSummary}
                  open={midVisitSummaryOpen}
                  onToggle={() => setMidVisitSummaryOpen((o) => !o)}
                />
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                maxWidth: '100%',
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: phase === 'paused' ? 0.5 : 1 }}>
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
          </ScrollFadeArea>

          <Box sx={{ width: '100%', flexShrink: 0, pt: 1, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {phase === 'recording' && (
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
                  startIcon={<PauseRecordingIcon />}
                  onClick={onPauseRecording}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    height: 48,
                    minHeight: 48,
                    borderRadius: '999px',
                    fontSize: 14,
                  }}
                >
                  Pause
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
                  startIcon={<StopRecordingIcon />}
                  onClick={onFinishRecording}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    height: 48,
                    minHeight: 48,
                    borderRadius: '999px',
                    fontSize: 14,
                  }}
                >
                  Finish
                </Button>
              </Box>
            )}

            {phase === 'paused' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <IconButton
                  className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
                  aria-label="Finish recording"
                  onClick={onFinishRecording}
                  sx={{
                    width: 48,
                    height: 48,
                    minWidth: 48,
                    minHeight: 48,
                    flexShrink: 0,
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                    },
                  }}
                >
                  <AssignmentTurnedInOutlined sx={{ fontSize: 20 }} />
                </IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
                  startIcon={<PlayRecordingIcon />}
                  onClick={onResumeRecording}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    height: 48,
                    minHeight: 48,
                    borderRadius: '999px',
                    fontSize: 14,
                  }}
                >
                  Resume
                </Button>
                <IconButton
                  className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
                  aria-label="Cancel recording"
                  onClick={onCancelRecording}
                  sx={{
                    width: 48,
                    height: 48,
                    minWidth: 48,
                    minHeight: 48,
                    flexShrink: 0,
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: (t) => alpha(t.palette.text.secondary, 0.4),
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
                    },
                  }}
                >
                  <DeleteOutlineRounded sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
