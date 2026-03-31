/**
 * Mock claims rows for the Revenue Cycle → Claims list (demo).
 */

export const ALL_CLAIMS_TOTAL = 850;

export type ClaimStatusVariant =
  | 'self_pay_unpaid'
  | 'initial_review'
  | 'submission_error'
  | 'submission_pending';

export interface ClaimAssigneeAvatar {
  initials: string;
  bgcolor: string;
  color?: string;
}

export interface ClaimRow {
  id: string;
  claimNumericId: string;
  status: ClaimStatusVariant;
  stageLabel: string;
  stageRingPct: number;
  patientName: string;
  /** When set, patient name links into the patient profile demo. */
  patientId: string | null;
  provider: string;
  dateOfService: string;
  assignees:
    | { kind: 'invite' }
    | { kind: 'stack'; items: ClaimAssigneeAvatar[]; overflow?: number };
}

export const MOCK_CLAIM_ROWS: ClaimRow[] = [
  {
    id: 'c1',
    claimNumericId: '1048291',
    status: 'self_pay_unpaid',
    stageLabel: 'Patient',
    stageRingPct: 35,
    patientName: 'Elena Vasquez',
    patientId: '1',
    provider: 'Dr. Emily Chen',
    dateOfService: '03/18/2026',
    assignees: { kind: 'invite' },
  },
  {
    id: 'c2',
    claimNumericId: '1048292',
    status: 'initial_review',
    stageLabel: 'Payer 1',
    stageRingPct: 62,
    patientName: 'Marcus Webb',
    patientId: '10',
    provider: 'Dr. James Wilson',
    dateOfService: '03/17/2026',
    assignees: {
      kind: 'stack',
      items: [
        { initials: 'JT', bgcolor: '#00897b', color: '#fff' },
        { initials: 'V', bgcolor: '#4fc3f7', color: '#0d47a1' },
      ],
    },
  },
  {
    id: 'c3',
    claimNumericId: '1048293',
    status: 'submission_error',
    stageLabel: 'Patient',
    stageRingPct: 18,
    patientName: 'Priya Sharma',
    patientId: '9',
    provider: 'Dr. Maria Garcia',
    dateOfService: '03/16/2026',
    assignees: { kind: 'invite' },
  },
  {
    id: 'c4',
    claimNumericId: '1048294',
    status: 'submission_pending',
    stageLabel: 'Payer 1',
    stageRingPct: 48,
    patientName: 'Hannah Brooks',
    patientId: '12',
    provider: 'Dr. David Kim',
    dateOfService: '03/15/2026',
    assignees: {
      kind: 'stack',
      items: [{ initials: 'LH', bgcolor: '#7e57c2', color: '#fff' }],
    },
  },
  {
    id: 'c5',
    claimNumericId: '1048295',
    status: 'self_pay_unpaid',
    stageLabel: 'Patient',
    stageRingPct: 72,
    patientName: 'Chris Taylor',
    patientId: '8',
    provider: 'Dr. Sarah Johnson',
    dateOfService: '03/14/2026',
    assignees: { kind: 'invite' },
  },
  {
    id: 'c6',
    claimNumericId: '1048296',
    status: 'initial_review',
    stageLabel: 'Payer 1',
    stageRingPct: 55,
    patientName: 'Nina Okonkwo',
    patientId: '11',
    provider: 'Dr. Robert Lee',
    dateOfService: '03/13/2026',
    assignees: {
      kind: 'stack',
      items: [
        { initials: 'JT', bgcolor: '#00897b', color: '#fff' },
        { initials: 'V', bgcolor: '#4fc3f7', color: '#0d47a1' },
        { initials: 'LH', bgcolor: '#7e57c2', color: '#fff' },
      ],
      overflow: 2,
    },
  },
  {
    id: 'c7',
    claimNumericId: '1048297',
    status: 'submission_pending',
    stageLabel: 'Patient',
    stageRingPct: 40,
    patientName: 'Amy Foster',
    patientId: '7',
    provider: 'Dr. Marcus Webb',
    dateOfService: '03/12/2026',
    assignees: { kind: 'invite' },
  },
  {
    id: 'c8',
    claimNumericId: '1048298',
    status: 'submission_error',
    stageLabel: 'Payer 1',
    stageRingPct: 22,
    patientName: 'Riley Morgan',
    patientId: '3',
    provider: 'Dr. Chris Taylor',
    dateOfService: '03/11/2026',
    assignees: { kind: 'invite' },
  },
  {
    id: 'c9',
    claimNumericId: '1048299',
    status: 'initial_review',
    stageLabel: 'Patient',
    stageRingPct: 66,
    patientName: 'Michael Chen',
    patientId: '2',
    provider: 'Dr. Priya Sharma',
    dateOfService: '03/10/2026',
    assignees: {
      kind: 'stack',
      items: [{ initials: 'V', bgcolor: '#4fc3f7', color: '#0d47a1' }],
    },
  },
  {
    id: 'c10',
    claimNumericId: '1048300',
    status: 'submission_pending',
    stageLabel: 'Payer 1',
    stageRingPct: 30,
    patientName: 'Jordan Lee',
    patientId: '4',
    provider: 'Dr. Hannah Brooks',
    dateOfService: '03/09/2026',
    assignees: { kind: 'invite' },
  },
  {
    id: 'c11',
    claimNumericId: '1048301',
    status: 'self_pay_unpaid',
    stageLabel: 'Patient',
    stageRingPct: 80,
    patientName: 'Sam Patel',
    patientId: '5',
    provider: 'Dr. Nina Okonkwo',
    dateOfService: '03/08/2026',
    assignees: {
      kind: 'stack',
      items: [
        { initials: 'JT', bgcolor: '#00897b', color: '#fff' },
        { initials: 'LH', bgcolor: '#7e57c2', color: '#fff' },
      ],
    },
  },
  {
    id: 'c12',
    claimNumericId: '1048302',
    status: 'submission_error',
    stageLabel: 'Payer 1',
    stageRingPct: 12,
    patientName: 'Casey Nguyen',
    patientId: '6',
    provider: 'Dr. Amy Foster',
    dateOfService: '03/07/2026',
    assignees: { kind: 'invite' },
  },
];
