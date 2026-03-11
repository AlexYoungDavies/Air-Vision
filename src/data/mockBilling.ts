/**
 * Mock billing data per patient for the Billing tab.
 */

export interface BillingSummary {
  patientCharges: number;
  payments: number;
  balance: number;
  availableCredit: number;
  lockedCredit: number;
  refunds: number;
}

export type ChargeStatus = 'Outstanding' | 'Paid' | 'Cancelled';

export interface BillingCharge {
  id: string;
  patientId: string;
  dateOfService: string;
  patientName: string;
  financialGuarantor: string;
  prStatus: string;
  encounterId: string;
  providerName: string;
  pr: number;
  paid: number;
  writtenOff: number;
  balanceDue: number;
  status: ChargeStatus;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

const PROVIDERS = ['Milton Lee', 'Dr. Emily Chen', 'Dr. James Wilson', 'Dr. Maria Garcia', 'Dr. David Kim'];

function buildSummary(patientIndex: number): BillingSummary {
  const baseCharges = 1500 + patientIndex * 80;
  const payments = 200 + patientIndex * 15;
  const balance = Math.max(0, baseCharges * 0.4 - payments);
  return {
    patientCharges: baseCharges + 554.77,
    payments: 287.54 + patientIndex * 10,
    balance: Math.round(balance * 100) / 100,
    availableCredit: 0,
    lockedCredit: patientIndex % 3 === 0 ? 3.33 : 0,
    refunds: 0,
  };
}

function buildCharges(patientId: string, patientName: string, patientIndex: number): BillingCharge[] {
  const charges: BillingCharge[] = [];
  const numCharges = 5 + (patientIndex % 4);
  for (let i = 0; i < numCharges; i++) {
    const pr = 100 + (patientIndex + i) * 25;
    const paid = i % 3 === 0 ? pr : i % 3 === 1 ? pr * 0.5 : 0;
    const writtenOff = i % 5 === 0 ? 10 : 0;
    const balanceDue = Math.max(0, pr - paid - writtenOff);
    const status: ChargeStatus = balanceDue <= 0 ? 'Paid' : i % 7 === 0 ? 'Cancelled' : 'Outstanding';
    charges.push({
      id: `ch-${patientId}-${i + 1}`,
      patientId,
      dateOfService: new Date(2026, (patientIndex + i) % 12, (i + 1) * 2).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      patientName,
      financialGuarantor: patientName,
      prStatus: 'Verified',
      encounterId: `ENC-${1000 + parseInt(patientId, 10) * 10 + i}`,
      providerName: PROVIDERS[(patientIndex + i) % PROVIDERS.length],
      pr,
      paid: status === 'Paid' ? pr : paid,
      writtenOff,
      balanceDue: status === 'Cancelled' ? 0 : balanceDue,
      status,
    });
  }
  return charges.sort((a, b) => new Date(b.dateOfService).getTime() - new Date(a.dateOfService).getTime());
}

const SUMMARY_CACHE: Record<string, BillingSummary> = {};
const CHARGES_CACHE: Record<string, BillingCharge[]> = {};

export function getBillingSummary(patientId: string): BillingSummary {
  const patientIndex = parseInt(patientId, 10) - 1;
  if (!SUMMARY_CACHE[patientId]) SUMMARY_CACHE[patientId] = buildSummary(Math.max(0, patientIndex));
  return SUMMARY_CACHE[patientId];
}

export function getBillingCharges(patientId: string, patientName: string): BillingCharge[] {
  const patientIndex = Math.max(0, parseInt(patientId, 10) - 1);
  if (!CHARGES_CACHE[patientId]) CHARGES_CACHE[patientId] = buildCharges(patientId, patientName, patientIndex);
  return CHARGES_CACHE[patientId];
}

// Transaction History

export type TransactionPaymentType = 'Payment for service' | 'Refund (credit)' | 'Write';

export interface BillingTransaction {
  id: string;
  date: string;
  amount: number;
  paymentType: TransactionPaymentType;
  paymentMethod: string;
}

function buildTransactions(patientId: string): BillingTransaction[] {
  const base = [
    { paymentType: 'Payment for service' as const, amount: 287.54, date: '02/15/2026', method: 'Credit Card' },
    { paymentType: 'Payment for service' as const, amount: 150.00, date: '01/28/2026', method: 'ACH' },
    { paymentType: 'Refund (credit)' as const, amount: -45.00, date: '01/20/2026', method: 'Credit Card' },
    { paymentType: 'Payment for service' as const, amount: 89.25, date: '01/10/2026', method: 'Check' },
    { paymentType: 'Write' as const, amount: -25.00, date: '01/05/2026', method: '—' },
    { paymentType: 'Payment for service' as const, amount: 312.00, date: '12/18/2025', method: 'Credit Card' },
    { paymentType: 'Refund (credit)' as const, amount: -100.00, date: '12/01/2025', method: 'ACH' },
    { paymentType: 'Write' as const, amount: -15.50, date: '11/22/2025', method: '—' },
    { paymentType: 'Payment for service' as const, amount: 75.00, date: '11/15/2025', method: 'Credit Card' },
  ];
  return base.map((t, i) => ({
    id: `txn-${patientId}-${i + 1}`,
    date: t.date,
    amount: t.amount,
    paymentType: t.paymentType,
    paymentMethod: t.method,
  }));
}

const TRANSACTIONS_CACHE: Record<string, BillingTransaction[]> = {};

export function getBillingTransactions(patientId: string): BillingTransaction[] {
  if (!TRANSACTIONS_CACHE[patientId]) TRANSACTIONS_CACHE[patientId] = buildTransactions(patientId);
  return TRANSACTIONS_CACHE[patientId];
}

export { formatCurrency };
