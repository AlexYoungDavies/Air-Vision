import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import PushPinOutlined from '@mui/icons-material/PushPinOutlined';
import QuestionAnswerOutlined from '@mui/icons-material/QuestionAnswerOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import type { Patient } from '../../data/mockPatients';
import { getAppointmentsForPatient, type Appointment } from '../../data/mockAppointments';
import { AppointmentsTabContent } from './AppointmentsTabContent';
import { AttachmentsTabContent } from './AttachmentsTabContent';
import { BillingTabContent } from './BillingTabContent';
import { OverviewTabContent } from './OverviewTabContent';
import { VisitNoteContent } from './VisitNoteContent';
import {
  MedicationsTabContent,
  OrdersTabContent,
  ProblemListTabContent,
  LabsTabContent,
  VitalsTabContent,
  AllergiesTabContent,
  ImmunizationsTabContent,
} from './OverflowTabContent';

const visitNoteTabSlideUp = keyframes`
  0% { transform: translateY(10px); opacity: 0.7; }
  100% { transform: translateY(0); opacity: 1; }
`;

const PRIMARY_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'billing', label: 'Billing' },
  { id: 'attachment', label: 'Attachment' },
] as const;

const MORE_TAB_OPTIONS = [
  { id: 'medications', label: 'Medications' },
  { id: 'orders', label: 'Orders' },
  { id: 'problem-list', label: 'Problem List' },
  { id: 'labs', label: 'Labs' },
  { id: 'vitals', label: 'Vitals' },
  { id: 'allergies', label: 'Allergies' },
  { id: 'immunizations', label: 'Immunizations' },
] as const;

const SPLIT_BUTTON_ACTIONS = [
  { id: 'create-task', label: 'Create Task' },
  { id: 'prescribe-med', label: 'Prescribe Med' },
  { id: 'create-order', label: 'Create Order' },
  { id: 'print-sheet', label: 'Print Patient Sheet' },
  { id: 'charge-patient', label: 'Charge Patient' },
  { id: 'print-statements', label: 'Print Statements' },
] as const;

export type PrimaryTabId = (typeof PRIMARY_TABS)[number]['id'];
export type MoreTabId = (typeof MORE_TAB_OPTIONS)[number]['id'];
export type ProfileTabId = PrimaryTabId | MoreTabId;

export type SecondaryPanelMode = 'pin' | 'chat' | 'tasks' | 'history' | 'ai';

export interface OpenVisitNote {
  id: string;
  appointment: Appointment;
}

export interface PatientProfilePageProps {
  patient: Patient;
  /** Controlled: which secondary panel is open (null = closed). If omitted, internal state is used. */
  secondaryPanelMode?: SecondaryPanelMode | null;
  /** Called when the user toggles the secondary panel open/closed or switches mode. */
  onSecondaryPanelModeChange?: (mode: SecondaryPanelMode | null) => void;
}

function isPrimaryTab(id: string): id is PrimaryTabId {
  return PRIMARY_TABS.some((t) => t.id === id);
}

const SECONDARY_PANEL_ICONS: { mode: SecondaryPanelMode; title: string }[] = [
  { mode: 'pin', title: 'Pin' },
  { mode: 'chat', title: 'Chat' },
  { mode: 'tasks', title: 'Tasks' },
  { mode: 'history', title: 'History' },
];

/** Pinned notes: front desk comment (payment) + severe allergy note (reflective of allergies page). */
function PinPanelContent({ patient: _patient }: { patient: Patient }) {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
        Pinned notes
      </Typography>
      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Front desk
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          Patient prefers to pay at time of service. Has had past issues with billing — please follow up on payment plan before next visit.
        </Typography>
      </Paper>
      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50', borderColor: 'warning.main' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Allergy alert
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          Severe allergy to Penicillin (anaphylaxis). Patient also has Sulfa drugs — Hives. Ensure allergies are flagged in chart and at check-in.
        </Typography>
      </Paper>
    </Box>
  );
}

const MOCK_THREAD_MESSAGES = [
  { id: '1', author: 'Dr. Smith', role: 'Provider', time: 'Today, 9:42 AM', text: 'Can we move the follow-up to Thursday? Patient has conflict Wednesday.', isCurrentUser: false },
  { id: '2', author: 'Maria L.', role: 'Front desk', time: 'Today, 9:58 AM', text: 'Done — moved to Thu 2:00 PM. I’ll send the confirmation.', isCurrentUser: false },
  { id: '3', author: 'James K.', role: 'Billing', time: 'Today, 10:15 AM', text: 'Prior auth for PT visits came through. Encounter can be processed.', isCurrentUser: false },
  { id: '4', author: 'Dr. Smith', role: 'Provider', time: 'Today, 10:22 AM', text: 'Thanks both. I’ll complete the note after this block.', isCurrentUser: true },
  { id: '5', author: 'Maria L.', role: 'Front desk', time: 'Today, 10:30 AM', text: 'Patient checked in. Ready when you are.', isCurrentUser: false },
];

function ChatPanelContent() {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
        Care thread
      </Typography>
      {MOCK_THREAD_MESSAGES.map((msg) => (
        <Box
          key={msg.id}
          sx={{
            alignSelf: msg.isCurrentUser ? 'flex-end' : 'flex-start',
            maxWidth: '90%',
            px: 1.5,
            py: 1,
            borderRadius: 1,
            bgcolor: msg.isCurrentUser ? 'primary.main' : 'action.hover',
            color: msg.isCurrentUser ? 'primary.contrastText' : 'text.primary',
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
            {msg.author} · {msg.role} — {msg.time}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, mt: 0.25 }}>{msg.text}</Typography>
        </Box>
      ))}
    </Box>
  );
}

const MOCK_TASKS = [
  { id: '1', name: 'Complete prior auth form', description: 'Submit PT prior auth for 12 visits to insurer.', assignedTo: 'Billing team', status: 'In progress' as const },
  { id: '2', name: 'Schedule follow-up', description: 'Book 2-week follow-up after labs reviewed.', assignedTo: 'Maria L.', status: 'Done' as const },
  { id: '3', name: 'Send patient summary', description: 'Email visit summary and home exercise instructions.', assignedTo: 'Dr. Smith', status: 'To do' as const },
];

function TasksPanelContent() {
  const statusColor = (s: string) => (s === 'Done' ? 'success' : s === 'In progress' ? 'warning' : 'default');
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
        Tasks
      </Typography>
      {MOCK_TASKS.map((t) => (
        <Paper key={t.id} variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>{t.name}</Typography>
          <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>{t.description}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Assigned to {t.assignedTo}</Typography>
            <Chip size="small" label={t.status} color={statusColor(t.status)} variant="outlined" sx={{ height: 20, fontSize: 11 }} />
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

const TIMELINE_LINE_OFFSET_PX = 11;
const TIMELINE_ICON_SIZE = 12;
const TIMELINE_LEFT_PADDING = 32;

const MOCK_ACTIVITY = [
  { id: '1', label: 'Patient profile created', date: 'Jan 15, 2024', time: '10:02 AM' },
  { id: '2', label: 'Intake forms completed', date: 'Jan 16, 2024', time: '2:30 PM' },
  { id: '3', label: 'Insurance added', date: 'Jan 16, 2024', time: '2:35 PM' },
  { id: '4', label: 'First appointment scheduled', date: 'Jan 18, 2024', time: '9:00 AM' },
  { id: '5', label: 'Appointment completed', date: 'Jan 25, 2024', time: '11:45 AM' },
  { id: '6', label: 'Labs ordered', date: 'Jan 25, 2024', time: '12:00 PM' },
  { id: '7', label: 'Authorizations added', date: 'Feb 1, 2024', time: '9:15 AM' },
  { id: '8', label: 'Patient information updated', date: 'Feb 10, 2024', time: '3:20 PM' },
  { id: '9', label: 'Appointment scheduled', date: 'Mar 5, 2025', time: '10:00 AM' },
  { id: '10', label: 'Appointment completed', date: 'Mar 12, 2025', time: '2:00 PM' },
];

function HistoryPanelContent() {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
        Activity
      </Typography>
      <Box
        sx={{
          position: 'relative',
          pl: `${TIMELINE_LEFT_PADDING}px`,
        }}
      >
        {/* Vertical line running through icon centers */}
        <Box
          sx={{
            position: 'absolute',
            left: TIMELINE_LINE_OFFSET_PX,
            top: TIMELINE_ICON_SIZE / 2,
            bottom: TIMELINE_ICON_SIZE / 2,
            width: 2,
            bgcolor: 'divider',
            borderRadius: 1,
          }}
        />
        {MOCK_ACTIVITY.map((item, i) => (
          <Box
            key={item.id}
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              pb: i < MOCK_ACTIVITY.length - 1 ? 2 : 0,
            }}
          >
            {/* Icon centered on the vertical line at TIMELINE_LINE_OFFSET_PX */}
            <Box
              sx={{
                position: 'absolute',
                left: TIMELINE_LINE_OFFSET_PX - TIMELINE_ICON_SIZE / 2 - TIMELINE_LEFT_PADDING,
                top: 2,
                width: TIMELINE_ICON_SIZE,
                height: TIMELINE_ICON_SIZE,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                border: '2px solid',
                borderColor: 'background.paper',
                boxSizing: 'border-box',
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
                {item.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {item.date} · {item.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function PatientProfilePage({
  patient,
  secondaryPanelMode: controlledPanelMode,
  onSecondaryPanelModeChange,
}: PatientProfilePageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview');
  const [internalPanelMode, setInternalPanelMode] = useState<SecondaryPanelMode | null>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [splitMenuAnchor, setSplitMenuAnchor] = useState<null | HTMLElement>(null);
  const [patientMenuAnchor, setPatientMenuAnchor] = useState<null | HTMLElement>(null);
  const [openVisitNotes, setOpenVisitNotes] = useState<OpenVisitNote[]>([]);
  const [activeVisitNoteId, setActiveVisitNoteId] = useState<string | null>(null);
  const [lastOpenedNoteId, setLastOpenedNoteId] = useState<string | null>(null);
  const [overflowTabVisible, setOverflowTabVisible] = useState<MoreTabId | null>(null);
  const [overflowTabFadingOut, setOverflowTabFadingOut] = useState<MoreTabId | null>(null);
  const [overflowTabFadeIn, setOverflowTabFadeIn] = useState(false);

  const isControlled = controlledPanelMode !== undefined;
  const secondaryPanelMode = isControlled ? controlledPanelMode : internalPanelMode;
  const lastPanelModeRef = useRef<SecondaryPanelMode | null>(null);

  useEffect(() => {
    if (secondaryPanelMode != null) lastPanelModeRef.current = secondaryPanelMode;
  }, [secondaryPanelMode]);

  const setSecondaryPanelMode = (mode: SecondaryPanelMode | null) => {
    const isOpening = secondaryPanelMode === null && mode !== null;
    const apply = () => {
      if (!isControlled) setInternalPanelMode(mode);
      onSecondaryPanelModeChange?.(mode);
    };
    if (isOpening) {
      requestAnimationFrame(apply);
    } else {
      apply();
    }
  };

  const handleSecondaryIconClick = (mode: SecondaryPanelMode) => {
    setSecondaryPanelMode(secondaryPanelMode === mode ? null : mode);
  };

  const handleMoreTabSelect = (id: MoreTabId) => {
    setActiveTab(id);
    setMoreMenuAnchor(null);
    setActiveVisitNoteId(null);
    setOverflowTabVisible(id);
    setOverflowTabFadingOut(null);
    setOverflowTabFadeIn(true);
  };

  const openNoteAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenNote = (appointment: Appointment) => {
    const id = `visit-note-${appointment.id}-${Date.now()}`;
    setOpenVisitNotes((prev) => [...prev, { id, appointment }]);
    setActiveVisitNoteId(id);
    setLastOpenedNoteId(id);
    if (openNoteAnimationTimerRef.current) clearTimeout(openNoteAnimationTimerRef.current);
    openNoteAnimationTimerRef.current = setTimeout(() => setLastOpenedNoteId(null), 220);
  };

  const handleCloseVisitNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    setOpenVisitNotes((prev) => {
      const next = prev.filter((n) => n.id !== noteId);
      if (activeVisitNoteId === noteId) {
        const remaining = next.length ? next[next.length - 1].id : null;
        setActiveVisitNoteId(remaining);
      }
      return next;
    });
  };

  const handleSelectVisitNote = (noteId: string) => {
    setActiveVisitNoteId(noteId);
    if (overflowTabVisible) setOverflowTabFadingOut(overflowTabVisible);
  };

  const tabsValue = activeVisitNoteId ? false : activeTab;

  useEffect(() => {
    if (!overflowTabFadingOut) return;
    const timer = setTimeout(() => {
      setOverflowTabVisible(null);
      setOverflowTabFadingOut(null);
    }, 220);
    return () => clearTimeout(timer);
  }, [overflowTabFadingOut]);

  useEffect(() => {
    if (!overflowTabVisible || !overflowTabFadeIn) return;
    const frame = requestAnimationFrame(() => setOverflowTabFadeIn(false));
    return () => cancelAnimationFrame(frame);
  }, [overflowTabVisible, overflowTabFadeIn]);

  // When navigated from home page "Open Note" (e.g. ?openNote=1), open this patient's visit note
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openNote') !== '1') return;
    const appointments = getAppointmentsForPatient(patient.id);
    const toOpen = appointments.find((a) => a.status === 'Complete') ?? appointments[0];
    if (toOpen) {
      navigate(location.pathname, { replace: true });
      const id = `visit-note-${toOpen.id}-${Date.now()}`;
      setOpenVisitNotes((prev) => [...prev, { id, appointment: toOpen }]);
      setActiveVisitNoteId(id);
      setLastOpenedNoteId(id);
      if (openNoteAnimationTimerRef.current) clearTimeout(openNoteAnimationTimerRef.current);
      openNoteAnimationTimerRef.current = setTimeout(() => setLastOpenedNoteId(null), 220);
    }
  }, [location.search, location.pathname, patient.id, navigate]);

  const secondaryPanelOpen = secondaryPanelMode !== null;
  const activeVisitNote = openVisitNotes.find((n) => n.id === activeVisitNoteId);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          flexShrink: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {/* Top row: Avatar + name, Split button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 1.5,
            pb: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={patient.picture}
              alt={patient.fullName}
              sx={{ width: 36, height: 36, borderRadius: 1 }}
            />
            <Box
              component="button"
              onClick={(e) => setPatientMenuAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                border: 0,
                background: 'none',
                cursor: 'pointer',
                font: 'inherit',
                color: 'text.primary',
                p: 0,
                '&:hover': { color: 'primary.main' },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
                {patient.fullName}
              </Typography>
              <KeyboardArrowDownOutlined sx={{ fontSize: 20, color: 'inherit' }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                borderRadius: '9px',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Button
                variant="text"
                size="small"
                sx={{
                  height: 28,
                  px: 1,
                  py: 0.375,
                  borderRadius: 0,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: 14,
                  color: 'text.primary',
                }}
              >
                Book Appointment
              </Button>
              <IconButton
                size="small"
                onClick={(e) => setSplitMenuAnchor(e.currentTarget)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 0,
                  color: 'text.primary',
                }}
              >
                <KeyboardArrowDownOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            <Menu
              anchorEl={splitMenuAnchor}
              open={Boolean(splitMenuAnchor)}
              onClose={() => setSplitMenuAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {SPLIT_BUTTON_ACTIONS.slice(0, -2).map(({ id, label }) => (
                <MenuItem key={id} onClick={() => setSplitMenuAnchor(null)}>
                  {label}
                </MenuItem>
              ))}
              <Divider component="li" sx={{ my: 0.5 }} />
              {SPLIT_BUTTON_ACTIONS.slice(-2).map(({ id, label }) => (
                <MenuItem key={id} onClick={() => setSplitMenuAnchor(null)}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
        {/* Bottom row: Tabs + right panel icon buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            px: 2,
            pr: 1.5,
          }}
        >
          <Tabs
            value={tabsValue}
            onChange={(_, value: ProfileTabId) => {
              if (isPrimaryTab(value)) {
                if (overflowTabVisible) {
                  setOverflowTabFadingOut(overflowTabVisible);
                }
                setActiveTab(value);
                setActiveVisitNoteId(null);
              }
            }}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              minHeight: 0,
              flexShrink: 0,
              '& .MuiTabs-flexContainer': { gap: '16px' },
              '& .MuiTabs-indicator': { height: 2, borderRadius: '2px 2px 0 0' },
              '& .MuiTab-root': {
                minHeight: 0,
                minWidth: 'unset',
                flex: '0 0 auto',
                pt: 0.75,
                paddingBottom: '8px', // 6px (0.75) + 2px extra
                paddingLeft: '2px',
                paddingRight: '2px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
              },
            }}
          >
            {PRIMARY_TABS.map(({ id, label }) => (
              <Tab key={id} value={id} label={label} />
            ))}
            {overflowTabVisible &&
              (() => {
                const option = MORE_TAB_OPTIONS.find((t) => t.id === overflowTabVisible);
                const label = option?.label ?? overflowTabVisible;
                const isFadingOut = overflowTabFadingOut === overflowTabVisible;
                const opacity = isFadingOut || overflowTabFadeIn ? 0 : 1;
                return (
                  <Tab
                    value={overflowTabVisible}
                    label={label}
                    sx={{
                      opacity,
                      transition: 'opacity 0.2s ease',
                    }}
                  />
                );
              })()}
            <Tab
              icon={<MoreHorizOutlined sx={{ fontSize: 20 }} />}
              iconPosition="start"
              value={false}
              onClick={(e) => setMoreMenuAnchor(e.currentTarget)}
              sx={{ minWidth: 'unset' }}
            />
          </Tabs>
          {openVisitNotes.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                flex: 1,
                minWidth: 0,
                overflowX: 'auto',
                borderLeft: 1,
                borderColor: 'divider',
                pl: 1,
                ml: 1.5,
              }}
            >
              {openVisitNotes.map((note) => {
                const isActive = note.id === activeVisitNoteId;
                const isJustOpened = note.id === lastOpenedNoteId;
                const label = `${note.appointment.date} | ${note.appointment.clinicalStage}`;
                return (
                  <Box
                    key={note.id}
                    role="tab"
                    tabIndex={0}
                    onClick={() => handleSelectVisitNote(note.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectVisitNote(note.id);
                      }
                    }}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1,
                      py: 0.5,
                      mr: 0.5,
                      mt: 0.25,
                      mb: 0.25,
                      maxWidth: 200,
                      width: 'fit-content',
                      height: 'fit-content',
                      minWidth: 0,
                      borderRadius: 1,
                      cursor: 'pointer',
                      borderBottom: 0,
                      ...(isJustOpened && {
                        animation: `${visitNoteTabSlideUp} 0.2s ease-out`,
                      }),
                      bgcolor: isActive
                        ? (theme) => alpha(theme.palette.primary.main, 0.08)
                        : 'transparent',
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontSize: 14,
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: isActive
                          ? (theme) => alpha(theme.palette.primary.main, 0.08)
                          : 'action.hover',
                      },
                      ...(!isActive && {
                        '&:hover .visit-note-tab-close': { opacity: 1 },
                      }),
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: 14,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </Typography>
                    <IconButton
                      className="visit-note-tab-close"
                      size="small"
                      onClick={(e) => handleCloseVisitNote(e, note.id)}
                      aria-label={`Close ${label}`}
                      sx={{
                        width: 20,
                        height: 20,
                        p: 0,
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.15s ease',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <CloseOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          )}
          <Menu
            anchorEl={moreMenuAnchor}
            open={Boolean(moreMenuAnchor)}
            onClose={() => setMoreMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {MORE_TAB_OPTIONS.map(({ id, label }) => (
              <MenuItem key={id} onClick={() => handleMoreTabSelect(id)}>
                {label}
              </MenuItem>
            ))}
          </Menu>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, pb: 0.5, flexShrink: 0 }}>
            {SECONDARY_PANEL_ICONS.map(({ mode, title }) => {
              const active = secondaryPanelMode === mode;
              const Icon =
                mode === 'pin'
                  ? PushPinOutlined
                  : mode === 'chat'
                    ? QuestionAnswerOutlined
                    : mode === 'tasks'
                      ? TaskAltOutlined
                      : HistoryOutlined;
              return (
                <IconButton
                  key={mode}
                  size="small"
                  onClick={() => handleSecondaryIconClick(mode)}
                  title={title}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    ...(active && {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'action.selected' },
                    }),
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </IconButton>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Content: Primary + Secondary */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          {activeVisitNote ? (
            <VisitNoteContent
              noteId={activeVisitNote.id}
              appointment={activeVisitNote.appointment}
              onAICheckClick={() => setSecondaryPanelMode(secondaryPanelMode === 'ai' ? null : 'ai')}
              isAIPanelOpen={secondaryPanelMode === 'ai'}
            />
          ) : activeTab === 'overview' ? (
            <OverviewTabContent
              patient={patient}
              onSecondaryPanelMode={(mode) => setSecondaryPanelMode(mode)}
              onNavigateToTab={(tabId) => setActiveTab(tabId as ProfileTabId)}
              onOpenNote={handleOpenNote}
            />
          ) : activeTab === 'appointments' ? (
            <AppointmentsTabContent patientId={patient.id} onOpenNote={handleOpenNote} />
          ) : activeTab === 'billing' ? (
            <BillingTabContent patient={patient} />
          ) : activeTab === 'attachment' ? (
            <AttachmentsTabContent patientId={patient.id} />
          ) : activeTab === 'medications' ? (
            <MedicationsTabContent patientId={patient.id} />
          ) : activeTab === 'orders' ? (
            <OrdersTabContent patientId={patient.id} />
          ) : activeTab === 'problem-list' ? (
            <ProblemListTabContent patientId={patient.id} />
          ) : activeTab === 'labs' ? (
            <LabsTabContent patientId={patient.id} />
          ) : activeTab === 'vitals' ? (
            <VitalsTabContent patientId={patient.id} />
          ) : activeTab === 'allergies' ? (
            <AllergiesTabContent patientId={patient.id} />
          ) : activeTab === 'immunizations' ? (
            <ImmunizationsTabContent patientId={patient.id} />
          ) : (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
              <Typography variant="body1" color="text.secondary">
                {activeTab}
              </Typography>
            </Box>
          )}
        </Box>
        {/* Secondary panel with slide animation */}
        <Box
          sx={{
            width: secondaryPanelOpen ? 360 : 0,
            minWidth: 0,
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Box
            sx={{
              width: 360,
              height: '100%',
              borderLeft: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              bgcolor: 'background.paper',
              transform: secondaryPanelOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: secondaryPanelOpen ? 'auto' : 'transform',
            }}
          >
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              {(secondaryPanelMode ?? lastPanelModeRef.current) === 'pin' && <PinPanelContent patient={patient} />}
              {(secondaryPanelMode ?? lastPanelModeRef.current) === 'chat' && <ChatPanelContent />}
              {(secondaryPanelMode ?? lastPanelModeRef.current) === 'tasks' && <TasksPanelContent />}
              {(secondaryPanelMode ?? lastPanelModeRef.current) === 'history' && <HistoryPanelContent />}
              {(secondaryPanelMode ?? lastPanelModeRef.current) === 'ai' && (
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">AI Check content</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={patientMenuAnchor}
        open={Boolean(patientMenuAnchor)}
        onClose={() => setPatientMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={() => setPatientMenuAnchor(null)}>Switch patient</MenuItem>
      </Menu>
    </Box>
  );
}
