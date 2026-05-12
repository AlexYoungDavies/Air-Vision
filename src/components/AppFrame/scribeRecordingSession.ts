import type { MockScribeVisit } from '../../data/mockTodaysVisits';

/**
 * Lifecycle of an active Scribe session:
 *  - `recording` / `paused` — provider is capturing audio.
 *  - `processing`           — provider hit Finish; AI is "post-processing"
 *                             the recording into a structured note.
 *  - `preview`              — post-processed note + transcript are ready for
 *                             the provider to review and submit to chart.
 */
export type ScribeRecordingSessionPhase =
  | 'recording'
  | 'paused'
  | 'processing'
  | 'preview';

/** Active scribe session (after Begin Recording, until Submit or Cancel). */
export interface ActiveScribeRecordingSession {
  visit: MockScribeVisit;
  phase: ScribeRecordingSessionPhase;
  seconds: number;
}
