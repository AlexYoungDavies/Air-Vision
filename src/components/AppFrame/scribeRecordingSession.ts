import type { MockScribeVisit } from '../../data/mockTodaysVisits';

export type ScribeRecordingSessionPhase = 'recording' | 'paused';

/** Active scribe session (after Begin Recording, until Finish or Cancel). */
export interface ActiveScribeRecordingSession {
  visit: MockScribeVisit;
  phase: ScribeRecordingSessionPhase;
  seconds: number;
}
