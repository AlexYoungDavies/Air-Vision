import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { ComponentType } from 'react';
import WbSunnyOutlined from '@mui/icons-material/WbSunnyOutlined';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
import NotificationImportantOutlined from '@mui/icons-material/NotificationImportantOutlined';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import EventRepeatOutlined from '@mui/icons-material/EventRepeatOutlined';
import ViewListOutlined from '@mui/icons-material/ViewListOutlined';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined';
import AddCommentOutlined from '@mui/icons-material/AddCommentOutlined';
import ForwardToInboxOutlined from '@mui/icons-material/ForwardToInboxOutlined';
import PostAddOutlined from '@mui/icons-material/PostAddOutlined';
import AnalyticsOutlined from '@mui/icons-material/AnalyticsOutlined';
import ReportProblemOutlined from '@mui/icons-material/ReportProblemOutlined';

export interface AIAssistantShortcut {
  id: string;
  label: string;
  /** Leading icon inside the chip. */
  Icon: ComponentType<SvgIconProps>;
  /** Short description shown in the "Tips" popover when this shortcut is active. */
  tips?: string;
}

/** Home / day overview (route `/`). */
export const DEFAULT_ASSISTANT_SHORTCUTS: AIAssistantShortcut[] = [
  {
    id: 'tell-me-about-my-day',
    label: "Today's Overview",
    Icon: WbSunnyOutlined,
    tips: "I'll walk you through today's patient schedule, flag any overruns, highlight open pre-visit tasks, and surface anything that needs your attention before clinic starts.",
  },
  {
    id: 'whats-waiting-on-me',
    label: "My Todo's",
    Icon: HourglassEmptyOutlined,
    tips: "I'll show you pending refill requests, unsigned notes, lab results awaiting review, and any other tasks waiting on your sign-off — prioritised by urgency.",
  },
  {
    id: 'key-alerts-today',
    label: 'Important Alerts',
    Icon: NotificationImportantOutlined,
    tips: "I'll surface critical alerts from today's schedule: flagged lab results, overbooked slots, unsigned consents, and patients with outstanding pre-visit tasks.",
  },
];

/** Visits calendar (`/visits`). */
export const CALENDAR_ASSISTANT_SHORTCUTS: AIAssistantShortcut[] = [
  { id: 'calendar-book-visit', label: 'Book Visit', Icon: EventAvailableOutlined },
  { id: 'calendar-next-availability', label: 'Next Availability', Icon: ScheduleOutlined },
  { id: 'calendar-schedule-followups', label: 'Schedule Follow-ups', Icon: EventRepeatOutlined },
];

/** Patients list (`/patients`, index only). */
export const PATIENTS_LIST_ASSISTANT_SHORTCUTS: AIAssistantShortcut[] = [
  { id: 'patients-visits-overview', label: 'Visits Overview', Icon: ViewListOutlined },
  { id: 'patients-book-visit', label: 'Book Visit', Icon: EventAvailableOutlined },
  { id: 'patients-update-profile', label: 'Update Patient Profile', Icon: PersonOutlineOutlined },
];

/** Patient profile (`/patients/:id`) — overridden when a visit note is open. */
export const PATIENT_PROFILE_ASSISTANT_SHORTCUTS: AIAssistantShortcut[] = [
  { id: 'profile-summarize-balances', label: 'Summarize Patient Balances', Icon: AccountBalanceWalletOutlined },
  { id: 'profile-book-patient', label: 'Book Patient', Icon: EventAvailableOutlined },
  { id: 'profile-update-info', label: 'Update Profile Info', Icon: PersonOutlineOutlined },
];

/** Visit note — unsigned / in progress. */
export const VISIT_NOTE_UNSIGNED_ASSISTANT_SHORTCUTS: AIAssistantShortcut[] = [
  { id: 'note-ai-check', label: 'AI Note Check', Icon: FactCheckOutlined },
  { id: 'note-add-context', label: 'Add Context', Icon: AddCommentOutlined },
  { id: 'note-fax', label: 'Fax Note', Icon: ForwardToInboxOutlined },
];

/** Visit note — after signing. */
export const VISIT_NOTE_SIGNED_ASSISTANT_SHORTCUTS: AIAssistantShortcut[] = [
  { id: 'note-add-addendum', label: 'Add Addendum', Icon: PostAddOutlined },
  { id: 'note-fax-signed', label: 'Fax Note', Icon: ForwardToInboxOutlined },
];

/** Claims (`/claims`). */
export const CLAIMS_ASSISTANT_SHORTCUTS: AIAssistantShortcut[] = [
  { id: 'claims-summary', label: 'Claims Summary', Icon: AnalyticsOutlined },
  { id: 'claims-highlight-issues', label: 'Highlight Issues', Icon: ReportProblemOutlined },
];

function normalizePath(pathname: string): string {
  const t = pathname.replace(/\/+$/, '');
  return t === '' ? '/' : t;
}

/**
 * Shortcuts for the current route when no page-specific override is active
 * (e.g. visit note sets an override via AssistantShortcutsProvider).
 */
export function getAssistantShortcutsForPath(pathname: string): AIAssistantShortcut[] {
  const p = normalizePath(pathname);

  if (p === '/visits') return CALENDAR_ASSISTANT_SHORTCUTS;
  if (p === '/claims') return CLAIMS_ASSISTANT_SHORTCUTS;
  if (p === '/patients') return PATIENTS_LIST_ASSISTANT_SHORTCUTS;
  if (p.startsWith('/patients/')) return PATIENT_PROFILE_ASSISTANT_SHORTCUTS;

  return DEFAULT_ASSISTANT_SHORTCUTS;
}
