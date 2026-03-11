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
} from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { getAppointmentsForPatient, type AppointmentStatus } from '../../data/mockAppointments';

export interface AppointmentsTabContentProps {
  patientId: string;
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

export function AppointmentsTabContent({ patientId }: AppointmentsTabContentProps) {
  const [search, setSearch] = useState('');
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
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  {search.trim() ? 'No appointments match your search.' : 'No appointments yet.'}
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((apt) => (
                <TableRow key={apt.id} hover>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
