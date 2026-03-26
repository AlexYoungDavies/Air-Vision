import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Avatar, Button, SvgIcon, Popover, List, ListItemButton, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { SearchIcon } from '../icons';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import hoverAnimationData from '../../assets/hover.json';
import { MOCK_PATIENTS } from '../../data/mockPatients';

const lottieSlowSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

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
  /** Called when the user clicks "Ask Athelas" (toggles AI Assistant panel). */
  onAskAthelasClick?: () => void;
  /** Called when the user clicks the search bar (opens spotlight search). */
  onSearchClick?: () => void;
}

export type NavHistoryEntry = { pathname: string; search: string; label: string };

export function HeaderBar({ navCollapsed = false, onToggleNav, onAskAthelasClick, onSearchClick }: HeaderBarProps = {}) {
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        {onToggleNav && (
          <IconButton
            size="small"
            aria-label={navCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleNav}
            sx={{
              color: 'text.secondary',
              width: 28,
              height: 28,
              borderRadius: '9px',
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
            borderRadius: '9px',
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
            borderRadius: '9px',
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
            borderRadius: '9px',
          }}
        >
          <HistoryIcon sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
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

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <Box
          component="button"
          type="button"
          onClick={onSearchClick}
          aria-label="Search"
          sx={{
            width: 360,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            borderRadius: 1,
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
          <Box component="span" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Search for anything
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            borderRadius: '9px',
            bgcolor: 'grey.400',
            border: '1px solid',
            borderColor: 'divider',
            fontSize: '0.75rem',
          }}
        >
          P
        </Avatar>
        <Button
          variant="text"
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
            px: 1.25,
            py: 0.5,
            gap: 0,
            borderRadius: '9px',
            bgcolor: 'unset',
            background: 'unset',
            border: 'none',
            color: 'primary.main',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '24px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'unset',
              background: 'unset',
            },
          }}
        >
          Ask Athelas
        </Button>
      </Box>
    </Box>
  );
}
