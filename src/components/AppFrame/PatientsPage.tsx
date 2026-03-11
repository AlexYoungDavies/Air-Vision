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

/** Parse "7:00 AM" / "2:30 PM" to minutes since midnight, or null if unparseable. */
function parseTimeToMinutes(time: string | undefined): number | null {
  if (!time) return null;
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (match[3].toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (match[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

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

  const patientsByVisitCategory = useMemo(() => {
    const morning: Patient[] = [];
    const midday: Patient[] = [];
    const afternoon: Patient[] = [];
    for (const p of TODAYS_PATIENTS) {
      const minutes = parseTimeToMinutes(p.appointmentTime);
      if (minutes === null) continue;
      if (minutes >= 7 * 60 && minutes < 11 * 60) morning.push(p);
      else if (minutes >= 11 * 60 && minutes < 14 * 60) midday.push(p); // 11am - 2pm
      else if (minutes >= 14 * 60 && minutes < 21 * 60) afternoon.push(p); // 2pm - 9pm
    }
    return [
      ['Morning', morning] as const,
      ['Midday', midday] as const,
      ['Afternoon', afternoon] as const,
    ];
  }, []);

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
                  py: 0.5,
                  px: 2,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
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
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ maxWidth: 800, width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Today&apos;s Patients
            </Typography>
            {patientsByVisitCategory.map(([category, patients]) => (
              <Box key={category} sx={{ mb: 2.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    display: 'block',
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {category}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 1.5,
                  }}
                >
                  {patients.map((patient) => (
                    <TodayPatientCard key={patient.id} patient={patient} />
                  ))}
                </Box>
              </Box>
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
        borderRadius: 1.5,
        overflow: 'hidden',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
          <Avatar
            src={patient.picture}
            alt={patient.fullName}
            sx={{ width: 40, height: 40, flexShrink: 0 }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>
              {patient.fullName}
            </Typography>
            {patient.reasonForVisit && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25, fontSize: 12 }}
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
