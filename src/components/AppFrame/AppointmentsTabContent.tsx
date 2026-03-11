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
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { getAppointmentsForPatient, type Appointment, type AppointmentStatus } from '../../data/mockAppointments';

const STICKY_ACTIONS_CELL = {
  position: 'sticky' as const,
  right: 0,
  minWidth: 140,
  width: 140,
  bgcolor: 'background.paper',
  boxShadow: '-4px 0 8px -2px rgba(0,0,0,0.06)',
  zIndex: 1,
  whiteSpace: 'nowrap' as const,
};
const STICKY_ACTIONS_HEADER = { ...STICKY_ACTIONS_CELL, bgcolor: 'grey.50', zIndex: 2 };

export interface AppointmentsTabContentProps {
  patientId: string;
  /** Called when user clicks "Open Note" on a complete appointment. Opens a visit note tab. */
  onOpenNote?: (appointment: Appointment) => void;
}

const STATUS_CHIP_STYLES: Record<
  AppointmentStatus,
  { bgcolor: string; color: string }
> = {
  Schedule: { bgcolor: '#f5f5f5', color: '#616161' },
  Confirmed: { bgcolor: '#e3f2fd', color: '#1565c0' },
  'Checked In': { bgcolor: '#fff3e0', color: '#e65100' },
  Complete: { bgcolor: '#e8f5e9', color: '#2e7d32' },
  Canceled: { bgcolor: '#ffebee', color: '#c62828' },
  'No Show': { bgcolor: '#fff8e1', color: '#f57c00' },
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
                <SearchOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
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
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Case</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Template</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Clinical stage</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Provider</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Insurance</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Facility</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Tags</TableCell>
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
                    <TableCell>{apt.date}</TableCell>
                    <TableCell>{apt.time}</TableCell>
                    <TableCell>
                      <Chip
                        label={apt.status}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          ...STATUS_CHIP_STYLES[apt.status],
                        }}
                      />
                    </TableCell>
                    <TableCell>{`${apt.caseName} [${apt.caseId}]`}</TableCell>
                    <TableCell>{apt.template}</TableCell>
                    <TableCell>{apt.clinicalStage}</TableCell>
                    <TableCell>{apt.provider}</TableCell>
                    <TableCell>{apt.insurance}</TableCell>
                    <TableCell>{apt.facility}</TableCell>
                    <TableCell>
                      {apt.tags && apt.tags.length > 0 ? (
                        <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {apt.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ fontSize: '0.75rem', bgcolor: '#f5f5f5', color: '#616161' }}
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
