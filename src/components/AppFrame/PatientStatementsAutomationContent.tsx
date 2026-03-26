import { useState, type ReactNode } from 'react';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  MOCK_BATCH_HISTORY,
  MOCK_LAST_BATCH_META,
  MOCK_OVERALL_STATS,
  MOCK_UPCOMING_SCHEDULE,
} from '../../data/mockPatientStatements';

const TABLE_HEADER_SX = {
  fontWeight: 600,
  fontSize: 13,
  bgcolor: 'grey.50',
  color: 'text.secondary',
  borderBottom: 1,
  borderColor: 'divider',
  py: 1.25,
  whiteSpace: 'nowrap' as const,
};

const TABLE_CELL_SX = {
  fontSize: 13,
  borderBottom: 1,
  borderColor: 'divider',
  py: 1.25,
  verticalAlign: 'middle' as const,
};

const CARD_SX = {
  borderRadius: '9px',
  bgcolor: 'background.paper',
  overflow: 'hidden',
  boxShadow: 'none',
};

const INLINE_BADGE_SX = {
  display: 'inline-flex',
  alignItems: 'center',
  px: 0.75,
  py: 0.25,
  mx: 0.25,
  borderRadius: '6px',
  bgcolor: 'grey.200',
  color: 'text.primary',
  fontSize: 13,
  fontWeight: 600,
};

function SectionCard({ children, sx = {} }: { children: ReactNode; sx?: object }) {
  return (
    <Paper elevation={0} sx={{ ...CARD_SX, ...sx }}>
      {children}
    </Paper>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '9px',
        bgcolor: 'grey.50',
        minHeight: 88,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, lineHeight: 1.4 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
        {value}
      </Typography>
    </Box>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 1.25,
        px: 0,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}

export function PatientStatementsAutomationContent() {
  const [lastBatchFilter, setLastBatchFilter] = useState('all');

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
      }}
    >
      {/* Overall + Last Batch */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        <SectionCard>
          <Box sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>
              Overall
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
              }}
            >
              {MOCK_OVERALL_STATS.map((s) => (
                <StatTile key={s.label} label={s.label} value={s.value} />
              ))}
            </Box>
          </Box>
        </SectionCard>

        <SectionCard>
          <Box
            sx={{
              px: 2.5,
              pt: 2.5,
              pb: 0,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, flex: 1, minWidth: 0, pr: 1 }}>
              {MOCK_LAST_BATCH_META.title}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 88, flexShrink: 0 }}>
              <Select
                value={lastBatchFilter}
                onChange={(e) => setLastBatchFilter(e.target.value)}
                displayEmpty
                sx={{ fontSize: 13, borderRadius: '8px' }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="mail">MAIL</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ px: 2.5, pb: 2.5, pt: 1 }}>
            {MOCK_LAST_BATCH_META.rows.map((row, i) => (
              <Box key={row.label}>
                {i > 0 ? <Divider /> : null}
                <MetricRow label={row.label} value={row.value} />
              </Box>
            ))}
          </Box>
        </SectionCard>
      </Box>

      {/* Batch History */}
      <SectionCard>
        <Box
          sx={{
            px: 2.5,
            pt: 2,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>
            Batch History
          </Typography>
          <Link
            component="button"
            type="button"
            underline="hover"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: 14,
              fontWeight: 500,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'primary.main',
            }}
          >
            <DownloadOutlined sx={{ fontSize: 18 }} />
            Download
          </Link>
        </Box>
        <TableContainer>
          <Table size="small" sx={{ borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={TABLE_HEADER_SX}>Date of Batch</TableCell>
                <TableCell sx={TABLE_HEADER_SX}>Delivered Texts</TableCell>
                <TableCell sx={TABLE_HEADER_SX}>Not Delivered Texts</TableCell>
                <TableCell sx={TABLE_HEADER_SX}>Delivered Emails</TableCell>
                <TableCell sx={TABLE_HEADER_SX}>Not Delivered Emails</TableCell>
                <TableCell sx={TABLE_HEADER_SX}>Total Sent in Batch</TableCell>
                <TableCell sx={TABLE_HEADER_SX}>Total Amount Paid in Batch</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_BATCH_HISTORY.map((row) => (
                <TableRow key={row.date} hover>
                  <TableCell sx={{ ...TABLE_CELL_SX, fontWeight: 500 }}>{row.date}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{row.deliveredTexts || '—'}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{row.notDeliveredTexts || '—'}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{row.deliveredEmails || '—'}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{row.notDeliveredEmails || '—'}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{row.totalSent}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{row.totalPaid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      {/* Upcoming Batch */}
      <SectionCard sx={{ mb: 1 }}>
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>
              Upcoming Batch
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Link
                component="button"
                type="button"
                underline="hover"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'primary.main',
                }}
              >
                <DownloadOutlined sx={{ fontSize: 18 }} />
                Download Upcoming Batch
              </Link>
              <Button variant="contained" disabled sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}>
                Send Now
              </Button>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5 }}>
            Scheduled to be sent out in
            <Box component="span" sx={INLINE_BADGE_SX}>
              {MOCK_UPCOMING_SCHEDULE.batchCount}
            </Box>
            daily batches of
            <Box component="span" sx={INLINE_BADGE_SX}>
              {MOCK_UPCOMING_SCHEDULE.patientsPerBatch}
            </Box>
            patients each, across
            <Box component="span" sx={INLINE_BADGE_SX}>
              {MOCK_UPCOMING_SCHEDULE.weekdays}
            </Box>
            between
            <Box component="span" sx={INLINE_BADGE_SX}>
              {MOCK_UPCOMING_SCHEDULE.rangeLabel}
            </Box>
          </Typography>

          <Box
            sx={{
              bgcolor: 'grey.50',
              borderRadius: '9px',
              p: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Scheduled to be sent out on{' '}
                <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {MOCK_UPCOMING_SCHEDULE.sendDate}
                </Box>
              </Typography>
              <Link
                component="button"
                type="button"
                underline="hover"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'primary.main',
                }}
              >
                Reschedule
                <CalendarMonthOutlined sx={{ fontSize: 18 }} />
              </Link>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' },
                gap: 2,
              }}
            >
              {[
                { label: 'Total PR', value: '$0.00' },
                { label: '# Patients', value: '—' },
                { label: '% Of Outstanding PR', value: '—' },
                { label: 'Highest PR', value: '$0.00' },
                { label: 'Lowest PR', value: '—' },
              ].map((m) => (
                <Box key={m.label}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {m.label}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {m.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder="Filter by patient name"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'grey.50',
                borderRadius: '9px',
              },
            }}
          />

          <TableContainer>
            <Table size="small" sx={{ borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={TABLE_HEADER_SX}>Patient</TableCell>
                  <TableCell sx={{ ...TABLE_HEADER_SX, textAlign: 'center' }}>Last Contacted</TableCell>
                  <TableCell sx={{ ...TABLE_HEADER_SX, textAlign: 'right' }}>Current Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{
                      ...TABLE_CELL_SX,
                      py: 6,
                      textAlign: 'center',
                      color: 'text.secondary',
                      fontSize: 14,
                    }}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </SectionCard>
    </Box>
  );
}
