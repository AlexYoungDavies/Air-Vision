import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowRightOutlined from '@mui/icons-material/KeyboardArrowRightOutlined';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import { AppIconButton } from '../AppIconButton';
import { getAppointmentTypeVisual } from '../../data/mockAppointmentTypes';
import { MOCK_PATIENTS } from '../../data/mockPatients';
import {
  MOCK_CALENDAR_APPOINTMENTS,
  type CalendarAppointment,
  type CalendarAppointmentStatus,
} from '../../data/mockCalendarAppointments';

interface VisitsListProvider {
  id: string;
  displayName: string;
}

interface VisitsListViewProps {
  visibleProviderIds: ReadonlySet<string>;
  providers: readonly VisitsListProvider[];
}

const PATIENT_COLUMN_WIDTH = 190;
const ACTION_COLUMN_WIDTH = 124;
const GROUP_HEADER_HEIGHT = 28;

const columns = [
  { label: 'Provider', width: 150 },
  { label: 'Appt. time', width: 100 },
  { label: 'Alerts', width: 72 },
  { label: 'Insurance & eligibility', width: 210 },
  { label: 'Balance', width: 90 },
  { label: 'Collected', width: 90 },
  { label: 'Total', width: 80 },
  { label: 'Suggested charges', width: 210 },
  { label: 'Checked in', width: 100 },
  { label: 'Intake', width: 72 },
  { label: 'In stage', width: 82 },
  { label: 'Room', width: 80 },
  { label: 'Stage', width: 132 },
  { label: 'Tags', width: 156 },
  { label: 'Notes', width: 230 },
] as const;

const TOTAL_COLUMN_COUNT = columns.length + 2;

const stageByStatus: Record<CalendarAppointmentStatus, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  checkedIn: 'In room',
  completed: 'Complete',
  canceled: 'Canceled',
  noShow: 'No show',
};

const statusAccent: Record<CalendarAppointmentStatus, string> = {
  scheduled: '#2196F3',
  confirmed: '#21A179',
  checkedIn: '#7E57C2',
  completed: '#43A047',
  canceled: '#D32F2F',
  noShow: '#F57C00',
};

function formatStartTime(minutes: number) {
  const hour24 = Math.floor(minutes / 60);
  const minutesPart = minutes % 60;
  const hour12 = hour24 % 12 || 12;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutesPart.toString().padStart(2, '0')} ${period}`;
}

function formatGroupTime(minutes: number) {
  const hour24 = Math.floor(minutes / 60);
  const minutesPart = minutes % 60;
  const hour12 = hour24 % 12 || 12;
  const period = hour24 >= 12 ? 'pm' : 'am';
  return `${hour12}:${minutesPart.toString().padStart(2, '0')}${period}`;
}

function formatElapsed(minutes: number) {
  return minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function getRowDetails(appointment: CalendarAppointment, index: number) {
  const patient = MOCK_PATIENTS.find((p) => p.id === appointment.patientId);
  const balance = 85 + ((index * 37) % 245);
  const collected = appointment.status === 'completed' ? balance : index % 4 === 0 ? 0 : Math.round(balance / 2);
  const checkedIn = appointment.status === 'checkedIn' || appointment.status === 'completed';
  const insurance = patient?.insurance.provider ?? ['Aetna', 'Blue Cross', 'United', 'Cigna'][index % 4];
  return {
    balance,
    collected,
    checkedIn,
    insurance,
    stage: stageByStatus[appointment.status],
    intakeComplete: appointment.status !== 'scheduled' && appointment.status !== 'canceled',
    stageMinutes: checkedIn ? 4 + ((index * 7) % 38) : null,
    room: checkedIn ? `Room ${1 + (index % 6)}` : '—',
  };
}

const bodyCellSx = {
  px: 1.25,
  py: 0.5,
  height: 44,
  boxSizing: 'border-box',
  whiteSpace: 'nowrap',
  fontSize: 12,
  borderColor: 'divider',
} as const;

const groupHeaderBg = (theme: { palette: { mode: string } }) =>
  theme.palette.mode === 'dark' ? '#2C2C2C' : '#F7F7F7';

const groupHeaderCellSx = {
  ...bodyCellSx,
  height: GROUP_HEADER_HEIGHT,
  py: 0,
  bgcolor: groupHeaderBg,
  borderColor: 'divider',
} as const;

/** Horizontally scrollable appointment table with frozen patient and action columns. */
export function VisitsListView({ visibleProviderIds, providers }: VisitsListViewProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFrozenBorder, setShowLeftFrozenBorder] = useState(false);
  const [showRightFrozenBorder, setShowRightFrozenBorder] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(() => new Set());
  const providerNames = new Map(providers.map((provider) => [provider.id, provider.displayName]));
  const appointments = MOCK_CALENDAR_APPOINTMENTS
    .filter((appointment) => visibleProviderIds.has(appointment.providerId))
    .sort((a, b) => a.startMinutes - b.startMinutes || a.patientName.localeCompare(b.patientName));

  const appointmentGroups: { startMinutes: number; appointments: CalendarAppointment[] }[] = [];
  for (const appointment of appointments) {
    const last = appointmentGroups[appointmentGroups.length - 1];
    if (last && last.startMinutes === appointment.startMinutes) {
      last.appointments.push(appointment);
    } else {
      appointmentGroups.push({ startMinutes: appointment.startMinutes, appointments: [appointment] });
    }
  }

  const toggleGroup = (startMinutes: number) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(startMinutes)) next.delete(startMinutes);
      else next.add(startMinutes);
      return next;
    });
  };

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const updateFrozenBorders = () => {
      setShowLeftFrozenBorder(container.scrollLeft > 1);
      setShowRightFrozenBorder(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
      );
    };

    updateFrozenBorders();
    const observer = new ResizeObserver(updateFrozenBorders);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, bgcolor: 'background.paper' }}>
      <TableContainer
        ref={tableContainerRef}
        onScroll={() => {
          const container = tableContainerRef.current;
          if (!container) return;
          setShowLeftFrozenBorder(container.scrollLeft > 1);
          setShowRightFrozenBorder(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
          );
        }}
        sx={{ width: '100%', height: '100%', overflow: 'auto' }}
      >
        <Table stickyHeader size="small" aria-label="Appointments list" sx={{ minWidth: 2220, tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...bodyCellSx,
                  position: 'sticky',
                  left: 0,
                  zIndex: 5,
                  width: PATIENT_COLUMN_WIDTH,
                  minWidth: PATIENT_COLUMN_WIDTH,
                  bgcolor: 'background.paper',
                  fontWeight: 700,
                  borderRight: '1px solid',
                  borderRightColor: showLeftFrozenBorder ? 'divider' : 'transparent',
                }}
              >
                Patient
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.label}
                  sx={{
                    ...bodyCellSx,
                    width: column.width,
                    minWidth: column.width,
                    bgcolor: 'background.paper',
                    fontWeight: 700,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell
                align="right"
                sx={{
                  ...bodyCellSx,
                  position: 'sticky',
                  right: 0,
                  zIndex: 5,
                  width: ACTION_COLUMN_WIDTH,
                  minWidth: ACTION_COLUMN_WIDTH,
                  bgcolor: 'background.paper',
                  fontWeight: 700,
                  borderLeft: '1px solid',
                  borderLeftColor: showRightFrozenBorder ? 'divider' : 'transparent',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointmentGroups.flatMap((group) => {
              const collapsed = collapsedGroups.has(group.startMinutes);
              const rows = [
                <TableRow
                  key={`group-${group.startMinutes}`}
                  onClick={() => toggleGroup(group.startMinutes)}
                  aria-expanded={!collapsed}
                  sx={{
                    height: GROUP_HEADER_HEIGHT,
                    cursor: 'pointer',
                    bgcolor: groupHeaderBg,
                    '&:hover': { filter: 'brightness(0.98)' },
                  }}
                >
                  <TableCell
                    sx={{
                      ...groupHeaderCellSx,
                      position: 'sticky',
                      left: 0,
                      zIndex: 3,
                      bgcolor: groupHeaderBg,
                      pl: 1.5,
                      borderRight: '1px solid',
                      borderRightColor: showLeftFrozenBorder ? 'divider' : 'transparent',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                      {collapsed ? (
                        <KeyboardArrowRightOutlined sx={{ fontSize: 17, color: 'text.secondary' }} />
                      ) : (
                        <KeyboardArrowDownOutlined sx={{ fontSize: 17, color: 'text.secondary' }} />
                      )}
                      <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary' }}>
                        {formatGroupTime(group.startMinutes)}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}
                      >
                        ({group.appointments.length})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    colSpan={TOTAL_COLUMN_COUNT - 2}
                    sx={{
                      ...groupHeaderCellSx,
                      bgcolor: groupHeaderBg,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...groupHeaderCellSx,
                      position: 'sticky',
                      right: 0,
                      zIndex: 3,
                      bgcolor: groupHeaderBg,
                      borderLeft: '1px solid',
                      borderLeftColor: showRightFrozenBorder ? 'divider' : 'transparent',
                    }}
                  />
                </TableRow>,
              ];

              if (!collapsed) {
                for (const [index, appointment] of group.appointments.entries()) {
                  const details = getRowDetails(appointment, index);
                  const appointmentTypeVisual = getAppointmentTypeVisual(appointment.appointmentType);
                  rows.push(
                    <TableRow key={appointment.id} sx={{ height: 44, bgcolor: 'background.paper' }}>
                      <TableCell
                        sx={{
                          ...bodyCellSx,
                          position: 'sticky',
                          left: 0,
                          zIndex: 2,
                          bgcolor: 'background.paper',
                          backgroundImage: (theme) =>
                            `linear-gradient(90deg, ${alpha(appointmentTypeVisual.accent, 0.18)} 0%, ${alpha(appointmentTypeVisual.accent, 0.08)} 62%, ${theme.palette.background.paper} 100%)`,
                          pl: 2.5,
                          overflow: 'hidden',
                          borderRight: '1px solid',
                          borderRightColor: showLeftFrozenBorder ? 'divider' : 'transparent',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: '0 auto 0 0',
                            width: 10,
                            bgcolor: appointmentTypeVisual.accent,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            lineHeight: 1.25,
                            fontWeight: 700,
                            color: appointmentTypeVisual.text,
                          }}
                        >
                          {appointment.patientName}
                        </Typography>
                        <Typography
                          title={`${appointment.appointmentType} · ${appointment.caseName}`}
                          sx={{
                            fontSize: 10,
                            lineHeight: 1.25,
                            color: appointmentTypeVisual.text,
                            opacity: 0.88,
                            display: 'block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {appointment.appointmentType} · {appointment.caseName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {providerNames.get(appointment.providerId) ?? 'Unassigned'}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>{formatStartTime(appointment.startMinutes)}</TableCell>
                      <TableCell sx={bodyCellSx}>
                        {appointment.alerts ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                            <NotificationsNoneOutlined sx={{ fontSize: 18 }} />
                            <Typography component="span" sx={{ fontSize: 10, fontWeight: 700 }}>
                              {1 + (appointment.alerts.extraCount ?? 0)}
                            </Typography>
                          </Box>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          <Chip
                            size="small"
                            icon={<TaskAltOutlined />}
                            label={details.insurance}
                            sx={{ height: 20, '& .MuiChip-label': { px: 0.75, fontSize: 10 } }}
                          />
                          <Chip
                            size="small"
                            label="Eligible"
                            color="success"
                            variant="outlined"
                            sx={{ height: 20, '& .MuiChip-label': { px: 0.75, fontSize: 10 } }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>${details.balance}</TableCell>
                      <TableCell sx={bodyCellSx}>${details.collected}</TableCell>
                      <TableCell sx={bodyCellSx}>${details.balance}</TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ fontSize: 11, lineHeight: 1.2 }}>
                          $48 Copay, $108 other balances
                        </Typography>
                        <Typography sx={{ fontSize: 10, lineHeight: 1.2, color: 'primary.main' }}>
                          Explain charges
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {details.checkedIn ? formatStartTime(appointment.startMinutes + 2) : '—'}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {details.intakeComplete ? (
                          <CheckOutlined sx={{ fontSize: 17, color: 'success.main' }} />
                        ) : appointment.status === 'canceled' || appointment.status === 'noShow' ? (
                          <CloseOutlined sx={{ fontSize: 17, color: 'error.main' }} />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {details.stageMinutes != null ? formatElapsed(details.stageMinutes) : '—'}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>{details.room}</TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Chip
                          size="small"
                          label={details.stage}
                          sx={{
                            height: 20,
                            bgcolor: `${statusAccent[appointment.status]}14`,
                            color: statusAccent[appointment.status],
                            '& .MuiChip-label': { px: 1, fontSize: 10, fontWeight: 600 },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Chip
                            size="small"
                            label="Chiro"
                            sx={{ height: 20, '& .MuiChip-label': { px: 0.75, fontSize: 10 } }}
                          />
                          <Chip
                            size="small"
                            label={appointment.facilityName === 'Main Campus' ? 'Main' : 'Remote'}
                            sx={{ height: 20, '& .MuiChip-label': { px: 0.75, fontSize: 10 } }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Notes for user to view here
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          ...bodyCellSx,
                          position: 'sticky',
                          right: 0,
                          zIndex: 2,
                          bgcolor: 'background.paper',
                          borderLeft: '1px solid',
                          borderLeftColor: showRightFrozenBorder ? 'divider' : 'transparent',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.25 }}>
                          <AppIconButton tooltip="Open visit" size="small" variant="primary">
                            <EventNoteOutlined sx={{ fontSize: 17 }} />
                          </AppIconButton>
                          <AppIconButton tooltip="Edit appointment" size="small" variant="secondary">
                            <EditOutlined sx={{ fontSize: 17 }} />
                          </AppIconButton>
                        </Box>
                      </TableCell>
                    </TableRow>,
                  );
                }
              }

              return rows;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
