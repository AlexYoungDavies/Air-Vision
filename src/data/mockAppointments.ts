/**
 * Mock appointment data per patient. Used in the Appointments tab of the patient profile.
 */

export type AppointmentStatus =
  | 'Schedule'
  | 'Confirmed'
  | 'Checked In'
  | 'Complete'
  | 'Canceled'
  | 'No Show';

export interface Appointment {
  id: string;
  patientId: string;
  date: string; // ISO date or "Mon DDth, YYYY" display
  time: string;
  status: AppointmentStatus;
  caseName: string;
  caseId: string;
  template: string;
  clinicalStage: string;
  provider: string;
  insurance: string;
  facility: string;
  tags?: string[];
}

/** Format a Date as "Mon DDth, YYYY" */
function formatDateOrdinal(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
}

const TEMPLATES = ['Knee Sprain', 'ACL Tear', 'Annual Physical', 'Follow-up', 'Consultation', 'Lab Review', 'Hypertension Follow-up', 'Wellness Exam', 'Sports Physical', 'Migraine Management', 'Diabetes Check', 'Prenatal Care', 'Thyroid Follow-up', 'Allergy Testing', 'Cardiac Screening', 'Skin Check', 'Asthma Follow-up', 'Joint Pain', 'Sleep Study Follow-up', 'Anxiety Management'];
const PROVIDERS = ['Dr. Emily Chen', 'Dr. James Wilson', 'Dr. Maria Garcia', 'Dr. David Kim', 'Dr. Sarah Johnson', 'Dr. Robert Lee', 'Dr. Amy Foster', 'Dr. Chris Taylor'];
const SINGLE_FACILITY = 'Portland Medical Center';
const SINGLE_INSURANCE = 'Aetna';

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

/** Fixed "today" for reproducible mock data (March 11, 2025) */
const MOCK_TODAY = new Date(2025, 2, 11);

const TIMES = ['8:00 AM', '9:00 AM', '9:30 AM', '10:00 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:30 PM', '4:00 PM'];

function buildAppointmentsForPatient(patientId: string, patientIndex: number): Appointment[] {
  const appointments: Appointment[] = [];

  // Each patient has 10–14 appointments (at least 10, some more)
  const totalCount = 10 + (patientIndex % 5);
  const pastCount = 3 + (patientIndex % 2); // 3 or 4 in the past
  const futureCount = totalCount - pastCount - 1; // 1 is today, rest future

  const dates: Date[] = [];
  for (let p = 0; p < pastCount; p++) {
    const d = new Date(MOCK_TODAY);
    d.setDate(d.getDate() - (pastCount - p));
    dates.push(d);
  }
  dates.push(new Date(MOCK_TODAY));
  for (let f = 0; f < futureCount; f++) {
    const d = new Date(MOCK_TODAY);
    d.setDate(d.getDate() + (f + 1));
    dates.push(d);
  }

  dates.sort((a, b) => b.getTime() - a.getTime());

  dates.forEach((d, i) => {
    const isPast = d.getTime() < MOCK_TODAY.getTime();
    const isToday = d.getTime() === MOCK_TODAY.getTime();
    let status: AppointmentStatus;
    if (isPast) {
      // Past: only Complete, Canceled, or (rarely) No Show
      const seed = patientIndex * 100 + i;
      if (seed % 23 === 0) {
        status = 'No Show'; // very rare
      } else if (seed % 7 === 0) {
        status = 'Canceled';
      } else {
        status = 'Complete';
      }
    } else if (isToday) {
      status = 'Checked In';
    } else {
      status = 'Schedule';
    }
    // Clinical stage: Initial Evaluation = first (chronologically), Progress Note every ~5–10, rest Follow-up
    const chronoIndex = totalCount - 1 - i; // 0 = first appointment ever
    const clinicalStage =
      chronoIndex === 0
        ? 'Initial Evaluation'
        : chronoIndex % 7 === 0
          ? 'Progress Note'
          : 'Follow-up';
    appointments.push({
      id: `apt-${patientId}-${i + 1}`,
      patientId,
      date: formatDateOrdinal(d),
      time: pick(TIMES, patientIndex + i),
      status,
      caseName: `Case ${patientId}-${i + 1}`,
      caseId: `C-${1000 + parseInt(patientId, 10) * 10 + i}`,
      template: pick(TEMPLATES, patientIndex + i),
      clinicalStage,
      provider: pick(PROVIDERS, patientIndex + i),
      insurance: SINGLE_INSURANCE,
      facility: SINGLE_FACILITY,
      tags: i % 3 === 0 ? ['Urgent', 'Follow-up'].slice(0, 1 + (i % 2)) : undefined,
    });
  });

  return appointments;
}

/** All appointments keyed by patient id. */
export const MOCK_APPOINTMENTS_BY_PATIENT: Record<string, Appointment[]> = (() => {
  const map: Record<string, Appointment[]> = {};
  for (let i = 1; i <= 20; i++) {
    const id = String(i);
    map[id] = buildAppointmentsForPatient(id, i - 1);
  }
  return map;
})();

export function getAppointmentsForPatient(patientId: string): Appointment[] {
  return MOCK_APPOINTMENTS_BY_PATIENT[patientId] ?? [];
}
