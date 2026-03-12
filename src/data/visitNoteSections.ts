/**
 * Visit note structure: SOAP + Other sections and subsections for TOC and content.
 */

export type SectionId = 'subjective' | 'objective' | 'assessment' | 'plan' | 'other' | 'notarize';

export interface SubsectionDef {
  id: string;
  label: string;
  /** Anchor id for scroll / nav */
  anchorId: string;
}

export interface SectionDef {
  id: SectionId;
  label: string;
  anchorId: string;
  subsections: SubsectionDef[];
}

export const VISIT_NOTE_SECTIONS: SectionDef[] = [
  {
    id: 'subjective',
    label: 'Subjective',
    anchorId: 'section-subjective',
    subsections: [
      { id: 'chief-complaint', label: 'Chief Complaint', anchorId: 'subsection-chief-complaint' },
      { id: 'history-of-present-illness', label: 'History of Present Illness', anchorId: 'subsection-history-of-present-illness' },
      { id: 'exacerbating-factors', label: 'Exacerbating Factors', anchorId: 'subsection-exacerbating-factors' },
    ],
  },
  {
    id: 'objective',
    label: 'Objective',
    anchorId: 'section-objective',
    subsections: [
      { id: 'objective-comments', label: 'Objective Comments', anchorId: 'subsection-objective-comments' },
      { id: 'measurements', label: 'Measurements', anchorId: 'subsection-measurements' },
    ],
  },
  {
    id: 'assessment',
    label: 'Assessment',
    anchorId: 'section-assessment',
    subsections: [
      { id: 'diagnosis-summary', label: 'Diagnosis Summary', anchorId: 'subsection-diagnosis-summary' },
      { id: 'continued-care', label: 'Continued Care', anchorId: 'subsection-continued-care' },
      { id: 'additional-notes', label: 'Additional Notes', anchorId: 'subsection-additional-notes' },
    ],
  },
  {
    id: 'plan',
    label: 'Plan',
    anchorId: 'section-plan',
    subsections: [
      { id: 'treatment-plan', label: 'Treatment Plan', anchorId: 'subsection-treatment-plan' },
      { id: 'goals', label: 'Goals', anchorId: 'subsection-goals' },
      { id: 'plan-of-care', label: 'Plan of Care', anchorId: 'subsection-plan-of-care' },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    anchorId: 'section-other',
    subsections: [
      { id: 'visits', label: 'Visits', anchorId: 'subsection-visits' },
      { id: 'billing', label: 'Billing', anchorId: 'subsection-billing' },
      { id: 'fax', label: 'Fax', anchorId: 'subsection-fax' },
    ],
  },
  {
    id: 'notarize',
    label: 'Notarize',
    anchorId: 'section-notarize',
    subsections: [
      { id: 'notarize', label: 'Notarize', anchorId: 'subsection-notarize' },
    ],
  },
];

/** Shape of visit note content (section -> subsection -> field values). Expand as needed. */
export interface VisitNoteData {
  subjective: {
    'chief-complaint': {
      content: string;
      detailedExplanation: string;
      dateOfOnset: string;
      painRating: string | null;
    };
    'history-of-present-illness': {
      dateOfOnset: string;
      dateOfSurgery: string;
      stateOfCondition: string | null;
      sideOfIssue: string | null;
      historyOfCondition: string;
    };
    'exacerbating-factors': {
      exacerbatingFactors: string;
      alleviatingFactors: string;
    };
  };
  objective: {
    'objective-comments': {
      comments: string;
    };
    measurements: {
      'lumbar-mobility': (string | undefined)[][];
      thoracic: (string | undefined)[][];
      'general-upright': (string | undefined)[][];
    };
  };
  assessment: {
    'diagnosis-summary': {
      cptCodes: string[];
      summary: string;
    };
    'continued-care': {
      content: string;
    };
    'additional-notes': {
      content: string;
    };
  };
  plan: {
    'treatment-plan': {
      content: string;
    };
    goals: {
      goals: Array<{
        id: string;
        title: string;
        type: 'short-term' | 'long-term';
        targetDate: string;
        status: 'not-started' | 'in-progress' | 'completed';
        description: string;
        initialState: string;
        currentState: string;
        previousVisitPercent: number;
      }>;
    };
    'plan-of-care': {
      durationValue: string;
      durationUnit: 'days' | 'weeks' | 'months';
      frequencyValue: string;
      frequencyUnit: 'per-week' | 'per-month' | 'per-year';
      careTimelineStart: string;
      careTimelineEnd: string;
    };
  };
  other: {
    visits: Record<string, string>;
    billing: Record<string, string>;
    fax: Record<string, string>;
  };
  notarize: {
    notarize: {
      selectedProviderIds: string[];
      overrideCredentialingValidation: boolean;
      referringProviderName: string;
      referringProviderFax: string;
      faxNoteToReferringProvider: boolean;
      faxDocumentType: string;
      requestSignatureFromReferring: boolean;
      includeFacesheet: boolean;
      signStatus: 'signed' | 'unsigned';
    };
  };
}

const CHIEF_COMPLAINT_DEFAULT =
  'Low back stiffness and pain, worse than typical, with associated pain during bed mobility and sit-to-stand movements.\n\n' +
  'Lower back pain and stillness, worse than typical pain in the day to day. Specifically calling out when mobile actions to and from the bed, i.e. sit to stand and vice versa to get up and go to bed.';

const CHIEF_COMPLAINT_DETAILED_DEFAULT =
  'Patient reports significant discomfort when getting up from bed each morning. The back feels stiff and painful during the transition from lying to sitting and then to standing. This morning stiffness persists throughout the day, though it may ease slightly with light movement. The constant stiffness and pain make daily activities more difficult and leave the patient feeling more tired by the end of the day.';

const EXACERBATING_FACTORS_DEFAULT =
  'Prolonged sitting, bending forward, lifting heavy objects, and long car rides. Symptoms also worsen with inactivity and first thing in the morning.';

const ALLEVIATING_FACTORS_DEFAULT =
  'Short walks, heat application, changing position frequently, and avoiding prolonged sitting. Rest in a supported reclined position provides some relief.';

const OBJECTIVE_COMMENTS_DEFAULT =
  'Patient performs only okay on lumbar measurements and has shown little improvement from previous visits.';

/** Sample CPT codes for visit note diagnosis selection. */
export const CPT_CODE_OPTIONS: { value: string; label: string }[] = [
  { value: '97110', label: '97110 – Therapeutic exercise' },
  { value: '97112', label: '97112 – Neuromuscular re-education' },
  { value: '97140', label: '97140 – Manual therapy' },
  { value: '97116', label: '97116 – Gait training' },
  { value: '97530', label: '97530 – Therapeutic activities' },
  { value: '97161', label: '97161 – PT evaluation low complexity' },
  { value: '97162', label: '97162 – PT evaluation moderate complexity' },
  { value: '97163', label: '97163 – PT evaluation high complexity' },
  { value: '97165', label: '97165 – OT evaluation low complexity' },
  { value: '97167', label: '97167 – OT evaluation moderate complexity' },
];

const DIAGNOSIS_SUMMARY_DEFAULT =
  'Low back pain with lumbar stiffness and limited mobility. Patient would benefit from continued therapeutic exercise and manual therapy to improve range of motion and function.';

const CONTINUED_CARE_DEFAULT =
  'Care should be continued to address ongoing lumbar stiffness and pain, maintain gains in mobility, and support the patient\'s ability to perform daily activities and bed mobility with less discomfort.';

const ADDITIONAL_NOTES_DEFAULT =
  'Patient is engaged in treatment and has been compliant with home exercise recommendations. Progress is gradual; will continue to monitor response to manual therapy and therapeutic exercise.';

export const DEFAULT_VISIT_NOTE_DATA: VisitNoteData = {
  subjective: {
    'chief-complaint': {
      content: CHIEF_COMPLAINT_DEFAULT,
      detailedExplanation: CHIEF_COMPLAINT_DETAILED_DEFAULT,
      dateOfOnset: '2025-03-04',
      painRating: '5',
    },
    'history-of-present-illness': {
      dateOfOnset: '2025-03-04',
      dateOfSurgery: '',
      stateOfCondition: 'maintaining',
      sideOfIssue: 'bilateral',
      historyOfCondition: '',
    },
    'exacerbating-factors': {
      exacerbatingFactors: EXACERBATING_FACTORS_DEFAULT,
      alleviatingFactors: ALLEVIATING_FACTORS_DEFAULT,
    },
  },
  objective: {
    'objective-comments': {
      comments: OBJECTIVE_COMMENTS_DEFAULT,
    },
    measurements: {
      'lumbar-mobility': [
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ],
      thoracic: [
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
        [undefined, undefined],
      ],
      'general-upright': [[undefined], [undefined], [undefined], [undefined]],
    },
  },
  assessment: {
    'diagnosis-summary': {
      cptCodes: [],
      summary: DIAGNOSIS_SUMMARY_DEFAULT,
    },
    'continued-care': {
      content: CONTINUED_CARE_DEFAULT,
    },
    'additional-notes': {
      content: ADDITIONAL_NOTES_DEFAULT,
    },
  },
  plan: {
    'treatment-plan': { content: '' },
    goals: {
      goals: [
        { id: 'goal-1', title: '', type: 'long-term', targetDate: '', status: 'in-progress', description: '', initialState: '', currentState: '', previousVisitPercent: 0 },
        { id: 'goal-2', title: '', type: 'long-term', targetDate: '', status: 'in-progress', description: '', initialState: '', currentState: '', previousVisitPercent: 0 },
        { id: 'goal-3', title: '', type: 'long-term', targetDate: '', status: 'in-progress', description: '', initialState: '', currentState: '', previousVisitPercent: 0 },
        { id: 'goal-4', title: '', type: 'long-term', targetDate: '', status: 'in-progress', description: '', initialState: '', currentState: '', previousVisitPercent: 0 },
      ],
    },
    'plan-of-care': {
      durationValue: '',
      durationUnit: 'weeks',
      frequencyValue: '',
      frequencyUnit: 'per-week',
      careTimelineStart: '',
      careTimelineEnd: '',
    },
  },
  other: {
    visits: {},
    billing: {},
    fax: {},
  },
  notarize: {
    notarize: {
      selectedProviderIds: ['provider-1'],
      overrideCredentialingValidation: false,
      referringProviderName: 'Lauren Chambers',
      referringProviderFax: '+1 (585) 784-7981',
      faxNoteToReferringProvider: true,
      faxDocumentType: 'Plan of Care PDF',
      requestSignatureFromReferring: false,
      includeFacesheet: false,
      signStatus: 'signed',
    },
  },
};
