/**
 * Mock data for the patient visit right panel (per-patient summary, needs attention, clinical context).
 */

import type { Patient } from './mockPatients';

export interface TreatmentHistoryEntry {
  date: string;
  description: string;
  provider?: string;
}

export interface NewItemToReview {
  type: 'Lab' | 'Imaging' | 'Other';
  name: string;
  date?: string;
}

export interface PatientComm {
  type: 'Message' | 'Call' | 'Portal';
  summary: string;
  date: string;
}

export interface RelevantAlert {
  type: 'Authorization' | 'Visit type' | 'Other';
  message: string;
}

export interface MedicationEntry {
  name: string;
  dose: string;
  frequency: string;
  status: string;
}

export interface AllergyEntry {
  allergen: string;
  reaction: string;
  severity: string;
}

export interface ImmunizationEntry {
  vaccine: string;
  date: string;
  dose?: string;
}

export interface PatientVisitPanelData {
  /** Patient Summary */
  demographics: { label: string; value: string }[];
  reasonForVisit: string;
  treatmentHistory: TreatmentHistoryEntry[];
  /** Needs attention before visit */
  newLabsImaging: NewItemToReview[];
  patientComms: PatientComm[];
  alerts: RelevantAlert[];
  /** Clinical context */
  medications: MedicationEntry[];
  allergies: AllergyEntry[];
  immunizations: ImmunizationEntry[];
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
    { date: '2024-06-01', description: 'Initial eval – knee injury', provider: 'Dr. Jones' },
    { date: '2024-06-15', description: 'Follow-up – PT referral', provider: 'Dr. Jones' },
  ],
  'Hypertension follow-up': [
    { date: '2023-11-01', description: 'Hypertension diagnosis', provider: 'Dr. Smith' },
    { date: '2024-01-05', description: 'Medication adjustment', provider: 'Dr. Smith' },
  ],
  'Lab review': [
    { date: '2024-02-28', description: 'Labs ordered', provider: 'Dr. Smith' },
    { date: '2024-03-01', description: 'CMP, CBC resulted', provider: 'Dr. Smith' },
  ],
};

const DEFAULT_MEDICATIONS: MedicationEntry[] = [
  { name: 'Lisinopril', dose: '10 mg', frequency: 'Once daily', status: 'Active' },
  { name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', status: 'Active' },
  { name: 'Atorvastatin', dose: '20 mg', frequency: 'Once daily at bedtime', status: 'Active' },
];

const DEFAULT_ALLERGIES: AllergyEntry[] = [
  { allergen: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
  { allergen: 'Sulfa drugs', reaction: 'Hives', severity: 'Mild' },
];

const DEFAULT_IMMUNIZATIONS: ImmunizationEntry[] = [
  { vaccine: 'Influenza (seasonal)', date: '2024-10-15', dose: '1' },
  { vaccine: 'COVID-19 (updated)', date: '2024-09-01', dose: '1' },
  { vaccine: 'Tdap', date: '2022-03-12', dose: '1' },
];

/** Build panel data for a patient (used by the right-panel visit detail). */
export function getPatientVisitPanelData(patient: Patient): PatientVisitPanelData {
  const demographics = [
    { label: 'DOB', value: patient.dateOfBirth },
    { label: 'Age', value: `${patient.age} years` },
    { label: 'Gender', value: patient.gender },
    { label: 'MRN', value: patient.mrn },
    { label: 'Insurance', value: patient.insurance.provider },
  ];

  const newLabsImaging: NewItemToReview[] = [];
  if (patient.hasNewLabs) newLabsImaging.push({ type: 'Lab', name: 'CBC, CMP', date: '2024-03-01' });
  if (patient.hasNewImaging) newLabsImaging.push({ type: 'Imaging', name: 'MRI brain', date: '2024-02-28' });

  const treatmentHistory =
    TREATMENT_HISTORY_BY_CASE[patient.case] ?? TREATMENT_HISTORY_BY_CASE.default;

  const patientComms: PatientComm[] = [
    { type: 'Portal', summary: 'Question about medication refill', date: '2024-03-05' },
    { type: 'Message', summary: 'Appointment confirmation', date: '2024-03-01' },
  ];

  const alerts: RelevantAlert[] = [];
  if (patient.appointmentType === 'Initial Eval') {
    alerts.push({ type: 'Authorization', message: 'Prior auth may be required for new patient visit.' });
  }
  alerts.push({ type: 'Visit type', message: `${patient.appointmentType ?? 'Visit'} — confirmed` });

  return {
    demographics,
    reasonForVisit: patient.reasonForVisit ?? patient.case ?? 'Visit',
    treatmentHistory,
    newLabsImaging,
    patientComms,
    alerts,
    medications: DEFAULT_MEDICATIONS,
    allergies: DEFAULT_ALLERGIES,
    immunizations: DEFAULT_IMMUNIZATIONS,
  };
}
