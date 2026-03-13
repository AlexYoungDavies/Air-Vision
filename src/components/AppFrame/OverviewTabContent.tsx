import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { AppIconButton } from '../AppIconButton';
import PushPinOutlined from '@mui/icons-material/PushPinOutlined';
import QuestionAnswerOutlined from '@mui/icons-material/QuestionAnswerOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import Emergency from '@mui/icons-material/Emergency';
import Gavel from '@mui/icons-material/Gavel';
import AttachMoney from '@mui/icons-material/AttachMoney';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import type { Patient } from '../../data/mockPatients';
import { getAppointmentsForPatient, type Appointment } from '../../data/mockAppointments';
import { STICKY_ACTIONS_CELL, STICKY_ACTIONS_HEADER, STATUS_CHIP_STYLES, COLUMN_HEADER_STYLE, COLUMN_BODY_STYLE } from './AppointmentsTabContent';
import { getBillingSummary, formatCurrency } from '../../data/mockBilling';
import {
  getActiveMedicationsForPatient,
  getReferralsAndPriorAuthsForPatient,
  getContactsForPatient,
  getAlertsForPatient,
} from '../../data/mockOverview';
import { LabelValue } from './LabelValue';

const OVERVIEW_SUB_TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'cases', label: 'Cases' },
  { id: 'profile', label: 'Profile' },
] as const;

type OverviewSubTabId = (typeof OVERVIEW_SUB_TABS)[number]['id'];

export interface OverviewTabContentProps {
  patient: Patient;
  onSecondaryPanelMode?: (mode: 'pin' | 'chat' | 'tasks' | 'history' | null) => void;
  /** Navigate to a main profile tab (e.g. appointments, billing, medications). */
  onNavigateToTab?: (tabId: string) => void;
  /** Called when user clicks "Open Note" on a complete appointment. Opens a visit note tab. */
  onOpenNote?: (appointment: Appointment) => void;
}

function SectionCard({
  title,
  supportingContent,
  children,
  onAdd,
}: {
  title: string;
  supportingContent?: React.ReactNode;
  children: React.ReactNode;
  onAdd?: () => void;
}) {
  return (
    <Box
      sx={{
        borderRadius: 1,
        boxShadow: '0 2px 8px 2px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
      }}
    >
      <Box
        sx={{
          borderRadius: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          height: '100%',
        }}
      >
      <Box
        sx={{
          px: 1,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            {title}
          </Typography>
          {supportingContent != null && (
            <Box component="span" sx={{ fontSize: 12, color: 'text.secondary', flexShrink: 0 }}>
              {supportingContent}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          {onAdd && (
            <AppIconButton tooltip="Add" onClick={onAdd} aria-label="Add">
              <AddOutlined sx={{ fontSize: 16, color: 'primary.main' }} />
            </AppIconButton>
          )}
        </Box>
      </Box>
      <Box sx={{ flex: 1, bgcolor: 'background.paper', p: 0, overflow: 'auto' }}>
        {children}
      </Box>
      </Box>
    </Box>
  );
}

const FINANCIAL_METRICS: { key: keyof ReturnType<typeof getBillingSummary>; label: string }[] = [
  { key: 'patientCharges', label: 'Patient Charges' },
  { key: 'payments', label: 'Payments' },
  { key: 'balance', label: 'Outstanding Balance' },
  { key: 'availableCredit', label: 'Available Credit' },
  { key: 'lockedCredit', label: 'Locked Credit' },
  { key: 'refunds', label: 'Refunds' },
];

const RECENT_VISITS_LIMIT = 5;

/** Inline link style for supporting text (12px, light grey, underlined, clickable). */
function SupportingLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        fontSize: 12,
        color: 'text.secondary',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textDecoration: 'underline',
        fontFamily: 'inherit',
        '&:hover': { color: 'text.primary' },
      }}
    >
      {children}
    </Box>
  );
}

function SummaryView({
  patient,
  onNavigateToTab,
  onOpenNote,
  onSetOverviewSubTab,
}: OverviewTabContentProps & { onSetOverviewSubTab?: (subTab: OverviewSubTabId) => void }) {
  const [moreAnchor, setMoreAnchor] = useState<{ el: HTMLElement; appointment: Appointment } | null>(null);
  const financialSummary = getBillingSummary(patient.id);
  const recentVisits = useMemo(
    () => getAppointmentsForPatient(patient.id).slice(0, RECENT_VISITS_LIMIT),
    [patient.id]
  );
  const activeMedications = useMemo(
    () => getActiveMedicationsForPatient(patient.id),
    [patient.id]
  );
  const referralsAndPriorAuths = useMemo(
    () => getReferralsAndPriorAuthsForPatient(patient.id),
    [patient.id]
  );
  const contacts = useMemo(() => getContactsForPatient(patient), [patient]);
  const alerts = useMemo(() => getAlertsForPatient(patient.id), [patient.id]);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'auto 320px 240px auto',
        gap: '16px',
        minHeight: 0,
      }}
    >
      {/* Row 1: Financial Summary — full width */}
      <Box sx={{ gridColumn: '1 / -1', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <SectionCard
          title="Financial Summary"
          supportingContent={
            onNavigateToTab ? (
              <SupportingLink onClick={() => onNavigateToTab('billing')}>See billing profile</SupportingLink>
            ) : undefined
          }
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              gap: 3,
              height: '100%',
            }}
          >
            {FINANCIAL_METRICS.map(({ key, label }) => (
              <Box
                key={key}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  minWidth: 0,
                  py: 1.5,
                  px: 2,
                }}
              >
                <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.25 }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary' }}>
                  {formatCurrency(financialSummary[key] as number)}
                </Typography>
              </Box>
            ))}
          </Box>
        </SectionCard>
      </Box>

      {/* Row 2: Visits (3 cols) + Alerts (1 col) — same columns/actions as Appointments tab, capped at 5 */}
      <Box sx={{ gridColumn: 'span 3', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <SectionCard
          title="Visits"
          supportingContent={
            onNavigateToTab ? (
              <>
                Showing 5 most recent.{' '}
                <SupportingLink onClick={() => onNavigateToTab('appointments')}>View all</SupportingLink>
              </>
            ) : undefined
          }
          onAdd={() => {}}
        >
          <TableContainer sx={{ overflow: 'auto', maxHeight: 320 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Case</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Template</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Clinical stage</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Insurance</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Facility</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', ...COLUMN_HEADER_STYLE }}>Tags</TableCell>
                  <TableCell sx={{ fontWeight: 600, ...STICKY_ACTIONS_HEADER }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentVisits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 2, color: 'text.secondary', fontSize: 13 }}>
                      No visits yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recentVisits.map((apt) => {
                    const isComplete = apt.status === 'Complete';
                    return (
                      <TableRow
                        key={apt.id}
                        hover
                        onDoubleClick={() => isComplete && onOpenNote?.(apt)}
                        sx={isComplete ? { cursor: 'pointer' } : undefined}
                      >
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }} title={apt.date}>{apt.date}</TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }} title={apt.time}>{apt.time}</TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }}>
                          <Chip
                            label={apt.status}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              maxWidth: '100%',
                              '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                              ...STATUS_CHIP_STYLES[apt.status],
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }} title={`${apt.caseName} [${apt.caseId}]`}>{`${apt.caseName} [${apt.caseId}]`}</TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }} title={apt.template}>{apt.template}</TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }} title={apt.clinicalStage}>{apt.clinicalStage}</TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }} title={apt.provider}>{apt.provider}</TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }} title={apt.insurance}>{apt.insurance}</TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE }} title={apt.facility}>{apt.facility}</TableCell>
                        <TableCell sx={{ fontSize: 13, ...COLUMN_BODY_STYLE, '& .MuiBox-root': { overflow: 'hidden', textOverflow: 'ellipsis' } }}>
                          {apt.tags && apt.tags.length > 0 ? (
                            <Box component="span" sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, overflow: 'hidden', minWidth: 0 }}>
                              {apt.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  sx={{ fontSize: '0.75rem', bgcolor: '#f5f5f5', color: '#616161', flexShrink: 0 }}
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
        </SectionCard>
      </Box>
      <Box sx={{ gridColumn: 'span 1', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <SectionCard title="Alerts">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}>
            {alerts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No alerts
              </Typography>
            ) : (
              alerts.map((alert) => (
                <Box
                  key={alert.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    px: 1,
                    py: 0.75,
                    borderRadius: '4px',
                    ...(alert.variant === 'warning' && {
                      bgcolor: 'rgba(237, 108, 2, 0.1)',
                      borderLeft: '4px solid',
                      borderColor: 'warning.main',
                    }),
                    ...(alert.variant === 'highlight' && {
                      bgcolor: 'rgba(2, 136, 209, 0.08)',
                      borderLeft: '4px solid',
                      borderColor: 'info.main',
                    }),
                  }}
                >
                  {alert.variant === 'warning' ? (
                    <WarningAmberOutlined sx={{ fontSize: 18, color: 'warning.main', flexShrink: 0, mt: 0.125 }} />
                  ) : (
                    <ImageOutlined sx={{ fontSize: 18, color: 'info.main', flexShrink: 0, mt: 0.125 }} />
                  )}
                  <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.4 }}>
                    {alert.message}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </SectionCard>
      </Box>

      {/* Row 3: Medications (2 cols) + Authorizations (2 cols) */}
      <Box sx={{ gridColumn: 'span 2', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <SectionCard
          title="Medications"
          supportingContent={
            onNavigateToTab ? (
              <SupportingLink onClick={() => onNavigateToTab('medications')}>View all</SupportingLink>
            ) : undefined
          }
          onAdd={() => {}}
        >
          <TableContainer sx={{ overflow: 'auto', maxHeight: 220 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ height: 28, minHeight: 28 }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Medication</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Dose</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Frequency</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Prescriber</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeMedications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ py: 2, color: 'text.secondary', fontSize: 13 }}>
                      No active medications
                    </TableCell>
                  </TableRow>
                ) : (
                  activeMedications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell sx={{ fontSize: 13 }}>{med.name}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{med.dose}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{med.frequency}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{med.prescriber}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      </Box>
      <Box sx={{ gridColumn: 'span 2', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <SectionCard
          title="Authorizations"
          supportingContent={
            onSetOverviewSubTab ? (
              <>
                Showing 5 most recent. <SupportingLink onClick={() => onSetOverviewSubTab('insurance')}>View all</SupportingLink>
              </>
            ) : undefined
          }
          onAdd={() => {}}
        >
          <TableContainer sx={{ overflow: 'auto', maxHeight: 220 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ height: 28, minHeight: 28 }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {referralsAndPriorAuths.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ py: 2, color: 'text.secondary', fontSize: 13 }}>
                      No referrals or prior authorizations
                    </TableCell>
                  </TableRow>
                ) : (
                  referralsAndPriorAuths.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ fontSize: 13 }}>{row.type}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.description}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.date}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      </Box>

      {/* Row 4: Contacts — full width */}
      <Box sx={{ gridColumn: '1 / -1', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <SectionCard title="Contacts" onAdd={() => {}}>
          <Box sx={{ p: '12px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1.5 }}>
              {contacts.map((c, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: 'flex-start',
                    gap: 0.25,
                    py: 1,
                    px: 1.5,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    flex: '1 1 0',
                    maxWidth: '23%',
                    minWidth: 0,
                  }}
                >
                {c.type != null && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: 11,
                      height: 22,
                      ...(c.type === 'Emergency' && {
                        bgcolor: 'rgba(211, 47, 47, 0.14)',
                        color: '#b71c1c',
                      }),
                      ...(c.type === 'Legal' && {
                        bgcolor: 'rgba(0, 151, 105, 0.14)',
                        color: '#00563c',
                      }),
                      ...(c.type === 'Guarantor' && {
                        bgcolor: 'rgba(46, 125, 50, 0.14)',
                        color: '#1b5e20',
                      }),
                      ...(c.type === 'Family' && {
                        bgcolor: 'rgba(97, 97, 97, 0.12)',
                        color: '#424242',
                      }),
                    }}
                  >
                    {c.type === 'Emergency' && (
                      <Emergency sx={{ width: 14, height: 14, fontSize: 14, flexShrink: 0 }} />
                    )}
                    {c.type === 'Legal' && (
                      <Gavel sx={{ width: 14, height: 14, fontSize: 14, flexShrink: 0 }} />
                    )}
                    {c.type === 'Guarantor' && (
                      <AttachMoney sx={{ width: 14, height: 14, fontSize: 14, flexShrink: 0 }} />
                    )}
                    <span>{c.type}</span>
                  </Box>
                )}
                <Typography sx={{ fontSize: 15, fontWeight: 600, pr: c.type != null ? 6 : 0 }}>
                  {c.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {c.relationship}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {c.phone}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {c.email}
                </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </SectionCard>
      </Box>
    </Box>
  );
}

/** Unique case derived from appointments (caseId + caseName + count). */
interface CaseRow {
  caseId: string;
  caseName: string;
  appointmentCount: number;
}

function getCasesFromAppointments(appointments: Appointment[]): CaseRow[] {
  const byCase = new Map<string, { caseName: string; count: number }>();
  for (const apt of appointments) {
    const existing = byCase.get(apt.caseId);
    if (existing) {
      existing.count += 1;
    } else {
      byCase.set(apt.caseId, { caseName: apt.caseName, count: 1 });
    }
  }
  return Array.from(byCase.entries()).map(([caseId, { caseName, count }]) => ({
    caseId,
    caseName,
    appointmentCount: count,
  }));
}

function InsuranceView({ patient }: { patient: Patient }) {
  const insurances = [patient.insurance];
  const authorizations = useMemo(
    () => getReferralsAndPriorAuthsForPatient(patient.id),
    [patient.id]
  );
  return (
    <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Insurance on file
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ height: 28, minHeight: 28 }}>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Provider</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Member ID</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Group Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {insurances.map((ins, i) => (
                <TableRow key={i}>
                  <TableCell>{ins.provider}</TableCell>
                  <TableCell>{ins.memberId}</TableCell>
                  <TableCell>{ins.groupNumber ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Authorizations
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ height: 28, minHeight: 28 }}>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authorizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 2, color: 'text.secondary', fontSize: 13 }}>
                    No referrals or prior authorizations
                  </TableCell>
                </TableRow>
              ) : (
                authorizations.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontSize: 13 }}>{row.type}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{row.description}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{row.date}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{row.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

function CasesView({ patient }: { patient: Patient }) {
  const appointments = getAppointmentsForPatient(patient.id);
  const cases = useMemo(() => getCasesFromAppointments(appointments), [appointments]);
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Cases
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ height: 28, minHeight: 28 }}>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Case name</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }}>Case ID</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 0.5, lineHeight: 1.2 }} align="right">Appointments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((row) => (
              <TableRow key={row.caseId}>
                <TableCell>{row.caseName}</TableCell>
                <TableCell>{row.caseId}</TableCell>
                <TableCell align="right">{row.appointmentCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function ProfileView({ patient }: { patient: Patient }) {
  const { fullName, dateOfBirth, email, phone, gender, homeAddress, emergencyContact } = patient;
  return (
    <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6">Demographics</Typography>
      <Box sx={{ display: 'grid', gap: 2, maxWidth: 480 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Full name</Typography>
          <Typography>{fullName}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Date of birth</Typography>
          <Typography>{dateOfBirth}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Gender</Typography>
          <Typography>{gender}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Email</Typography>
          <Typography>{email}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Phone</Typography>
          <Typography>{phone}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Address</Typography>
          <Typography>
            {homeAddress.line1}
            {homeAddress.line2 ? `, ${homeAddress.line2}` : ''}
            <br />
            {homeAddress.city}, {homeAddress.state} {homeAddress.zip}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Emergency contact</Typography>
          <Typography>
            {emergencyContact.name} — {emergencyContact.relationship}
            <br />
            {emergencyContact.phone}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function OverviewTabContent({ patient, onSecondaryPanelMode, onNavigateToTab, onOpenNote }: OverviewTabContentProps) {
  const [subTab, setSubTab] = useState<OverviewSubTabId>('summary');

  return (
    <Box
      sx={{
        px: 6,
        py: 4,
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Container: patient name + LabelValue row (always visible) */}
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
              {patient.fullName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[
                { mode: 'pin' as const, Icon: PushPinOutlined, title: 'Pin' },
                { mode: 'chat' as const, Icon: QuestionAnswerOutlined, title: 'Chat' },
                { mode: 'tasks' as const, Icon: TaskAltOutlined, title: 'Tasks' },
                { mode: 'history' as const, Icon: HistoryOutlined, title: 'History' },
              ].map(({ mode, Icon, title }) => (
                <Tooltip key={mode} title={title}>
                  <IconButton
                    size="small"
                    onClick={() => onSecondaryPanelMode?.(mode)}
                    sx={{ borderRadius: '52px' }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', typography: 'body2' }}>
            {[
              { label: 'MRN', value: patient.mrn },
              { label: 'Age', value: String(patient.age) },
              { label: 'Gender', value: patient.gender },
              { label: 'Language', value: patient.language ?? 'English' },
              { label: 'Patient since', value: patient.patientSince ?? '—' },
            ].map(({ label, value }) => (
              <LabelValue key={label} label={label} value={value} />
            ))}
          </Box>
        </Box>

        {/* Tab bar: Summary, Insurance, Cases, Profile — pill style, accent color for active */}
        <Tabs
          value={subTab}
          onChange={(_, v: OverviewSubTabId) => setSubTab(v)}
          sx={{
            flexShrink: 0,
            minHeight: 0,
            '& .MuiTab-root': {
              minHeight: 0,
              py: 0.75,
              px: 1.5,
              fontSize: 14,
              fontWeight: 400,
              textTransform: 'none',
              borderRadius: '8px !important',
              color: 'text.secondary',
            },
            '& .Mui-selected': {
              bgcolor: 'primary.light',
              color: 'primary.dark',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': { gap: 0.5 },
          }}
        >
          {OVERVIEW_SUB_TABS.map(({ id, label }) => (
            <Tab key={id} value={id} label={label} />
          ))}
        </Tabs>

        {/* Tab content — scrollable; padding so card shadows are not clipped */}
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 1.5 }}>
          {subTab === 'summary' && (
            <SummaryView
              patient={patient}
              onSecondaryPanelMode={onSecondaryPanelMode}
              onNavigateToTab={onNavigateToTab}
              onOpenNote={onOpenNote}
              onSetOverviewSubTab={setSubTab}
            />
          )}
          {subTab === 'insurance' && <InsuranceView patient={patient} />}
          {subTab === 'cases' && <CasesView patient={patient} />}
          {subTab === 'profile' && <ProfileView patient={patient} />}
        </Box>
      </Box>
    </Box>
  );
}
