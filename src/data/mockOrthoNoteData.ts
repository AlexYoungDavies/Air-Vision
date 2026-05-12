/**
 * Orthopedic visit note data for the 6 specified demo patients.
 * These patients get ortho-oriented SOAP content plus Orders and Services sections.
 */

import type { VisitNoteData } from './visitNoteSections';

/** Patient IDs that should render the orthopedic note template. */
export const ORTHO_PATIENT_IDS = new Set(['1', '2', '3', '4', '5', '7']);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OrthoOrder {
  id: string;
  name: string;
  iconType: 'radiology' | 'procedure' | 'dme';
  createdAt: string;
  recipientName: string;
}

export interface OrthoServiceRow {
  id: string;
  cptCode: string;
  modifier: string;
  description: string;
  icdCodes: string[];
  units: string;
}

export interface OrthoServiceCategory {
  id: string;
  label: string;
  rows: OrthoServiceRow[];
}

export interface OrthoNoteExtras {
  diagnosisCodes: Array<{ code: string; label: string }>;
  orders: OrthoOrder[];
  services: OrthoServiceCategory[];
}

// ─── Default content (same for all 6 ortho demo patients) ────────────────────

const ORTHO_SUBJECTIVE =
  'Right knee pain, ongoing for approximately 18 months, progressively worsening.';

const ORTHO_HPI =
  '64-year-old patient presents for evaluation of chronic right knee pain. Pain is described as a deep, aching discomfort localized to the medial joint line, rated 6/10 at rest and 8/10 with weight-bearing activity. Symptoms are worse in the morning with stiffness lasting approximately 20–30 minutes, and again at the end of the day after prolonged standing. Patient reports intermittent mechanical symptoms including crepitus, occasional catching, and a sensation of instability when descending stairs. Pain is exacerbated by walking more than two blocks, climbing stairs, and squatting; partially relieved by rest, ice, and over-the-counter NSAIDs.\n\n' +
  'Patient has trialed conservative management over the past 12 months including acetaminophen, ibuprofen 600 mg TID, a 6-week course of physical therapy focused on quadriceps strengthening, and activity modification, with inadequate symptom relief. Denies recent trauma, fevers, chills, erythema, or night sweats. Reports difficulty with activities of daily living including yard work, grocery shopping, and recreational walking.';

const ORTHO_EXACERBATING =
  'Walking more than two blocks, climbing stairs, squatting, prolonged weight-bearing, and end-of-day activity after extended standing.';

const ORTHO_ALLEVIATING =
  'Rest, application of ice, elevation, and over-the-counter NSAIDs (ibuprofen 600 mg). Symptoms partially relieved with activity modification.';

const ORTHO_OBJECTIVE =
  'Vitals: BP 132/78, HR 74, T 98.4°F, BMI 29.\n' +
  'General: Alert, well-appearing, in no acute distress.\n' +
  'Right Knee Examination:\n' +
  '• Inspection: Mild varus alignment, no erythema, no obvious effusion, well-healed arthroscopic portal scars.\n' +
  '• Palpation: Tenderness along the medial joint line; no warmth.\n' +
  '• Range of motion: Active flexion 0–115° (limited by pain); passive flexion to 120° with crepitus.\n' +
  '• Strength: Quadriceps 4/5, hamstrings 5/5.\n' +
  '• Special tests: Negative Lachman, negative anterior/posterior drawer, negative McMurray, mild medial joint line tenderness with compression.\n' +
  '• Stability: Ligamentously stable to varus/valgus stress at 0° and 30°.\n' +
  '• Gait: Antalgic gait favoring the right lower extremity.';

const ORTHO_ASSESSMENT =
  'The patient presents with chronic knee pain and functional limitation consistent with primary osteoarthritis of the right knee. Clinical examination and prior history suggest degenerative joint disease with mechanical symptoms impacting daily activities. Diagnostic knee radiographs have been ordered to evaluate the degree of joint space narrowing and degenerative changes.';

const ORTHO_PLAN =
  'An intra-articular viscosupplement injection using hylan G-F 20 (Synvisc) 16 mg was ordered for symptomatic management of right knee osteoarthritis following inadequate response to conservative therapy. The injection is intended to improve joint lubrication, reduce pain, and enhance functional mobility.\n\n' +
  'A prefabricated knee brace was ordered to provide joint stabilization and support during ambulation and daily activities. The orthosis is intended to reduce mechanical stress on the right knee joint, improve stability, and assist with pain management in the setting of degenerative joint disease.';

const ORTHO_CONTINUED_CARE =
  'Patient will follow up for repeat viscosupplement injection as indicated and ongoing management of right knee osteoarthritis. Radiographic results will be reviewed at next visit to determine degree of joint space narrowing and guide further treatment planning.';

const ORTHO_ADDITIONAL_NOTES =
  'Patient tolerated today\'s visit well. Weight loss counseling provided. Instructed to use prescribed knee orthosis during weight-bearing activity and to follow up if symptoms acutely worsen prior to scheduled return.';

/**
 * Empty ortho-specific extras used before the Scribe has populated the chart.
 * Keeps the four Services categories so the table header structure renders
 * even when no rows are present.
 */
export const EMPTY_ORTHO_NOTE_EXTRAS: OrthoNoteExtras = {
  diagnosisCodes: [],
  orders: [],
  services: [
    { id: 'cat-evaluations', label: 'Evaluations', rows: [] },
    { id: 'cat-procedures', label: 'Procedures', rows: [] },
    { id: 'cat-radiology', label: 'Radiology & Imaging', rows: [] },
    { id: 'cat-dme', label: 'DME', rows: [] },
  ],
};

export const DEFAULT_ORTHO_NOTE_EXTRAS: OrthoNoteExtras = {
  diagnosisCodes: [
    { code: 'M17.11', label: 'Unilateral Primary osteoarthritis, right knee' },
  ],
  orders: [
    {
      id: 'order-1',
      name: 'Radiologic examination, knee; 3 views',
      iconType: 'radiology',
      createdAt: '01-20-2026 4:04 PM',
      recipientName: 'Recipient Name',
    },
    {
      id: 'order-2',
      name: 'Arthrocentesis, aspiration and/or injection; major joint (knee)',
      iconType: 'procedure',
      createdAt: '01-20-2026 4:04 PM',
      recipientName: 'Recipient Name',
    },
    {
      id: 'order-3',
      name: 'Knee orthosis, elastic with joints, prefabricated',
      iconType: 'dme',
      createdAt: '01-20-2026 4:04 PM',
      recipientName: 'Recipient Name',
    },
  ],
  services: [
    {
      id: 'cat-evaluations',
      label: 'Evaluations',
      rows: [
        {
          id: 'svc-1',
          cptCode: '99214',
          modifier: 'Mod',
          description: 'Office/outpatient E/M establish patient',
          icdCodes: ['M17.0', 'M18.0'],
          units: '',
        },
      ],
    },
    {
      id: 'cat-procedures',
      label: 'Procedures',
      rows: [
        {
          id: 'svc-2',
          cptCode: '20610',
          modifier: 'Mod',
          description: 'Arthrocentesis, aspiration and/or injection; major joint (knee)',
          icdCodes: ['M17.0'],
          units: '',
        },
        {
          id: 'svc-3',
          cptCode: 'J7325',
          modifier: 'Mod',
          description: 'Hylan G-F 20 (Synvisc), per 1 mg',
          icdCodes: ['M17.0'],
          units: '',
        },
      ],
    },
    {
      id: 'cat-radiology',
      label: 'Radiology & Imaging',
      rows: [
        {
          id: 'svc-4',
          cptCode: '73562',
          modifier: 'Mod',
          description: 'Radiologic examination, knee; 3 views',
          icdCodes: ['M17.0'],
          units: '',
        },
      ],
    },
    {
      id: 'cat-dme',
      label: 'DME',
      rows: [
        {
          id: 'svc-5',
          cptCode: 'L1810',
          modifier: 'RT',
          description: 'Knee orthosis, elastic with joints, prefabricated',
          icdCodes: ['M17.0'],
          units: '',
        },
      ],
    },
  ],
};

export const DEFAULT_ORTHO_VISIT_NOTE_DATA: VisitNoteData = {
  subjective: {
    'chief-complaint': {
      content: ORTHO_SUBJECTIVE,
      detailedExplanation: '',
      dateOfOnset: '2024-07-15',
      painRating: '6',
    },
    'history-of-present-illness': {
      dateOfOnset: '2024-07-15',
      dateOfSurgery: '',
      stateOfCondition: 'worsening',
      sideOfIssue: 'right',
      historyOfCondition: ORTHO_HPI,
    },
    'exacerbating-factors': {
      exacerbatingFactors: ORTHO_EXACERBATING,
      alleviatingFactors: ORTHO_ALLEVIATING,
    },
  },
  objective: {
    'objective-comments': {
      comments: ORTHO_OBJECTIVE,
    },
    measurements: {
      // Repurposed for ortho: "Inspection" table (1 column)
      'lumbar-mobility': [
        ['Mild varus'],
        ['None'],
        ['None obvious'],
        ['Well-healed arthroscopic portal scars'],
      ],
      // Repurposed for ortho: "General" stability table (2 columns)
      thoracic: [
        ['--', 'Stable'],
        ['--', 'Stable'],
        ['--', 'Stable'],
        ['--', 'Stable'],
      ],
      'general-upright': [],
    },
  },
  assessment: {
    'diagnosis-summary': {
      cptCodes: [],
      summary: ORTHO_ASSESSMENT,
    },
    'continued-care': { content: ORTHO_CONTINUED_CARE },
    'additional-notes': { content: ORTHO_ADDITIONAL_NOTES },
  },
  plan: {
    'treatment-plan': { content: ORTHO_PLAN },
    goals: { goals: [] },
    'plan-of-care': {
      durationValue: '',
      durationUnit: 'weeks',
      frequencyValue: '',
      frequencyUnit: 'per-week',
      careTimelineStart: '',
      careTimelineEnd: '',
    },
  },
  notarize: {
    notarize: {
      selectedProviderIds: ['provider-1'],
      overrideCredentialingValidation: false,
      referringProviderName: '',
      referringProviderFax: '',
      faxNoteToReferringProvider: false,
      faxDocumentType: '',
      requestSignatureFromReferring: false,
      includeFacesheet: false,
      signStatus: 'unsigned',
    },
  },
};
