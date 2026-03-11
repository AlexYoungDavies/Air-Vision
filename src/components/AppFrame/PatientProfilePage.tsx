import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined';
import PushPinOutlined from '@mui/icons-material/PushPinOutlined';
import QuestionAnswerOutlined from '@mui/icons-material/QuestionAnswerOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import type { Patient } from '../../data/mockPatients';
import { AppointmentsTabContent } from './AppointmentsTabContent';
import { BillingTabContent } from './BillingTabContent';

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
] as const;

export type PrimaryTabId = (typeof PRIMARY_TABS)[number]['id'];
export type MoreTabId = (typeof MORE_TAB_OPTIONS)[number]['id'];
export type ProfileTabId = PrimaryTabId | MoreTabId;

export type SecondaryPanelMode = 'pin' | 'chat' | 'tasks' | 'history';

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

export function PatientProfilePage({
  patient,
  secondaryPanelMode: controlledPanelMode,
  onSecondaryPanelModeChange,
}: PatientProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview');
  const [internalPanelMode, setInternalPanelMode] = useState<SecondaryPanelMode | null>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [splitMenuAnchor, setSplitMenuAnchor] = useState<null | HTMLElement>(null);
  const [patientMenuAnchor, setPatientMenuAnchor] = useState<null | HTMLElement>(null);

  const isControlled = controlledPanelMode !== undefined;
  const secondaryPanelMode = isControlled ? controlledPanelMode : internalPanelMode;
  const lastPanelModeRef = useRef<SecondaryPanelMode | null>(null);

  useEffect(() => {
    if (secondaryPanelMode != null) lastPanelModeRef.current = secondaryPanelMode;
  }, [secondaryPanelMode]);

  const setSecondaryPanelMode = (mode: SecondaryPanelMode | null) => {
    if (!isControlled) setInternalPanelMode(mode);
    onSecondaryPanelModeChange?.(mode);
  };

  const handleSecondaryIconClick = (mode: SecondaryPanelMode) => {
    setSecondaryPanelMode(secondaryPanelMode === mode ? null : mode);
  };

  const handleMoreTabSelect = (id: MoreTabId) => {
    setActiveTab(id);
    setMoreMenuAnchor(null);
  };
  const tabsValue = isPrimaryTab(activeTab) ? activeTab : false;
  const secondaryPanelOpen = secondaryPanelMode !== null;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
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
              {SPLIT_BUTTON_ACTIONS.map(({ id, label }) => (
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
            onChange={(_, value: PrimaryTabId) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              minHeight: 0,
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
            <Tab
              icon={<MoreHorizOutlined sx={{ fontSize: 20 }} />}
              iconPosition="start"
              value={false}
              onClick={(e) => setMoreMenuAnchor(e.currentTarget)}
              sx={{ minWidth: 'unset' }}
            />
          </Tabs>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, pb: 0.5 }}>
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
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          {activeTab === 'appointments' ? (
            <AppointmentsTabContent patientId={patient.id} />
          ) : activeTab === 'billing' ? (
            <BillingTabContent patient={patient} />
          ) : (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
              <Typography variant="body1" color="text.secondary">
                Primary Content — {activeTab}
              </Typography>
            </Box>
          )}
        </Box>
        {/* Secondary panel with slide animation */}
        <Box
          sx={{
            width: secondaryPanelOpen ? 360 : 0,
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
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {(secondaryPanelMode ?? lastPanelModeRef.current) === 'pin' && 'Pin content'}
                {(secondaryPanelMode ?? lastPanelModeRef.current) === 'chat' && 'Chat content'}
                {(secondaryPanelMode ?? lastPanelModeRef.current) === 'tasks' && 'Tasks content'}
                {(secondaryPanelMode ?? lastPanelModeRef.current) === 'history' && 'History content'}
              </Typography>
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
