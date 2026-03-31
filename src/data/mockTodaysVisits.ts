import type { AccentKey } from '../theme/accents';

export interface MockTodayVisit {
  patientName: string;
  visitType: string;
  time: string;
  /** Stripe color from shared accent palette (not necessarily the app’s current accent). */
  stripeAccent: AccentKey;
}

/** Demo list for the Scribe “Today’s visits” panel (~6 items). */
export const MOCK_TODAYS_VISITS: MockTodayVisit[] = [
  { patientName: 'Danielle Shoback', visitType: 'Initial Evaluation', time: '10:00 AM', stripeAccent: 'blue' },
  { patientName: 'Eric Whyte', visitType: 'Follow-up', time: '10:30 AM', stripeAccent: 'green' },
  { patientName: 'Yasmine Raiki', visitType: 'Follow-up', time: '11:00 AM', stripeAccent: 'lilac' },
  { patientName: 'Negar Khosravi', visitType: 'Progress Note', time: '11:30 AM', stripeAccent: 'yellow' },
  { patientName: 'James Okonkwo', visitType: 'Initial Evaluation', time: '1:00 PM', stripeAccent: 'orange' },
  { patientName: 'Priya Nair', visitType: 'Follow-up', time: '2:15 PM', stripeAccent: 'blue' },
];
