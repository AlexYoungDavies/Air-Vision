/**
 * Mock data for the home "Visits" tab right panel (pre-visit summary, items to review, additional info).
 */

import type { Patient } from './mockPatients';

export interface TreatmentHistoryEntry {
  date: string;
  description: string;
  provider?: string;
}

export interface PreVisitSummaryAlert {
  severity: 'warning' | 'error';
  message: string;
}

export type ReviewAlertTone = 'info' | 'danger';

/** Tertiary action on an actionable review alert (link or button). */
export type ReviewAlertAction =
  | { id: string; label: string; href: string }
  | { id: string; label: string; onClick: () => void };

/** Single alert row under a Things to Review column (static copy vs actionable CTAs). */
export type ReviewAlertItem =
  | {
      id: string;
      kind: 'static';
      tone: ReviewAlertTone;
      title: string;
      subheading: string;
      blurb?: string;
      accentLabel?: string;
    }
  | {
      id: string;
      kind: 'actionable';
      tone: ReviewAlertTone;
      title: string;
      subheading: string;
      actions: ReviewAlertAction[];
    };

export interface ReviewDetailColumn {
  title: string;
  cards: ReviewAlertItem[];
}

export interface ProfileInfoRow {
  primary: string;
  secondary?: string;
}

export interface PatientVisitPanelData {
  /** Shown in header after DOB and sex */
  lastSeenLabel: string;
  /** e.g. "Follow up • 7:30 AM" */
  appointmentHeading: string;
  /** Short AI-style narrative for the visit */
  aiSummary: string;
  /** Bullets under Pre-visit Summary — only actionable review items */
  thingsToReviewBullets: string[];
  /** Context that may change how the provider interacts */
  highlightBullets: string[];
  /** Insurance, safety, authorization, etc. */
  summaryAlerts: PreVisitSummaryAlert[];
  /** Expanded review items aligned with the bullets above */
  reviewColumns: ReviewDetailColumn[];
  /** Additional Patient Information tab bodies */
  visitHistory: ProfileInfoRow[];
  files: ProfileInfoRow[];
  medications: ProfileInfoRow[];
  labs: ProfileInfoRow[];
  immunizations: ProfileInfoRow[];
}

const TREATMENT_HISTORY_BY_CASE: Record<string, TreatmentHistoryEntry[]> = {
  default: [
    { date: '2024-01-15', description: 'Initial evaluation', provider: 'Dr. Smith' },
    { date: '2024-02-20', description: 'Follow-up visit', provider: 'Dr. Smith' },
    { date: '2024-03-10', description: 'Lab review', provider: 'Dr. Jones' },
  ],
  'Annual physical': [
    { date: '2023-08-01', description: 'Annual physical', provider: 'Dr. Smith' },
    { date: '2024-01-10', description: 'Preventive visit', provider: 'Dr. Smith' },
  ],
  'Knee sprain': [
    { date: '2026-06-02', description: 'Follow-up — right knee MCL sprain, PT progress', provider: 'Dr. Jones' },
    { date: '2026-04-20', description: 'Post-operative visit — knee scope', provider: 'Dr. Jones' },
    { date: '2026-03-15', description: 'Initial eval — knee injury (fall)', provider: 'Dr. Jones' },
  ],
  'Hypertension follow-up': [
    { date: '2023-11-01', description: 'Hypertension diagnosis', provider: 'Dr. Smith' },
    { date: '2024-01-05', description: 'Medication adjustment', provider: 'Dr. Smith' },
  ],
  'Lab review': [
    { date: '2024-02-28', description: 'Labs ordered', provider: 'Dr. Smith' },
    { date: '2024-03-01', description: 'CMP, CBC resulted', provider: 'Dr. Smith' },
  ],
  'Post-op knee': [
    { date: '2026-04-23', description: 'Right knee surgery — post–Grade II MCL sprain', provider: 'Dr. Jones' },
    { date: '2026-03-26', description: 'Initial eval — right knee MCL injury (backyard fall)', provider: 'Dr. Jones' },
  ],
};

function treatmentHistoryFor(patient: Patient): TreatmentHistoryEntry[] {
  return TREATMENT_HISTORY_BY_CASE[patient.case] ?? TREATMENT_HISTORY_BY_CASE.default;
}

function formatHistoryDate(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const y = Number(parts[0]);
    const mo = Number(parts[1]);
    const d = Number(parts[2]);
    if (y && mo && d) {
      return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }
  return isoDate;
}

function lastSeenFromHistory(entries: TreatmentHistoryEntry[]): string {
  const first = entries[0];
  return first ? formatHistoryDate(first.date) : '—';
}

function appointmentHeading(patient: Patient): string {
  const type = patient.appointmentType ?? 'Visit';
  const time = patient.appointmentTime ?? '—';
  return `${type} • ${time}`;
}

function defaultMedicationRows(): ProfileInfoRow[] {
  return [
    { primary: 'Lisinopril', secondary: '10 mg · once daily' },
    { primary: 'Metformin', secondary: '500 mg · twice daily' },
    { primary: 'Atorvastatin', secondary: '20 mg · once daily at bedtime' },
  ];
}

function defaultImmunizationRows(): ProfileInfoRow[] {
  return [
    { primary: 'Influenza (seasonal)', secondary: 'Oct 15, 2024' },
    { primary: 'COVID-19 (updated)', secondary: 'Sep 1, 2024' },
    { primary: 'Tdap', secondary: 'Mar 12, 2022' },
  ];
}

/**
 * Michelle Chen — first slot on Today’s Patients: post-op follow-up (8:30–9:00 AM).
 */
function panelForMichelleChenPostOp(patient: Patient): PatientVisitPanelData {
  const history = treatmentHistoryFor(patient);
  return {
    lastSeenLabel: lastSeenFromHistory(history),
    appointmentHeading: 'Post-op follow-up • 8:30 AM – 9:00 AM',
    aiSummary:
      'Michelle Chen, 59F, here for a follow-up on her right knee after a Grade II MCL sprain. Occurred 6 weeks ago from a backyard fall. Surgery 2 weeks ago, has completed 2/8 week PT program. MRI imaging is available for review.',
    thingsToReviewBullets: [
      'Medication Risk: Patient taking anticoagulant',
      'New MRI imaging',
      'Workers compensation case',
    ],
    highlightBullets: [],
    summaryAlerts: [
      { severity: 'warning', message: 'Workers compensation case' },
      { severity: 'error', message: 'Patient is on anticoagulant (Warfarin) — surgery risk' },
    ],
    reviewColumns: [
      {
        title: 'Medication Risks',
        cards: [
          {
            id: 'warfarin',
            kind: 'static',
            tone: 'danger',
            title: 'Anticoagulant',
            subheading: 'Warfarin · 5 mg daily',
            accentLabel: 'SURGERY RISK',
          },
        ],
      },
      {
        title: 'Imaging & Diagnostic',
        cards: [
          {
            id: 'mri-right-knee',
            kind: 'actionable',
            tone: 'info',
            title: 'MRI — Right knee',
            subheading: 'New results available for review; correlate with post-operative course and PT progress.',
            actions: [
              { id: 'see-report', label: 'See report', onClick: () => undefined },
              { id: 'images', label: 'Images', onClick: () => undefined },
            ],
          },
        ],
      },
      {
        title: 'Medical History',
        cards: [
          {
            id: 'mcl-repair',
            kind: 'static',
            tone: 'info',
            title: 'Right MCL repair',
            subheading: 'Feb 2022',
            blurb: 'Shanghai Central Hospital',
          },
        ],
      },
    ],
    visitHistory: history.map((h) => ({
      primary: h.description,
      secondary: `${formatHistoryDate(h.date)}${h.provider ? ` · ${h.provider}` : ''}`,
    })),
    files: [{ primary: 'MRI — Right knee', secondary: 'Available for review' }],
    medications: [
      { primary: 'Warfarin', secondary: '5 mg daily · anticoagulant' },
      { primary: 'Acetaminophen', secondary: '500 mg PRN pain' },
    ],
    labs: [{ primary: 'INR', secondary: 'Due today — on Warfarin' }],
    immunizations: defaultImmunizationRows(),
  };
}

/** Rich demo aligned with knee follow-up + anticoagulant + imaging review */
function panelForKneeFollowUp(patient: Patient): PatientVisitPanelData {
  const history = treatmentHistoryFor(patient);
  return {
    lastSeenLabel: 'Jun 2, 2026',
    appointmentHeading: appointmentHeading(patient),
    aiSummary:
      'Follow-up for a right knee Grade II MCL sprain after a fall about six weeks ago; arthroscopic washout was performed two weeks ago. The patient is in week 2 of an 8-week PT plan. New MRI and X-ray are available to correlate with symptoms and post-op course.',
    thingsToReviewBullets: [
      'MRI imaging results (right knee)',
      'X-ray imaging results (right knee)',
      'Prior surgery in orthopaedic course',
      'Anticoagulant therapy and perioperative risk',
    ],
    highlightBullets: [
      'Primary language: English',
      'Prior surgery: Appendectomy — Feb 14, 1982 (Shanghai Central Hospital)',
    ],
    summaryAlerts: [
      { severity: 'warning', message: 'Workers compensation case' },
      { severity: 'error', message: 'Patient is on anticoagulant (Warfarin) — surgery risk' },
    ],
    reviewColumns: [
      {
        title: 'Medications',
        cards: [
          {
            id: 'warfarin',
            kind: 'static',
            tone: 'danger',
            title: 'Medication risk',
            subheading: 'Warfarin · Anticoagulant · 5 mg · daily',
            accentLabel: 'SURGERY RISK',
          },
        ],
      },
      {
        title: 'Imaging',
        cards: [
          {
            id: 'mri',
            kind: 'actionable',
            tone: 'info',
            title: 'MRI — Right knee',
            subheading: 'Partial MCL tear; menisci intact on report.',
            actions: [
              { id: 'mri-preview', label: 'Preview report', onClick: () => undefined },
              { id: 'mri-open', label: 'Open study', href: `/patients/${patient.id}` },
            ],
          },
          {
            id: 'xr',
            kind: 'actionable',
            tone: 'info',
            title: 'X-ray — Right knee',
            subheading: 'Alignment preserved; no acute fracture.',
            actions: [
              { id: 'xr-preview', label: 'Preview report', onClick: () => undefined },
              { id: 'xr-open', label: 'Open study', href: `/patients/${patient.id}` },
            ],
          },
        ],
      },
      {
        title: 'Previous surgery(s)',
        cards: [
          {
            id: 'scope',
            kind: 'static',
            tone: 'info',
            title: 'Knee arthroscopy / washout',
            subheading: 'Apr 20, 2026',
            blurb: 'Regional Medical Center',
          },
          {
            id: 'appy',
            kind: 'static',
            tone: 'info',
            title: 'Appendectomy',
            subheading: 'Feb 14, 1982',
            blurb: 'Shanghai Central Hospital',
          },
        ],
      },
    ],
    visitHistory: history.map((h) => ({
      primary: h.description,
      secondary: `${formatHistoryDate(h.date)}${h.provider ? ` · ${h.provider}` : ''}`,
    })),
    files: [
      { primary: 'MRI — Right knee', secondary: 'Received Mar 8, 2026' },
      { primary: 'X-ray — Right knee', secondary: 'Received Mar 8, 2026' },
      { primary: 'PT flow sheet', secondary: 'Updated Mar 5, 2026' },
    ],
    medications: [
      { primary: 'Warfarin', secondary: '5 mg daily · anticoagulant' },
      { primary: 'Acetaminophen', secondary: '500 mg PRN pain' },
    ],
    labs: [{ primary: 'INR', secondary: 'Due today — on Warfarin' }],
    immunizations: defaultImmunizationRows(),
  };
}

function buildReviewColumnsFromFlags(
  patient: Patient,
  extras: ReviewDetailColumn[],
): ReviewDetailColumn[] {
  const cols: ReviewDetailColumn[] = [...extras];
  const imagingCards: ReviewAlertItem[] = [];
  if (patient.hasNewImaging) {
    imagingCards.push({
      id: 'new-imaging',
      kind: 'actionable',
      tone: 'info',
      title: 'New imaging to review',
      subheading: 'Results available since last visit; open study in chart.',
      actions: [{ id: 'open-imaging', label: 'Open chart', href: `/patients/${patient.id}` }],
    });
  }
  const labCards: ReviewAlertItem[] = [];
  if (patient.hasNewLabs) {
    labCards.push({
      id: 'new-labs',
      kind: 'actionable',
      tone: 'info',
      title: 'New labs to review',
      subheading: 'CBC / CMP resulted; trend vs prior if applicable.',
      actions: [{ id: 'open-labs', label: 'Open labs', href: `/patients/${patient.id}` }],
    });
  }
  if (imagingCards.length) cols.push({ title: 'Imaging', cards: imagingCards });
  if (labCards.length) cols.push({ title: 'Labs', cards: labCards });
  return cols;
}

/** Default / generated panel when we do not use the full knee demo */
function panelForGenericPatient(patient: Patient): PatientVisitPanelData {
  const history = treatmentHistoryFor(patient);
  const lastVisit = history[0];
  const reason = patient.reasonForVisit ?? patient.case ?? 'Visit';

  const thingsToReviewBullets: string[] = [];
  if (patient.hasNewImaging) thingsToReviewBullets.push('New imaging results since last visit');
  if (patient.hasNewLabs) thingsToReviewBullets.push('New laboratory results to reconcile');
  if (patient.appointmentType === 'Initial Eval') {
    thingsToReviewBullets.push('New patient intake — confirm visit type and benefits');
  }

  const highlightBullets: string[] = [];
  if (patient.language && patient.language !== 'English') {
    highlightBullets.push(`Primary language: ${patient.language} — use qualified interpreter if needed`);
  }

  const summaryAlerts: PreVisitSummaryAlert[] = [];
  if (patient.appointmentType === 'Initial Eval') {
    summaryAlerts.push({
      severity: 'warning',
      message: 'Prior authorization may be required for new patient visit',
    });
  }

  const lastVisitLine = lastVisit
    ? `Last visit ${lastVisit.date}: ${lastVisit.description}.`
    : 'No recent visit on file.';
  const reviewLine =
    thingsToReviewBullets.length > 0
      ? ` Today, prioritize ${thingsToReviewBullets[0].toLowerCase().replace(/\.$/, '')}${thingsToReviewBullets.length > 1 ? ', and related items noted below.' : '.'}`
      : ' No new diagnostics flagged for mandatory pre-review.';

  const aiSummary = `${reason} on the schedule. ${lastVisitLine}${reviewLine}`;

  const reviewColumns = buildReviewColumnsFromFlags(patient, []);

  const visitHistory: ProfileInfoRow[] = history.map((h) => ({
    primary: h.description,
    secondary: `${formatHistoryDate(h.date)}${h.provider ? ` · ${h.provider}` : ''}`,
  }));

  const files: ProfileInfoRow[] = [];
  if (patient.hasNewImaging) files.push({ primary: 'Diagnostic imaging', secondary: 'New since last visit' });
  if (patient.hasNewLabs) files.push({ primary: 'Lab report PDF', secondary: 'New since last visit' });
  if (files.length === 0) files.push({ primary: 'No new documents', secondary: 'See chart for full file list' });

  const labs: ProfileInfoRow[] = [];
  if (patient.hasNewLabs) {
    labs.push({ primary: 'CBC, CMP', secondary: 'Recent · compare to baseline' });
  } else {
    labs.push({ primary: 'No new labs flagged', secondary: 'Open Labs tab in profile for history' });
  }

  return {
    lastSeenLabel: lastSeenFromHistory(history),
    appointmentHeading: appointmentHeading(patient),
    aiSummary,
    thingsToReviewBullets,
    highlightBullets,
    summaryAlerts,
    reviewColumns,
    visitHistory,
    files,
    medications: defaultMedicationRows(),
    labs,
    immunizations: defaultImmunizationRows(),
  };
}

/** Build panel data for a patient (home page Visits → selected visit). */
export function getPatientVisitPanelData(patient: Patient): PatientVisitPanelData {
  if (patient.id === '1') {
    return panelForMichelleChenPostOp(patient);
  }
  if (patient.id === '2') {
    return panelForKneeFollowUp(patient);
  }
  return panelForGenericPatient(patient);
}
