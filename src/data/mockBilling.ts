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

export { formatCurrency };
