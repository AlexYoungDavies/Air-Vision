import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Tabs,
  Tab,
  Checkbox,
} from '@mui/material';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import PushPinOutlined from '@mui/icons-material/PushPinOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import QuestionAnswerOutlined from '@mui/icons-material/QuestionAnswerOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import {
  getBillingSummary,
  getBillingCharges,
  formatCurrency,
  type ChargeStatus,
} from '../../data/mockBilling';
import type { Patient } from '../../data/mockPatients';

const BILLING_TABS = ['Charges', 'Credits ($0.00)', 'Transaction History', 'Eligibility', 'Touchpoints (538)', 'Claims (60)', 'Prior Authorization (5)', 'Documents'] as const;
const CHARGE_SUB_TABS: { id: ChargeStatus | 'All'; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Outstanding', label: 'Outstanding' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Cancelled', label: 'Cancelled' },
];

const CHARGE_STATUS_CHIP: Record<ChargeStatus, { bgcolor: string; color: string }> = {
  Outstanding: { bgcolor: '#fff3e0', color: '#e65100' },
  Paid: { bgcolor: '#e8f5e9', color: '#2e7d32' },
  Cancelled: { bgcolor: '#f5f5f5', color: '#616161' },
};

export interface BillingTabContentProps {
  patient: Patient;
}

function formatAddress(patient: Patient): string {
  const { line1, line2, city, state, zip } = patient.homeAddress;
  return [line1, line2, `${city}, ${state} ${zip}`].filter(Boolean).join(', ');
}

export function BillingTabContent({ patient }: BillingTabContentProps) {
  const [billingTab, setBillingTab] = useState(0);
  const [chargeFilter, setChargeFilter] = useState<ChargeStatus | 'All'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const summary = getBillingSummary(patient.id);
  const allCharges = useMemo(() => getBillingCharges(patient.id, patient.fullName), [patient.id, patient.fullName]);
  const charges = useMemo(
    () => (chargeFilter === 'All' ? allCharges : allCharges.filter((c) => c.status === chargeFilter)),
    [allCharges, chargeFilter]
  );

  const patientDisplayId = 2000000 + parseInt(patient.id, 10);

  const toggleSelectAll = () => {
    if (selectedIds.size === charges.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(charges.map((c) => c.id)));
  };
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
      {/* Back + Patient header */}
      <Box sx={{ px: 2, pt: 2, pb: 1, flexShrink: 0 }}>
        <Link to="/patients" style={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'inherit', textDecoration: 'none', fontSize: 14, marginBottom: 1 }}>
          <ArrowBackOutlined sx={{ fontSize: 18 }} /> Back
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {patient.fullName}
              </Typography>
              <Chip label={`Patient ID: ${patientDisplayId}`} size="small" sx={{ bgcolor: '#f5f5f5', color: '#616161', fontWeight: 500, fontSize: '0.75rem' }} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 3, rowGap: 0.5, mt: 1.5, typography: 'body2', color: 'text.secondary' }}>
              <Typography variant="body2" color="text.secondary">Gender:</Typography>
              <Typography variant="body2" color="text.secondary">{patient.gender}</Typography>
              <Typography variant="body2" color="text.secondary">Address:</Typography>
              <Typography variant="body2" color="text.secondary">{formatAddress(patient)}</Typography>
              <Typography variant="body2" color="text.secondary">Phone:</Typography>
              <Typography variant="body2" color="text.secondary">{patient.phone}</Typography>
              <Typography variant="body2" color="text.secondary">Email:</Typography>
              <Typography variant="body2" color="text.secondary">{patient.email}</Typography>
              <Typography variant="body2" color="text.secondary">Date of Birth:</Typography>
              <Typography variant="body2" color="text.secondary">{patient.dateOfBirth}</Typography>
              <Typography variant="body2" color="text.secondary">Primary Language:</Typography>
              <Typography variant="body2" color="text.secondary">English</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}>
              Cards On File
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <Button variant="text" size="small" sx={{ minWidth: 32, px: 0.5 }}><PushPinOutlined sx={{ fontSize: 18 }} /></Button>
              <Button variant="text" size="small" sx={{ minWidth: 32, px: 0.5 }}><FlagOutlined sx={{ fontSize: 18 }} /></Button>
              <Button variant="text" size="small" sx={{ minWidth: 32, px: 0.5 }}><QuestionAnswerOutlined sx={{ fontSize: 18 }} /></Button>
              <Button variant="text" size="small" sx={{ minWidth: 32, px: 0.5 }}><DownloadOutlined sx={{ fontSize: 18 }} /></Button>
              <Button variant="text" size="small" sx={{ minWidth: 32, px: 0.5 }}><FolderOutlined sx={{ fontSize: 18 }} /></Button>
              <Button variant="text" size="small" sx={{ minWidth: 32, px: 0.5 }}><EditOutlined sx={{ fontSize: 18 }} /></Button>
            </Box>
            <Link to="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'primary.main', fontSize: 14, textDecoration: 'none' }}>
              <EditOutlined sx={{ fontSize: 16 }} /> Edit
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Financial Summary */}
      <Box sx={{ px: 2, py: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Financial Summary
          </Typography>
          <Button variant="text" color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 500 }}>
            + Analyze Patient Balance
          </Button>
        </Box>
        {/* Status toggles - directly below Financial Summary heading */}
        <Box sx={{ display: 'flex', gap: 3, py: 1.5, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
            <Typography variant="body2" color="text.secondary">Auto Send Text Message: Active</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.400' }} />
            <Typography variant="body2" color="text.secondary">Payment Plan: Inactive</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.400' }} />
            <Typography variant="body2" color="text.secondary">In Collections: Inactive</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          All {patient.fullName}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2 }}>
          <Box><Typography variant="caption" color="text.secondary">Patient Charges</Typography><Typography variant="body1" fontWeight={600}>{formatCurrency(summary.patientCharges)}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Payments</Typography><Typography variant="body1" fontWeight={600}>{formatCurrency(summary.payments)}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Balance</Typography><Typography variant="body1" fontWeight={600}>{formatCurrency(summary.balance)}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Available Credit</Typography><Typography variant="body1" fontWeight={600}>{formatCurrency(summary.availableCredit)}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Locked Credit</Typography><Typography variant="body1" fontWeight={600}>{formatCurrency(summary.lockedCredit)}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Refunds</Typography><Typography variant="body1" fontWeight={600}>{formatCurrency(summary.refunds)}</Typography></Box>
        </Box>
      </Box>

      {/* Billing sub-tabs */}
      <Tabs
        value={billingTab}
        onChange={(_, v) => setBillingTab(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          px: 2,
          minHeight: 0,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTabs-flexContainer': { gap: '16px' },
          '& .MuiTabs-indicator': { height: 2 },
          '& .MuiTab-root': { minHeight: 0, minWidth: 'unset', pt: 0.75, paddingBottom: '8px', paddingLeft: '2px', paddingRight: '2px', textTransform: 'none', fontWeight: 500, fontSize: 14 },
        }}
      >
        {BILLING_TABS.map((label, idx) => (
          <Tab key={label} label={label} value={idx} />
        ))}
      </Tabs>

      {/* Charges tab content */}
      {billingTab === 0 && (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField size="small" placeholder="Date of Service" sx={{ width: 160 }} />
              <TextField size="small" placeholder="Provider" sx={{ width: 140 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {CHARGE_SUB_TABS.map(({ id, label }) => (
                <Button
                  key={id}
                  variant={chargeFilter === id ? 'contained' : 'text'}
                  size="small"
                  onClick={() => setChargeFilter(id)}
                  sx={{ textTransform: 'none', fontWeight: 500, boxShadow: chargeFilter === id ? 'none' : undefined }}
                >
                  {label}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant="text" size="small" startIcon={<DownloadOutlined />} sx={{ textTransform: 'none' }}>Export as PDF</Button>
              <Button variant="text" size="small" startIcon={<AddOutlined />} sx={{ textTransform: 'none' }}>Miscellaneous Charge</Button>
              <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}>Pay Balance</Button>
              <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Verify</Button>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: 0, boxShadow: 'none' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                    <Checkbox size="small" checked={charges.length > 0 && selectedIds.size === charges.length} indeterminate={selectedIds.size > 0 && selectedIds.size < charges.length} onChange={toggleSelectAll} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Date of Service</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Financial Guarantor</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>PR Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Encounter ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Provider Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>PR</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Paid</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Written Off</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Balance Due</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {charges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 4, color: 'text.secondary' }}>No charges match the selected filter.</TableCell>
                  </TableRow>
                ) : (
                  charges.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell padding="checkbox"><Checkbox size="small" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} /></TableCell>
                      <TableCell>{row.dateOfService}</TableCell>
                      <TableCell>{row.patientName}</TableCell>
                      <TableCell>{row.financialGuarantor}</TableCell>
                      <TableCell>{row.prStatus}</TableCell>
                      <TableCell>{row.encounterId}</TableCell>
                      <TableCell>{row.providerName}</TableCell>
                      <TableCell>{formatCurrency(row.pr)}</TableCell>
                      <TableCell>{formatCurrency(row.paid)}</TableCell>
                      <TableCell>{formatCurrency(row.writtenOff)}</TableCell>
                      <TableCell>{formatCurrency(row.balanceDue)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={row.status} sx={{ ...CHARGE_STATUS_CHIP[row.status], fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell><Button variant="text" size="small" sx={{ textTransform: 'none', p: 0, minWidth: 0 }}>View Details</Button></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {billingTab !== 0 && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary">Content for {BILLING_TABS[billingTab]} coming soon.</Typography>
        </Box>
      )}
    </Box>
  );
}
