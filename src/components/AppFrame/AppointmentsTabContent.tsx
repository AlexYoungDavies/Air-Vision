import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { SearchIcon } from '../icons';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { getAppointmentsForPatient, type Appointment, type AppointmentStatus } from '../../data/mockAppointments';

export const STICKY_ACTIONS_CELL = {
  position: 'sticky' as const,
  right: 0,
  minWidth: 140,
  width: 140,
  bgcolor: 'background.paper',
  boxShadow: (theme: { palette: { mode: string } }) =>
    theme.palette.mode === 'dark' ? '-4px 0 8px -2px rgba(0,0,0,0.3)' : '-4px 0 8px -2px rgba(0,0,0,0.06)',
  zIndex: 1,
  whiteSpace: 'nowrap' as const,
};
export const STICKY_ACTIONS_HEADER = { ...STICKY_ACTIONS_CELL, bgcolor: 'background.paper', zIndex: 2 };

export const COLUMN_HEADER_STYLE = { maxWidth: 240 };
export const COLUMN_BODY_STYLE = { maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const };

export interface AppointmentsTabContentProps {
  patientId: string;
  /** Called when user clicks "Open Note" on a complete appointment. Opens a visit note tab. */
  onOpenNote?: (appointment: Appointment) => void;
}

export const STATUS_CHIP_STYLES: Record<
  AppointmentStatus,
  { bgcolor: string; color: string }
> = {
  Schedule: { bgcolor: 'action.hover', color: 'text.secondary' },
  Confirmed: { bgcolor: 'info.light', color: 'info.dark' },
  'Checked In': { bgcolor: 'warning.light', color: 'warning.dark' },
  Complete: { bgcolor: 'success.light', color: 'success.dark' },
  Canceled: { bgcolor: 'error.light', color: 'error.dark' },
  'No Show': { bgcolor: 'warning.light', color: 'warning.dark' },
};

export function AppointmentsTabContent({ patientId, onOpenNote }: AppointmentsTabContentProps) {
  const [search, setSearch] = useState('');
  const [moreAnchor, setMoreAnchor] = useState<{ el: HTMLElement; appointment: Appointment } | null>(null);
  const appointments = useMemo(() => {
    const list = getAppointmentsForPatient(patientId);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (apt) =>
      apt.caseName.toLowerCase().includes(q) ||
      apt.caseId.toLowerCase().includes(q) ||
      apt.template.toLowerCase().includes(q) ||
      apt.provider.toLowerCase().includes(q) ||
      apt.status.toLowerCase().includes(q) ||
      apt.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [patientId, search]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 2,
          pt: 2,
          pb: 1.5,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Appointments
          </Typography>
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<AddOutlined sx={{ fontSize: 18 }} />}
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none', minWidth: 'auto', px: 1 }}
          >
            Book
          </Button>
        </Box>
        <TextField
          placeholder="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 220,
            '& .MuiOutlinedInput-root': {
              height: 36,
              borderRadius: '8px',
              bgcolor: 'grey.50',
              fontSize: 14,
            },
          }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: 0, boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Case</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Template</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Clinical stage</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Provider</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Insurance</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Facility</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.paper', ...COLUMN_HEADER_STYLE }}>Tags</TableCell>
              <TableCell sx={{ fontWeight: 600, ...STICKY_ACTIONS_HEADER }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  {search.trim() ? 'No appointments match your search.' : 'No appointments yet.'}
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((apt) => {
                const isComplete = apt.status === 'Complete';
                return (
                  <TableRow
                    key={apt.id}
                    hover
                    onDoubleClick={() => isComplete && onOpenNote?.(apt)}
                    sx={isComplete ? { cursor: 'pointer' } : undefined}
                  >
                    <TableCell sx={COLUMN_BODY_STYLE}>{apt.date}</TableCell>
                    <TableCell sx={COLUMN_BODY_STYLE}>{apt.time}</TableCell>
                    <TableCell sx={COLUMN_BODY_STYLE}>
                      <Chip
                        label={apt.status}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          maxWidth: '100%',
                          '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                          ...STATUS_CHIP_STYLES[apt.status],
                        }}
                      />
                    </TableCell>
                    <TableCell sx={COLUMN_BODY_STYLE} title={`${apt.caseName} [${apt.caseId}]`}>{`${apt.caseName} [${apt.caseId}]`}</TableCell>
                    <TableCell sx={COLUMN_BODY_STYLE} title={apt.template}>{apt.template}</TableCell>
                    <TableCell sx={COLUMN_BODY_STYLE} title={apt.clinicalStage}>{apt.clinicalStage}</TableCell>
                    <TableCell sx={COLUMN_BODY_STYLE} title={apt.provider}>{apt.provider}</TableCell>
                    <TableCell sx={COLUMN_BODY_STYLE} title={apt.insurance}>{apt.insurance}</TableCell>
                    <TableCell sx={COLUMN_BODY_STYLE} title={apt.facility}>{apt.facility}</TableCell>
                    <TableCell sx={{ ...COLUMN_BODY_STYLE, '& .MuiBox-root': { overflow: 'hidden', textOverflow: 'ellipsis' } }}>
                      {apt.tags && apt.tags.length > 0 ? (
                        <Box component="span" sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, overflow: 'hidden', minWidth: 0 }}>
                          {apt.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ fontSize: '0.75rem', bgcolor: '#f5f5f5', color: '#616161', flexShrink: 0 }}
                            />
                          ))}
                        </Box>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell sx={STICKY_ACTIONS_CELL} align="right">
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0, flexWrap: 'nowrap' }}>
                        {isComplete ? (
                          <>
                            <Tooltip title="Download Note PDF">
                              <IconButton size="small" aria-label="Download Note PDF">
                                <DownloadOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="More">
                              <IconButton
                                size="small"
                                aria-label="More actions"
                                onClick={(e) => setMoreAnchor({ el: e.currentTarget, appointment: apt })}
                              >
                                <MoreVertOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => onOpenNote?.(apt)}
                            sx={{ textTransform: 'none', fontWeight: 500, minWidth: 'auto', px: 0.5 }}
                          >
                            Open Note
                          </Button>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Edit">
                              <IconButton size="small" aria-label="Edit">
                                <EditOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Button
                              variant="text"
                              size="small"
                              href="#"
                              sx={{ textTransform: 'none', fontWeight: 500, minWidth: 'auto', px: 0.5 }}
                            >
                              Pre-chart
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <Menu
          anchorEl={moreAnchor?.el}
          open={Boolean(moreAnchor)}
          onClose={() => setMoreAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => setMoreAnchor(null)}>Appointment Changelog</MenuItem>
          <MenuItem onClick={() => setMoreAnchor(null)}>Edit Visit Details</MenuItem>
          <MenuItem onClick={() => setMoreAnchor(null)}>Add Addendum</MenuItem>
        </Menu>
      </TableContainer>
    </Box>
  );
}
