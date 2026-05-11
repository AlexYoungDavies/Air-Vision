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

/** One ordered item shown in the mid-visit "This visit so far…" card. */
export interface MockScribeMidVisitOrder {
  /** Primary text — order name (e.g. "Radiologic examination, knee; 3 views"). */
  name: string;
  /** Secondary text — provider / fulfillment vendor. */
  provider: string;
}

/**
 * Snapshot of the visit that the scribe has captured so far. Shown when the
 * provider pauses the recording so they can verify what the AI heard before
 * resuming.
 */
export interface MockScribeMidVisitSummary {
  /** Short bulleted observations the scribe has captured from the visit. */
  bullets: string[];
  /** Orders the scribe has staged during the visit. */
  orders: MockScribeMidVisitOrder[];
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

/**
 * Visual status used by the provider home "Visits" list (today's patients).
 * Derived in real time from the patient's `appointmentTime` range vs. the
 * current wall clock so the UI updates as the day progresses:
 *  - `completed` → the visit's end time has already passed (dim in the list).
 *  - `active`    → the visit is currently in progress (start ≤ now < end).
 *  - `upcoming`  → the visit hasn't started yet, or the time can't be parsed.
 *
 * Pass `now` from a clock-tick state in the component so React re-renders
 * the list when status transitions across appointment boundaries.
 */
export type HomeVisitAppointmentStatus = 'completed' | 'active' | 'upcoming';

function parseAppointmentTimeToMinutes(token: string): number | null {
  const match = token.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const ap = match[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function parseAppointmentRangeMinutes(
  appointmentTime: string,
): { start: number; end: number } | null {
  const parts = appointmentTime.split(/\s*[–-]\s*/);
  if (parts.length < 2) return null;
  const start = parseAppointmentTimeToMinutes(parts[0]);
  const end = parseAppointmentTimeToMinutes(parts[1]);
  if (start === null || end === null) return null;
  return { start, end };
}

export function getHomeVisitAppointmentStatus(
  appointmentTime: string | undefined,
  now: Date = new Date(),
): HomeVisitAppointmentStatus {
  if (!appointmentTime) return 'upcoming';
  const range = parseAppointmentRangeMinutes(appointmentTime);
  if (!range) return 'upcoming';
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes >= range.end) return 'completed';
  if (nowMinutes >= range.start) return 'active';
  return 'upcoming';
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

/**
 * Default mid-visit "This visit so far…" card content. Tuned for a post-op
 * knee follow-up so the orders sub-section has a believable radiology line.
 */
const DEFAULT_MID_VISIT_SUMMARY: MockScribeMidVisitSummary = {
  bullets: [
    'Recovery going well overall — mild tenderness at medial joint line, not limiting daily activity',
    'Denies locking, giving way, or new swelling; pain 1–2/10 at rest',
    '2/8 weeks into PT program, attending as scheduled and doing home exercises',
    'Surgical site clean on visual inspection; ambulating with mild antalgic gait',
    'Informed patient of routine post-op X-ray order; verbalized understanding — escort to imaging before provider',
  ],
  orders: [
    {
      name: 'Radiologic examination, knee; 3 views',
      provider: 'X-rays Delight LLC.',
    },
  ],
};

const PATIENT_MID_VISIT_OVERRIDES: Record<string, MockScribeMidVisitSummary> = {};

export function getMidVisitSummaryForVisit(visit: MockScribeVisit): MockScribeMidVisitSummary {
  return PATIENT_MID_VISIT_OVERRIDES[visit.patientId] ?? DEFAULT_MID_VISIT_SUMMARY;
}
