/** Mock remittances / deposits data for dashboard demos. */

export const FILTER_DATE_RANGE_LABEL = 'Date is 02/01/2026 - 03/31/2026';

/** Cash flow waterfall — weekly totals (dollars). */
export const CASH_FLOW_WEEKS: { label: string; amount: number }[] = [
  { label: '02/02/26 - 02/08/26', amount: 78200 },
  { label: '02/09/26 - 02/15/26', amount: 91000 },
  { label: '02/16/26 - 02/22/26', amount: 68500 },
  { label: '02/23/26 - 02/29/26', amount: 52800 },
  { label: '03/02/26 - 03/08/26', amount: 87300 },
  { label: '03/09/26 - 03/15/26', amount: 81200 },
  { label: '03/16/26 - 03/22/26', amount: 76800 },
  { label: '03/23/26 - 03/29/26', amount: 21400 },
];

/** Line items that sum to each week’s waterfall bar (first five weeks × two rows = 10). */
export interface WaterfallLineItem {
  id: string;
  dateRange: string;
  payer: string;
  channel: string;
  amount: number;
}

export const WATERFALL_LINE_ITEMS: WaterfallLineItem[] = [
  { id: 'wf1', dateRange: '02/02/26 - 02/08/26', payer: 'BCBS', channel: 'ERA', amount: 45120 },
  { id: 'wf2', dateRange: '02/02/26 - 02/08/26', payer: 'UnitedHealthcare', channel: 'ERA', amount: 33080 },
  { id: 'wf3', dateRange: '02/09/26 - 02/15/26', payer: 'BCBS', channel: 'ERA', amount: 48200 },
  { id: 'wf4', dateRange: '02/09/26 - 02/15/26', payer: 'WPS', channel: 'Paper EOB', amount: 42800 },
  { id: 'wf5', dateRange: '02/16/26 - 02/22/26', payer: 'Zelis', channel: 'ERA', amount: 36200 },
  { id: 'wf6', dateRange: '02/16/26 - 02/22/26', payer: 'Aetna', channel: 'ERA', amount: 32300 },
  { id: 'wf7', dateRange: '02/23/26 - 02/29/26', payer: 'Humana', channel: 'ERA', amount: 28800 },
  { id: 'wf8', dateRange: '02/23/26 - 02/29/26', payer: 'Cigna', channel: 'ERA', amount: 24000 },
  { id: 'wf9', dateRange: '03/02/26 - 03/08/26', payer: 'BCBS', channel: 'Remote deposit', amount: 52300 },
  { id: 'wf10', dateRange: '03/02/26 - 03/08/26', payer: 'UHC', channel: 'ERA', amount: 35000 },
];

export const SUMMARY_CARDS = [
  {
    id: 'insurance',
    title: 'Insurance Deposits',
    value: 530_570,
    format: 'compactK' as const,
    badgeText: undefined as string | undefined,
  },
  {
    id: 'checks',
    title: 'Check Total',
    value: 273.41,
    format: 'standard' as const,
    badgeText: '0.05%',
  },
  {
    id: 'posted',
    title: 'Posted Payments',
    value: 0,
    format: 'standard' as const,
    badgeText: '0.00%',
  },
] as const;

/** Stacked deposit series keys and display colors (matches reference palette). */
export const DEPOSIT_STACK_KEYS = [
  { key: 'na', label: 'N/A', color: '#1565c0' },
  { key: 'bcbs', label: 'BCBS', color: '#d81b60' },
  { key: 'wps', label: 'WPS', color: '#f4511e' },
  { key: 'other', label: 'OTHER', color: '#fdd835' },
  { key: 'uhc', label: 'UNITEDHEALTHCARE', color: '#43a047' },
  { key: 'zelis', label: 'ZELIS', color: '#00897b' },
  { key: 'remote', label: 'REMOTE CHECK DEPOSIT', color: '#8e24aa' },
] as const;

export type DepositStackKey = (typeof DEPOSIT_STACK_KEYS)[number]['key'];

export const DEPOSIT_STACK_WEEKS: { label: string; segments: Record<DepositStackKey, number> }[] =
  CASH_FLOW_WEEKS.map((w, i) => {
    const base = w.amount;
    const t = i / 7;
    return {
      label: w.label,
      segments: {
        na: base * (0.12 + t * 0.02),
        bcbs: base * (0.28 - t * 0.03),
        wps: base * (0.15 + t * 0.01),
        other: base * 0.08,
        uhc: base * 0.18,
        zelis: base * 0.12,
        remote: base * (0.07 + t * 0.02),
      },
    };
  });

/** Ten largest segment line items from the deposit stack (tie chart ↔ table). */
function buildDepositLineItems(): DepositsTableRow[] {
  type Cand = { weekLabel: string; sourceLabel: string; amount: number };
  const cands: Cand[] = [];
  for (const week of DEPOSIT_STACK_WEEKS) {
    for (const { key, label } of DEPOSIT_STACK_KEYS) {
      cands.push({ weekLabel: week.label, sourceLabel: label, amount: week.segments[key] });
    }
  }
  cands.sort((a, b) => b.amount - a.amount);
  return cands.slice(0, 10).map((c, i) => ({
    id: `dl${i}`,
    dateRange: c.weekLabel,
    depositSource: c.sourceLabel,
    depositsAmt: Math.round(c.amount * 100) / 100,
    matchedAmt: 0,
    nonInsuranceAmt: 0,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  }));
}

export interface DepositsTableRow {
  id: string;
  dateRange: string;
  depositSource: string;
  depositsAmt: number;
  matchedAmt: number;
  nonInsuranceAmt: number;
  nonAthelasAmt: number;
  dollarsMatchedPct: number;
}

export const DEPOSIT_LINE_ITEMS = buildDepositLineItems();

/** Checks chart: weekly totals (scaled from cash flow for a coherent demo). */
export const CHECKS_WEEKLY: { label: string; amount: number }[] = CASH_FLOW_WEEKS.map((w) => ({
  label: w.label,
  amount: Math.round(w.amount * 0.088 * 100) / 100,
}));

export interface ChecksTableRow {
  id: string;
  dateRange: string;
  depositSource: string;
  checksAmt: number;
  matchedAmt: number;
  postedAmt: number;
  unpostedAmt: number;
  nonAthelasAmt: number;
  dollarsMatchedPct: number;
}

/** Ten rows; sums per week match CHECKS_WEEKLY for the first five weeks (two rows each). */
export const CHECKS_LINE_ITEMS: ChecksTableRow[] = [
  {
    id: 'ck1',
    dateRange: '02/02/26 - 02/08/26',
    depositSource: 'BCBS',
    checksAmt: 2150.0,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 2150.0,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck2',
    dateRange: '02/02/26 - 02/08/26',
    depositSource: '—',
    checksAmt: 4731.6,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 4731.6,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck3',
    dateRange: '02/09/26 - 02/15/26',
    depositSource: 'WPS',
    checksAmt: 3200.0,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 3200.0,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck4',
    dateRange: '02/09/26 - 02/15/26',
    depositSource: '—',
    checksAmt: 4808.0,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 4808.0,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck5',
    dateRange: '02/16/26 - 02/22/26',
    depositSource: 'UHC',
    checksAmt: 2100.0,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 2100.0,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck6',
    dateRange: '02/16/26 - 02/22/26',
    depositSource: '—',
    checksAmt: 3928.0,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 3928.0,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck7',
    dateRange: '02/23/26 - 02/29/26',
    depositSource: '—',
    checksAmt: 3026.4,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 3026.4,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck8',
    dateRange: '02/23/26 - 02/29/26',
    depositSource: 'BCBS',
    checksAmt: 1620.0,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 1620.0,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck9',
    dateRange: '03/02/26 - 03/08/26',
    depositSource: 'Zelis',
    checksAmt: 4500.0,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 4500.0,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
  {
    id: 'ck10',
    dateRange: '03/02/26 - 03/08/26',
    depositSource: '—',
    checksAmt: 3182.4,
    matchedAmt: 0,
    postedAmt: 0,
    unpostedAmt: 3182.4,
    nonAthelasAmt: 0,
    dollarsMatchedPct: 0,
  },
];

/** Posted payments chart — weekly posted totals. */
export const POSTED_WEEKLY: { label: string; amount: number }[] = CASH_FLOW_WEEKS.map((w) => ({
  label: w.label,
  amount: Math.round(w.amount * 0.38 * 100) / 100,
}));

export interface PostedPaymentsTableRow {
  id: string;
  dateRange: string;
  batch: string;
  postedAmt: number;
  verifiedAmt: number;
  verifiedPct: number;
}

export const POSTED_LINE_ITEMS: PostedPaymentsTableRow[] = [
  {
    id: 'pp1',
    dateRange: '02/02/26 - 02/08/26',
    batch: 'ERA batch #44102',
    postedAmt: 18200.0,
    verifiedAmt: 18200.0,
    verifiedPct: 100,
  },
  {
    id: 'pp2',
    dateRange: '02/02/26 - 02/08/26',
    batch: 'Manual post — lockbox',
    postedAmt: 11516.0,
    verifiedAmt: 11000.0,
    verifiedPct: 95.52,
  },
  {
    id: 'pp3',
    dateRange: '02/09/26 - 02/15/26',
    batch: 'ERA batch #44118',
    postedAmt: 24800.0,
    verifiedAmt: 24800.0,
    verifiedPct: 100,
  },
  {
    id: 'pp4',
    dateRange: '02/09/26 - 02/15/26',
    batch: 'ERA batch #44122',
    postedAmt: 9780.0,
    verifiedAmt: 9600.0,
    verifiedPct: 98.16,
  },
  {
    id: 'pp5',
    dateRange: '02/16/26 - 02/22/26',
    batch: 'ERA batch #44130',
    postedAmt: 20100.0,
    verifiedAmt: 20100.0,
    verifiedPct: 100,
  },
  {
    id: 'pp6',
    dateRange: '02/16/26 - 02/22/26',
    batch: 'Paper remit upload',
    postedAmt: 5930.0,
    verifiedAmt: 5500.0,
    verifiedPct: 92.75,
  },
  {
    id: 'pp7',
    dateRange: '02/23/26 - 02/29/26',
    batch: 'ERA batch #44141',
    postedAmt: 15500.0,
    verifiedAmt: 15500.0,
    verifiedPct: 100,
  },
  {
    id: 'pp8',
    dateRange: '02/23/26 - 02/29/26',
    batch: 'ERA batch #44144',
    postedAmt: 4564.0,
    verifiedAmt: 4400.0,
    verifiedPct: 96.41,
  },
  {
    id: 'pp9',
    dateRange: '03/02/26 - 03/08/26',
    batch: 'ERA batch #44150',
    postedAmt: 28900.0,
    verifiedAmt: 28900.0,
    verifiedPct: 100,
  },
  {
    id: 'pp10',
    dateRange: '03/02/26 - 03/08/26',
    batch: 'Zelis auto-post',
    postedAmt: 4273.8,
    verifiedAmt: 4200.0,
    verifiedPct: 98.27,
  },
];

export const DETAIL_TABLE_PAGE_SIZE = 10;
