import { useState, useMemo } from 'react';
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
  IconButton,
  Tooltip,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import {
  getBillingSummary,
  getBillingCharges,
  getBillingTransactions,
  formatCurrency,
  type ChargeStatus,
} from '../../data/mockBilling';
import type { Patient } from '../../data/mockPatients';
import { MOCK_PROVIDERS } from '../../data/mockProviders';

const BILLING_TABS = ['Charges', 'Transaction History', 'Eligibility', 'Touchpoints (538)', 'Claims (60)', 'Prior Authorization (5)'] as const;
const CHARGE_SUB_TABS: { id: ChargeStatus | 'All'; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Outstanding', label: 'Outstanding' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Cancelled', label: 'Cancelled' },
];

const CHARGE_STATUS_CHIP: Record<ChargeStatus, { bgcolor: string; color: string }> = {
  Outstanding: { bgcolor: 'warning.light', color: 'warning.dark' },
  Paid: { bgcolor: 'success.light', color: 'success.dark' },
  Cancelled: { bgcolor: 'action.hover', color: 'text.secondary' },
};

export interface BillingTabContentProps {
  patient: Patient;
}

export function BillingTabContent({ patient }: BillingTabContentProps) {
  const [billingTab, setBillingTab] = useState(0);
  const [chargeFilter, setChargeFilter] = useState<ChargeStatus | 'All'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [dateOfService, setDateOfService] = useState<string>('');
  const [providerId, setProviderId] = useState<string>('');

  const summary = getBillingSummary(patient.id);
  const allCharges = useMemo(() => getBillingCharges(patient.id, patient.fullName), [patient.id, patient.fullName]);
  const transactions = useMemo(() => getBillingTransactions(patient.id), [patient.id]);
  const charges = useMemo(
    () => (chargeFilter === 'All' ? allCharges : allCharges.filter((c) => c.status === chargeFilter)),
    [allCharges, chargeFilter]
  );

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
      {/* Financial Summary */}
      <Box sx={{ px: 2, py: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Financial Summary
            </Typography>
            <Button variant="text" color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 500 }}>
              + Analyze Patient Balance
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, flexShrink: 0 }}>
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
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2, mt: 1.5, py: 1.5 }}>
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
            {/* Filled tabs: first in row */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'stretch',
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              {CHARGE_SUB_TABS.map(({ id, label }) => (
                <Button
                  key={id}
                  variant="text"
                  size="small"
                  onClick={() => setChargeFilter(id)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '8px',
                    minWidth: 0,
                    px: 1.5,
                    py: 0.75,
                    ...(chargeFilter === id
                      ? { bgcolor: 'primary.light', color: 'primary.main' }
                      : { color: 'text.secondary' }),
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Export as PDF">
                <IconButton size="small" aria-label="Export as PDF">
                  <DownloadOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Miscellaneous Charge">
                <IconButton size="small" aria-label="Miscellaneous Charge">
                  <AddOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton
                  size="small"
                  aria-label="Filter"
                  aria-haspopup="true"
                  aria-expanded={Boolean(filterAnchor)}
                  onClick={(e) => setFilterAnchor(e.currentTarget)}
                  sx={{ ...(filterAnchor ? { bgcolor: 'action.selected' } : {}) }}
                >
                  <FilterListOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <Popover
                open={Boolean(filterAnchor)}
                anchorEl={filterAnchor}
                onClose={() => setFilterAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { mt: 1.5, p: 2, minWidth: 280 } } }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    size="small"
                    label="Date of Service"
                    type="date"
                    value={dateOfService}
                    onChange={(e) => setDateOfService(e.target.value)}
                    slotProps={{ htmlInput: { sx: { minWidth: 220 } } }}
                    sx={{ width: 220 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="billing-filter-provider-label">Provider</InputLabel>
                    <Select
                      labelId="billing-filter-provider-label"
                      label="Provider"
                      value={providerId}
                      onChange={(e) => setProviderId(e.target.value)}
                    >
                      <MenuItem value="">All providers</MenuItem>
                      {MOCK_PROVIDERS.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Popover>
              <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Verify</Button>
              <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}>Pay Balance</Button>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: 0, boxShadow: 'none' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>
                    <Checkbox size="small" checked={charges.length > 0 && selectedIds.size === charges.length} indeterminate={selectedIds.size > 0 && selectedIds.size < charges.length} onChange={toggleSelectAll} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Date of Service</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Financial Guarantor</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>PR Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Encounter ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Provider Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>PR</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Paid</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Written Off</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Balance Due</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Action</TableCell>
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

      {/* Transaction History tab */}
      {billingTab === 1 && (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto', borderRadius: 0, boxShadow: 'none' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Payment type</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>Payment method</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>View receipt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{formatCurrency(row.amount)}</TableCell>
                    <TableCell>{row.paymentType}</TableCell>
                    <TableCell>{row.paymentMethod}</TableCell>
                    <TableCell>
                      <Typography component="a" href="#" variant="body2" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        View receipt
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {billingTab !== 0 && billingTab !== 1 && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary">Content for {BILLING_TABS[billingTab]} coming soon.</Typography>
        </Box>
      )}
    </Box>
  );
}
