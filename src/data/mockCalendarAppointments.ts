/**
 * Mock day-grid appointments for the Visits calendar.
 * Times are minutes from midnight. Day grid runs 6 AM–7 PM.
 * Patient names and appointment types come from the shared catalogs.
 */

import { MOCK_PATIENTS } from './mockPatients';
import { getAppointmentTypeByLabel, MOCK_APPOINTMENT_TYPES } from './mockAppointmentTypes';

export type CalendarAppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checkedIn'
  | 'completed'
  | 'canceled'
  | 'noShow';

export interface CalendarAppointmentAlerts {
  hasChecklist?: boolean;
  hasBillingIssue?: boolean;
  hasNotes?: boolean;
  extraCount?: number;
}

export interface CalendarAppointment {
  id: string;
  providerId: string;
  patientId: string;
  patientName: string;
  caseName: string;
  /** Catalog label from `MOCK_APPOINTMENT_TYPES` */
  appointmentType: string;
  facilityName: string;
  status: CalendarAppointmentStatus;
  /** Minutes from midnight */
  startMinutes: number;
  /** Minutes from midnight */
  endMinutes: number;
  alerts?: CalendarAppointmentAlerts;
}

export interface LaidOutCalendarAppointment extends CalendarAppointment {
  /** Column index within an overlapping group (0-based) */
  columnIndex: number;
  /** Total columns in the overlapping group */
  columnCount: number;
}

const FACILITY = 'Main Campus';
const NORTH = 'North Clinic';
const TELE = 'Telehealth Hub';

function at(h: number, m = 0) {
  return h * 60 + m;
}

function patient(id: string) {
  const p = MOCK_PATIENTS.find((row) => row.id === id);
  if (!p) throw new Error(`Unknown mock patient id: ${id}`);
  return { patientId: p.id, patientName: p.fullName, caseName: p.case };
}

function typeLabel(id: (typeof MOCK_APPOINTMENT_TYPES)[number]['id']) {
  const t = MOCK_APPOINTMENT_TYPES.find((row) => row.id === id);
  if (!t) throw new Error(`Unknown appointment type id: ${id}`);
  return t.label;
}

/** Dense mock schedule spanning statuses, overlaps, durations, and all 20 appointment types. */
export const MOCK_CALENDAR_APPOINTMENTS: CalendarAppointment[] = [
  // Emily Chen — provider 1
  {
    id: 'a1',
    providerId: '1',
    ...patient('21'),
    appointmentType: typeLabel('follow-up'),
    facilityName: FACILITY,
    status: 'completed',
    startMinutes: at(7, 0),
    endMinutes: at(7, 30),
    alerts: { hasChecklist: true, hasNotes: true },
  },
  {
    id: 'a2',
    providerId: '1',
    ...patient('22'),
    appointmentType: typeLabel('progress-note'),
    facilityName: FACILITY,
    status: 'completed',
    startMinutes: at(7, 0),
    endMinutes: at(7, 30),
    alerts: { hasBillingIssue: true },
  },
  {
    id: 'a3',
    providerId: '1',
    ...patient('23'),
    appointmentType: typeLabel('telehealth'),
    facilityName: TELE,
    status: 'checkedIn',
    startMinutes: at(8, 0),
    endMinutes: at(8, 45),
    alerts: { hasChecklist: true, hasBillingIssue: true, hasNotes: true, extraCount: 2 },
  },
  {
    id: 'a4',
    providerId: '1',
    ...patient('24'),
    appointmentType: typeLabel('new-patient-consult'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(9, 0),
    endMinutes: at(9, 30),
    alerts: { hasNotes: true },
  },
  {
    id: 'a5',
    providerId: '1',
    ...patient('25'),
    appointmentType: typeLabel('medicare-follow-up'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(10, 0),
    endMinutes: at(10, 30),
  },

  // James Wilson — provider 2
  {
    id: 'a6',
    providerId: '2',
    ...patient('26'),
    appointmentType: typeLabel('annual-wellness'),
    facilityName: NORTH,
    status: 'scheduled',
    startMinutes: at(8, 0),
    endMinutes: at(8, 30),
    alerts: { hasChecklist: true },
  },
  {
    id: 'a7',
    providerId: '2',
    ...patient('27'),
    appointmentType: typeLabel('consult'),
    facilityName: NORTH,
    status: 'confirmed',
    startMinutes: at(9, 0),
    endMinutes: at(10, 0),
    alerts: { hasBillingIssue: true, hasNotes: true, extraCount: 1 },
  },
  {
    id: 'a8',
    providerId: '2',
    ...patient('28'),
    appointmentType: typeLabel('annual-wellness'),
    facilityName: FACILITY,
    status: 'canceled',
    startMinutes: at(11, 0),
    endMinutes: at(11, 30),
  },

  // Maria Garcia — provider 3
  {
    id: 'a9',
    providerId: '3',
    ...patient('29'),
    appointmentType: typeLabel('follow-up'),
    facilityName: FACILITY,
    status: 'checkedIn',
    startMinutes: at(7, 30),
    endMinutes: at(8, 0),
    alerts: { hasChecklist: true, extraCount: 2 },
  },
  {
    id: 'a10',
    providerId: '3',
    ...patient('30'),
    appointmentType: typeLabel('progress-note'),
    facilityName: FACILITY,
    status: 'noShow',
    startMinutes: at(8, 30),
    endMinutes: at(9, 0),
    alerts: { hasNotes: true },
  },
  {
    id: 'a11',
    providerId: '3',
    ...patient('31'),
    appointmentType: typeLabel('lab-review'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(9, 30),
    endMinutes: at(10, 0),
  },
  {
    id: 'a12',
    providerId: '3',
    ...patient('10'),
    appointmentType: typeLabel('consult'),
    facilityName: TELE,
    status: 'scheduled',
    startMinutes: at(10, 30),
    endMinutes: at(11, 30),
    alerts: { hasChecklist: true, hasBillingIssue: true },
  },
  {
    id: 'a13',
    providerId: '3',
    ...patient('33'),
    appointmentType: typeLabel('procedure'),
    facilityName: FACILITY,
    status: 'completed',
    startMinutes: at(13, 0),
    endMinutes: at(13, 45),
  },
  {
    id: 'a14',
    providerId: '3',
    ...patient('32'),
    appointmentType: typeLabel('injection'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(14, 0),
    endMinutes: at(14, 30),
    alerts: { hasNotes: true, extraCount: 3 },
  },

  // David Kim — provider 4
  {
    id: 'a15',
    providerId: '4',
    ...patient('12'),
    appointmentType: typeLabel('post-op'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(9, 0),
    endMinutes: at(9, 45),
    alerts: { hasChecklist: true },
  },
  {
    id: 'a15b',
    providerId: '4',
    ...patient('49'),
    appointmentType: typeLabel('pre-op'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(11, 0),
    endMinutes: at(11, 45),
  },

  // Sarah Johnson — provider 5
  {
    id: 'a16',
    providerId: '5',
    ...patient('34'),
    appointmentType: typeLabel('medicare-progress-note'),
    facilityName: NORTH,
    status: 'checkedIn',
    startMinutes: at(8, 0),
    endMinutes: at(8, 30),
  },
  {
    id: 'a17',
    providerId: '5',
    ...patient('35'),
    appointmentType: typeLabel('telehealth'),
    facilityName: TELE,
    status: 'scheduled',
    startMinutes: at(10, 0),
    endMinutes: at(11, 0),
    alerts: { hasNotes: true },
  },
  {
    id: 'a18',
    providerId: '5',
    ...patient('36'),
    appointmentType: typeLabel('lab-review'),
    facilityName: FACILITY,
    status: 'canceled',
    startMinutes: at(13, 0),
    endMinutes: at(13, 30),
  },

  // Robert Lee — provider 6
  {
    id: 'a19',
    providerId: '6',
    ...patient('37'),
    appointmentType: typeLabel('medicare-initial-eval'),
    facilityName: FACILITY,
    status: 'completed',
    startMinutes: at(7, 0),
    endMinutes: at(7, 45),
  },
  {
    id: 'a20',
    providerId: '6',
    ...patient('38'),
    appointmentType: typeLabel('re-evaluation'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(8, 0),
    endMinutes: at(8, 30),
    alerts: { hasBillingIssue: true, extraCount: 2 },
  },
  {
    id: 'a21',
    providerId: '6',
    ...patient('39'),
    appointmentType: typeLabel('follow-up'),
    facilityName: FACILITY,
    status: 'noShow',
    startMinutes: at(9, 0),
    endMinutes: at(9, 30),
  },
  {
    id: 'a22',
    providerId: '6',
    ...patient('2'),
    appointmentType: typeLabel('post-op'),
    facilityName: FACILITY,
    status: 'checkedIn',
    startMinutes: at(11, 0),
    endMinutes: at(12, 0),
    alerts: { hasChecklist: true, hasNotes: true },
  },
  {
    id: 'a23',
    providerId: '6',
    ...patient('4'),
    appointmentType: typeLabel('initial-eval'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(14, 0),
    endMinutes: at(14, 45),
  },

  // Amy Foster — provider 7
  {
    id: 'a24',
    providerId: '7',
    ...patient('40'),
    appointmentType: typeLabel('medicare-re-evaluation'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(10, 0),
    endMinutes: at(10, 45),
  },
  {
    id: 'a25',
    providerId: '7',
    ...patient('41'),
    appointmentType: typeLabel('discharge'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(15, 0),
    endMinutes: at(15, 30),
    alerts: { hasChecklist: true, hasBillingIssue: true, hasNotes: true, extraCount: 2 },
  },

  // Chris Taylor — provider 8
  {
    id: 'a26',
    providerId: '8',
    ...patient('42'),
    appointmentType: typeLabel('progress-note'),
    facilityName: FACILITY,
    status: 'completed',
    startMinutes: at(7, 0),
    endMinutes: at(7, 30),
  },
  {
    id: 'a27',
    providerId: '8',
    ...patient('43'),
    appointmentType: typeLabel('medicare-discharge'),
    facilityName: FACILITY,
    status: 'checkedIn',
    startMinutes: at(8, 0),
    endMinutes: at(8, 30),
    alerts: { hasChecklist: true },
  },
  {
    id: 'a28',
    providerId: '8',
    ...patient('44'),
    appointmentType: typeLabel('consult'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(9, 0),
    endMinutes: at(9, 30),
  },
  {
    id: 'a29',
    providerId: '8',
    ...patient('45'),
    appointmentType: typeLabel('follow-up'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(9, 0),
    endMinutes: at(9, 30),
    alerts: { hasNotes: true },
  },
  {
    id: 'a30',
    providerId: '8',
    ...patient('7'),
    appointmentType: typeLabel('procedure'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(11, 0),
    endMinutes: at(12, 0),
  },
  {
    id: 'a31',
    providerId: '8',
    ...patient('5'),
    appointmentType: typeLabel('injection'),
    facilityName: FACILITY,
    status: 'canceled',
    startMinutes: at(13, 0),
    endMinutes: at(13, 45),
  },
  {
    id: 'a32',
    providerId: '8',
    ...patient('50'),
    appointmentType: typeLabel('walk-in'),
    facilityName: FACILITY,
    status: 'noShow',
    startMinutes: at(15, 0),
    endMinutes: at(15, 30),
  },

  // Priya Sharma — provider 9
  {
    id: 'a33',
    providerId: '9',
    ...patient('46'),
    appointmentType: typeLabel('medicare-follow-up'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(8, 30),
    endMinutes: at(9, 0),
  },
  {
    id: 'a34',
    providerId: '9',
    ...patient('15'),
    appointmentType: typeLabel('telehealth'),
    facilityName: TELE,
    status: 'checkedIn',
    startMinutes: at(10, 0),
    endMinutes: at(10, 30),
    alerts: { hasBillingIssue: true, extraCount: 1 },
  },
  {
    id: 'a35',
    providerId: '9',
    ...patient('18'),
    appointmentType: typeLabel('follow-up'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(14, 30),
    endMinutes: at(15, 0),
  },

  // Marcus Webb — provider 10
  {
    id: 'a35b',
    providerId: '10',
    ...patient('1'),
    appointmentType: typeLabel('post-op'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(9, 0),
    endMinutes: at(9, 45),
    alerts: { hasChecklist: true, hasNotes: true },
  },
  {
    id: 'a35c',
    providerId: '10',
    ...patient('8'),
    appointmentType: typeLabel('initial-eval'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(13, 0),
    endMinutes: at(13, 45),
  },

  // Nina Okonkwo — provider 11
  {
    id: 'a36',
    providerId: '11',
    ...patient('47'),
    appointmentType: typeLabel('discharge'),
    facilityName: FACILITY,
    status: 'completed',
    startMinutes: at(8, 0),
    endMinutes: at(8, 30),
  },
  {
    id: 'a37',
    providerId: '11',
    ...patient('48'),
    appointmentType: typeLabel('telehealth'),
    facilityName: TELE,
    status: 'confirmed',
    startMinutes: at(9, 30),
    endMinutes: at(10, 30),
    alerts: { hasNotes: true, extraCount: 2 },
  },
  {
    id: 'a38',
    providerId: '11',
    ...patient('3'),
    appointmentType: typeLabel('post-op'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(13, 0),
    endMinutes: at(13, 30),
  },
  {
    id: 'a39',
    providerId: '11',
    ...patient('49'),
    appointmentType: typeLabel('pre-op'),
    facilityName: FACILITY,
    status: 'checkedIn',
    startMinutes: at(15, 0),
    endMinutes: at(16, 0),
    alerts: { hasChecklist: true, hasBillingIssue: true },
  },

  // Hannah Brooks — provider 12
  {
    id: 'a40',
    providerId: '12',
    ...patient('9'),
    appointmentType: typeLabel('progress-note'),
    facilityName: FACILITY,
    status: 'confirmed',
    startMinutes: at(11, 0),
    endMinutes: at(11, 30),
  },
  {
    id: 'a41',
    providerId: '12',
    ...patient('11'),
    appointmentType: typeLabel('injection'),
    facilityName: FACILITY,
    status: 'scheduled',
    startMinutes: at(14, 0),
    endMinutes: at(14, 30),
    alerts: { hasNotes: true },
  },
];

for (const appt of MOCK_CALENDAR_APPOINTMENTS) {
  if (!getAppointmentTypeByLabel(appt.appointmentType)) {
    throw new Error(`Calendar appointment ${appt.id} has unknown type "${appt.appointmentType}"`);
  }
  if (!MOCK_PATIENTS.some((p) => p.id === appt.patientId)) {
    throw new Error(`Calendar appointment ${appt.id} has unknown patient "${appt.patientId}"`);
  }
}

/** Format a minute range as "8-8:30AM" / "9-10AM". */
export function formatAppointmentTimeRange(startMinutes: number, endMinutes: number): string {
  const fmt = (mins: number, includePeriod: boolean) => {
    const h24 = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const time = m === 0 ? `${h12}` : `${h12}:${m.toString().padStart(2, '0')}`;
    return includePeriod ? `${time}${period}` : time;
  };
  const startPeriod = Math.floor(startMinutes / 60) >= 12 ? 'PM' : 'AM';
  const endPeriod = Math.floor(endMinutes / 60) >= 12 ? 'PM' : 'AM';
  const samePeriod = startPeriod === endPeriod;
  return `${fmt(startMinutes, !samePeriod)}-${fmt(endMinutes, true)}`;
}

/** Clock range for list/home displays: "7:30 AM – 8:00 AM". */
export function formatAppointmentClockRange(startMinutes: number, endMinutes: number): string {
  const fmt = (mins: number) => {
    const h24 = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };
  return `${fmt(startMinutes)} – ${fmt(endMinutes)}`;
}

export function getAppointmentsForProvider(providerId: string): CalendarAppointment[] {
  return MOCK_CALENDAR_APPOINTMENTS.filter((a) => a.providerId === providerId);
}

export function getVisitCountForProvider(providerId: string): number {
  return getAppointmentsForProvider(providerId).length;
}

/**
 * Greedy column packing for overlapping appointments within a provider column.
 */
export function layoutProviderAppointments(
  appointments: CalendarAppointment[],
): LaidOutCalendarAppointment[] {
  const sorted = [...appointments].sort(
    (a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes,
  );

  type Active = { endMinutes: number; columnIndex: number };
  const active: Active[] = [];
  const cluster: LaidOutCalendarAppointment[] = [];
  const result: LaidOutCalendarAppointment[] = [];
  let clusterMaxCols = 0;

  const flushCluster = () => {
    for (const item of cluster) {
      result.push({ ...item, columnCount: Math.max(1, clusterMaxCols) });
    }
    cluster.length = 0;
    clusterMaxCols = 0;
  };

  for (const appt of sorted) {
    for (let i = active.length - 1; i >= 0; i -= 1) {
      if (active[i].endMinutes <= appt.startMinutes) active.splice(i, 1);
    }
    if (active.length === 0 && cluster.length > 0) flushCluster();

    const used = new Set(active.map((a) => a.columnIndex));
    let columnIndex = 0;
    while (used.has(columnIndex)) columnIndex += 1;

    active.push({ endMinutes: appt.endMinutes, columnIndex });
    clusterMaxCols = Math.max(clusterMaxCols, columnIndex + 1);
    cluster.push({ ...appt, columnIndex, columnCount: 1 });
  }
  flushCluster();
  return result;
}
