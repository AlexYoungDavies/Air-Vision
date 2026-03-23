import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  SvgIcon,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ViewListOutlined from '@mui/icons-material/ViewListOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';

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
] as const;

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
}: {
  secondaryPanelMode: VisitsSecondaryPanelMode | null;
  onToggleSecondaryPanel: (mode: VisitsSecondaryPanelMode) => void;
}) {
  const [calendarView, setCalendarView] = useState<'calendar' | 'list'>('calendar');
  const [rangeView, setRangeView] = useState<'day' | 'week' | 'month'>('day');

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'nowrap' }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => {}}
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
          <IconButton size="small" aria-label="Previous day" onClick={() => {}} sx={headerIconButtonSx}>
            <ChevronLeftOutlined sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton size="small" aria-label="Next day" onClick={() => {}} sx={headerIconButtonSx}>
            <ChevronRightOutlined sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: `${HEADER_CONTROL_HEIGHT}px` }}>
          Friday Nov 21
        </Typography>
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

function VisitsCalendarCanvas() {
  const timeColWidth = 56;
  const hourHeight = 48;
  const gridCols = `${timeColWidth}px repeat(${MOCK_PROVIDERS.length}, minmax(120px, 1fr))`;

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
          minWidth: timeColWidth + MOCK_PROVIDERS.length * 120,
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
        {MOCK_PROVIDERS.map((p) => (
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
            minWidth: timeColWidth + MOCK_PROVIDERS.length * 120,
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
          {MOCK_PROVIDERS.map((p) => (
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

const PANEL_PLACEHOLDERS: Record<VisitsSecondaryPanelMode, string> = {
  waitlist: 'Patients on the waitlist for this schedule will appear here.',
  savedViews: 'Your saved calendar views will appear here.',
  filters: 'Filter the calendar by provider, location, or visit type.',
};

function VisitsSecondaryPanel({
  mode,
  onClose,
}: {
  mode: VisitsSecondaryPanelMode | null;
  onClose: () => void;
}) {
  const open = mode !== null;

  return (
    <Box
      sx={{
        width: open ? 360 : 0,
        minWidth: 0,
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Box
        sx={{
          width: 360,
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
            px: 2,
            borderBottom: 1,
            borderColor: 'divider',
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
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mode && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {PANEL_PLACEHOLDERS[mode]}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Visits / schedule page: header controls, multi-provider day grid, and secondary panel.
 */
export function VisitsPage() {
  const [secondaryPanelMode, setSecondaryPanelMode] = useState<VisitsSecondaryPanelMode | null>(null);

  const handleTogglePanel = (mode: VisitsSecondaryPanelMode) => {
    setSecondaryPanelMode((current) => (current === mode ? null : mode));
  };

  return (
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
      />
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        <VisitsCalendarCanvas />
        <VisitsSecondaryPanel mode={secondaryPanelMode} onClose={() => setSecondaryPanelMode(null)} />
      </Box>
    </Box>
  );
}
