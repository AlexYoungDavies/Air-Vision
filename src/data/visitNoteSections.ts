/**
 * Visit note structure: SOAP sections and subsections for TOC and content.
 */

export type SectionId = 'subjective' | 'objective' | 'assessment' | 'plan' | 'notarize';

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

const HISTORY_OF_CONDITION_DEFAULT =
  'Patient reports a 2-week history of increased low back stiffness and pain following a weekend of yard work and prolonged driving. No prior lumbar surgery. Symptoms have been relatively stable over the past week with morning stiffness that eases somewhat with movement. Patient denies radicular symptoms, numbness, or weakness in the lower extremities.';

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
      historyOfCondition: HISTORY_OF_CONDITION_DEFAULT,
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
        ['48', '45'],
        ['18', '16'],
        ['24', ''],
        ['', '22'],
      ],
      thoracic: [
        ['34', ''],
        ['', '32'],
        ['16', '15'],
        ['20', '19'],
      ],
      'general-upright': [['26'], ['9'], ['10'], ['12']],
    },
  },
  assessment: {
    'diagnosis-summary': {
      cptCodes: ['97110', '97140'],
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
    'treatment-plan': {
      content:
        'Therapeutic exercise (97110): lumbar ROM, core stabilization, and hip flexor stretching 2x/week. Manual therapy (97140): soft tissue mobilization and joint mobilization to lumbar and thoracic segments as indicated. Patient to continue home exercise program (lumbar stretches, cat-cow, supported bridge) daily. Reassess in 2 weeks for progress toward goals.',
    },
    goals: {
      goals: [
        {
          id: 'goal-1',
          title: 'Improve lumbar flexion ROM',
          type: 'short-term',
          targetDate: '2025-04-15',
          status: 'in-progress',
          description: 'Increase active lumbar flexion to within functional range (target 60°+) to reduce stiffness with sit-to-stand and forward bending.',
          initialState: 'Lumbar flexion limited to approximately 45° bilaterally with stiffness.',
          currentState: 'Lumbar flexion ~48° left, 45° right; mild improvement with warm-up.',
          previousVisitPercent: 15,
        },
        {
          id: 'goal-2',
          title: 'Reduce pain with bed mobility',
          type: 'short-term',
          targetDate: '2025-04-15',
          status: 'in-progress',
          description: 'Patient to report decreased pain (≤3/10) during morning get-up and bed mobility.',
          initialState: 'Pain 5–6/10 with sit-to-stand from bed and prolonged sitting.',
          currentState: 'Pain 5/10 with bed mobility; improved with consistent HEP.',
          previousVisitPercent: 20,
        },
        {
          id: 'goal-3',
          title: 'Independent HEP and activity modification',
          type: 'long-term',
          targetDate: '2025-05-30',
          status: 'in-progress',
          description: 'Patient to perform home exercise program independently and apply activity modification (posture, breaks) to manage symptoms during work and ADLs.',
          initialState: 'Limited awareness of aggravating postures; HEP not yet established.',
          currentState: 'Performing HEP 4–5x/week; using lumbar support when driving.',
          previousVisitPercent: 40,
        },
        {
          id: 'goal-4',
          title: 'Return to prior level of activity',
          type: 'long-term',
          targetDate: '2025-06-15',
          status: 'in-progress',
          description: 'Resume yard work, prolonged driving, and recreational activities without significant increase in symptoms.',
          initialState: 'Symptoms flared after yard work and long drive; avoiding these activities.',
          currentState: 'Able to drive 30 min with minimal discomfort; not yet ready for prolonged yard work.',
          previousVisitPercent: 25,
        },
      ],
    },
    'plan-of-care': {
      durationValue: '6',
      durationUnit: 'weeks',
      frequencyValue: '2',
      frequencyUnit: 'per-week',
      careTimelineStart: '2025-03-10',
      careTimelineEnd: '2025-04-21',
    },
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
      signStatus: 'unsigned',
    },
  },
};
