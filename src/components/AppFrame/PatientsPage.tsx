import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { MOCK_PATIENTS, TODAYS_PATIENTS, type Patient } from '../../data/mockPatients';

export function PatientsPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
        {/* Left column: search + patient list */}
        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
              Patients
            </Typography>
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
                  borderRadius: 2,
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
              overflow: 'auto',
              py: 0,
            }}
          >
            {filteredPatients.map((patient) => (
              <ListItemButton
                key={patient.id}
                selected={selectedId === patient.id}
                onClick={() => setSelectedId(patient.id)}
                sx={{
                  py: 1.25,
                  px: 2,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <ListItemText
                  primary={patient.fullName}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                  secondary={
                    <>
                      {patient.mrn} • {patient.dateOfBirth}
                    </>
                  }
                  secondaryTypographyProps={{
                    fontSize: 12,
                    color: 'text.secondary',
                    sx: { mt: 0.25 },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Right column: Today's Patients */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'auto',
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Today&apos;s Patients
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 2,
            }}
          >
            {TODAYS_PATIENTS.map((patient) => (
              <TodayPatientCard key={patient.id} patient={patient} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function TodayPatientCard({ patient }: { patient: Patient }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <Avatar
            src={patient.picture}
            alt={patient.fullName}
            sx={{ width: 48, height: 48, flexShrink: 0 }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {patient.fullName}
            </Typography>
            {patient.appointmentTime && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                {patient.appointmentTime}
              </Typography>
            )}
            {patient.reasonForVisit && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: 13 }}
              >
                {patient.reasonForVisit}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
