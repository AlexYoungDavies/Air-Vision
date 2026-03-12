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
  Chip,
} from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';

const PAGE_HEADER = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 2,
  py: 2,
  flexShrink: 0,
  borderBottom: 1,
  borderColor: 'divider',
};

const mockMedications = [
  { id: '1', name: 'Lisinopril', dose: '10 mg', frequency: 'Once daily', status: 'Active', prescriber: 'Dr. Smith' },
  { id: '2', name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', status: 'Active', prescriber: 'Dr. Smith' },
  { id: '3', name: 'Atorvastatin', dose: '20 mg', frequency: 'Once daily at bedtime', status: 'Active', prescriber: 'Dr. Jones' },
  { id: '4', name: 'Omeprazole', dose: '20 mg', frequency: 'Once daily', status: 'Active', prescriber: 'Dr. Smith' },
];

export function MedicationsTabContent({ patientId: _patientId }: { patientId: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={PAGE_HEADER}>
        <Typography variant="h6" fontWeight={600}>Medications</Typography>
        <Button variant="outlined" size="small" startIcon={<AddOutlined />}>Add medication</Button>
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Medication</TableCell>
              <TableCell>Dose</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Prescriber</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockMedications.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.dose}</TableCell>
                <TableCell>{row.frequency}</TableCell>
                <TableCell><Chip label={row.status} size="small" color="success" variant="outlined" /></TableCell>
                <TableCell>{row.prescriber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const mockOrders = [
  { id: '1', type: 'Lab - CBC', date: '2025-03-01', status: 'Completed', provider: 'Dr. Smith' },
  { id: '2', type: 'Imaging - X-Ray Chest', date: '2025-03-05', status: 'Pending', provider: 'Dr. Jones' },
  { id: '3', type: 'Referral - Cardiology', date: '2025-02-28', status: 'Sent', provider: 'Dr. Smith' },
  { id: '4', type: 'Lab - Metabolic Panel', date: '2025-02-20', status: 'Completed', provider: 'Dr. Smith' },
];

export function OrdersTabContent({ patientId: _patientId }: { patientId: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={PAGE_HEADER}>
        <Typography variant="h6" fontWeight={600}>Orders</Typography>
        <Button variant="outlined" size="small" startIcon={<AddOutlined />}>New order</Button>
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Order type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ordering provider</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockOrders.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{row.provider}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const mockProblems = [
  { id: '1', problem: 'Essential (primary) hypertension', status: 'Active', onset: '2020-05', icd: 'I10' },
  { id: '2', problem: 'Type 2 diabetes mellitus', status: 'Active', onset: '2019-08', icd: 'E11.9' },
  { id: '3', problem: 'Hyperlipidemia', status: 'Active', onset: '2021-01', icd: 'E78.5' },
  { id: '4', problem: 'Seasonal allergic rhinitis', status: 'Resolved', onset: '2018-03', icd: 'J30.2' },
];

export function ProblemListTabContent({ patientId: _patientId }: { patientId: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={PAGE_HEADER}>
        <Typography variant="h6" fontWeight={600}>Problem list</Typography>
        <Button variant="outlined" size="small" startIcon={<AddOutlined />}>Add problem</Button>
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Problem</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Onset</TableCell>
              <TableCell>ICD-10</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockProblems.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.problem}</TableCell>
                <TableCell><Chip label={row.status} size="small" color={row.status === 'Active' ? 'primary' : 'default'} variant="outlined" /></TableCell>
                <TableCell>{row.onset}</TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>{row.icd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const mockLabs = [
  { id: '1', name: 'CBC', date: '2025-03-01', result: 'Within normal limits', provider: 'Dr. Smith' },
  { id: '2', name: 'Comprehensive Metabolic Panel', date: '2025-03-01', result: 'Glucose 108 (H)', provider: 'Dr. Smith' },
  { id: '3', name: 'HbA1c', date: '2025-02-15', result: '6.8%', provider: 'Dr. Jones' },
  { id: '4', name: 'Lipid Panel', date: '2025-02-15', result: 'LDL 98', provider: 'Dr. Jones' },
];

export function LabsTabContent({ patientId: _patientId }: { patientId: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={PAGE_HEADER}>
        <Typography variant="h6" fontWeight={600}>Labs</Typography>
        <Button variant="outlined" size="small" startIcon={<AddOutlined />}>Order lab</Button>
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Lab</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Ordering provider</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockLabs.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.result}</TableCell>
                <TableCell>{row.provider}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const mockVitals = [
  { id: '1', date: '2025-03-10', bp: '128/82', hr: 72, temp: '98.6°F', weight: '185 lb', resp: 16 },
  { id: '2', date: '2025-02-15', bp: '132/84', hr: 76, temp: '98.4°F', weight: '186 lb', resp: 14 },
  { id: '3', date: '2025-01-10', bp: '130/80', hr: 74, temp: '98.6°F', weight: '188 lb', resp: 16 },
];

export function VitalsTabContent({ patientId: _patientId }: { patientId: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={PAGE_HEADER}>
        <Typography variant="h6" fontWeight={600}>Vitals</Typography>
        <Button variant="outlined" size="small" startIcon={<AddOutlined />}>Record vitals</Button>
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Blood pressure</TableCell>
              <TableCell>Heart rate</TableCell>
              <TableCell>Temp</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Resp.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockVitals.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.bp}</TableCell>
                <TableCell>{row.hr}</TableCell>
                <TableCell>{row.temp}</TableCell>
                <TableCell>{row.weight}</TableCell>
                <TableCell>{row.resp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const mockAllergies = [
  { id: '1', allergen: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
  { id: '2', allergen: 'Sulfa drugs', reaction: 'Hives', severity: 'Mild' },
];

export function AllergiesTabContent({ patientId: _patientId }: { patientId: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={PAGE_HEADER}>
        <Typography variant="h6" fontWeight={600}>Allergies</Typography>
        <Button variant="outlined" size="small" startIcon={<AddOutlined />}>Add allergy</Button>
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Allergen</TableCell>
              <TableCell>Reaction</TableCell>
              <TableCell>Severity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockAllergies.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.allergen}</TableCell>
                <TableCell>{row.reaction}</TableCell>
                <TableCell>
                  <Chip
                    label={row.severity}
                    size="small"
                    color={row.severity === 'Moderate' ? 'warning' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const mockImmunizations = [
  { id: '1', vaccine: 'Influenza (seasonal)', date: '2024-10-15', dose: '1' },
  { id: '2', vaccine: 'COVID-19 (updated)', date: '2024-09-01', dose: '1' },
  { id: '3', vaccine: 'Tdap', date: '2022-03-12', dose: '1' },
  { id: '4', vaccine: 'Pneumococcal (PPSV23)', date: '2021-06-20', dose: '1' },
];

export function ImmunizationsTabContent({ patientId: _patientId }: { patientId: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={PAGE_HEADER}>
        <Typography variant="h6" fontWeight={600}>Immunizations</Typography>
        <Button variant="outlined" size="small" startIcon={<AddOutlined />}>Record immunization</Button>
      </Box>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Vaccine</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Dose</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockImmunizations.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.vaccine}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.dose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
