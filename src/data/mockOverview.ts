/**
 * Mock data for Overview tab summary sections: active medications,
 * referrals, prior authorizations, and contacts (per patient).
 */

import type { Patient } from './mockPatients';

export type ContactType = 'Emergency' | 'Legal' | 'Guarantor' | 'Family';

export interface Contact {
  name: string;
  phone: string;
  email: string;
  relationship: string;
  isEmergency: boolean;
  /** Badge shown in top-right of card (e.g. Emergency, Legal, Guarantor). */
  type?: ContactType;
}

export interface ActiveMedication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  status: string;
  prescriber: string;
}

export interface ReferralOrPriorAuth {
  id: string;
  type: 'Referral' | 'Prior Authorization';
  description: string;
  date: string;
  status: string;
  provider?: string;
}

const MEDICATIONS_BY_PATIENT: Record<string, ActiveMedication[]> = {
  '1': [
    { id: 'm1', name: 'Lisinopril', dose: '10 mg', frequency: 'Once daily', status: 'Active', prescriber: 'Dr. Smith' },
    { id: 'm2', name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', status: 'Active', prescriber: 'Dr. Smith' },
    { id: 'm3', name: 'Atorvastatin', dose: '20 mg', frequency: 'Once daily at bedtime', status: 'Active', prescriber: 'Dr. Jones' },
    { id: 'm4', name: 'Omeprazole', dose: '20 mg', frequency: 'Once daily', status: 'Active', prescriber: 'Dr. Smith' },
  ],
  '2': [
    { id: 'm1', name: 'Ibuprofen', dose: '400 mg', frequency: 'As needed', status: 'Active', prescriber: 'Dr. Chen' },
    { id: 'm2', name: 'Lisinopril', dose: '5 mg', frequency: 'Once daily', status: 'Active', prescriber: 'Dr. Wilson' },
  ],
  '3': [
    { id: 'm1', name: 'Amlodipine', dose: '5 mg', frequency: 'Once daily', status: 'Active', prescriber: 'Dr. Garcia' },
    { id: 'm2', name: 'Metformin', dose: '1000 mg', frequency: 'Twice daily', status: 'Active', prescriber: 'Dr. Garcia' },
    { id: 'm3', name: 'Losartan', dose: '50 mg', frequency: 'Once daily', status: 'Active', prescriber: 'Dr. Garcia' },
  ],
};

const AUTHORIZATIONS_BY_PATIENT: Record<string, ReferralOrPriorAuth[]> = {
  '1': [
    { id: 'a1', type: 'Referral', description: 'Cardiology', date: '2025-02-28', status: 'Sent', provider: 'Dr. Smith' },
    { id: 'a2', type: 'Prior Authorization', description: 'PT — 12 visits', date: '2025-02-15', status: 'Approved', provider: 'Billing' },
    { id: 'a3', type: 'Referral', description: 'Dermatology', date: '2025-01-10', status: 'Completed', provider: 'Dr. Jones' },
  ],
  '2': [
    { id: 'a1', type: 'Prior Authorization', description: 'MRI lumbar spine', date: '2025-03-01', status: 'Pending', provider: 'Dr. Chen' },
    { id: 'a2', type: 'Referral', description: 'Orthopedics', date: '2025-02-20', status: 'Sent', provider: 'Dr. Wilson' },
  ],
  '3': [
    { id: 'a1', type: 'Prior Authorization', description: 'Specialist visit — 6 visits', date: '2025-02-01', status: 'Approved' },
    { id: 'a2', type: 'Referral', description: 'Endocrinology', date: '2025-01-15', status: 'Completed', provider: 'Dr. Garcia' },
    { id: 'a3', type: 'Referral', description: 'Ophthalmology', date: '2024-12-10', status: 'Completed', provider: 'Dr. Garcia' },
  ],
};

const DEFAULT_MEDS: ActiveMedication[] = [
  { id: 'm1', name: 'Lisinopril', dose: '10 mg', frequency: 'Once daily', status: 'Active', prescriber: 'Dr. Smith' },
  { id: 'm2', name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', status: 'Active', prescriber: 'Dr. Smith' },
];

const DEFAULT_AUTHS: ReferralOrPriorAuth[] = [
  { id: 'a1', type: 'Referral', description: 'Cardiology', date: '2025-02-28', status: 'Sent', provider: 'Dr. Smith' },
  { id: 'a2', type: 'Prior Authorization', description: 'PT — 12 visits', date: '2025-02-15', status: 'Approved' },
];

const MAX_ROWS = 5;

/** Returns up to 5 active medications for the patient. */
export function getActiveMedicationsForPatient(patientId: string): ActiveMedication[] {
  const list = MEDICATIONS_BY_PATIENT[patientId] ?? DEFAULT_MEDS;
  return list.filter((m) => m.status === 'Active').slice(0, MAX_ROWS);
}

/** Returns up to 5 referrals and/or prior authorizations for the patient. */
export function getReferralsAndPriorAuthsForPatient(patientId: string): ReferralOrPriorAuth[] {
  const list = AUTHORIZATIONS_BY_PATIENT[patientId] ?? DEFAULT_AUTHS;
  return list.slice(0, MAX_ROWS);
}

/** Full contact list per patient (5 contacts). One spouse = emergency, one Legal = case representative. */
const CONTACTS_BY_PATIENT: Record<string, Omit<Contact, 'isEmergency'>[]> = {
  '1': [
    { name: 'Sarah Johnson', phone: '(555) 201-3401', email: 'sarah.johnson@email.com', relationship: 'Spouse', type: 'Emergency' },
    { name: 'David Martinez', phone: '(555) 201-3402', email: 'david.martinez@law.com', relationship: 'Attorney', type: 'Legal' },
    { name: 'Robert Johnson', phone: '(555) 201-3403', email: 'robert.johnson@email.com', relationship: 'Father', type: 'Family' },
    { name: 'Mary Johnson', phone: '(555) 201-3404', email: 'mary.johnson@email.com', relationship: 'Mother', type: 'Family' },
    { name: 'Jennifer Walsh', phone: '(555) 201-3405', email: 'jennifer.walsh@email.com', relationship: 'Sibling', type: 'Guarantor' },
  ],
  '2': [
    { name: 'Wei Chen', phone: '(555) 202-4501', email: 'wei.chen@email.com', relationship: 'Spouse', type: 'Emergency' },
    { name: 'Lisa Park', phone: '(555) 202-4502', email: 'lisa.park@legal.com', relationship: 'Case Representative', type: 'Legal' },
    { name: 'Wei Chen Sr.', phone: '(555) 202-4504', email: 'wei.sr@email.com', relationship: 'Father', type: 'Family' },
    { name: 'Mei Chen', phone: '(555) 202-4505', email: 'mei.chen@email.com', relationship: 'Mother', type: 'Family' },
    { name: 'Michael Chen', phone: '(555) 202-4506', email: 'michael.chen@email.com', relationship: 'Brother', type: 'Guarantor' },
  ],
  '3': [
    { name: 'Patricia Williams', phone: '(555) 203-5601', email: 'patricia.williams@email.com', relationship: 'Spouse', type: 'Emergency' },
    { name: 'Rachel Green', phone: '(555) 203-5602', email: 'rachel.green@law.com', relationship: 'Case Representative', type: 'Legal' },
    { name: 'James Williams', phone: '(555) 203-5605', email: 'james.williams@email.com', relationship: 'Father', type: 'Family' },
    { name: 'Patricia Williams Sr.', phone: '(555) 203-5606', email: 'patricia.sr@email.com', relationship: 'Mother', type: 'Family' },
    { name: 'Thomas Williams', phone: '(555) 203-5607', email: 'thomas.williams@email.com', relationship: 'Brother', type: 'Guarantor' },
  ],
};

const DEFAULT_CONTACTS: Omit<Contact, 'isEmergency'>[] = [
  { name: 'Emergency Contact', phone: '(555) 000-0001', email: 'emergency@email.com', relationship: 'Spouse', type: 'Emergency' },
  { name: 'Legal Rep', phone: '(555) 000-0002', email: 'legal@email.com', relationship: 'Case Representative', type: 'Legal' },
  { name: 'Parent One', phone: '(555) 000-0003', email: 'parent1@email.com', relationship: 'Father', type: 'Family' },
  { name: 'Parent Two', phone: '(555) 000-0004', email: 'parent2@email.com', relationship: 'Mother', type: 'Family' },
  { name: 'Other Contact', phone: '(555) 000-0005', email: 'other@email.com', relationship: 'Sibling', type: 'Guarantor' },
];

/** Returns 5 contacts: one spouse as emergency, one Legal (case representative), plus three others. */
export function getContactsForPatient(patient: Patient): Contact[] {
  const list = CONTACTS_BY_PATIENT[patient.id] ?? DEFAULT_CONTACTS;
  return list.map((c) => ({
    ...c,
    isEmergency: c.type === 'Emergency',
  }));
}

export type AlertVariant = 'warning' | 'highlight';

export interface OverviewAlert {
  id: string;
  variant: AlertVariant;
  message: string;
}

/** Mock alerts for the Overview Alerts section. */
export function getAlertsForPatient(_patientId: string): OverviewAlert[] {
  return [
    {
      id: 'alert-1',
      variant: 'warning',
      message: 'Plan of care has less than 3 visits left',
    },
    {
      id: 'alert-2',
      variant: 'highlight',
      message: 'New imaging has been received for this patient',
    },
  ];
}
