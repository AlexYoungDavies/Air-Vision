/**
 * Mock data for spotlight search: notes, tasks, medications.
 * Patients come from mockPatients.
 */

export const SEARCHABLE_NOTES = [
  { id: 'n1', patient: 'Sarah Johnson', date: 'Aug 8', template: 'Office Visit' },
  { id: 'n2', patient: 'Michael Chen', date: 'Aug 8', template: 'Follow-up' },
  { id: 'n3', patient: 'Emily Davis', date: 'Aug 7', template: 'Annual Physical' },
];

export const SEARCHABLE_TASKS = [
  { id: 't1', title: 'Review lab results', due: 'Today' },
  { id: 't2', title: 'Call patient re: medication', due: 'Today' },
  { id: 't3', title: 'Sign off on referral', due: 'Tomorrow' },
];

export const SEARCHABLE_MEDICATIONS = [
  { id: 'm1', name: 'Lisinopril', dose: '10 mg', frequency: 'Once daily' },
  { id: 'm2', name: 'Metformin', dose: '500 mg', frequency: 'Twice daily' },
  { id: 'm3', name: 'Atorvastatin', dose: '20 mg', frequency: 'Once daily at bedtime' },
  { id: 'm4', name: 'Omeprazole', dose: '20 mg', frequency: 'Once daily' },
];
