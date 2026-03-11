import { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { TODAYS_PATIENTS, type Patient } from '../../data/mockPatients';

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

export function TodayPatientsContent() {
  const patientsByVisitCategory = useMemo(() => {
    const morning: Patient[] = [];
    const midday: Patient[] = [];
    const afternoon: Patient[] = [];
    for (const p of TODAYS_PATIENTS) {
      const minutes = parseTimeToMinutes(p.appointmentTime);
      if (minutes === null) continue;
      if (minutes >= 7 * 60 && minutes < 11 * 60) morning.push(p);
      else if (minutes >= 11 * 60 && minutes < 14 * 60) midday.push(p);
      else if (minutes >= 14 * 60 && minutes < 21 * 60) afternoon.push(p);
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
        flex: 1,
        minWidth: 0,
        overflow: 'auto',
        p: 3,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ maxWidth: 800, width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                columnGap: '8px',
                rowGap: '16px',
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
  );
}

function TodayPatientCard({ patient }: { patient: Patient }) {
  return (
    <Card
      component={Link}
      to={`/patients/${patient.id}`}
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        overflow: 'hidden',
        height: 'fit-content',
        border: 'none',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', justifyContent: 'flex-start' }}>
          <Avatar
            variant="rounded"
            src={patient.picture}
            alt={patient.fullName}
            sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: 1 }}
          />
          <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
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
