import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Button, SvgIcon, Popover, List, ListItemButton, Typography, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import StopRounded from '@mui/icons-material/StopRounded';
import { SearchIcon, MicrophoneIcon, SpeakingIcon } from '../icons';
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
const MAX_HISTORY = 10;

const PATH_LABELS: Record<string, string> = {
  '/': 'Home',
  '/visits': 'Visits',
  '/messages': 'Messages',
  '/patients': 'Patients',
  '/orders': 'Orders',
  '/pharmacies': 'Pharmacies',
  '/overview': 'Overview',
  '/lead-management': 'Lead Management',
  '/outreach': 'Outreach',
  '/reports': 'Reports',
  '/automations': 'Automations',
  '/claims': 'Claims',
  '/remittances': 'Remittances',
  '/eobs': 'EoBs',
  '/payments': 'Payments',
  '/statements': 'Statements',
  '/preferences': 'Preferences',
};

function getLabelForLocation(pathname: string, search: string): string {
  const patientMatch = pathname.match(/^\/patients\/([^/]+)$/);
  if (patientMatch) {
    const patient = MOCK_PATIENTS.find((p) => p.id === patientMatch[1]);
    const name = patient?.fullName ?? 'Patient profile';
    return search.includes('openNote=1') ? `${name} (Visit note)` : name;
  }
  return PATH_LABELS[pathname] ?? (pathname || 'Home');
}

function ArrowLeftIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M6.81066 11.25L11.5303 6.53033L10.5 5.5L4 12L10.5 18.5L11.5303 17.4697L6.81066 12.75H20V11.25H6.81066Z" />
    </SvgIcon>
  );
}

function ArrowRightIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M17.1893 12.75L12.4697 17.4697L13.5 18.5L20 12L13.5 5.5L12.4697 6.53033L17.1893 11.25H4V12.75H17.1893Z" />
    </SvgIcon>
  );
}

function HistoryIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M5.70976 8.25C7.04318 5.96362 9.20366 4.75 12 4.75C16.0858 4.75 19.25 7.91421 19.25 12C19.25 16.0858 16.0858 19.25 12 19.25C8.3771 19.25 5.48651 16.7639 4.87143 13.3664L3.39542 13.6336C4.13968 17.7447 7.65151 20.75 12 20.75C16.9142 20.75 20.75 16.9142 20.75 12C20.75 7.08579 16.9142 3.25 12 3.25C8.88327 3.25 6.37104 4.55955 4.75 6.95978V4H3.25V9.75H9V8.25H5.70976Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 12.9636V7.96355H12.75V12.5L15.3354 13.7927L14.6646 15.1344L11.6646 13.6344L11.25 12.9636Z"
      />
    </SvgIcon>
  );
}

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
  /** Called when the user clicks "Ask Athelas" (toggles AI Assistant panel). */
  onAskAthelasClick?: () => void;
  assistantOpen?: boolean;
  /** Called when the user clicks the search bar (opens spotlight search). */
  onSearchClick?: () => void;
}

export type NavHistoryEntry = { pathname: string; search: string; label: string };

export function HeaderBar({
  navCollapsed = false,
  onToggleNav,
  onDictateClick,
  dictateActive = false,
  onScribeClick,
  scribePanelOpen = false,
  onAskAthelasClick,
  assistantOpen = false,
  onSearchClick,
}: HeaderBarProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromBackRef = useRef(false);
  const askAthelasLottieRef = useRef<LottieRefCurrentProps | null>(null);
  const historyButtonRef = useRef<HTMLButtonElement>(null);
  const [canGoForward, setCanGoForward] = useState(false);
  const [navHistory, setNavHistory] = useState<NavHistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    const key = location.pathname + location.search;
    const label = getLabelForLocation(location.pathname, location.search);
    setNavHistory((prev) => {
      const filtered = prev.filter((e) => e.pathname + e.search !== key);
      const next = [...filtered, { pathname: location.pathname, search: location.search, label }];
      return next.slice(-MAX_HISTORY);
    });
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (cameFromBackRef.current) {
      setCanGoForward(true);
      cameFromBackRef.current = false;
    } else {
      setCanGoForward(false);
    }
  }, [location.key]);

  const handleBack = () => {
    cameFromBackRef.current = true;
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const handleHistoryItemClick = (pathname: string, search: string) => {
    navigate(pathname + search);
    setHistoryOpen(false);
  };

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
      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
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
        <IconButton
          size="small"
          aria-label="Back"
          onClick={handleBack}
          sx={{
            color: 'text.secondary',
            width: 28,
            height: 28,
            minHeight: 28,
            maxHeight: 28,
            borderRadius: '8px',
          }}
        >
          <ArrowLeftIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Forward"
          onClick={handleForward}
          disabled={!canGoForward}
          sx={{
            color: 'text.secondary',
            width: 28,
            height: 28,
            minHeight: 28,
            maxHeight: 28,
            borderRadius: '8px',
          }}
        >
          <ArrowRightIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton
          ref={historyButtonRef}
          size="small"
          aria-label="History"
          aria-haspopup="listbox"
          aria-expanded={historyOpen}
          onClick={() => setHistoryOpen((open) => !open)}
          sx={{
            color: 'text.secondary',
            width: 28,
            height: 28,
            minHeight: 28,
            maxHeight: 28,
            borderRadius: '8px',
          }}
        >
          <HistoryIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
      </Box>

      <Box
        component="button"
        type="button"
        onClick={onSearchClick}
        aria-label="Search"
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          zIndex: 1,
          transform: 'translate(-50%, -50%)',
          width: 360,
          height: 28,
          minHeight: 28,
          maxHeight: 28,
          display: 'flex',
          alignItems: 'center',
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

      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
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
        open={historyOpen}
        anchorEl={historyButtonRef.current}
        onClose={() => setHistoryOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { mt: 1, borderRadius: 2, minWidth: 260, maxWidth: 360 },
          },
        }}
      >
        <Box sx={{ py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              px: 2,
              py: 0.5,
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Recent places
          </Typography>
          {navHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
              No history yet. Navigate around the app to see recent places here.
            </Typography>
          ) : (
            <List dense disablePadding sx={{ maxHeight: 320, overflow: 'auto' }}>
              {[...navHistory].reverse().map((entry) => (
                <ListItemButton
                  key={`${entry.pathname}${entry.search}`}
                  onClick={() => handleHistoryItemClick(entry.pathname, entry.search)}
                  sx={{ py: 0.75 }}
                >
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {entry.label}
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </Box>
  );
}
