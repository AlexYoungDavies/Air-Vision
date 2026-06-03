import { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  IconButton,
  Button,
  SvgIcon,
  Popover,
  List,
  ListItemButton,
  Typography,
  Tooltip,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import StopRounded from '@mui/icons-material/StopRounded';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import { SearchIcon, MicrophoneIcon, SpeakingIcon } from '../icons';
import { ScribeLiveActivityBar } from './ScribeLiveActivityBar';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import hoverAnimationData from '../../assets/hover.json';
import { MOCK_PATIENTS } from '../../data/mockPatients';
const lottieSlowSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const soundWavePulse = keyframes`
  0%,
  100% {
    transform: scaleY(0.35);
  }
  50% {
    transform: scaleY(1);
  }
`;

const DICTATE_TRANSITION_MS = 300;
/** Pl: 7px + wave ~20px + gap 6px + icon 22px + pr 5px */
const DICTATE_EXPANDED_MIN_WIDTH = 60;
const DICTATE_COLLAPSED_WIDTH = 28;

/** Scribe chip ↔ live activity morph (same timing as dictate). */
const SCRIBE_MORPH_MS = DICTATE_TRANSITION_MS;
const SCRIBE_SLOT_WIDTH_COLLAPSED = 90;
/** Initial expanded slot width before layout measure (avoids 0-width flash). */
const SCRIBE_LIVE_WIDTH_FALLBACK = 160;

/** Five bars, light-on-accent; sits inside the active dictation pill to the left of the mic/stop icon. */
function DictationSoundWaveBars({ active = true }: { active?: boolean }) {
  return (
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        height: 22,
        flexShrink: 0,
        pr: 0.25,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <Box
          key={i}
          sx={{
            width: 2,
            height: 12,
            borderRadius: 0.5,
            bgcolor: (theme) => alpha(theme.palette.primary.contrastText, 0.92),
            transformOrigin: 'center bottom',
            animation: active
              ? `${soundWavePulse} 0.55s ease-in-out infinite`
              : 'none',
            animationDelay: active ? `${i * 0.08}s` : undefined,
          }}
        />
      ))}
    </Box>
  );
}

const ICON_SIZE = 20;
const LOTTIE_SIZE = 22;

// ----- Header page-name (left of the collapse button) -----

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/visits': 'Visits',
  '/messages': 'Messages & Tasks',
  '/patients': 'Patients',
  '/orders': 'Orders',
  '/pharmacies': 'Pharmacies',
  '/overview': 'Overview',
  '/lead-management': 'Lead Management',
  '/outreach': 'Outreach',
  '/reports': 'Reports',
  '/automations': 'Automations',
  '/encounters': 'Automations',
  '/claims': 'Claims',
  '/remittances': 'Remittances',
  '/eobs': 'EoBs',
  '/payments': 'Payments',
  '/statements': 'Statements',
  '/preferences': 'Preferences',
};

function getPageLabel(pathname: string, search: string): string {
  const patientMatch = pathname.match(/^\/patients\/([^/]+)$/);
  if (patientMatch) {
    const patient = MOCK_PATIENTS.find((p) => p.id === patientMatch[1]);
    const name = patient?.fullName ?? 'Patient profile';
    return search.includes('openNote=1') ? `${name} · Visit note` : name;
  }
  return PAGE_LABELS[pathname] ?? 'Page';
}

// ----- Notifications popover mock data -----

type NotificationTabId = 'general' | 'request-center' | 'messages' | 'tasks' | 'medications';

const NOTIFICATION_TABS: { id: NotificationTabId; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'request-center', label: 'Request Center' },
  { id: 'messages', label: 'Messages' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'medications', label: 'Medications' },
];

interface NotificationItem {
  id: string;
  title: string;
  subtitle?: string;
  time: string;
  unread?: boolean;
}

const MOCK_NOTIFICATIONS: Record<NotificationTabId, NotificationItem[]> = {
  general: [
    {
      id: 'g1',
      title: 'Weekly digest is ready',
      subtitle: '14 charts signed · 3 outstanding from last week.',
      time: '8m',
      unread: true,
    },
    {
      id: 'g2',
      title: 'EHR sync completed',
      subtitle: '4 patients refreshed from the Athelas data layer.',
      time: '1h',
      unread: true,
    },
    {
      id: 'g3',
      title: 'New release · scribe orders',
      subtitle: 'Captured orders now flow into your home Tasks list.',
      time: 'Yesterday',
    },
  ],
  'request-center': [
    {
      id: 'r1',
      title: 'Insurance verification needed',
      subtitle: 'Front desk flagged Jennifer Davis ahead of her 2:30 visit.',
      time: '12m',
      unread: true,
    },
    {
      id: 'r2',
      title: 'Records request from Bay Area Cardiology',
      subtitle: 'Requesting last 12 months for Michael Chen.',
      time: '1h',
    },
    {
      id: 'r3',
      title: 'PA appeal queued',
      subtitle: 'Aimovig 70 mg for Sarah Johnson — denial received.',
      time: 'Yesterday',
    },
  ],
  messages: [
    {
      id: 'm1',
      title: 'Anya Patel sent you a message',
      subtitle: '"Hi Dr. Garcia — quick question about my refill…"',
      time: '5m',
      unread: true,
    },
    {
      id: 'm2',
      title: 'Maria L. replied in "Lipid panel review"',
      subtitle: 'Tagged you and shared the latest labs.',
      time: '32m',
      unread: true,
    },
    {
      id: 'm3',
      title: 'Care team thread updated',
      subtitle: 'New comment from Dr. Lee on the post-op plan.',
      time: 'Yesterday',
    },
  ],
  tasks: [
    {
      id: 't1',
      title: 'Approve medication refill',
      subtitle: 'Sertraline 50 mg · Michael Chen',
      time: 'Today',
      unread: true,
    },
    {
      id: 't2',
      title: 'Sign off on PT referral',
      subtitle: 'OrthoPT Group · 12 visits / 8 weeks',
      time: 'Tomorrow',
    },
    {
      id: 't3',
      title: 'Review lab results',
      subtitle: "Michael Chen's HbA1c trending up to 7.6%.",
      time: 'Today',
    },
  ],
  medications: [
    {
      id: 'rx1',
      title: 'Refill request: Sertraline 50 mg',
      subtitle: 'Michael Chen · via patient portal.',
      time: 'Today',
      unread: true,
    },
    {
      id: 'rx2',
      title: 'PA approved: Ozempic 1 mg',
      subtitle: 'Jennifer Davis · ready to send to pharmacy.',
      time: '12m',
    },
    {
      id: 'rx3',
      title: 'Pharmacy callback',
      subtitle: 'Walgreens needs SIG clarification for Lisinopril 20 mg — David Lee.',
      time: '1h',
    },
  ],
};

function LeftPanelIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.6 3.00024C16.8402 3.00024 17.9603 3.00024 18.816 3.43622C19.5686 3.81971 20.1805 4.43163 20.564 5.18428C21 6.03993 21 7.16003 21 9.40024V14.6002C21 16.8405 21 17.9606 20.564 18.8162C20.1805 19.5689 19.5686 20.1808 18.816 20.5643C17.9603 21.0002 16.8402 21.0002 14.6 21.0002H9.4C7.15979 21.0002 6.03969 21.0002 5.18404 20.5643C4.43139 20.1808 3.81947 19.5689 3.43597 18.8162C3 17.9606 3 16.8405 3 14.6002V9.40024C3 7.16003 3 6.03993 3.43597 5.18428C3.81947 4.43163 4.43139 3.81971 5.18404 3.43622C6.03969 3.00024 7.15979 3.00024 9.4 3.00024H14.6ZM7.625 4.50024C7.04418 4.50024 6.75377 4.50024 6.51227 4.54828C5.52055 4.74555 4.7453 5.52079 4.54804 6.51252C4.5 6.75402 4.5 7.04443 4.5 7.62524V16.3752C4.5 16.9561 4.5 17.2465 4.54804 17.488C4.7453 18.4797 5.52055 19.2549 6.51227 19.4522C6.75377 19.5002 7.04418 19.5002 7.625 19.5002C7.74116 19.5002 7.79925 19.5002 7.84755 19.4906C8.04589 19.4512 8.20094 19.2961 8.24039 19.0978C8.25 19.0495 8.25 18.9914 8.25 18.8752L8.25 5.12524C8.25 5.00908 8.25 4.951 8.24039 4.9027C8.20094 4.70435 8.04589 4.5493 7.84755 4.50985C7.79925 4.50024 7.74116 4.50024 7.625 4.50024ZM10.55 4.50024C10.27 4.50024 10.13 4.50024 10.023 4.55474C9.92892 4.60268 9.85243 4.67917 9.8045 4.77325C9.75 4.8802 9.75 5.02022 9.75 5.30024L9.75 18.7002C9.75 18.9803 9.75 19.1203 9.8045 19.2272C9.85243 19.3213 9.92892 19.3978 10.023 19.4457C10.13 19.5002 10.27 19.5002 10.55 19.5002H15.5C16.9001 19.5002 17.6002 19.5002 18.135 19.2278C18.6054 18.9881 18.9878 18.6056 19.2275 18.1352C19.5 17.6004 19.5 16.9004 19.5 15.5002V8.50024C19.5 7.10011 19.5 6.40005 19.2275 5.86527C18.9878 5.39486 18.6054 5.01241 18.135 4.77273C17.6002 4.50024 16.9001 4.50024 15.5 4.50024H10.55Z"
      />
    </SvgIcon>
  );
}

export interface HeaderBarProps {
  navCollapsed?: boolean;
  onToggleNav?: () => void;
  /** Toggles dictation mode (visual only in demo). */
  onDictateClick?: () => void;
  dictateActive?: boolean;
  /** Toggles Scribe “today’s visits” panel. */
  onScribeClick?: () => void;
  scribePanelOpen?: boolean;
  /** When set, replaces the Scribe chip with the in-progress recording bar (panel closed / away from recording view). */
  scribeLiveActivity?: {
    phase: 'recording' | 'paused';
    seconds: number;
    onPause: () => void;
    onResume: () => void;
    onFinish: () => void;
    onNavigateToRecording: () => void;
  } | null;
  /** Called when the user clicks "Ask Athelas" (toggles AI Assistant panel). */
  onAskAthelasClick?: () => void;
  assistantOpen?: boolean;
  /** Called when the user clicks the search bar (opens spotlight search). */
  onSearchClick?: () => void;
}

export function HeaderBar({
  navCollapsed = false,
  onToggleNav,
  onDictateClick,
  dictateActive = false,
  onScribeClick,
  scribePanelOpen = false,
  scribeLiveActivity = null,
  onAskAthelasClick,
  assistantOpen = false,
  onSearchClick,
}: HeaderBarProps = {}) {
  const location = useLocation();
  const pageLabel = getPageLabel(location.pathname, location.search);
  const askAthelasLottieRef = useRef<LottieRefCurrentProps | null>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<NotificationTabId>('general');

  const hasUnreadNotifications = useMemo(
    () => Object.values(MOCK_NOTIFICATIONS).some((items) => items.some((n) => n.unread)),
    [],
  );

  type ScribeLiveSlotProps = NonNullable<HeaderBarProps['scribeLiveActivity']>;
  const scribeLiveSnapshotRef = useRef<ScribeLiveSlotProps | null>(null);
  if (scribeLiveActivity) {
    scribeLiveSnapshotRef.current = scribeLiveActivity;
  }
  const [scribeLiveMounted, setScribeLiveMounted] = useState(false);

  useLayoutEffect(() => {
    if (scribeLiveActivity) {
      setScribeLiveMounted(true);
    } else {
      const t = window.setTimeout(() => setScribeLiveMounted(false), SCRIBE_MORPH_MS);
      return () => window.clearTimeout(t);
    }
  }, [scribeLiveActivity]);

  const scribeSlotExpanded = Boolean(scribeLiveActivity);
  const liveBarProps = scribeLiveActivity ?? scribeLiveSnapshotRef.current;

  const scribeLiveBarRef = useRef<HTMLDivElement>(null);
  const [scribeLiveMeasuredWidth, setScribeLiveMeasuredWidth] = useState(SCRIBE_LIVE_WIDTH_FALLBACK);

  useLayoutEffect(() => {
    if (!liveBarProps || !(scribeLiveActivity || scribeLiveMounted)) return;
    const el = scribeLiveBarRef.current;
    if (!el) return;
    const w = Math.ceil(el.getBoundingClientRect().width);
    if (w > 0) setScribeLiveMeasuredWidth(w);
  }, [scribeLiveActivity, scribeLiveMounted, liveBarProps, liveBarProps?.seconds, liveBarProps?.phase]);

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        width: '100%',
        height: 'fit-content',
        pl: 1,
        pr: 1,
        pt: 0.5,
        pb: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0px', flexShrink: 0 }}>
        {onToggleNav && (
          <IconButton
            size="small"
            aria-label={navCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleNav}
            sx={{
              color: 'text.secondary',
              width: 28,
              height: 28,
              minHeight: 28,
              maxHeight: 28,
              borderRadius: '8px',
            }}
          >
            <LeftPanelIcon
              sx={{
                fontSize: ICON_SIZE,
                ...(navCollapsed && { transform: 'scaleX(-1)' }),
              }}
            />
          </IconButton>
        )}
        <Typography
          sx={{
            ml: 1,
            fontSize: 15,
            fontWeight: 500,
            color: 'text.primary',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 260,
          }}
        >
          {pageLabel}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          zIndex: 1,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Tooltip title="Notifications">
          <IconButton
            ref={notificationsButtonRef}
            size="small"
            aria-label="Notifications"
            aria-haspopup="dialog"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((open) => !open)}
            sx={{
              color: 'text.secondary',
              width: 28,
              height: 28,
              minHeight: 28,
              maxHeight: 28,
              borderRadius: '8px',
            }}
          >
            <Badge
              variant="dot"
              invisible={!hasUnreadNotifications}
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: 'error.main',
                  minWidth: 8,
                  height: 8,
                  borderRadius: '50%',
                  border: (theme) => `2px solid ${theme.palette.background.paper}`,
                  top: 3,
                  right: 3,
                },
              }}
            >
              <NotificationsNoneOutlined sx={{ fontSize: ICON_SIZE }} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Box
          component="button"
          type="button"
          onClick={onSearchClick}
          aria-label="Search"
          sx={{
            width: 360,
            height: 28,
            minHeight: 28,
            maxHeight: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            px: 1.5,
            borderRadius: '8px',
            border: 'none',
            bgcolor: 'action.hover',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'text.secondary',
            fontSize: 14,
            '&:hover': {
              bgcolor: 'action.selected',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineOffset: 2,
              outlineColor: 'primary.main',
            },
          }}
        >
          <SearchIcon sx={{ fontSize: ICON_SIZE, color: 'text.disabled', flexShrink: 0 }} />
          <Box
            component="span"
            sx={{
              width: 'fit-content',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Search for anything
          </Box>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Tooltip title={dictateActive ? 'Stop dictation' : 'Dictate'}>
            <Box
              component="button"
              type="button"
              onClick={onDictateClick}
              aria-label={dictateActive ? 'Stop dictation' : 'Dictate'}
              sx={{
                flexShrink: 0,
                p: 0,
                border: 'none',
                borderRadius: '8px',
                boxSizing: 'border-box',
                minHeight: 28,
                maxHeight: 28,
                height: 28,
                minWidth: dictateActive ? DICTATE_EXPANDED_MIN_WIDTH : DICTATE_COLLAPSED_WIDTH,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pl: dictateActive ? 0.875 : 0.375,
                pr: dictateActive ? 0.625 : 0.375,
                gap: dictateActive ? '6px' : '0px',
                bgcolor: dictateActive ? 'primary.main' : 'transparent',
                color: dictateActive ? 'primary.contrastText' : 'primary.main',
                transition: (theme) =>
                  theme.transitions.create(
                    ['min-width', 'padding-left', 'padding-right', 'background-color', 'color', 'gap'],
                    {
                      duration: DICTATE_TRANSITION_MS,
                      easing: theme.transitions.easing.easeInOut,
                    },
                  ),
                '&:hover': {
                  bgcolor: dictateActive ? 'primary.dark' : 'action.hover',
                },
                ...(dictateActive && {
                  '&:hover .dictate-recording-layer': { opacity: 0 },
                  '&:hover .dictate-stop-layer': { opacity: 1 },
                }),
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineOffset: 2,
                  outlineColor: 'primary.main',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  minWidth: 0,
                  flexShrink: 0,
                  maxWidth: dictateActive ? 40 : 0,
                  opacity: dictateActive ? 1 : 0,
                  transition: (theme) =>
                    theme.transitions.create(['max-width', 'opacity'], {
                      duration: DICTATE_TRANSITION_MS,
                      easing: theme.transitions.easing.easeInOut,
                    }),
                }}
              >
                <DictationSoundWaveBars active={dictateActive} />
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  width: 22,
                  height: 22,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  className="dictate-recording-layer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.12s ease-out',
                  }}
                >
                  <SpeakingIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box
                  className="dictate-stop-layer"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.12s ease-out',
                  }}
                >
                  <StopRounded sx={{ fontSize: 20 }} />
                </Box>
              </Box>
            </Box>
          </Tooltip>
        </Box>
        <Box
          sx={{
            position: 'relative',
            height: 28,
            width: scribeSlotExpanded ? scribeLiveMeasuredWidth : SCRIBE_SLOT_WIDTH_COLLAPSED,
            flexShrink: 0,
            overflow: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: SCRIBE_MORPH_MS,
                easing: theme.transitions.easing.easeInOut,
              }),
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 1,
              width: SCRIBE_SLOT_WIDTH_COLLAPSED,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              opacity: scribeSlotExpanded ? 0 : 1,
              pointerEvents: scribeSlotExpanded ? 'none' : 'auto',
              transition: (theme) =>
                theme.transitions.create('opacity', {
                  duration: SCRIBE_MORPH_MS,
                  easing: theme.transitions.easing.easeInOut,
                }),
            }}
          >
            <Button
              variant="text"
              size="small"
              onClick={onScribeClick}
              startIcon={<MicrophoneIcon />}
              sx={{
                height: 28,
                minHeight: 28,
                maxHeight: 28,
                px: 1.25,
                py: 0,
                gap: '6px',
                minWidth: 0,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1,
                color: 'primary.main',
                bgcolor: scribePanelOpen ? (theme) => alpha(theme.palette.primary.main, 0.15) : 'transparent',
                border: 'none',
                boxShadow: 'none',
                '& .MuiButton-startIcon': {
                  margin: 0,
                  '& .MuiSvgIcon-root': { fontSize: 20 },
                },
                '&:hover': {
                  bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, scribePanelOpen ? 0.22 : 0.1),
                  boxShadow: 'none',
                },
              }}
            >
              Scribe
            </Button>
          </Box>
          {liveBarProps && (scribeLiveActivity || scribeLiveMounted) ? (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 2,
                width: 'max-content',
                height: 28,
                display: 'flex',
                alignItems: 'center',
                opacity: scribeSlotExpanded ? 1 : 0,
                pointerEvents: scribeSlotExpanded ? 'auto' : 'none',
                transition: (theme) =>
                  theme.transitions.create('opacity', {
                    duration: SCRIBE_MORPH_MS,
                    easing: theme.transitions.easing.easeInOut,
                  }),
              }}
            >
              <ScribeLiveActivityBar
                ref={scribeLiveBarRef}
                phase={liveBarProps.phase}
                seconds={liveBarProps.seconds}
                onPause={liveBarProps.onPause}
                onResume={liveBarProps.onResume}
                onFinish={liveBarProps.onFinish}
                onNavigateToRecording={liveBarProps.onNavigateToRecording}
              />
            </Box>
          ) : null}
        </Box>
        <Button
          variant="text"
          size="small"
          onClick={onAskAthelasClick}
          startIcon={
            <Box
              component="span"
              sx={{
                width: LOTTIE_SIZE,
                height: LOTTIE_SIZE,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${lottieSlowSpin} 20s linear infinite`,
                '& > div': { width: LOTTIE_SIZE, height: LOTTIE_SIZE },
              }}
            >
              <Lottie
                lottieRef={askAthelasLottieRef}
                animationData={hoverAnimationData}
                loop={false}
                autoplay={false}
                onDOMLoaded={() => {
                  askAthelasLottieRef.current?.goToAndStop(0, true);
                }}
                style={{ width: LOTTIE_SIZE, height: LOTTIE_SIZE }}
                rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
              />
            </Box>
          }
          onMouseEnter={() => {
            askAthelasLottieRef.current?.setDirection(1);
            askAthelasLottieRef.current?.play();
          }}
          onMouseLeave={() => {
            askAthelasLottieRef.current?.setDirection(-1);
            askAthelasLottieRef.current?.play();
          }}
          sx={{
            height: 28,
            minHeight: 28,
            maxHeight: 28,
            px: '8px',
            py: 0,
            gap: '6px',
            borderRadius: '8px',
            bgcolor: assistantOpen ? (theme) => alpha(theme.palette.primary.main, 0.12) : 'transparent',
            border: 'none',
            color: 'primary.main',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1,
            textTransform: 'none',
            boxShadow: 'none',
            '& .MuiButton-startIcon': { margin: 0 },
            '&:hover': {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, assistantOpen ? 0.18 : 0.08),
              boxShadow: 'none',
            },
          }}
        >
          Ask Athelas
        </Button>
      </Box>

      <Popover
        open={notificationsOpen}
        anchorEl={notificationsButtonRef.current}
        onClose={() => setNotificationsOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              width: 380,
              maxWidth: 'calc(100vw - 32px)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 1.25,
            pb: 0.75,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
            Notifications
          </Typography>
          <Button
            size="small"
            variant="text"
            sx={{
              textTransform: 'none',
              fontSize: 12,
              fontWeight: 500,
              minWidth: 0,
              px: 0.75,
              color: 'text.secondary',
              '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
            }}
          >
            Mark all read
          </Button>
        </Box>
        <Tabs
          value={activeNotificationTab}
          onChange={(_, v: NotificationTabId) => setActiveNotificationTab(v)}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            px: 1,
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              py: 0.5,
              px: 1.25,
              textTransform: 'none',
              fontSize: 12,
              fontWeight: 500,
              color: 'text.secondary',
            },
            '& .Mui-selected': { color: 'primary.main', fontWeight: 600 },
          }}
        >
          {NOTIFICATION_TABS.map(({ id, label }) => (
            <Tab key={id} value={id} label={label} />
          ))}
        </Tabs>
        <NotificationsTabPanel items={MOCK_NOTIFICATIONS[activeNotificationTab]} />
      </Popover>
    </Box>
  );
}

function NotificationsTabPanel({ items }: { items: NotificationItem[] }) {
  if (items.length === 0) {
    return (
      <Box sx={{ px: 2, py: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography sx={{ fontSize: 13 }}>You're all caught up.</Typography>
      </Box>
    );
  }
  return (
    <List dense disablePadding sx={{ maxHeight: 360, overflow: 'auto', py: 0.5 }}>
      {items.map((item) => (
        <ListItemButton
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.25,
            py: 1,
            px: 2,
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: 8,
              height: 8,
              mt: '6px',
              borderRadius: '50%',
              bgcolor: item.unread ? 'primary.main' : 'transparent',
              border: (theme) =>
                item.unread ? 'none' : `1px solid ${theme.palette.divider}`,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: item.unread ? 600 : 500,
                color: 'text.primary',
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </Typography>
            {item.subtitle && (
              <Typography
                sx={{
                  fontSize: 12,
                  color: 'text.secondary',
                  lineHeight: 1.35,
                  mt: 0.25,
                  whiteSpace: 'normal',
                }}
              >
                {item.subtitle}
              </Typography>
            )}
          </Box>
          <Typography
            sx={{
              flexShrink: 0,
              fontSize: 11,
              color: 'text.secondary',
              mt: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            {item.time}
          </Typography>
        </ListItemButton>
      ))}
    </List>
  );
}
