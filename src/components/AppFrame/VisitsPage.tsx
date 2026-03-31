import React, { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  SvgIcon,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ViewListOutlined from '@mui/icons-material/ViewListOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { AppIconButton } from '../AppIconButton';

/** Visits calendar header: icon buttons, toggles outer shell, Today control. */
const HEADER_CONTROL_HEIGHT = 28;

/** Secondary panel modes toggled from the visits header (like patient profile). */
export type VisitsSecondaryPanelMode = 'waitlist' | 'savedViews' | 'filters';

/** Bookmark / Saved views icon. */
function SavedViewsIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8384 18.6638C11.244 18.432 11.4468 18.3161 11.661 18.2664C11.884 18.2147 12.116 18.2147 12.339 18.2664C12.5532 18.3161 12.756 18.432 13.1616 18.6638C14.997 19.7126 15.9147 20.2369 16.6674 20.1864C17.444 20.1343 18.1521 19.7234 18.5827 19.0749C19 18.4464 19 17.3895 19 15.2757V9.4C19 7.15979 19 6.03969 18.564 5.18404C18.1805 4.43139 17.5686 3.81947 16.816 3.43597C15.9603 3 14.8402 3 12.6 3H11.4C9.15979 3 8.03969 3 7.18404 3.43597C6.43139 3.81947 5.81947 4.43139 5.43597 5.18404C5 6.03969 5 7.15979 5 9.4V15.2757C5 17.3895 5 18.4464 5.41729 19.0749C5.84788 19.7234 6.55597 20.1343 7.33265 20.1864C8.08535 20.2369 9.00302 19.7126 10.8384 18.6638ZM6.5 16.8741C6.5 17.8062 6.5 18.2722 6.69531 18.5369C6.86559 18.7677 7.12678 18.9143 7.41249 18.9394C7.7402 18.9682 8.138 18.7254 8.9336 18.2397L9.49919 17.8945C10.4076 17.34 10.8618 17.0628 11.3476 16.9545C11.7773 16.8588 12.2227 16.8588 12.6524 16.9545C13.1382 17.0628 13.5924 17.34 14.5008 17.8945L15.0664 18.2397C15.862 18.7254 16.2598 18.9682 16.5875 18.9394C16.8732 18.9143 17.1344 18.7677 17.3047 18.5369C17.5 18.2722 17.5 17.8062 17.5 16.8741V8.5C17.5 7.09987 17.5 6.3998 17.2275 5.86502C16.9878 5.39462 16.6054 5.01217 16.135 4.77248C15.6002 4.5 14.9001 4.5 13.5 4.5H10.5C9.09987 4.5 8.3998 4.5 7.86502 4.77248C7.39462 5.01217 7.01217 5.39462 6.77248 5.86502C6.5 6.3998 6.5 7.09987 6.5 8.5V16.8741Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

/** Filters icon. */
function FiltersIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none">
      <path
        d="M14.25 16.75C14.6642 16.75 15 17.0858 15 17.5C15 17.9142 14.6642 18.25 14.25 18.25H9.75C9.33579 18.25 9 17.9142 9 17.5C9 17.0858 9.33579 16.75 9.75 16.75H14.25ZM17.25 11.25C17.6642 11.25 18 11.5858 18 12C18 12.4142 17.6642 12.75 17.25 12.75H6.75C6.33579 12.75 6 12.4142 6 12C6 11.5858 6.33579 11.25 6.75 11.25H17.25ZM20.25 5.75C20.6642 5.75 21 6.08579 21 6.5C21 6.91421 20.6642 7.25 20.25 7.25H3.75C3.33579 7.25 3 6.91421 3 6.5C3 6.08579 3.33579 5.75 3.75 5.75H20.25Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

/** Waitlist (waiting person) icon. */
function WaitlistIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none">
      <path
        d="M12.6279 14C12.2995 14.4563 12.0336 14.9602 11.8428 15.5H7C5.61933 15.5 4.50007 16.6193 4.5 18V22H3V18C3.00007 15.7909 4.7909 14 7 14H12.6279Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C12.7614 2 14.9999 4.23863 15 7C15 9.76142 12.7614 12 10 12C7.23858 12 5 9.76142 5 7C5.00007 4.23863 7.23862 2 10 2ZM10 3.5C8.06704 3.5 6.50007 5.06706 6.5 7C6.5 8.933 8.067 10.5 10 10.5C11.933 10.5 13.5 8.933 13.5 7C13.4999 5.06706 11.933 3.5 10 3.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 17.5C22 19.9853 19.9853 22 17.5 22C15.0147 22 13 19.9853 13 17.5C13 15.0147 15.0147 13 17.5 13C19.9853 13 22 15.0147 22 17.5ZM17.5 20.65C19.008 20.65 20.2685 19.5903 20.5775 18.175H16.825V14.4225C15.4097 14.7315 14.35 15.992 14.35 17.5C14.35 19.2397 15.7603 20.65 17.5 20.65ZM20.5775 16.825C20.316 15.6271 19.3729 14.684 18.175 14.4225V16.825H20.5775Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

const headerIconButtonSx = {
  width: HEADER_CONTROL_HEIGHT,
  height: HEADER_CONTROL_HEIGHT,
  minHeight: HEADER_CONTROL_HEIGHT,
  borderRadius: '8px',
  p: 0,
} as const;

/** Day/Week/Month and Calendar/List: segmented control; `size="small"` toggles, 8px pill buttons, 10px outer shell. */
const visitsHeaderToggleGroupSx = {
  width: 'fit-content',
  height: 'fit-content',
  boxSizing: 'border-box',
  bgcolor: 'action.hover',
  p: '2px',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  '& .MuiToggleButton-root': {
    border: 'none',
    borderRadius: '8px !important',
    minHeight: HEADER_CONTROL_HEIGHT,
    height: HEADER_CONTROL_HEIGHT,
    px: 1.5,
    py: 0,
    textTransform: 'none',
    fontWeight: 500,
    lineHeight: 1,
    '&.Mui-selected': {
      bgcolor: 'background.paper',
      boxShadow: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? '0 1px 2px rgba(0, 0, 0, 0.35)'
          : '0 1px 2px rgba(0, 0, 0, 0.06)',
      '&:hover': { bgcolor: 'background.paper' },
    },
  },
};

/** Mock providers for the multi-column day view (one column per provider). */
const MOCK_PROVIDERS = [
  { id: '1', displayName: 'Emily Chen', visitCount: 4 },
  { id: '2', displayName: 'James Wilson', visitCount: 2 },
  { id: '3', displayName: 'Maria Garcia', visitCount: 6 },
  { id: '4', displayName: 'David Kim', visitCount: 1 },
  { id: '5', displayName: 'Sarah Johnson', visitCount: 3 },
  { id: '6', displayName: 'Robert Lee', visitCount: 5 },
  { id: '7', displayName: 'Amy Foster', visitCount: 2 },
  { id: '8', displayName: 'Chris Taylor', visitCount: 7 },
  { id: '9', displayName: 'Priya Sharma', visitCount: 3 },
  { id: '10', displayName: 'Marcus Webb', visitCount: 0 },
  { id: '11', displayName: 'Nina Okonkwo', visitCount: 4 },
  { id: '12', displayName: 'Hannah Brooks', visitCount: 1 },
] as const;

type MockProvider = (typeof MOCK_PROVIDERS)[number];

const MOCK_FACILITIES = [
  { id: 'main', label: 'Main Campus' },
  { id: 'north', label: 'North Clinic' },
  { id: 'tele', label: 'Telehealth Hub' },
] as const;

/** Preset provider subsets for the saved-views panel (mock until custom views exist). */
const MOCK_SAVED_VIEWS = [
  { id: 'morning', label: 'Morning providers', description: 'Early shift column set', providerIds: ['1', '2', '4', '6', '8'] as const },
  { id: 'medicare', label: 'Medicare panel', description: 'Providers focused on Medicare visits', providerIds: ['1', '3', '5', '7', '9'] as const },
  { id: 'surgery', label: 'Surgery team', description: 'Procedure-heavy day', providerIds: ['2', '4', '10', '11'] as const },
  {
    id: 'full',
    label: 'Full team',
    description: 'Everyone on the schedule',
    providerIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const,
  },
] as const;

const MOCK_WAITLIST = [
  {
    id: 'wl1',
    patientName: 'Jordan Lee',
    appointmentType: 'Annual physical',
    desire: 'Soonest slot',
    preferredTimes: 'Tue–Thu, 9 AM–12 PM. Can do Friday afternoon if needed.',
  },
  {
    id: 'wl2',
    patientName: 'Sam Patel',
    appointmentType: 'Follow-up',
    desire: 'Same provider as last visit',
    preferredTimes: 'After 3 PM weekdays only.',
  },
  {
    id: 'wl3',
    patientName: 'Riley Morgan',
    appointmentType: 'New patient',
    desire: 'First available',
    preferredTimes: 'Mornings preferred; avoid lunch hour.',
  },
  {
    id: 'wl4',
    patientName: 'Casey Nguyen',
    appointmentType: 'Urgent care follow-up',
    desire: 'Within 48 hours',
    preferredTimes: 'Any time Sat or Sun; weekdays before 11 AM.',
  },
] as const;

const SECONDARY_PANEL_WIDTH_PX = 280;

/** Hour labels from 6 AM through 6 PM (13 rows). */
const HOUR_ROWS = Array.from({ length: 13 }, (_, i) => {
  const h = 6 + i;
  if (h === 12) return '12 PM';
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
});

function VisitsCalendarHeaderBar({
  secondaryPanelMode,
  onToggleSecondaryPanel,
  scheduleDate,
  onScheduleDateChange,
}: {
  secondaryPanelMode: VisitsSecondaryPanelMode | null;
  onToggleSecondaryPanel: (mode: VisitsSecondaryPanelMode) => void;
  scheduleDate: Dayjs;
  onScheduleDateChange: (next: Dayjs) => void;
}) {
  const [calendarView, setCalendarView] = useState<'calendar' | 'list'>('calendar');
  const [rangeView, setRangeView] = useState<'day' | 'week' | 'month'>('day');
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null);
  const datePickerOpen = Boolean(datePickerAnchor);

  const panelButton = (mode: VisitsSecondaryPanelMode, title: string, Icon: React.ComponentType<React.ComponentProps<typeof SvgIcon>>) => {
    const active = secondaryPanelMode === mode;
    return (
      <IconButton
        size="small"
        onClick={() => onToggleSecondaryPanel(mode)}
        title={title}
        aria-label={title}
        sx={{
          ...headerIconButtonSx,
          ...(active && {
            bgcolor: 'action.selected',
            color: 'primary.main',
            '&:hover': { bgcolor: 'action.selected' },
          }),
        }}
      >
        <Icon sx={{ fontSize: 22 }} />
      </IconButton>
    );
  };

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: 1,
        py: 1.5,
        px: 1.5,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'nowrap' }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => onScheduleDateChange(dayjs().startOf('day'))}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: 'none',
            px: 2,
            minHeight: HEADER_CONTROL_HEIGHT,
            height: HEADER_CONTROL_HEIGHT,
            py: 0,
          }}
        >
          Today
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            aria-label="Previous day"
            onClick={() => onScheduleDateChange(scheduleDate.subtract(1, 'day'))}
            sx={headerIconButtonSx}
          >
            <ChevronLeftOutlined sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Next day"
            onClick={() => onScheduleDateChange(scheduleDate.add(1, 'day'))}
            sx={headerIconButtonSx}
          >
            <ChevronRightOutlined sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Button
          variant="text"
          id="visits-schedule-date-button"
          aria-haspopup="dialog"
          aria-expanded={datePickerOpen}
          aria-label={`Schedule date, ${scheduleDate.format('dddd, MMMM D, YYYY')}. Open calendar`}
          onClick={(e) => setDatePickerAnchor(e.currentTarget)}
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            minWidth: 0,
            px: '6px',
            marginLeft: '-2px',
            lineHeight: `${HEADER_CONTROL_HEIGHT}px`,
            height: HEADER_CONTROL_HEIGHT,
            borderRadius: '8px',
          }}
        >
          <Typography
            component="span"
            variant="subtitle1"
            sx={{ fontWeight: 700, color: 'inherit', lineHeight: 'inherit' }}
          >
            {scheduleDate.format('dddd MMM D')}
          </Typography>
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
                onScheduleDateChange(value.startOf('day'));
                setDatePickerAnchor(null);
              }
            }}
          />
        </Popover>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={calendarView}
          onChange={(_, v) => v != null && setCalendarView(v)}
          sx={visitsHeaderToggleGroupSx}
        >
          <ToggleButton value="calendar" aria-label="Calendar view">
            <CalendarMonthOutlined sx={{ fontSize: 20 }} />
          </ToggleButton>
          <ToggleButton value="list" aria-label="List view">
            <ViewListOutlined sx={{ fontSize: 20 }} />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={rangeView}
          onChange={(_, v) => v != null && setRangeView(v)}
          sx={visitsHeaderToggleGroupSx}
        >
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {panelButton('waitlist', 'Waitlist', WaitlistIcon)}
        {panelButton('savedViews', 'Saved views', SavedViewsIcon)}
        {panelButton('filters', 'Filters', FiltersIcon)}
        <IconButton
          size="small"
          color="primary"
          aria-label="Add appointment"
          onClick={() => {}}
          sx={{
            ...headerIconButtonSx,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <AddOutlined sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

function VisitsCalendarCanvas({ visibleProviders }: { visibleProviders: readonly MockProvider[] }) {
  const timeColWidth = 56;
  const hourHeight = 48;
  const n = visibleProviders.length;
  const gridCols =
    n === 0
      ? `${timeColWidth}px`
      : `${timeColWidth}px repeat(${n}, minmax(120px, 1fr))`;
  const gridMinWidth = timeColWidth + n * 120;

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      {/* Sticky header row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          position: 'sticky',
          top: 0,
          zIndex: 2,
          minWidth: gridMinWidth,
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            borderRight: 1,
            borderRightColor: 'divider',
          }}
        />
        {visibleProviders.map((p) => (
          <Box
            key={p.id}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              borderRight: 1,
              borderRightColor: 'divider',
              py: 1,
              px: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              minWidth: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                textAlign: 'left',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {p.displayName}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                flexShrink: 0,
                ml: 'auto',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {p.visitCount}
              </Typography>
              <Typography component="span" variant="caption" sx={{ color: 'text.disabled' }}>
                #
              </Typography>
              <PersonOutlineOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Hour rows */}
      {HOUR_ROWS.map((label, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            minWidth: gridMinWidth,
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              left: 0,
              zIndex: 1,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              borderBottom: 1,
              borderBottomColor: 'divider',
              height: hourHeight,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              pr: 1,
              pt: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
              {label}
            </Typography>
          </Box>
          {visibleProviders.map((p) => (
            <Box
              key={`${p.id}-${rowIndex}`}
              sx={{
                position: 'relative',
                borderRight: 1,
                borderColor: 'divider',
                borderBottom: 1,
                borderBottomColor: 'divider',
                height: hourHeight,
                bgcolor: 'background.paper',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  borderTop: '1px dashed',
                  borderColor: 'divider',
                  pointerEvents: 'none',
                },
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

const PANEL_TITLES: Record<VisitsSecondaryPanelMode, string> = {
  waitlist: 'Waitlist',
  savedViews: 'Saved views',
  filters: 'Filters',
};

function VisitsSecondaryPanelFilters({
  facilityId,
  onFacilityChange,
  visibleProviderIds,
  onToggleProvider,
}: {
  facilityId: string;
  onFacilityChange: (id: string) => void;
  visibleProviderIds: ReadonlySet<string>;
  onToggleProvider: (id: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <FormControl size="small" fullWidth>
        <InputLabel id="visits-facility-label">Facility</InputLabel>
        <Select
          labelId="visits-facility-label"
          id="visits-facility"
          label="Facility"
          value={facilityId}
          onChange={(e) => onFacilityChange(e.target.value)}
        >
          {MOCK_FACILITIES.map((f) => (
            <MenuItem key={f.id} value={f.id}>
              {f.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Providers
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {MOCK_PROVIDERS.map((p) => {
          const visible = visibleProviderIds.has(p.id);
          return (
            <Box
              key={p.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                opacity: visible ? 1 : 0.48,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  color: visible ? 'text.primary' : 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.displayName}
              </Typography>
              <AppIconButton
                size="small"
                tooltip={visible ? `Hide ${p.displayName}` : `Show ${p.displayName}`}
                aria-label={visible ? `Hide ${p.displayName} column` : `Show ${p.displayName} column`}
                onClick={() => onToggleProvider(p.id)}
                sx={{
                  flexShrink: 0,
                  color: visible ? 'text.secondary' : 'text.disabled',
                }}
              >
                {visible ? <VisibilityOutlined fontSize="small" /> : <VisibilityOffOutlined fontSize="small" />}
              </AppIconButton>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function VisitsSecondaryPanelSavedViews({
  activeSavedViewId,
  onApplySavedView,
}: {
  activeSavedViewId: string | null;
  onApplySavedView: (view: (typeof MOCK_SAVED_VIEWS)[number]) => void;
}) {
  return (
    <List disablePadding sx={{ width: '100%' }}>
      {MOCK_SAVED_VIEWS.map((view) => (
        <ListItem key={view.id} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeSavedViewId === view.id}
            onClick={() => onApplySavedView(view)}
            sx={{ borderRadius: 1, alignItems: 'flex-start', py: 1 }}
          >
            <ListItemText
              primary={view.label}
              secondary={view.description}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
              secondaryTypographyProps={{ variant: 'caption', sx: { display: 'block', mt: 0.25 } }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

function VisitsSecondaryPanelWaitlist() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <List disablePadding sx={{ width: '100%' }}>
      {MOCK_WAITLIST.map((entry) => {
        const expanded = expandedId === entry.id;
        const tooltipTitle = (
          <Box sx={{ py: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
              Preferred times
            </Typography>
            <Typography variant="caption" sx={{ lineHeight: 1.4 }}>
              {entry.preferredTimes}
            </Typography>
          </Box>
        );
        return (
          <ListItem key={entry.id} disablePadding sx={{ mb: 1 }}>
            <Tooltip title={tooltipTitle} placement="left" enterTouchDelay={0}>
              <ListItemButton
                onClick={() => setExpandedId((id) => (id === entry.id ? null : entry.id))}
                selected={expanded}
                sx={{ borderRadius: 1, flexDirection: 'column', alignItems: 'stretch', textAlign: 'left' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {entry.patientName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                  {entry.appointmentType}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                  {entry.desire}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.75, fontStyle: 'italic' }}>
                  Hover for preferred times · click row to pin open
                </Typography>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, lineHeight: 1.45 }}>
                    <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Preferred times:{' '}
                    </Box>
                    {entry.preferredTimes}
                  </Typography>
                </Collapse>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
}

function VisitsSecondaryPanel({
  mode,
  onClose,
  facilityId,
  onFacilityChange,
  visibleProviderIds,
  onToggleProvider,
  activeSavedViewId,
  onApplySavedView,
}: {
  mode: VisitsSecondaryPanelMode | null;
  onClose: () => void;
  facilityId: string;
  onFacilityChange: (id: string) => void;
  visibleProviderIds: ReadonlySet<string>;
  onToggleProvider: (id: string) => void;
  activeSavedViewId: string | null;
  onApplySavedView: (view: (typeof MOCK_SAVED_VIEWS)[number]) => void;
}) {
  const open = mode !== null;

  return (
    <Box
      sx={{
        width: open ? SECONDARY_PANEL_WIDTH_PX : 0,
        minWidth: 0,
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Box
        sx={{
          width: SECONDARY_PANEL_WIDTH_PX,
          height: '100%',
          borderLeft: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            py: 1.5,
            px: 1.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {mode ? PANEL_TITLES[mode] : ''}
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close panel"
            title="Close"
            sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
          >
            <CloseOutlined sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            px: 2,
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          {mode === 'filters' && (
            <VisitsSecondaryPanelFilters
              facilityId={facilityId}
              onFacilityChange={onFacilityChange}
              visibleProviderIds={visibleProviderIds}
              onToggleProvider={onToggleProvider}
            />
          )}
          {mode === 'savedViews' && (
            <VisitsSecondaryPanelSavedViews activeSavedViewId={activeSavedViewId} onApplySavedView={onApplySavedView} />
          )}
          {mode === 'waitlist' && <VisitsSecondaryPanelWaitlist />}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Visits / schedule page: header controls, multi-provider day grid, and secondary panel.
 */
export function VisitsPage() {
  const [scheduleDate, setScheduleDate] = useState<Dayjs>(() => dayjs().startOf('day'));
  const [secondaryPanelMode, setSecondaryPanelMode] = useState<VisitsSecondaryPanelMode | null>(null);
  const [facilityId, setFacilityId] = useState<string>(MOCK_FACILITIES[0].id);
  const [visibleProviderIds, setVisibleProviderIds] = useState<Set<string>>(
    () => new Set(MOCK_PROVIDERS.map((p) => p.id)),
  );
  const [activeSavedViewId, setActiveSavedViewId] = useState<string | null>(null);

  const visibleProviders = MOCK_PROVIDERS.filter((p) => visibleProviderIds.has(p.id));

  const handleTogglePanel = (mode: VisitsSecondaryPanelMode) => {
    setSecondaryPanelMode((current) => (current === mode ? null : mode));
  };

  const handleToggleProvider = (id: string) => {
    setActiveSavedViewId(null);
    setVisibleProviderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApplySavedView = (view: (typeof MOCK_SAVED_VIEWS)[number]) => {
    setActiveSavedViewId(view.id);
    setVisibleProviderIds(new Set(view.providerIds));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <VisitsCalendarHeaderBar
          secondaryPanelMode={secondaryPanelMode}
          onToggleSecondaryPanel={handleTogglePanel}
          scheduleDate={scheduleDate}
          onScheduleDateChange={setScheduleDate}
        />
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        <VisitsCalendarCanvas visibleProviders={visibleProviders} />
        <VisitsSecondaryPanel
          mode={secondaryPanelMode}
          onClose={() => setSecondaryPanelMode(null)}
          facilityId={facilityId}
          onFacilityChange={setFacilityId}
          visibleProviderIds={visibleProviderIds}
          onToggleProvider={handleToggleProvider}
          activeSavedViewId={activeSavedViewId}
          onApplySavedView={handleApplySavedView}
        />
      </Box>
    </Box>
    </LocalizationProvider>
  );
}
