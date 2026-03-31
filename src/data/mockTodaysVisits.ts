import type { AccentKey } from '../theme/accents';

export type ScribeVisitGroup = 'upcoming' | 'action' | 'completed';

/** Optional right-side status for upcoming / action-pending rows. */
export type ScribeVisitRowStatus = 'starting' | 'paused' | 'review';

export interface MockScribeVisit {
  id: string;
  patientName: string;
  visitType: string;
  time: string;
  stripeAccent: AccentKey;
  group: ScribeVisitGroup;
  rowStatus?: ScribeVisitRowStatus;
}

/** Demo visits for the Scribe “Today’s visits” panel, grouped for the UI. */
export const MOCK_SCRIBE_VISITS: MockScribeVisit[] = [
  // Upcoming — not yet today
  {
    id: 'u1',
    patientName: 'Danielle Shoback',
    visitType: 'Initial Evaluation',
    time: '10:00 AM',
    stripeAccent: 'blue',
    group: 'upcoming',
    rowStatus: 'starting',
  },
  {
    id: 'u2',
    patientName: 'Eric Whyte',
    visitType: 'Follow-up',
    time: '10:30 AM',
    stripeAccent: 'teal',
    group: 'upcoming',
  },
  {
    id: 'u3',
    patientName: 'Yasmine Raiki',
    visitType: 'Follow-up',
    time: '11:00 AM',
    stripeAccent: 'yellow',
    group: 'upcoming',
  },
  // Action pending — paused scribe or needs review
  {
    id: 'a1',
    patientName: 'Negar Khosravi',
    visitType: 'Progress Note',
    time: '9:15 AM',
    stripeAccent: 'lilac',
    group: 'action',
    rowStatus: 'paused',
  },
  {
    id: 'a2',
    patientName: 'James Okonkwo',
    visitType: 'Initial Evaluation',
    time: '8:45 AM',
    stripeAccent: 'orange',
    group: 'action',
    rowStatus: 'review',
  },
  // Completed
  {
    id: 'c1',
    patientName: 'Priya Nair',
    visitType: 'Follow-up',
    time: '8:00 AM',
    stripeAccent: 'blue',
    group: 'completed',
  },
  {
    id: 'c2',
    patientName: 'Marcus Chen',
    visitType: 'Progress Note',
    time: '7:30 AM',
    stripeAccent: 'green',
    group: 'completed',
  },
];
