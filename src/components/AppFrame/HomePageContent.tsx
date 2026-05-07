import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  SvgIcon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  Avatar,
  Tabs,
  Tab,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import ScienceOutlined from '@mui/icons-material/ScienceOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import ContentPasteOutlined from '@mui/icons-material/ContentPasteOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import AssignmentLateOutlined from '@mui/icons-material/AssignmentLateOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_PATIENTS, TODAYS_PATIENTS, type Patient } from '../../data/mockPatients';
import { getAppointmentsForPatient, type Appointment } from '../../data/mockAppointments';
import { Callout } from './Callout';
import { getPatientVisitPanelData, type ProfileInfoRow } from '../../data/mockPatientVisitPanel';
import { MOCK_CHATS, getChatById, getMessagesForChat } from '../../data/mockChats';
import { VisitNoteContent } from './VisitNoteContent';
import { ThingsToReviewAlertItem } from './ThingsToReviewAlertItem';
import { AICheckIcon } from '../icons';

// Icons matching global nav: Patients (person/group), Messages (chat). Custom: Notes (signature), Tasks (checklist). Settings at bottom.
function PatientsNavIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 7C14 9.76142 11.7614 12 9 12C6.23858 12 4 9.76142 4 7C4 4.23858 6.23858 2 9 2C11.7614 2 14 4.23858 14 7ZM12.5 7C12.5 8.933 10.933 10.5 9 10.5C7.067 10.5 5.5 8.933 5.5 7C5.5 5.067 7.067 3.5 9 3.5C10.933 3.5 12.5 5.067 12.5 7Z"
      />
      <path d="M20 7C20 9.50742 18.1543 11.5838 15.7474 11.9445C15.3378 12.0059 15 11.6642 15 11.25C15 10.8358 15.3397 10.5083 15.7445 10.4206C17.3199 10.0794 18.5 8.6775 18.5 7C18.5 5.3225 17.3199 3.92064 15.7445 3.57936C15.3397 3.49166 15 3.16421 15 2.75C15 2.33579 15.3378 1.99409 15.7474 2.05548C18.1543 2.41624 20 4.49258 20 7Z" />
      <path d="M3.5 18.9998C3.5 16.9998 5 15.5 8 15.5H10C13 15.5 14.5 16.9998 14.5 18.9998V21.25C14.5 21.6642 14.8358 22 15.25 22C15.6642 22 16 21.6642 16 21.25V18.9998C16 15.9998 14 14 10 14H8C4 14 2 15.9998 2 18.9998V21.25C2 21.6642 2.33579 22 2.75 22C3.16421 22 3.5 21.6642 3.5 21.25V18.9998Z" />
      <path d="M18 15.5H17.75C17.3358 15.5 17 15.1642 17 14.75C17 14.3358 17.3358 14 17.75 14H18C20.2091 14 22 15.7909 22 18V21.25C22 21.6642 21.6642 22 21.25 22C20.8358 22 20.5 21.6642 20.5 21.25V18C20.5 16.6193 19.3807 15.5 18 15.5Z" />
    </SvgIcon>
  );
}

function SignatureAltIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 22 22" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.87476 2.52051C7.71484 2.52051 8.37685 2.86603 8.7609 3.53564C9.10748 4.13992 9.17166 4.91522 9.1145 5.69303C8.99885 7.26585 8.3478 9.29709 7.57121 11.253C7.54831 11.3107 7.52364 11.3681 7.50049 11.4258C7.57204 11.3914 7.64527 11.3549 7.71891 11.3139C8.1853 11.0542 8.64427 10.6893 9.05721 10.3041C9.46775 9.92118 9.81728 9.53281 10.0643 9.23885C10.1873 9.09251 10.2839 8.97097 10.349 8.88704C10.3814 8.84512 10.4064 8.81259 10.4224 8.79126C10.4302 8.78077 10.4358 8.77285 10.4394 8.76798C10.4412 8.76554 10.443 8.76261 10.443 8.76261L10.4438 8.76172L11.2065 7.71077L11.647 8.93359C11.9571 9.79558 12.2325 10.4476 12.5001 10.9075C12.7769 11.3831 12.9846 11.5453 13.1061 11.5923C13.1771 11.6197 13.3255 11.6515 13.6629 11.441C14.0145 11.2216 14.4682 10.7985 15.0567 10.0991L15.6654 9.37581L16.1659 10.177C16.6507 10.9518 17.0599 11.3134 17.5149 11.5028C17.9966 11.7032 18.6287 11.7546 19.6642 11.689L19.752 13.0604C18.683 13.1281 17.7777 13.1026 16.9858 12.773C16.4118 12.5341 15.9471 12.1547 15.524 11.6388C15.1288 12.0528 14.7538 12.3808 14.3907 12.6074C13.8389 12.9517 13.2272 13.1136 12.6102 12.8751C12.0437 12.656 11.6358 12.1554 11.3122 11.5994C11.1297 11.2859 10.9548 10.9188 10.7813 10.5064C10.5571 10.7548 10.2922 11.0334 9.99536 11.3103C9.53538 11.7393 8.98507 12.1826 8.38761 12.5152C7.91458 12.7786 7.38016 12.9869 6.81746 13.0452C6.53103 13.6963 6.23866 14.3294 5.9554 14.9259C10.3478 14.1421 14.0538 14.0053 19.7985 14.1686L19.76 15.5427C13.6607 15.3693 9.93903 15.5363 5.20345 16.4648C5.16943 16.5326 5.13735 16.6003 5.10409 16.6662C4.73237 17.4024 4.40891 18.0165 4.17847 18.4467C4.06328 18.6617 3.97073 18.8312 3.90723 18.9471C3.87563 19.0048 3.85145 19.0494 3.83472 19.0796C3.82633 19.0947 3.81941 19.1066 3.81502 19.1145C3.81292 19.1183 3.81168 19.1214 3.81055 19.1235L3.80876 19.1261C3.80876 19.1261 3.80824 19.1267 3.20809 18.7913L2.60832 18.4556L2.60921 18.4539L2.63159 18.4136C2.64746 18.3849 2.67067 18.3417 2.70142 18.2856C2.76299 18.1732 2.8534 18.0077 2.96639 17.7968C3.1052 17.5377 3.27704 17.2093 3.47485 16.8273C2.99503 16.9338 2.50194 17.0467 1.99333 17.1684L1.67285 15.831C2.58271 15.6133 3.44381 15.4209 4.27157 15.25C4.63545 14.5092 5.02737 13.6847 5.41203 12.8241C4.70921 12.4917 4.23399 11.85 3.9502 11.1259C3.55734 10.1234 3.47242 8.8635 3.58765 7.66512C3.70339 6.46168 4.02928 5.23832 4.53296 4.29386C5.0121 3.39556 5.78456 2.52051 6.87476 2.52051ZM6.87476 3.89551C6.5901 3.89551 6.17003 4.14588 5.74593 4.94108C5.34644 5.69017 5.0582 6.72871 4.95548 7.79671C4.85229 8.86994 4.94462 9.8924 5.2312 10.6237C5.41816 11.1008 5.66132 11.4038 5.95988 11.5601C6.0731 11.2895 6.18501 11.018 6.29289 10.7463C7.06304 8.80668 7.64383 6.94171 7.74308 5.59277C7.7933 4.90976 7.71067 4.46743 7.56852 4.21956C7.4638 4.03697 7.29508 3.89551 6.87476 3.89551Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function CheckListIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 22 22" fill="none">
      <path d="M4.5836 7.38904L7.84754 4.1251L6.87527 3.15283L4.5836 5.4445L3.2086 4.0695L2.23633 5.04177L4.5836 7.38904Z" fill="currentColor" />
      <path d="M4.5836 12.889L7.84754 9.6251L6.87527 8.65283L4.5836 10.9445L3.2086 9.5695L2.23633 10.5418L4.5836 12.889Z" fill="currentColor" />
      <path d="M7.84754 15.1251L4.5836 18.389L2.23633 16.0418L3.2086 15.0695L4.5836 16.4445L6.87527 14.1528L7.84754 15.1251Z" fill="currentColor" />
      <path d="M19.021 4.81261H9.396V6.18761H19.021V4.81261Z" fill="currentColor" />
      <path d="M9.396 10.3126H19.021V11.6876H9.396V10.3126Z" fill="currentColor" />
      <path d="M19.021 15.8126H9.396V17.1876H19.021V15.8126Z" fill="currentColor" />
    </SvgIcon>
  );
}

function MessagesNavIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.1331 10.5C16.8669 10.5 17.2338 10.5 17.579 10.5829C17.8851 10.6564 18.1778 10.7776 18.4462 10.9421C18.7489 11.1276 19.0084 11.387 19.5272 11.9059L20.1586 12.5373C20.2657 12.6444 20.3192 12.6979 20.3652 12.7015C20.4051 12.7047 20.4441 12.6885 20.4701 12.6581C20.5 12.623 20.5 12.5473 20.5 12.3958V7.5C20.5 6.09987 20.5 5.3998 20.2275 4.86502C19.9878 4.39462 19.6054 4.01217 19.135 3.77248C18.6002 3.5 17.9001 3.5 16.5 3.5H14C13.0694 3.5 12.604 3.5 12.2275 3.62236C11.4664 3.86965 10.8697 4.46636 10.6224 5.22746C10.5 5.60404 10.5 6.06936 10.5 7C10.5 7.93064 10.5 8.39596 10.6224 8.77254C10.8697 9.53364 11.4664 10.1303 12.2275 10.3776C12.604 10.5 13.0694 10.5 14 10.5H16.1331ZM14 12C13.0707 12 12.606 12 12.2196 11.9231C10.6329 11.6075 9.39249 10.3671 9.07686 8.78036C9 8.39397 9 7.92931 9 7C9 6.07069 9 5.60603 9.07686 5.21964C9.39249 3.63288 10.6329 2.39249 12.2196 2.07686C12.606 2 13.0707 2 14 2H15.6C17.8402 2 18.9603 2 19.816 2.43597C20.5686 2.81947 21.1805 3.43139 21.564 4.18404C22 5.03969 22 6.15979 22 8.4V11.068C22 12.5785 22 13.3337 21.7472 13.712C21.4101 14.2165 20.8024 14.4682 20.2074 14.3499C19.7611 14.2611 19.2271 13.7271 18.159 12.659C17.9429 12.4429 17.8349 12.3349 17.712 12.2528C17.5482 12.1434 17.3645 12.0673 17.1713 12.0288C17.0264 12 16.8736 12 16.568 12H14Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 9.75C7 9.33579 6.66421 9 6.25 9H6C3.79086 9 2 10.7909 2 13L2 18.068C2 19.5785 2 20.3337 2.2528 20.712C2.58986 21.2165 3.1976 21.4682 3.79263 21.3499C4.23891 21.2611 4.77294 20.7271 5.84099 19.659C6.05708 19.4429 6.16513 19.3349 6.28797 19.2528C6.45175 19.1434 6.63549 19.0673 6.82868 19.0288C6.97358 19 7.12638 19 7.43198 19H11C13.2091 19 15 17.2091 15 15V14.75C15 14.3358 14.6642 14 14.25 14C13.8358 14 13.5 14.3358 13.5 14.75V15C13.5 16.3807 12.3807 17.5 11 17.5H7.8669C7.13313 17.5 6.76625 17.5 6.42098 17.5829C6.11488 17.6564 5.82224 17.7776 5.55382 17.9421C5.25107 18.1276 4.99165 18.387 4.47279 18.9059L3.84142 19.5373C3.73433 19.6444 3.68078 19.6979 3.63481 19.7015C3.59492 19.7047 3.55594 19.6885 3.52995 19.6581C3.5 19.623 3.5 19.5473 3.5 19.3958V13C3.5 11.6193 4.61929 10.5 6 10.5H6.25C6.66421 10.5 7 10.1642 7 9.75Z"
      />
    </SvgIcon>
  );
}

const ICON_SIZE = 18;

type HomeViewTab = 'patients' | 'notes' | 'tasks' | 'messages';

const SIDE_TABS: { id: HomeViewTab; label: string; Icon: typeof PatientsNavIcon }[] = [
  { id: 'patients', label: 'Visits', Icon: PatientsNavIcon },
  { id: 'notes', label: 'Notes to Sign', Icon: SignatureAltIcon },
  { id: 'tasks', label: 'Tasks', Icon: CheckListIcon },
  { id: 'messages', label: 'Messages', Icon: MessagesNavIcon },
];

const MOCK_NOTES = [
  { id: 'n1', patient: 'Michelle Chen', date: 'Aug 8', template: 'Office Visit' },
  { id: 'n2', patient: 'Michael Chen', date: 'Aug 8', template: 'Follow-up' },
  { id: 'n3', patient: 'Emily Davis', date: 'Aug 7', template: 'Annual Physical' },
];

const MOCK_TASKS = [
  { id: 't1', title: 'Review lab results', due: 'Today' },
  { id: 't2', title: 'Call patient re: medication', due: 'Today' },
  { id: 't3', title: 'Sign off on referral', due: 'Tomorrow' },
];

// ----- Left panel content per tab -----

function PatientsListPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const surfaceOverlay = (theme.palette.background as { surfaceOverlay?: string }).surfaceOverlay;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: 0 }}>
      <Box
        sx={{
          bgcolor: surfaceOverlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          pl: 1.5,
          pr: 1,
          borderTop: 0,
          borderRight: 0,
          borderLeft: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 500, lineHeight: 18 / 12, color: 'text.primary' }}>
          Aug 8th, 2024
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton size="small" aria-label="Previous" sx={{ width: 28, height: 28, borderRadius: '9px', color: 'text.primary' }}>
            <ChevronLeftOutlined sx={{ fontSize: ICON_SIZE }} />
          </IconButton>
          <IconButton size="small" aria-label="Next" sx={{ width: 28, height: 28, borderRadius: '9px', color: 'text.primary' }}>
            <ChevronRightOutlined sx={{ fontSize: ICON_SIZE }} />
          </IconButton>
        </Box>
      </Box>
      <List dense disablePadding sx={{ flex: 1, overflow: 'auto', py: 0 }}>
        {TODAYS_PATIENTS.map((p) => {
          const row2 = [p.case, p.appointmentType].filter(Boolean).join(' • ');
          const showLabs = p.hasNewLabs === true;
          const showImaging = p.hasNewImaging === true;
          const blockColor =
            p.appointmentType === 'Initial Eval'
              ? theme.palette.info.main
              : p.appointmentType === 'Follow up'
                ? theme.palette.success.main
                : p.appointmentType === 'Progress Note'
                  ? theme.palette.warning.main
                  : theme.palette.divider;
          return (
            <ListItemButton
              key={p.id}
              selected={selectedId === p.id}
              onClick={() => onSelect(p.id)}
              sx={{
                position: 'relative',
                height: 'fit-content',
                minHeight: 0,
                borderRadius: 0,
                mx: 0,
                mb: 0,
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                padding: 0,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '& .open-note-list-btn': {
                  opacity: 0,
                },
                '&:hover .open-note-list-btn': {
                  opacity: 1,
                },
              }}
            >
              {/* Open Note: absolute top-right, visible on hover */}
              <Tooltip title="Open Note">
                <IconButton
                  size="small"
                  className="open-note-list-btn"
                  aria-label="Open note"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/patients/${p.id}?openNote=1`);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    zIndex: 1,
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ContentPasteOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
                </IconButton>
              </Tooltip>
              {/* Full-height left block: positioned to span entire list item regardless of MUI padding */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  bgcolor: blockColor,
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minWidth: 0,
                  justifyContent: 'center',
                  py: 0.75,
                  pl: 1.5,
                  pr: 1.5,
                  ml: '3px',
                }}
              >
                {/* Row 1: patient name */}
                <Typography sx={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, color: 'text.primary' }}>
                  {p.fullName}
                </Typography>
                {/* Row 2: case name • appointment type */}
                <Typography sx={{ fontSize: 11, lineHeight: 1, verticalAlign: 'top', color: 'text.secondary', mt: 0.25 }}>
                  {row2 || p.reasonForVisit || '—'}
                </Typography>
                {/* Row 3: time (left), alert icons (right) */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 0.25,
                  }}
                >
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                    {p.appointmentTime ?? '—'}
                  </Typography>
                  {(showLabs || showImaging) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                      {showLabs && (
                        <Tooltip title="New labs to review">
                          <ScienceOutlined sx={{ fontSize: 14, width: 14, height: 14, color: 'text.secondary' }} />
                        </Tooltip>
                      )}
                      {showImaging && (
                        <Tooltip title="New imaging to review">
                          <ImageOutlined sx={{ fontSize: 14, width: 14, height: 14, color: 'text.secondary' }} />
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

function NotesListPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: 0 }}>
      <Box sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>
          Outstanding visit notes
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>{MOCK_NOTES.length} to sign</Typography>
      </Box>
      <List dense disablePadding sx={{ flex: 1, overflow: 'auto', py: 0.5 }}>
        {MOCK_NOTES.map((n) => (
          <ListItemButton
            key={n.id}
            selected={selectedId === n.id}
            onClick={() => onSelect(n.id)}
            sx={{ borderRadius: 1, mx: 0.5, mb: 0.25 }}
          >
            <ListItemText
              primary={n.patient}
              secondary={`${n.date} · ${n.template}`}
              primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
              secondaryTypographyProps={{ fontSize: 11 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

function TasksListPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: 0 }}>
      <Box sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>
          Outstanding tasks
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>{MOCK_TASKS.length} assigned to you</Typography>
      </Box>
      <List dense disablePadding sx={{ flex: 1, overflow: 'auto', py: 0.5 }}>
        {MOCK_TASKS.map((t) => (
          <ListItemButton
            key={t.id}
            selected={selectedId === t.id}
            onClick={() => onSelect(t.id)}
            sx={{ borderRadius: 1, mx: 0.5, mb: 0.25 }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <TaskAltOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText
              primary={t.title}
              secondary={t.due}
              primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
              secondaryTypographyProps={{ fontSize: 11 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

function MessagesListPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: 0 }}>
      <Box sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>
          Chats
        </Typography>
      </Box>
      <List dense disablePadding sx={{ flex: 1, overflow: 'auto', py: 0.5 }}>
        {[...MOCK_CHATS]
          .sort((a, b) => {
            if (a.unread && !b.unread) return -1;
            if (!a.unread && b.unread) return 1;
            return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
          })
          .map((c) => (
          <ListItemButton
            key={c.id}
            selected={selectedId === c.id}
            onClick={() => onSelect(c.id)}
            sx={{ borderRadius: 1, mx: 0.5, mb: 0.25 }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.75, width: '100%' }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 13,
                      fontWeight: c.unread ? 600 : 500,
                      color: 'text.primary',
                      minWidth: 0,
                    }}
                  >
                    {c.title}
                  </Typography>
                  {c.unread && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>
              }
              secondary={`${c.participantLabel} · ${c.preview}`}
              secondaryTypographyProps={{
                fontSize: 11,
                sx: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

// ----- Right panel content per tab -----

const PANEL_SECTION = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  overflow: 'hidden',
  mb: 1.5,
};
const PANEL_SECTION_HEADER = {
  px: 1.5,
  py: 1,
  bgcolor: 'action.hover',
  borderBottom: '1px solid',
  borderColor: 'divider',
  fontWeight: 600,
  fontSize: 13,
};
const PANEL_SUBSECTION = {
  px: 1.5,
  py: 1,
  borderBottom: '1px solid',
  borderColor: 'divider',
  '&:last-of-type': { borderBottom: 'none' },
};
const PANEL_BODY = { fontSize: 12, color: 'text.primary', lineHeight: 1.5 };

/** Day summary stats when no patient is selected. Derived from mock data. */
function formatPatientDob(mmDdYyyy: string): string {
  const parts = mmDdYyyy.split('/');
  if (parts.length !== 3) return mmDdYyyy;
  const month = Number(parts[0]);
  const day = Number(parts[1]);
  const year = Number(parts[2]);
  if (!month || !day || !year) return mmDdYyyy;
  const dt = new Date(year, month - 1, day);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Column headers per Additional Patient Information tab (order matches ADDITIONAL_INFO_TABS). */
const ADDITIONAL_INFO_TABLE_HEADERS = [
  ['Date', 'Visit', 'Provider'],
  ['Document', 'Status'],
  ['Vaccine', 'Date given'],
  ['Lab / order', 'Status'],
  ['Medication', 'Instructions'],
] as const;

function buildAdditionalInfoBodyRows(tabIndex: number, rows: ProfileInfoRow[]): string[][] {
  if (tabIndex === 0) {
    return rows.map((r) => {
      const sec = r.secondary?.trim() ?? '';
      const sep = ' · ';
      const i = sec.indexOf(sep);
      if (i === -1) return [sec || '—', r.primary, '—'];
      return [sec.slice(0, i).trim(), r.primary, sec.slice(i + sep.length).trim() || '—'];
    });
  }
  return rows.map((r) => [r.primary, r.secondary ?? '—']);
}

const additionalInfoTableShellSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '12px',
  overflow: 'hidden',
  bgcolor: 'background.paper',
} as const;

const additionalInfoHeaderCellSx = {
  borderBottom: '1px solid',
  borderColor: 'divider',
  borderLeft: 'none',
  borderRight: 'none',
  py: 1.5,
  px: 2,
  fontSize: 12,
  fontWeight: 600,
  color: 'text.primary',
  lineHeight: 1.4,
  bgcolor: 'grey.50',
} as const;

const additionalInfoBodyCellSx = {
  borderBottom: '1px solid',
  borderColor: 'divider',
  borderLeft: 'none',
  borderRight: 'none',
  py: 1.5,
  px: 2,
  fontSize: 13,
  fontWeight: 400,
  color: 'text.secondary',
  lineHeight: 1.45,
  verticalAlign: 'top',
} as const;

function AdditionalInfoDataTable({ columns, rows }: { columns: readonly string[]; rows: string[][] }) {
  const colCount = columns.length;
  return (
    <Box sx={additionalInfoTableShellSx}>
      <Table
        size="small"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((label) => (
              <TableCell key={label} component="th" scope="col" sx={additionalInfoHeaderCellSx}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colCount} sx={{ ...additionalInfoBodyCellSx, borderBottom: 'none' }}>
                No items to show.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((cells, i) => (
              <TableRow
                key={`row-${i}`}
                sx={{
                  bgcolor: 'background.paper',
                  '&:last-of-type td': { borderBottom: 'none' },
                }}
              >
                {cells.map((cell, j) => (
                  <TableCell key={j} sx={additionalInfoBodyCellSx}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

function getDaySummaryStats() {
  const patientsToday = TODAYS_PATIENTS.length;
  const newLabsImages = TODAYS_PATIENTS.reduce(
    (sum, p) => sum + (p.hasNewLabs ? 1 : 0) + (p.hasNewImaging ? 1 : 0),
    0
  );
  const messagesUnread = MOCK_CHATS.filter((c) => c.unread).length;
  return {
    patientsToday,
    notesToSign: MOCK_NOTES.length,
    newLabsImages,
    tasksOutstanding: MOCK_TASKS.length,
    messagesUnread,
  };
}

function DaySummaryPanel() {
  const stats = getDaySummaryStats();
  return (
    <Box
      sx={{
        p: 3,
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'stretch', width: 500 }}>
        <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
          Today’s Preview
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Top row: 2 large callouts */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Callout variant="large" value={stats.patientsToday} label="Patients Today" />
            <Callout variant="large" value={stats.notesToSign} label="Notes to Close" />
          </Box>

          {/* Bottom row: 3 small callouts */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <Callout variant="small" value={stats.tasksOutstanding} label="Pending Tasks" />
            <Callout variant="small" value={stats.messagesUnread} label="New Messages" />
            <Callout variant="small" value={stats.newLabsImages} label="New Documents" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const ADDITIONAL_INFO_TABS = ['Visit history', 'Files', 'Immunizations', 'Labs', 'Medications'] as const;

/** Pre-visit panel: inner column max width (px). */
const PRE_VISIT_CONTENT_MAX_WIDTH = 760;

const visitDetailBlockSx = {
  width: '100%',
  pt: 2,
  px: 3,
  pb: 5,
  borderBottom: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  boxSizing: 'border-box',
} as const;

const visitDetailInnerSx = {
  width: '100%',
  maxWidth: PRE_VISIT_CONTENT_MAX_WIDTH,
  minWidth: 0,
} as const;

/** Vertical rhythm inside the Pre-visit AI Summary content (24px). */
const PRE_VISIT_AI_SUMMARY_STACK_GAP = 3;

const preVisitAiBlockHeadingSx = {
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: -0.01,
} as const;

const preVisitAiSubsectionTitleSx = {
  fontSize: 13,
  fontWeight: 600,
  color: 'text.primary',
  mb: 1,
} as const;

/** Category label inside each Things to Review grid column */
const thingsToReviewTopicSx = {
  ...preVisitAiSubsectionTitleSx,
  mb: 1.25,
} as const;

function PatientVisitDetailPanel({ patient }: { patient: Patient | null }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [additionalTab, setAdditionalTab] = useState(0);

  useEffect(() => {
    if (patient) setAdditionalTab(0);
  }, [patient?.id]);

  if (!patient) {
    return <DaySummaryPanel />;
  }
  const data = getPatientVisitPanelData(patient);

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* (1) Header — full width, stays visible */}
      <Box
        sx={{
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 'none',
            minWidth: 0,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            gap: '2px',
            pt: '12px',
            pb: '12px',
            pl: '24px',
            pr: '24px',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, minWidth: 0, flex: 1 }}>
            <Avatar src={patient.picture} alt="" sx={{ width: 44, height: 44, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 16, lineHeight: 1.3, color: 'text.primary' }}>
                {patient.fullName}, {patient.age}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
                {formatPatientDob(patient.dateOfBirth)} · {patient.gender}
                {data.lastSeenLabel !== '—' ? ` · Last seen ${data.lastSeenLabel}` : ''}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              flexShrink: 0,
              flexWrap: 'wrap',
              width: 'fit-content',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              component={Link}
              to={`/patients/${patient.id}`}
              variant="text"
              size="small"
              startIcon={<PersonOutlined sx={{ fontSize: 18 }} />}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Full Profile
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ContentPasteOutlined sx={{ fontSize: 18, color: 'primary.main' }} />}
              onClick={() => navigate(`/patients/${patient.id}?openNote=1`)}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Open Note
            </Button>
          </Box>
        </Box>
      </Box>

      {/* (2) Content — scrolls when needed */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          width: '100%',
        }}
      >
        {/* Block a — Pre-visit AI Summary (gradient band + flat content stack) */}
        <Box
          sx={[
            visitDetailBlockSx,
            (t) => ({
              background: `linear-gradient(90deg, ${alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.14 : 0.09)} 0%, ${t.palette.background.paper} 50%, ${t.palette.background.paper} 100%)`,
            }),
          ]}
        >
          <Box sx={visitDetailInnerSx}>
            <Stack spacing={PRE_VISIT_AI_SUMMARY_STACK_GAP}>
              {/* Heading: emblem + title; appointment subheading */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AICheckIcon sx={{ fontSize: 20, flexShrink: 0 }} aria-hidden />
                  <Typography
                    component="h2"
                    sx={{
                      ...preVisitAiBlockHeadingSx,
                      color: theme.palette.primary.dark,
                    }}
                  >
                    Pre-visit AI Summary
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: theme.palette.primary.dark,
                    opacity: 0.88,
                    mt: 0,
                    pl: 0.25,
                  }}
                >
                  {data.appointmentHeading}
                </Typography>
              </Box>

              {/* AI narrative */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Typography sx={{ ...PANEL_BODY, fontSize: 14, mb: 0 }}>{data.aiSummary}</Typography>
              </Box>

              {data.thingsToReviewBullets.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Typography sx={{ ...preVisitAiSubsectionTitleSx, mb: 0 }}>Things to Review</Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.25, ...PANEL_BODY }}>
                    {data.thingsToReviewBullets.map((line) => (
                      <li key={line}>
                        <Typography sx={PANEL_BODY}>{line}</Typography>
                      </li>
                    ))}
                  </Box>
                </Box>
              )}

              {data.highlightBullets.length > 0 && (
                <Box>
                  <Typography sx={preVisitAiSubsectionTitleSx}>Highlight</Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.25, ...PANEL_BODY }}>
                    {data.highlightBullets.map((line) => (
                      <li key={line}>
                        <Typography sx={PANEL_BODY}>{line}</Typography>
                      </li>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Alerts — full-width rows, 4px radius (not chips) */}
              {data.summaryAlerts.length > 0 && (
                <Box>
                  <Typography sx={preVisitAiSubsectionTitleSx}>Alerts</Typography>
                  <Stack spacing={0} sx={{ width: '100%', gap: '2px' }}>
                    {data.summaryAlerts.map((a) => {
                      const isError = a.severity === 'error';
                      const bg = isError
                        ? alpha(theme.palette.error.main, 0.12)
                        : alpha(theme.palette.warning.main, 0.22);
                      const fg = isError ? theme.palette.error.dark : theme.palette.warning.dark;
                      const iconColor = isError ? theme.palette.error.main : alpha(theme.palette.warning.dark, 0.95);
                      const IconComponent = isError ? AssignmentLateOutlined : AssignmentOutlined;
                      return (
                        <Box
                          key={a.message}
                          sx={{
                            pt: '6px',
                            pb: 1.125,
                            px: 1.5,
                            borderRadius: '4px',
                            bgcolor: bg,
                            width: 'fit-content',
                            boxSizing: 'border-box',
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0}
                            sx={{ gap: 1.25, minWidth: 0 }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                              <IconComponent sx={{ fontSize: 20, color: iconColor }} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 500, color: fg, lineHeight: 1.4 }}>
                                {a.message}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Block b — Things to Review */}
        <Box sx={visitDetailBlockSx}>
          <Box sx={visitDetailInnerSx}>
            <Stack spacing={PRE_VISIT_AI_SUMMARY_STACK_GAP}>
              <Typography component="h2" sx={{ ...preVisitAiBlockHeadingSx, color: 'text.primary', mb: 0 }}>
                Things to Review
              </Typography>
              {data.reviewColumns.length === 0 ? (
                <Typography sx={{ ...PANEL_BODY, color: 'text.secondary' }}>
                  Nothing flagged for expanded review. Open the chart if you need the full record.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                    columnGap: 3,
                    rowGap: 3,
                    width: '100%',
                    minWidth: 0,
                  }}
                >
                  {data.reviewColumns.map((col) => (
                    <Box key={col.title} sx={{ minWidth: 0 }}>
                      <Typography component="h3" sx={thingsToReviewTopicSx}>
                        {col.title}
                      </Typography>
                      <Stack spacing={1.5} sx={{ width: '100%' }}>
                        {col.cards.map((item) => (
                          <ThingsToReviewAlertItem key={item.id} item={item} />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Box>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Block c — Additional Patient Information */}
        <Box sx={visitDetailBlockSx}>
          <Box sx={visitDetailInnerSx}>
            <Stack spacing={PRE_VISIT_AI_SUMMARY_STACK_GAP}>
              <Typography component="h2" sx={{ ...preVisitAiBlockHeadingSx, color: 'text.primary', mb: 0 }}>
                Additional Patient Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Tabs
                  value={additionalTab}
                  onChange={(_, v) => setAdditionalTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: 0,
                    maxWidth: '100%',
                    bgcolor: 'transparent',
                    '& .MuiTabs-flexContainer': { gap: 1 },
                    '& .MuiTabs-indicator': { display: 'none' },
                    '& .MuiTab-root': {
                      minHeight: 28,
                      minWidth: 0,
                      px: 1,
                      py: 0.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'text.secondary',
                      bgcolor: 'transparent',
                      transition: (t) => t.transitions.create(['background-color', 'color'], { duration: 180 }),
                      '&.Mui-selected': {
                        color: 'primary.dark',
                        bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.22 : 0.14),
                      },
                    },
                  }}
                >
                  {ADDITIONAL_INFO_TABS.map((label) => (
                    <Tab key={label} label={label} disableRipple />
                  ))}
                </Tabs>
                <Box sx={{ pt: 0 }}>
                  <AdditionalInfoDataTable
                    columns={ADDITIONAL_INFO_TABLE_HEADERS[additionalTab]}
                    rows={buildAdditionalInfoBodyRows(
                      additionalTab,
                      [
                        data.visitHistory,
                        data.files,
                        data.immunizations,
                        data.labs,
                        data.medications,
                      ][additionalTab],
                    )}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function pickAppointmentForNote(appointments: Appointment[], noteTemplate: string): Appointment | undefined {
  const complete = appointments.find((a) => a.status === 'Complete');
  const matchingTemplate = appointments.find((a) => a.template === noteTemplate);
  return matchingTemplate ?? complete ?? appointments[0];
}

function NotePreviewPanel({ noteId }: { noteId: string | null }) {
  const navigate = useNavigate();
  if (!noteId) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', fontSize: 13 }}>
        Select a note to preview
      </Box>
    );
  }
  const note = MOCK_NOTES.find((n) => n.id === noteId);
  if (!note) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', fontSize: 13 }}>
        Note not found
      </Box>
    );
  }
  const patient = MOCK_PATIENTS.find((p) => p.fullName === note.patient);
  const appointments = patient ? getAppointmentsForPatient(patient.id) : [];
  const appointment = pickAppointmentForNote(appointments, note.template);

  if (patient && appointment) {
    return (
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <VisitNoteContent
          noteId={note.id}
          appointment={appointment}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, fontSize: 15 }}>
            {note.patient}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
            {note.date} · {note.template}
          </Typography>
        </Box>
        {patient && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
            <Button
              component={Link}
              to={`/patients/${patient.id}`}
              variant="text"
              size="small"
              startIcon={<PersonOutlined sx={{ fontSize: 18 }} />}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Full Profile
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ContentPasteOutlined sx={{ fontSize: 18, color: 'primary.main' }} />}
              onClick={() => navigate(`/patients/${patient.id}?openNote=1`)}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Open Note
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={PANEL_SECTION}>
        <Typography component="div" sx={PANEL_SECTION_HEADER}>
          Visit note
        </Typography>
        <Box sx={{ ...PANEL_SUBSECTION, borderBottom: 'none' }}>
          <Typography sx={PANEL_BODY}>
            {patient
              ? 'No visit note data available for this patient.'
              : `No matching patient found for "${note.patient}". Visit note content is shown when the note is linked to a patient with appointments.`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function TaskDetailPanel({ taskId }: { taskId: string | null }) {
  if (!taskId) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', fontSize: 13 }}>
        Select a task to view details
      </Box>
    );
  }
  return (
    <Box sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="body2" color="text.secondary">
        Task details (placeholder). Task ID: {taskId}
      </Typography>
    </Box>
  );
}

function OpenChatPanel({ chatId }: { chatId: string | null }) {
  if (!chatId) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', fontSize: 13 }}>
        Select a chat to open
      </Box>
    );
  }
  const chat = getChatById(chatId);
  const messages = getMessagesForChat(chatId);
  const patient = chat?.patientId ? MOCK_PATIENTS.find((p) => p.id === chat.patientId) : undefined;
  if (!chat) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', fontSize: 13 }}>
        Chat not found
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Chat header */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 15 }}>
          {chat.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
          {chat.participantLabel}
        </Typography>
        {patient && (
          <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ fontSize: 12, color: 'text.primary', fontWeight: 500 }}>
              {patient.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11 }}>
              {patient.mrn} · DOB {patient.dateOfBirth}
            </Typography>
            <Button
              component={Link}
              to={`/patients/${patient.id}`}
              size="small"
              variant="text"
              startIcon={<PersonOutlined sx={{ fontSize: 16 }} />}
              sx={{ mt: 0.5, textTransform: 'none', fontWeight: 500, fontSize: 12, p: 0, minWidth: 0 }}
            >
              Open patient profile
            </Button>
          </Box>
        )}
      </Box>
      {/* Message stream */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              alignSelf: msg.isFromCurrentUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: msg.isFromCurrentUser ? 'primary.main' : 'action.hover',
              color: msg.isFromCurrentUser ? 'primary.contrastText' : 'text.primary',
            }}
          >
            {!msg.isFromCurrentUser && (
              <Typography sx={{ fontSize: 11, fontWeight: 600, mb: 0.25 }}>
                {msg.senderName}
              </Typography>
            )}
            <Typography sx={{ fontSize: 13, lineHeight: 1.4 }}>{msg.content}</Typography>
            <Typography
              sx={{
                fontSize: 11,
                mt: 0.25,
                opacity: 0.85,
              }}
            >
              {msg.time}
            </Typography>
          </Box>
        ))}
      </Box>
      {/* Compose */}
      <Box sx={{ flexShrink: 0, p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'action.hover',
            },
          }}
        />
      </Box>
    </Box>
  );
}

function getFirstChatId(): string | null {
  const sorted = [...MOCK_CHATS].sort((a, b) => {
    if (a.unread && !b.unread) return -1;
    if (!a.unread && b.unread) return 1;
    return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
  });
  return sorted[0]?.id ?? null;
}

export function HomePageContent() {
  const [activeTab, setActiveTab] = useState<HomeViewTab>('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'notes' && MOCK_NOTES.length > 0) {
      setSelectedNoteId(MOCK_NOTES[0].id);
    } else if (activeTab === 'tasks' && MOCK_TASKS.length > 0) {
      setSelectedTaskId(MOCK_TASKS[0].id);
    } else if (activeTab === 'messages') {
      setSelectedChatId(getFirstChatId());
    }
  }, [activeTab]);

  const selectedPatient = selectedPatientId ? TODAYS_PATIENTS.find((p) => p.id === selectedPatientId) ?? null : null;
  const stats = getDaySummaryStats();

  const tabCounts: Record<HomeViewTab, number> = {
    patients: stats.patientsToday,
    notes: stats.notesToSign,
    tasks: stats.tasksOutstanding,
    messages: stats.messagesUnread,
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        background: (theme) => {
          const bg = theme.palette.background as { default?: string; gradientStart?: string; gradientEnd?: string };
          return `linear-gradient(to bottom, ${bg.gradientStart ?? bg.default} 0%, ${bg.gradientEnd ?? bg.default} 100%)`;
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        pt: 3,
        pb: '32px',
        px: '32px',
      }}
    >
      {/* Page header: greeting only */}
      <Box>
        <Typography
          variant="h2"
          sx={{ fontSize: 26.08, fontWeight: 500, lineHeight: 38 / 26.08, color: 'text.primary' }}
        >
          Morning, Dr. Garcia.
        </Typography>
      </Box>

      {/* Tab bar — sits above the card on the page background */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          mt: 0,
          mb: -0.5,
          mx: 0,
        }}
      >
        {SIDE_TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          const count = tabCounts[id];
          return (
            <Button
              key={id}
              className="visit-note-button-exempt"
              onClick={() => setActiveTab(id)}
              aria-label={label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 1,
                height: 'auto',
                minHeight: 0,
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? 'primary.light' : 'transparent',
                borderRadius: '10px',
                textTransform: 'none',
                '&:hover': { bgcolor: isActive ? 'primary.light' : 'rgba(0,0,0,0.04)' },
              }}
            >
              <Icon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: 'inherit' }}>
                {label}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  minWidth: 18,
                  height: 18,
                  px: isActive ? '6px' : 0,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'common.white' : 'text.secondary',
                  borderRadius: '9px',
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {count}
              </Box>
            </Button>
          );
        })}

        <Box sx={{ flex: 1 }} />

      </Box>

      {/* Main card: content only */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: (theme) => theme.shadows[4],
        }}
      >
        {/* Content row: list panel + detail panel */}
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          {/* Left panel: list content for current tab */}
          <Box
            sx={{
              width: 260,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            {activeTab === 'patients' && (
              <PatientsListPanel selectedId={selectedPatientId} onSelect={setSelectedPatientId} />
            )}
            {activeTab === 'notes' && (
              <NotesListPanel selectedId={selectedNoteId} onSelect={setSelectedNoteId} />
            )}
            {activeTab === 'tasks' && (
              <TasksListPanel selectedId={selectedTaskId} onSelect={setSelectedTaskId} />
            )}
            {activeTab === 'messages' && (
              <MessagesListPanel selectedId={selectedChatId} onSelect={setSelectedChatId} />
            )}
          </Box>

          {/* Right panel: detail content for current tab */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: 'background.paper',
              borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            {activeTab === 'patients' && <PatientVisitDetailPanel patient={selectedPatient} />}
            {activeTab === 'notes' && <NotePreviewPanel noteId={selectedNoteId} />}
            {activeTab === 'tasks' && <TaskDetailPanel taskId={selectedTaskId} />}
            {activeTab === 'messages' && <OpenChatPanel chatId={selectedChatId} />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
