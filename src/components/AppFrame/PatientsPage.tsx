import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import { Link, useParams, Outlet } from 'react-router-dom';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined';
import { MOCK_PATIENTS, type Patient } from '../../data/mockPatients';

const APPOINTMENT_TYPE_COLORS: Record<NonNullable<Patient['appointmentType']>, string> = {
  'Initial Eval': '#1976d2',
  'Follow up': '#2e7d32',
  'Progress Note': '#ed6c02',
};
const DEFAULT_APPOINTMENT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';

export function PatientsPage() {
  const [search, setSearch] = useState('');
  const { patientId } = useParams<{ patientId?: string }>();

  const filteredPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_PATIENTS;
    return MOCK_PATIENTS.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.dateOfBirth.includes(q)
    );
  }, [search]);

  const showPatientList = !patientId;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          gap: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left column: search + patient list (only on Today's Patients view) */}
        {showPatientList && (
          <Box
            sx={{
              width: 320,
              flexShrink: 0,
              height: '100%',
              borderRight: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: 2, pt: 2, pb: 1.5, flexShrink: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Patients
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  startIcon={<PersonAddOutlined />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                >
                  New Patient
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
                  '& .MuiOutlinedInput-root': {
                    height: 36,
                    borderRadius: '8px',
                    bgcolor: 'grey.50',
                  },
                }}
                fullWidth
              />
            </Box>
            <List
              disablePadding
              sx={{
                flex: 1,
                minHeight: 0,
                height: '100%',
                overflow: 'auto',
                py: 0,
              }}
            >
              {filteredPatients.map((patient) => {
                const blockColor =
                  patient.appointmentType != null
                    ? APPOINTMENT_TYPE_COLORS[patient.appointmentType]
                    : DEFAULT_APPOINTMENT_BORDER_COLOR;
                return (
                  <ListItemButton
                    key={patient.id}
                    component={Link}
                    to={`/patients/${patient.id}`}
                    selected={patientId === patient.id}
                    sx={{
                      position: 'relative',
                      minHeight: 0,
                      padding: 0,
                      flexDirection: 'row',
                      alignItems: 'stretch',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        bgcolor: blockColor,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0, py: 0.75, pl: 2, pr: 2, ml: '3px' }}>
                      <ListItemText
                        primary={patient.fullName}
                        primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                        secondary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: 0.25 }}>
                            <span>MRN: {patient.mrn}</span>
                            <span>•</span>
                            <span>{patient.dateOfBirth}</span>
                          </Box>
                        }
                        secondaryTypographyProps={{
                          fontSize: 12,
                          color: 'text.secondary',
                        }}
                      />
                    </Box>
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        )}

        {/* Main content: Today's Patients or full-canvas Patient Profile */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
