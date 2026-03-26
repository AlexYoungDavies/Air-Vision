export interface BatchHistoryRow {
  date: string;
  deliveredTexts: string;
  notDeliveredTexts: string;
  deliveredEmails: string;
  notDeliveredEmails: string;
  totalSent: string;
  totalPaid: string;
}

export const MOCK_OVERALL_STATS = [
  { label: 'Total Patient Collections', value: '$122.59K' },
  { label: 'Total Outstanding PR', value: '$47.83K' },
  { label: 'Patients With Outstanding Balance', value: '#263' },
  { label: '# Batches Sent', value: '#403' },
] as const;

export const MOCK_LAST_BATCH_META = {
  title: 'Last Batch (MAIL) 03/18/2026',
  rows: [
    { label: 'Total PR Sent', value: '$1,313.78' },
    { label: '# Patients', value: '8' },
    { label: '% of Outstanding PR', value: '100%' },
    { label: 'Total QR Code Payments', value: '$0.00' },
    { label: 'Highest PR in batch', value: '$803.28' },
    { label: 'Lowest PR in batch', value: '$10.00' },
  ],
} as const;

export const MOCK_BATCH_HISTORY: BatchHistoryRow[] = [
  {
    date: '09/09/2025',
    deliveredTexts: '57',
    notDeliveredTexts: '29',
    deliveredEmails: '21',
    notDeliveredEmails: '65',
    totalSent: '$7,831.67',
    totalPaid: '$0.00',
  },
  {
    date: '08/26/2025',
    deliveredTexts: '27',
    notDeliveredTexts: '7',
    deliveredEmails: '8',
    notDeliveredEmails: '26',
    totalSent: '$1,526.54',
    totalPaid: '$0.00',
  },
  {
    date: '08/20/2025',
    deliveredTexts: '5',
    notDeliveredTexts: '6',
    deliveredEmails: '1',
    notDeliveredEmails: '10',
    totalSent: '$509.00',
    totalPaid: '$0.00',
  },
  {
    date: '08/19/2025',
    deliveredTexts: '4',
    notDeliveredTexts: '7',
    deliveredEmails: '2',
    notDeliveredEmails: '7',
    totalSent: '$2,251.00',
    totalPaid: '$0.00',
  },
  {
    date: '08/18/2025',
    deliveredTexts: '6',
    notDeliveredTexts: '6',
    deliveredEmails: '1',
    notDeliveredEmails: '8',
    totalSent: '$2,194.00',
    totalPaid: '$0.00',
  },
  {
    date: '07/15/2025',
    deliveredTexts: '',
    notDeliveredTexts: '',
    deliveredEmails: '',
    notDeliveredEmails: '',
    totalSent: '$412.00',
    totalPaid: '$0.00',
  },
];

export const MOCK_UPCOMING_SCHEDULE = {
  batchCount: 5,
  patientsPerBatch: 0,
  weekdays: 'M, Tu, W, Th, F',
  rangeLabel: 'Sep 13, 2033 - Sep 19, 2033',
  sendDate: 'Sep 13, 2033',
} as const;
