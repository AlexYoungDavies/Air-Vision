import type { AccentKey } from '../theme/accents';
import { ACCENT_KEYS } from '../theme/accents';
import { MOCK_PATIENTS, TODAYS_PATIENTS } from './mockPatients';
import { getPatientVisitPanelData } from './mockPatientVisitPanel';

export type ScribeVisitGroup = 'upcoming' | 'action' | 'completed';

/** Optional right-side status for upcoming / action-pending rows. */
export type ScribeVisitRowStatus = 'starting' | 'paused' | 'review';

export interface MockScribeVisit {
  id: string;
  /** Matches `Patient.id` — same roster as the home page “today” list. */
  patientId: string;
  patientName: string;
  visitType: string;
  time: string;
  stripeAccent: AccentKey;
  group: ScribeVisitGroup;
  rowStatus?: ScribeVisitRowStatus;
}

/** Last visit SOAP shown inside the Pre-visit Summary card. */
export interface MockScribeLastVisitSummary {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface MockScribePreVisitSummary {
  /** Headline narrative paragraph. */
  body: string;
  lastVisit: MockScribeLastVisitSummary;
}

function formatAppointmentStart(appointmentTime: string): string {
  return appointmentTime.split(/\s*[–-]\s*/)[0].trim();
}

/**
 * Builds Scribe panel rows from the same ordered list as the home page “Visits” tab (`TODAYS_PATIENTS`).
 * Grouping is synthetic (demo): first two → completed, next two → action pending, remainder → upcoming.
 */
export function getTodaysScribeVisits(): MockScribeVisit[] {
  return TODAYS_PATIENTS.map((patient, index) => {
    const stripeAccent: AccentKey = ACCENT_KEYS[index % ACCENT_KEYS.length];
    let group: ScribeVisitGroup;
    let rowStatus: ScribeVisitRowStatus | undefined;
    if (index < 2) {
      group = 'completed';
    } else if (index < 4) {
      group = 'action';
      rowStatus = index === 2 ? 'paused' : 'review';
    } else {
      group = 'upcoming';
      if (index === 4) rowStatus = 'starting';
    }

    const visitType = patient.appointmentType ?? patient.reasonForVisit ?? 'Visit';
    const time = formatAppointmentStart(patient.appointmentTime ?? '9:00 AM');

    return {
      id: `scribe-visit-${patient.id}`,
      patientId: patient.id,
      patientName: patient.fullName,
      visitType,
      time,
      stripeAccent,
      group,
      rowStatus,
    };
  });
}

/** Cached list — keep reference stable for consumers that depend on identity. */
export const TODAYS_SCRIBE_VISITS: MockScribeVisit[] = getTodaysScribeVisits();

export function getScribeVisitForPatientId(patientId: string): MockScribeVisit | undefined {
  return TODAYS_SCRIBE_VISITS.find((v) => v.patientId === patientId);
}

/** @deprecated Use `TODAYS_SCRIBE_VISITS` — kept for any external imports. */
export const MOCK_SCRIBE_VISITS = TODAYS_SCRIBE_VISITS;

/**
 * Default last-visit SOAP shown in the pre-visit summary when a patient-specific
 * one isn't configured. Tone matches a recent post-op / rehab follow-up.
 */
const DEFAULT_LAST_VISIT_SUMMARY: MockScribeLastVisitSummary = {
  subjective: 'Pain and function significantly improved.',
  objective: 'Ambulating independently x 1 week, incision healing well without complications.',
  assessment: 'Patient progress is ahead of schedule for plan of care.',
  plan: 'Physiotherapy → Added 3 new exercises due to early completion of previous exercise collection. Medication → D/C prescription meds, acetaminophen PRN, Ibuprofen, No NSAIDs',
};

const PATIENT_LAST_VISIT_OVERRIDES: Record<string, MockScribeLastVisitSummary> = {};

export function getPreVisitSummaryForVisit(visit: MockScribeVisit): MockScribePreVisitSummary {
  const patient = MOCK_PATIENTS.find((p) => p.id === visit.patientId);
  const lastVisit = PATIENT_LAST_VISIT_OVERRIDES[visit.patientId] ?? DEFAULT_LAST_VISIT_SUMMARY;
  if (!patient) {
    return {
      body: `${visit.patientName} — ${visit.visitType}.`,
      lastVisit,
    };
  }
  // Source of truth = the home page Pre-visit AI Summary, so the two screens stay in sync.
  return {
    body: getPatientVisitPanelData(patient).aiSummary,
    lastVisit,
  };
}
