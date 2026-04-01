import { useState, type ComponentProps, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  SvgIcon,
  Button,
  Popover,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import PauseRounded from '@mui/icons-material/PauseRounded';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import { AppIconButton } from '../AppIconButton';
import {
  MOCK_SCRIBE_VISITS,
  type MockScribeVisit,
  type ScribeVisitRowStatus,
} from '../../data/mockTodaysVisits';
import type { ActiveScribeRecordingSession } from './scribeRecordingSession';
import { ACCENT_PRIMARY_PALETTES } from '../../theme/accents';
import { ScribeAppointmentView } from './ScribeAppointmentView';

const PANEL_WIDTH = 280;

const scribeVisitListSx = {
  pt: 0,
  px: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
} as const;

/** Cassette (cached recordings) — from design asset */
function CassetteIcon(props: ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: 20, flexShrink: 0, ...props.sx }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 7.5C19.9853 7.5 22 9.51472 22 12C22 14.4853 19.9853 16.5 17.5 16.5H6.5C4.01472 16.5 2 14.4853 2 12C2 9.51472 4.01472 7.5 6.5 7.5C8.98528 7.5 11 9.51472 11 12C11 12.8316 10.7742 13.6104 10.3808 14.2787C10.218 14.5552 10.1366 14.6935 10.1447 14.7747C10.1524 14.8524 10.1829 14.9058 10.246 14.9519C10.3119 15 10.4574 15 10.7485 15H13.2515C13.5426 15 13.6881 15 13.754 14.9519C13.8171 14.9058 13.8476 14.8524 13.8553 14.7747C13.8634 14.6935 13.782 14.5552 13.6192 14.2787C13.2258 13.6104 13 12.8316 13 12C13 9.51472 15.0147 7.5 17.5 7.5ZM6.5 9C4.84315 9 3.5 10.3431 3.5 12C3.5 13.6569 4.84315 15 6.5 15C8.15685 15 9.5 13.6569 9.5 12C9.5 10.3431 8.15685 9 6.5 9ZM17.5 9C15.8431 9 14.5 10.3431 14.5 12C14.5 13.6569 15.8431 15 17.5 15C19.1569 15 20.5 13.6569 20.5 12C20.5 10.3431 19.1569 9 17.5 9Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

/** Four o'clock — upcoming visits */
function FourOClockAltIcon(props: ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: 18, flexShrink: 0, ...props.sx }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M11.25 7.25V12.1057C11.25 12.3635 11.3218 12.6161 11.4573 12.8354C11.5928 13.0547 11.7867 13.2319 12.0173 13.3472L13.9938 14.3354C14.3643 14.5207 14.8148 14.3705 15 14C15.1852 13.6295 15.0351 13.179 14.6646 12.9938L13.096 12.2095C13.0288 12.1759 12.9952 12.1591 12.9664 12.1393C12.8511 12.0598 12.7743 11.9356 12.7549 11.7969C12.75 11.7624 12.75 11.7248 12.75 11.6496V7.25C12.75 6.83579 12.4142 6.5 12 6.5C11.5858 6.5 11.25 6.83579 11.25 7.25Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

/** Warning box — action pending */
function WarningBoxIcon(props: ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: 18, flexShrink: 0, ...props.sx }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.04735 11.2313C3.07231 14.4218 2.08479 16.017 2.19452 17.3325C2.29018 18.4793 2.87511 19.5293 3.79983 20.2143C4.8606 21 6.73675 21 10.489 21H13.5111C17.2634 21 19.1395 21 20.2003 20.2143C21.125 19.5293 21.71 18.4793 21.8056 17.3325C21.9154 16.017 20.9278 14.4218 18.9528 11.2313L17.4418 8.79042C15.6395 5.87912 14.7384 4.42347 13.582 3.92554C12.5722 3.49072 11.4279 3.49072 10.4181 3.92554C9.26173 4.42347 8.36061 5.87912 6.55838 8.79042L5.04735 11.2313ZM5.54199 13.2453C4.25671 15.2855 3.61406 16.3057 3.67966 17.148C3.73685 17.8822 4.10863 18.5558 4.69935 18.9955C5.37708 19.5 6.58276 19.5 8.9941 19.5H15.0061C17.4174 19.5 18.6231 19.5 19.3008 18.9955C19.8915 18.5558 20.2633 17.8822 20.3205 17.148C20.3861 16.3057 19.7434 15.2855 18.4582 13.2453L15.4522 8.47363C14.3063 6.65464 13.7333 5.74514 13.0012 5.43261C12.3617 5.15963 11.6385 5.15963 10.999 5.43261C10.2668 5.74514 9.69387 6.65463 8.54797 8.47362L5.54199 13.2453Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0001 18C11.5859 18 11.2501 17.6642 11.2501 17.25C11.2501 16.8358 11.5859 16.5 12.0001 16.5C12.4143 16.5 12.7501 16.8358 12.7501 17.25C12.7501 17.6642 12.4143 18 12.0001 18Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0001 8.99999C12.4143 8.99999 12.7501 9.33577 12.7501 9.74999V13.75C12.7501 14.1642 12.4143 14.5 12.0001 14.5C11.5859 14.5 11.2501 14.1642 11.2501 13.75V9.74999C11.2501 9.33577 11.5859 8.99999 12.0001 8.99999Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

/** Check box alt — completed */
function CheckBoxAltIcon(props: ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" sx={{ fontSize: 18, flexShrink: 0, ...props.sx }}>
      <path
        d="M3 9.40018C3 7.15997 3 6.03987 3.43597 5.18422C3.81947 4.43157 4.43139 3.81965 5.18404 3.43616C6.03969 3.00018 7.15979 3.00018 9.4 3.00018H15.25C15.6642 3.00018 16 3.33597 16 3.75018C16 4.1644 15.6642 4.50018 15.25 4.50018H8.5C7.09987 4.50018 6.3998 4.50018 5.86502 4.77267C5.39462 5.01235 5.01217 5.3948 4.77248 5.86521C4.5 6.39999 4.5 7.10005 4.5 8.50018V15.5002C4.5 16.9003 4.5 17.6004 4.77248 18.1352C5.01217 18.6056 5.39462 18.988 5.86502 19.2277C6.3998 19.5002 7.09987 19.5002 8.5 19.5002H15.5C16.9001 19.5002 17.6002 19.5002 18.135 19.2277C18.6054 18.988 18.9878 18.6056 19.2275 18.1352C19.5 17.6004 19.5 16.9003 19.5 15.5002V11.7502C19.5 11.336 19.8358 11.0002 20.25 11.0002C20.6642 11.0002 21 11.336 21 11.7502V14.6002C21 16.8404 21 17.9605 20.564 18.8161C20.1805 19.5688 19.5686 20.1807 18.816 20.5642C17.9603 21.0002 16.8402 21.0002 14.6 21.0002H9.4C7.15979 21.0002 6.03969 21.0002 5.18404 20.5642C4.43139 20.1807 3.81947 19.5688 3.43597 18.8161C3 17.9605 3 16.8404 3 14.6002V9.40018Z"
        fill="currentColor"
      />
      <path
        d="M10.8687 13.9295C11.2647 14.3255 11.4627 14.5235 11.691 14.5977C11.8919 14.6629 12.1082 14.6629 12.3091 14.5977C12.5374 14.5235 12.7354 14.3255 13.1314 13.9295L20.5001 6.56084C20.7929 6.26795 20.7929 5.79307 20.5001 5.50018C20.2072 5.20729 19.7323 5.20729 19.4394 5.50018L12.2829 12.6567C12.1839 12.7557 12.1344 12.8052 12.0773 12.8237C12.0271 12.84 11.973 12.84 11.9228 12.8237C11.8657 12.8052 11.8162 12.7557 11.7172 12.6567L9.56072 10.5002C9.26782 10.2073 8.79295 10.2073 8.50006 10.5002C8.20716 10.7931 8.20716 11.2679 8.50006 11.5608L10.8687 13.9295Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function formatDateHeader(d: Dayjs): string {
  const weekday = d.format('ddd');
  const month = d.format('MMM');
  const day = d.date();
  const ord =
    day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  return `${weekday} ${month} ${day}${ord}`;
}

function RowStatusChip({ status }: { status: ScribeVisitRowStatus }) {
  if (status === 'starting') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
        <AccessTimeOutlined sx={{ fontSize: 16 }} />
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12, lineHeight: 1.2 }}>
          Starting
        </Typography>
      </Box>
    );
  }
  if (status === 'paused') {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          px: 0.75,
          py: 0.125,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'primary.main',
          color: 'primary.main',
        }}
      >
        <PauseRounded sx={{ fontSize: 14 }} />
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 11, lineHeight: 1.2 }}>
          Paused
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
      <DescriptionOutlined sx={{ fontSize: 16 }} />
      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12, lineHeight: 1.2 }}>
        Review
      </Typography>
    </Box>
  );
}

function VisitRow({ visit, onSelect }: { visit: MockScribeVisit; onSelect: (visit: MockScribeVisit) => void }) {
  const stripe = ACCENT_PRIMARY_PALETTES[visit.stripeAccent].main;
  const showStatus = visit.rowStatus && visit.group !== 'completed';

  return (
    <ListItemButton
      onClick={() => onSelect(visit)}
      aria-label={`Open scribe recording for ${visit.patientName}`}
      sx={{
        alignItems: 'stretch',
        gap: 0,
        borderRadius: '6px',
        pt: 0.5,
        pb: 0.5,
        pl: 0.5,
        pr: 0,
        overflow: 'hidden',
        bgcolor: 'transparent',
        border: 'none',
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
          borderRadius: '4px',
          mr: 1.25,
          ml: 0,
        }}
      />
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          pr: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 0,
        }}
      >
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {visit.patientName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {visit.visitType}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {visit.time}
          </Typography>
          {showStatus && visit.rowStatus && <RowStatusChip status={visit.rowStatus} />}
        </Box>
      </Box>
    </ListItemButton>
  );
}

interface CollapsibleGroupProps {
  title: string;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleGroup({ title, icon, open, onToggle, children }: CollapsibleGroupProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4, px: 1 }}>
      <Box
        component="button"
        type="button"
        onClick={onToggle}
        sx={{
          width: '100%',
          height: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          border: 'none',
          bgcolor: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
          p: 0,
          m: 0,
          font: 'inherit',
          color: 'inherit',
          borderRadius: 0,
          boxSizing: 'border-box',
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: '0 1 auto' }}>
          <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>{icon}</Box>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', letterSpacing: 0.01 }}
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0, marginLeft: 'auto' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {open ? 'Hide' : 'Show'}
          </Typography>
          <ExpandMoreOutlined
            sx={{
              fontSize: 18,
              color: 'text.secondary',
              transition: (theme) => theme.transitions.create('transform', { duration: 200 }),
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Box>
      </Box>
      {open ? children : null}
    </Box>
  );
}

export interface ScribePanelProps {
  selectedVisit: MockScribeVisit | null;
  onSelectedVisitChange: (visit: MockScribeVisit | null) => void;
  activeRecording: ActiveScribeRecordingSession | null;
  onActiveRecordingChange: Dispatch<SetStateAction<ActiveScribeRecordingSession | null>>;
}

export function ScribePanel({
  selectedVisit,
  onSelectedVisitChange,
  activeRecording,
  onActiveRecordingChange,
}: ScribePanelProps) {
  const [scheduleDate, setScheduleDate] = useState<Dayjs>(() => dayjs().startOf('day'));
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null);
  const datePickerOpen = Boolean(datePickerAnchor);
  const [openUpcoming, setOpenUpcoming] = useState(true);
  const [openAction, setOpenAction] = useState(true);
  const [openCompleted, setOpenCompleted] = useState(false);

  const upcoming = MOCK_SCRIBE_VISITS.filter((v) => v.group === 'upcoming');
  const action = MOCK_SCRIBE_VISITS.filter((v) => v.group === 'action');
  const completed = MOCK_SCRIBE_VISITS.filter((v) => v.group === 'completed');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
      {/* Header: date picker + day nudgers | cached recordings (list view only) */}
      {!selectedVisit && (
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 0,
            py: 1.5,
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0, flex: 1 }}>
            <Button
              variant="text"
              size="small"
              aria-haspopup="dialog"
              aria-expanded={datePickerOpen}
              aria-label={`Scribe schedule date, ${scheduleDate.format('dddd, MMMM D, YYYY')}. Open calendar`}
              onClick={(e) => setDatePickerAnchor(e.currentTarget)}
              sx={{
                minWidth: 0,
                maxWidth: '100%',
                px: '6px',
                py: 0.25,
                color: 'text.primary',
                fontWeight: 700,
                fontSize: 15,
                textTransform: 'none',
                lineHeight: 1.25,
              }}
            >
              {formatDateHeader(scheduleDate)}
            </Button>
            <Popover
              open={datePickerOpen}
              anchorEl={datePickerAnchor}
              onClose={() => setDatePickerAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              slotProps={{
                paper: {
                  elevation: 8,
                  sx: { mt: 0.5, borderRadius: 2, overflow: 'hidden' },
                },
              }}
            >
              <DateCalendar
                value={scheduleDate}
                onChange={(value) => {
                  if (value) {
                    setScheduleDate(value.startOf('day'));
                    setDatePickerAnchor(null);
                  }
                }}
              />
            </Popover>
            <AppIconButton
              tooltip="Previous day"
              aria-label="Previous day"
              onClick={() => setScheduleDate((d) => d.subtract(1, 'day'))}
              sx={{ color: 'text.secondary' }}
            >
              <ChevronLeftOutlined sx={{ fontSize: 20 }} />
            </AppIconButton>
            <AppIconButton
              tooltip="Next day"
              aria-label="Next day"
              onClick={() => setScheduleDate((d) => d.add(1, 'day'))}
              sx={{ color: 'text.secondary' }}
            >
              <ChevronRightOutlined sx={{ fontSize: 20 }} />
            </AppIconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <AppIconButton tooltip="Cached recordings" aria-label="Cached recordings" sx={{ color: 'text.secondary' }}>
              <CassetteIcon />
            </AppIconButton>
          </Box>
        </Box>
      )}

      {selectedVisit ? (
        <ScribeAppointmentView
          key={selectedVisit.id}
          visit={selectedVisit}
          onBack={() => onSelectedVisitChange(null)}
          recordingForVisit={
            activeRecording?.visit.id === selectedVisit.id ? activeRecording : null
          }
          onBeginRecording={() =>
            onActiveRecordingChange({
              visit: selectedVisit,
              phase: 'recording',
              seconds: 0,
            })
          }
          onPauseRecording={() =>
            onActiveRecordingChange((s) =>
              s && s.visit.id === selectedVisit.id ? { ...s, phase: 'paused' } : s,
            )
          }
          onResumeRecording={() =>
            onActiveRecordingChange((s) =>
              s && s.visit.id === selectedVisit.id ? { ...s, phase: 'recording' } : s,
            )
          }
          onFinishRecording={() => onActiveRecordingChange(null)}
          onCancelRecording={() => {
            onActiveRecordingChange(null);
            onSelectedVisitChange(null);
          }}
        />
      ) : (
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 0, pb: 2 }}>
          <CollapsibleGroup
            title="Upcoming visits"
            icon={<FourOClockAltIcon />}
            open={openUpcoming}
            onToggle={() => setOpenUpcoming((o) => !o)}
          >
            <List disablePadding sx={scribeVisitListSx}>
              {upcoming.map((visit) => (
                <VisitRow key={visit.id} visit={visit} onSelect={onSelectedVisitChange} />
              ))}
            </List>
          </CollapsibleGroup>

          <CollapsibleGroup
            title="Action Pending"
            icon={<WarningBoxIcon />}
            open={openAction}
            onToggle={() => setOpenAction((o) => !o)}
          >
            <List disablePadding sx={scribeVisitListSx}>
              {action.map((visit) => (
                <VisitRow key={visit.id} visit={visit} onSelect={onSelectedVisitChange} />
              ))}
            </List>
          </CollapsibleGroup>

          <CollapsibleGroup
            title="Completed"
            icon={<CheckBoxAltIcon />}
            open={openCompleted}
            onToggle={() => setOpenCompleted((o) => !o)}
          >
            <List disablePadding sx={scribeVisitListSx}>
              {completed.map((visit) => (
                <VisitRow key={visit.id} visit={visit} onSelect={onSelectedVisitChange} />
              ))}
            </List>
          </CollapsibleGroup>
        </Box>
      )}
    </Box>
    </LocalizationProvider>
  );
}
