/**
 * Mock patient activity timeline entries for the History side panel.
 */

export type PatientActivityIconType =
  | 'appointment'
  | 'appointment-rescheduled'
  | 'visit-note'
  | 'claim'
  | 'payment'
  | 'document'
  | 'patient'
  | 'patient-edited'
  | 'patient-deleted'
  | 'order'
  | 'imaging'
  | 'medication'
  | 'labs'
  | 'immunization'
  | 'comment';

export interface PatientActivityAttachment {
  fileName: string;
}

export interface PatientActivityEntry {
  id: string;
  patientId: string;
  icon: PatientActivityIconType;
  /** Bold label prefix, e.g. "Appointment", "Visit note". */
  item: string;
  /** Remainder of the title, e.g. "scheduled for 01/01/26". */
  action: string;
  /** ISO timestamp used for sorting and display. */
  occurredAt: string;
  /** Omitted for system-driven events. */
  userName?: string;
  attachment?: PatientActivityAttachment;
  /** Body text for custom timeline notes. */
  noteContent?: string;
}

/** Format: "11:56am, Jun 5th 2026" */
export function formatActivityTimestamp(iso: string): string {
  const d = new Date(iso);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'am' : 'pm';
  const minutePart = minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? 'st'
      : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
          ? 'rd'
          : 'th';
  return `${hour12}${minutePart}${ampm}, ${months[d.getMonth()]} ${day}${suffix} ${d.getFullYear()}`;
}

function at(year: number, month: number, day: number, hour: number, minute = 0): string {
  return new Date(year, month, day, hour, minute).toISOString();
}

const MOCK_USER = 'Firstname Lastname';

function buildDefaultActivity(patientId: string): PatientActivityEntry[] {
  return [
    {
      id: `${patientId}-act-1`,
      patientId,
      icon: 'appointment',
      item: 'Appointment',
      action: 'scheduled for 01/01/26',
      occurredAt: at(2026, 5, 5, 11, 56),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-2`,
      patientId,
      icon: 'visit-note',
      item: 'Visit note',
      action: 'signed',
      occurredAt: at(2026, 5, 5, 11, 52),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-3`,
      patientId,
      icon: 'claim',
      item: 'Claim',
      action: 'created',
      occurredAt: at(2026, 5, 5, 11, 48),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-4`,
      patientId,
      icon: 'appointment-rescheduled',
      item: 'Appointment',
      action: 'rescheduled for 01/01/26',
      occurredAt: at(2026, 5, 5, 11, 44),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-5`,
      patientId,
      icon: 'claim',
      item: 'Claim',
      action: 'processed',
      occurredAt: at(2026, 5, 5, 11, 40),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-6`,
      patientId,
      icon: 'document',
      item: 'Document',
      action: 'uploaded',
      occurredAt: at(2026, 5, 5, 11, 36),
      userName: MOCK_USER,
      attachment: { fileName: 'filename.format.file' },
    },
    {
      id: `${patientId}-act-7`,
      patientId,
      icon: 'patient',
      item: 'Patient',
      action: 'created',
      occurredAt: at(2026, 5, 5, 11, 32),
    },
    {
      id: `${patientId}-act-8`,
      patientId,
      icon: 'payment',
      item: 'Payment',
      action: 'posted',
      occurredAt: at(2026, 5, 5, 11, 28),
    },
    {
      id: `${patientId}-act-9`,
      patientId,
      icon: 'order',
      item: 'Order',
      action: 'created for right knee MRI',
      occurredAt: at(2026, 5, 4, 15, 10),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-10`,
      patientId,
      icon: 'order',
      item: 'Order',
      action: 'fulfilled',
      occurredAt: at(2026, 5, 4, 9, 45),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-11`,
      patientId,
      icon: 'claim',
      item: 'Claim',
      action: 'submitted',
      occurredAt: at(2026, 5, 3, 16, 20),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-12`,
      patientId,
      icon: 'document',
      item: 'Document',
      action: 'edited',
      occurredAt: at(2026, 5, 3, 14, 5),
      userName: MOCK_USER,
      attachment: { fileName: 'filename.format.file' },
    },
    {
      id: `${patientId}-act-13`,
      patientId,
      icon: 'imaging',
      item: 'Imaging',
      action: 'received',
      occurredAt: at(2026, 5, 2, 10, 30),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-14`,
      patientId,
      icon: 'medication',
      item: 'Medication',
      action: 'prescribed (Ibuprofin 50mg)',
      occurredAt: at(2026, 5, 1, 13, 15),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-15`,
      patientId,
      icon: 'labs',
      item: 'Labs',
      action: 'received',
      occurredAt: at(2026, 4, 30, 8, 50),
    },
    {
      id: `${patientId}-act-16`,
      patientId,
      icon: 'immunization',
      item: 'Immunization',
      action: 'received',
      occurredAt: at(2026, 4, 28, 11, 0),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-17`,
      patientId,
      icon: 'patient-edited',
      item: 'Patient profile',
      action: 'edited',
      occurredAt: at(2026, 4, 25, 9, 22),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-18`,
      patientId,
      icon: 'patient-deleted',
      item: 'Patient',
      action: 'deleted',
      occurredAt: at(2026, 4, 20, 17, 5),
      userName: MOCK_USER,
    },
    {
      id: `${patientId}-act-19`,
      patientId,
      icon: 'comment',
      item: 'Comment',
      action: 'added by front desk',
      occurredAt: at(2026, 5, 4, 16, 30),
      userName: 'Maria L.',
      noteContent: 'Patient called to confirm Thursday follow-up. Prefers afternoon slots.',
    },
    {
      id: `${patientId}-act-20`,
      patientId,
      icon: 'comment',
      item: 'Comment',
      action: 'added by billing',
      occurredAt: at(2026, 5, 2, 14, 15),
      userName: 'James K.',
      noteContent: 'Prior auth approved for 12 PT visits. Updated in chart.',
    },
    {
      id: `${patientId}-act-21`,
      patientId,
      icon: 'comment',
      item: 'Comment',
      action: 'added by provider',
      occurredAt: at(2026, 4, 29, 9, 5),
      userName: MOCK_USER,
      noteContent: 'Discussed home exercise program at last visit — patient doing well with compliance.',
    },
  ];
}

const ACTIVITY_BY_PATIENT: Record<string, PatientActivityEntry[]> = (() => {
  const map: Record<string, PatientActivityEntry[]> = {};
  for (let i = 1; i <= 20; i++) {
    const id = String(i);
    map[id] = buildDefaultActivity(id);
  }
  return map;
})();

export function getPatientActivity(patientId: string): PatientActivityEntry[] {
  return ACTIVITY_BY_PATIENT[patientId] ?? buildDefaultActivity(patientId);
}

export function sortPatientActivity(entries: PatientActivityEntry[]): PatientActivityEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}

export type ActivityFilterGroup =
  | 'appointments'
  | 'visit-notes'
  | 'orders'
  | 'imaging'
  | 'medications'
  | 'labs'
  | 'immunizations'
  | 'claims'
  | 'payments'
  | 'documents'
  | 'patient-profile'
  | 'comments';

export const ACTIVITY_FILTER_OPTIONS: { id: ActivityFilterGroup; label: string }[] = [
  { id: 'appointments', label: 'Appointments' },
  { id: 'visit-notes', label: 'Visit notes' },
  { id: 'orders', label: 'Orders' },
  { id: 'imaging', label: 'Imaging' },
  { id: 'medications', label: 'Medications' },
  { id: 'labs', label: 'Labs' },
  { id: 'immunizations', label: 'Immunizations' },
  { id: 'claims', label: 'Claims' },
  { id: 'payments', label: 'Payments' },
  { id: 'documents', label: 'Documents' },
  { id: 'patient-profile', label: 'Patient profile' },
  { id: 'comments', label: 'Comments' },
];

const CLINICAL_ICONS = new Set<PatientActivityIconType>([
  'appointment',
  'appointment-rescheduled',
  'visit-note',
  'order',
  'imaging',
  'medication',
  'labs',
  'immunization',
]);

export function getActivityFilterGroup(entry: PatientActivityEntry): ActivityFilterGroup {
  switch (entry.icon) {
    case 'appointment':
    case 'appointment-rescheduled':
      return 'appointments';
    case 'visit-note':
      return 'visit-notes';
    case 'order':
      return 'orders';
    case 'imaging':
      return 'imaging';
    case 'medication':
      return 'medications';
    case 'labs':
      return 'labs';
    case 'immunization':
      return 'immunizations';
    case 'claim':
      return 'claims';
    case 'payment':
      return 'payments';
    case 'document':
      return 'documents';
    case 'comment':
      return 'comments';
    default:
      return 'patient-profile';
  }
}

export function isClinicalActivity(entry: PatientActivityEntry): boolean {
  return CLINICAL_ICONS.has(entry.icon);
}

export function isCommentActivity(entry: PatientActivityEntry): boolean {
  return entry.icon === 'comment';
}

export function matchesActivitySearch(entry: PatientActivityEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    entry.item,
    entry.action,
    entry.userName,
    entry.noteContent,
    entry.attachment?.fileName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function getDefaultActivityFilters(): Set<ActivityFilterGroup> {
  return new Set(ACTIVITY_FILTER_OPTIONS.map((option) => option.id));
}
