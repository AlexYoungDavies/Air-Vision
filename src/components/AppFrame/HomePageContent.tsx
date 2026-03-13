import { useState } from 'react';
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
} from '@mui/material';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import ScienceOutlined from '@mui/icons-material/ScienceOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import ContentPasteOutlined from '@mui/icons-material/ContentPasteOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_PATIENTS, TODAYS_PATIENTS, type Patient } from '../../data/mockPatients';
import { Callout } from './Callout';
import { LabelValue } from './LabelValue';
import { getPatientVisitPanelData } from '../../data/mockPatientVisitPanel';
import { MOCK_CHATS, getChatById, getMessagesForChat } from '../../data/mockChats';

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

function SettingsNavIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.37139 3.31098C10.0302 2.26968 10.7678 1.25 12 1.25C13.2322 1.25 13.9698 2.26968 14.6286 3.31098C14.7897 3.56566 15.0197 3.77703 15.358 3.91776C15.6897 4.05571 15.9973 4.06798 16.2879 4.00176C17.4894 3.72805 18.7301 3.52735 19.6014 4.39865C20.4727 5.26996 20.272 6.51068 19.9983 7.71211C19.932 8.00278 19.9443 8.31033 20.0823 8.642C20.223 8.98034 20.4343 9.21027 20.689 9.3714C21.7303 10.0302 22.75 10.7678 22.75 12C22.75 13.2322 21.7303 13.9698 20.689 14.6286C20.4343 14.7898 20.223 15.0197 20.0822 15.358C19.9443 15.6897 19.932 15.9973 19.9982 16.2879C20.2719 17.4894 20.4727 18.7301 19.6013 19.6014C18.73 20.4727 17.4893 20.272 16.2879 19.9983C15.9972 19.932 15.6897 19.9443 15.358 20.0823C15.0197 20.223 14.7897 20.4343 14.6286 20.689C13.9698 21.7303 13.2322 22.75 12 22.75C10.7678 22.75 10.0302 21.7303 9.3714 20.689C9.21027 20.4343 8.98034 20.223 8.642 20.0823C8.31033 19.9443 8.00278 19.932 7.71211 19.9983C6.51068 20.272 5.26996 20.4727 4.39865 19.6014C3.52735 18.7301 3.72805 17.4894 4.00176 16.2879C4.06798 15.9973 4.05571 15.6897 3.91776 15.358C3.77703 15.0197 3.56566 14.7898 3.31098 14.6286C2.26968 13.9698 1.25 13.2322 1.25 12C1.25 10.7678 2.26968 10.0302 3.31098 9.37139C3.56566 9.21026 3.77703 8.98033 3.91775 8.64198C4.0557 8.3103 4.06797 8.00273 4.00173 7.71204C3.72798 6.51063 3.52729 5.2699 4.3986 4.39859C5.2699 3.52729 6.51063 3.72797 7.71205 4.00173C8.00273 4.06797 8.3103 4.0557 8.64198 3.91775C8.98033 3.77702 9.21026 3.56566 9.37139 3.31098ZM12 2.75C11.501 2.75 11.092 3.11882 10.9082 3.58265C10.6044 4.34898 10.0573 4.95368 9.21802 5.30273C8.38072 5.65098 7.57167 5.60522 6.81937 5.27732C6.36198 5.07795 5.81207 5.10644 5.45926 5.45925C5.10644 5.81207 5.07796 6.36197 5.27732 6.81937C5.60522 7.57166 5.65098 8.38072 5.30273 9.21802C4.95368 10.0573 4.34898 10.6044 3.58265 10.9082C3.11882 11.092 2.75 11.501 2.75 12C2.75 12.499 3.11882 12.908 3.58265 13.0918C4.34898 13.3956 4.95369 13.9428 5.30274 14.782C5.65098 15.6193 5.60525 16.4283 5.27737 17.1806C5.07802 17.638 5.1065 18.1879 5.45931 18.5407C5.81213 18.8936 6.36204 18.922 6.81943 18.7227C7.57171 18.3948 8.38075 18.349 9.21803 18.6973C10.0573 19.0463 10.6044 19.651 10.9082 20.4173C11.092 20.8812 11.501 21.25 12 21.25C12.499 21.25 12.908 20.8812 13.0918 20.4173C13.3956 19.651 13.9427 19.0463 14.782 18.6973C15.6193 18.349 16.4283 18.3948 17.1806 18.7227C17.638 18.922 18.1879 18.8936 18.5407 18.5407C18.8935 18.1879 18.922 17.638 18.7226 17.1806C18.3947 16.4283 18.349 15.6193 18.6973 14.782C19.0463 13.9428 19.651 13.3956 20.4173 13.0918C20.8812 12.908 21.25 12.499 21.25 12C21.25 11.501 20.8812 11.092 20.4173 10.9082C19.651 10.6044 19.0463 10.0573 18.6973 9.21803C18.349 8.38075 18.3948 7.57171 18.7227 6.81943C18.922 6.36204 18.8936 5.81213 18.5407 5.45931C18.1879 5.1065 17.638 5.07802 17.1806 5.27737C16.4283 5.60525 15.6193 5.65098 14.782 5.30274C13.9428 4.95369 13.3956 4.34898 13.0918 3.58265C12.908 3.11882 12.499 2.75 12 2.75Z"
      />
    </SvgIcon>
  );
}

const ICON_SIZE = 18;
const SIDE_TAB_WIDTH = 56;

const APPOINTMENT_TYPE_COLORS: Record<NonNullable<Patient['appointmentType']>, string> = {
  'Initial Eval': '#1976d2',
  'Follow up': '#2e7d32',
  'Progress Note': '#ed6c02',
};
const DEFAULT_APPOINTMENT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const SIDE_TAB_PADDING = 1; // 8px
const SIDE_TAB_ICON_CONTAINER = 40; // 40x40px
const SIDE_TAB_ICON_SIZE = 22; // 22x22px
const SIDE_TAB_ITEM_GAP = '12px';

type HomeViewTab = 'patients' | 'notes' | 'tasks' | 'messages';

const SIDE_TABS: { id: HomeViewTab; label: string; Icon: typeof PatientsNavIcon }[] = [
  { id: 'patients', label: 'Patients', Icon: PatientsNavIcon },
  { id: 'notes', label: 'Notes', Icon: SignatureAltIcon },
  { id: 'tasks', label: 'Tasks', Icon: CheckListIcon },
  { id: 'messages', label: 'Messages', Icon: MessagesNavIcon },
];

const MOCK_NOTES = [
  { id: 'n1', patient: 'Sarah Johnson', date: 'Aug 8', template: 'Office Visit' },
  { id: 'n2', patient: 'Michael Chen', date: 'Aug 8', template: 'Follow-up' },
  { id: 'n3', patient: 'Emily Davis', date: 'Aug 7', template: 'Annual Physical' },
];

const MOCK_TASKS = [
  { id: 't1', title: 'Review lab results', due: 'Today' },
  { id: 't2', title: 'Call patient re: medication', due: 'Today' },
  { id: 't3', title: 'Sign off on referral', due: 'Tomorrow' },
];

// Background for side tab: white at 50% opacity
const SIDE_TAB_BG = 'rgba(255, 255, 255, 0.5)';

// ----- Left panel content per tab -----

function PatientsListPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: '16px 0 16px 0' }}>
      <Box
        sx={{
          bgcolor: 'rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          pl: 1.5,
          pr: 1,
          borderTop: 0,
          borderRight: 0,
          borderLeft: 0,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
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
            p.appointmentType != null
              ? APPOINTMENT_TYPE_COLORS[p.appointmentType]
              : DEFAULT_APPOINTMENT_BORDER_COLOR;
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
                borderColor: 'rgba(0, 0, 0, 0.1)',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: '16px 0 16px 0' }}>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: '16px 0 16px 0' }}>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: '16px 0 16px 0' }}>
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
const PANEL_SUB_LABEL = { fontSize: 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 };
const PANEL_BODY = { fontSize: 12, color: 'text.primary', lineHeight: 1.5 };

/** Day summary stats when no patient is selected. Derived from mock data. */
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

function PatientVisitDetailPanel({ patient }: { patient: Patient | null }) {
  const navigate = useNavigate();
  if (!patient) {
    return <DaySummaryPanel />;
  }
  const data = getPatientVisitPanelData(patient);
  return (
    <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
      {/* Header row: name + visit info (left), actions (right) */}
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
            {patient.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
            {patient.reasonForVisit ?? patient.case} · {patient.appointmentTime ?? '—'}
          </Typography>
        </Box>
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
      </Box>

      {/* 1. Patient Summary */}
      <Box sx={PANEL_SECTION}>
        <Typography component="div" sx={PANEL_SECTION_HEADER}>
          Patient Summary
        </Typography>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>Detailed demo</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {data.demographics.map((d) => (
              <LabelValue key={d.label} label={d.label} value={d.value} />
            ))}
          </Box>
        </Box>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>Reason for visiting</Typography>
          <Typography sx={PANEL_BODY}>{data.reasonForVisit}</Typography>
        </Box>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>Treatment history</Typography>
          {data.treatmentHistory.length === 0 ? (
            <Typography sx={{ ...PANEL_BODY, color: 'text.secondary' }}>None recorded.</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 12 }}>
              {data.treatmentHistory.map((t, i) => (
                <li key={i}>
                  <Typography sx={PANEL_BODY}>{t.date} — {t.description}{t.provider ? ` (${t.provider})` : ''}</Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* 2. Needs attention before visit */}
      <Box sx={PANEL_SECTION}>
        <Typography component="div" sx={PANEL_SECTION_HEADER}>
          Needs attention before visit
        </Typography>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>New labs / imaging / etc</Typography>
          {data.newLabsImaging.length === 0 ? (
            <Typography sx={{ ...PANEL_BODY, color: 'text.secondary' }}>Nothing new.</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 12 }}>
              {data.newLabsImaging.map((n, i) => (
                <li key={i}>
                  <Typography sx={PANEL_BODY}>{n.type}: {n.name}{n.date ? ` — ${n.date}` : ''}</Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>Patient comms</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 12 }}>
            {data.patientComms.map((c, i) => (
              <li key={i}>
                <Typography sx={PANEL_BODY}>{c.type} — {c.summary} ({c.date})</Typography>
              </li>
            ))}
          </Box>
        </Box>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>Relevant alerts (auth, visit type needed)</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 12 }}>
            {data.alerts.map((a, i) => (
              <li key={i}>
                <Typography sx={PANEL_BODY}>{a.type}: {a.message}</Typography>
              </li>
            ))}
          </Box>
        </Box>
      </Box>

      {/* 3. Clinical Context */}
      <Box sx={PANEL_SECTION}>
        <Typography component="div" sx={PANEL_SECTION_HEADER}>
          Clinical Context
        </Typography>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>Active medications</Typography>
          {data.medications.length === 0 ? (
            <Typography sx={{ ...PANEL_BODY, color: 'text.secondary' }}>None listed.</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 12 }}>
              {data.medications.map((m, i) => (
                <li key={i}>
                  <Typography sx={PANEL_BODY}>{m.name} {m.dose} — {m.frequency}</Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>Allergies</Typography>
          {data.allergies.length === 0 ? (
            <Typography sx={{ ...PANEL_BODY, color: 'text.secondary' }}>None documented.</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 12 }}>
              {data.allergies.map((a, i) => (
                <li key={i}>
                  <Typography sx={PANEL_BODY}>{a.allergen} — {a.reaction} ({a.severity})</Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={PANEL_SUBSECTION}>
          <Typography sx={PANEL_SUB_LABEL}>Immunizations</Typography>
          {data.immunizations.length === 0 ? (
            <Typography sx={{ ...PANEL_BODY, color: 'text.secondary' }}>None recorded.</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 12 }}>
              {data.immunizations.map((im, i) => (
                <li key={i}>
                  <Typography sx={PANEL_BODY}>{im.vaccine} — {im.date}{im.dose ? ` (dose ${im.dose})` : ''}</Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
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
  const patient = TODAYS_PATIENTS.find((p) => p.fullName === note.patient);
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
            Visit note for {note.patient} ({note.template}, {note.date}). Content will load when you open the note.
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

export function HomePageContent() {
  const [activeTab, setActiveTab] = useState<HomeViewTab>('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const selectedPatient = selectedPatientId ? TODAYS_PATIENTS.find((p) => p.id === selectedPatientId) ?? null : null;
  const stats = getDaySummaryStats();

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
        gap: 3,
        pt: 3,
        pb: 8,
        px: 8,
      }}
    >
      <Box sx={{ maxWidth: 578 }}>
        <Typography
          variant="h2"
          sx={{ fontSize: 26.08, fontWeight: 500, lineHeight: 38 / 26.08, color: 'text.primary', mb: 0.5 }}
        >
          Morning, Dr. Garcia.
        </Typography>
        <Typography sx={{ fontSize: 14, lineHeight: 22 / 14, color: 'text.primary' }}>
          Today you have {stats.patientsToday} patients. You also have {stats.notesToSign} notes to sign and {stats.tasksOutstanding} outstanding tasks.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 0,
          flex: 1,
          minHeight: 0,
          alignItems: 'stretch',
          overflow: 'visible',
          borderRadius: '16px',
          boxShadow: '0px 4px 36px 0px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Side tab: icons only, 56px wide, 40x40 containers, 8px padding, settings at bottom */}
        <Box
          sx={{
            width: SIDE_TAB_WIDTH,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: SIDE_TAB_PADDING,
            px: SIDE_TAB_PADDING,
            bgcolor: SIDE_TAB_BG,
            borderRadius: '16px 0 0 16px',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SIDE_TAB_ITEM_GAP }}>
            {SIDE_TABS.map(({ id, label, Icon }) => (
              <Tooltip key={id} title={label}>
                <IconButton
                  onClick={() => setActiveTab(id)}
                  aria-label={label}
                  sx={{
                    width: SIDE_TAB_ICON_CONTAINER,
                    height: SIDE_TAB_ICON_CONTAINER,
                    color: activeTab === id ? 'primary.main' : 'text.primary',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: SIDE_TAB_ICON_SIZE }} />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
          <Box sx={{ flex: 1, minHeight: 16 }} />
          <IconButton
            aria-label="Settings"
            sx={{
              width: SIDE_TAB_ICON_CONTAINER,
              height: SIDE_TAB_ICON_CONTAINER,
              color: 'text.primary',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <SettingsNavIcon sx={{ fontSize: SIDE_TAB_ICON_SIZE }} />
          </IconButton>
        </Box>

        {/* Container: left (list) + right (detail) panels */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            gap: 0.75,
            alignItems: 'stretch',
            overflow: 'hidden',
          }}
        >
          {/* Left panel: list content for current tab */}
          <Box
            sx={{
              width: 260,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '0 16px 16px 0',
              overflow: 'hidden',
              boxShadow: 'none',
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

          {/* Right panel: detail content for current tab (no tabs inside) */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 'none',
              zIndex: 10,
              bgcolor: 'background.paper',
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
