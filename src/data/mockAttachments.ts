/**
 * Mock attachment/document data per patient for the Attachments tab.
 */

export type AttachmentType =
  | 'Intake'
  | 'Immunization record'
  | 'Medical order form'
  | 'Letter of referral';

export interface Attachment {
  id: string;
  patientId: string;
  name: string;
  type: AttachmentType;
  dateAdded: string;
}

function buildAttachments(patientId: string): Attachment[] {
  const base: { name: string; type: AttachmentType; date: string }[] = [
    { name: 'Intake Form — 2026', type: 'Intake', date: '02/10/2026' },
    { name: 'New Patient Intake Packet', type: 'Intake', date: '01/28/2026' },
    { name: 'Immunization Record', type: 'Immunization record', date: '02/01/2026' },
    { name: 'Childhood Immunizations', type: 'Immunization record', date: '11/15/2025' },
    { name: 'Lab Order — CBC', type: 'Medical order form', date: '02/08/2026' },
    { name: 'Radiology Order — X-Ray', type: 'Medical order form', date: '01/22/2026' },
    { name: 'Referral to Cardiology', type: 'Medical order form', date: '01/15/2026' },
    { name: 'Physical Therapy Order', type: 'Medical order form', date: '12/18/2025' },
    { name: 'Letter of Referral — Dr. Martinez', type: 'Letter of referral', date: '02/05/2026' },
    { name: 'Letter of Referral — Dr. Walsh', type: 'Letter of referral', date: '01/08/2026' },
    { name: 'Specialist Referral — Dermatology', type: 'Letter of referral', date: '11/28/2025' },
    { name: 'Annual Intake Update', type: 'Intake', date: '12/01/2025' },
    { name: 'Flu Shot Documentation', type: 'Immunization record', date: '10/20/2025' },
    { name: 'MRI Order — Lower Back', type: 'Medical order form', date: '12/10/2025' },
  ];
  return base.map((row, i) => ({
    id: `att-${patientId}-${i + 1}`,
    patientId,
    name: row.name,
    type: row.type,
    dateAdded: row.date,
  }));
}

const CACHE: Record<string, Attachment[]> = {};

export function getAttachmentsForPatient(patientId: string): Attachment[] {
  if (!CACHE[patientId]) CACHE[patientId] = buildAttachments(patientId);
  return CACHE[patientId];
}
