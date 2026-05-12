/**
 * Data shapes for the AI Check report that gets surfaced inside the Ask Athelas
 * AI chat when the provider clicks "AI Check" on a visit note. The report is
 * delivered as a single rich assistant message (alongside a synthetic user
 * prompt) so it lives naturally inside the existing chat transcript.
 */

export interface AICheckSuggestionAcceptDecline {
  id: string;
  title: string;
  description?: string;
  bullets?: string[];
  action: 'accept-decline';
}

export interface AICheckSuggestionInput {
  id: string;
  title: string;
  description?: string;
  bullets?: string[];
  action: 'input';
  inputPlaceholder?: string;
}

export type AICheckSuggestion = AICheckSuggestionAcceptDecline | AICheckSuggestionInput;

export interface AICheckReport {
  /** Current likelihood the claim is accepted — before applying any AI suggestion. */
  beforePercent: number;
  /** Projected likelihood if every suggestion is accepted. */
  afterPercent: number;
  suggestions: AICheckSuggestion[];
}

export interface SeededAssistantChat {
  /** Synthetic user prompt that anchors the chat (also drives the chat title in the header). */
  userPrompt: string;
  /** Rich assistant payload rendered as a card in the transcript. */
  report: AICheckReport;
}

/**
 * Default mock AI Check report shown when the provider clicks "AI Check" on a
 * visit note. The first two suggestions target the documented injection
 * order so the demo's "accept → note actually changes" flow is easy to
 * eyeball. The remaining suggestions exercise the input-style and bullet
 * variants of the card surface.
 */
export function buildDefaultAICheckSeed(): SeededAssistantChat {
  return {
    userPrompt: 'Run an AI check on this note',
    report: {
      beforePercent: 78,
      afterPercent: 94,
      suggestions: [
        {
          id: 'sug-injection-units',
          title: 'Missing units on injection order',
          description:
            'You indicated you gave an injection for Hylan G-F 20 (Synvisc) but provided no value for units. Provide this to prevent a denial.',
          action: 'input',
          inputPlaceholder: 'Units',
        },
        {
          id: 'sug-modifier-25-same-day',
          title: 'Add modifier -25 to same-day E/M',
          description:
            'Documentation indicates that the injection was given same day. This requires the -25 modifier on the office visit to avoid rejection.',
          action: 'accept-decline',
        },
        {
          id: 'sug-future-plan',
          title: 'Suggest a stronger future plan',
          description:
            'Adding more detail about future care and next steps will help claim acceptance.',
          action: 'input',
          inputPlaceholder: 'Add details…',
        },
        {
          id: 'sug-left-knee',
          title: 'Add left knee for completeness',
          description:
            'Adding documentation for the left knee, even if unremarkable, will add completeness.',
          action: 'accept-decline',
        },
        {
          id: 'sug-historical',
          title: 'Add subjective historical records',
          bullets: [
            'Past Medical History: Hypertension, hyperlipidemia, BMI 29.',
            'Past Surgical History: Right knee arthroscopy 2009 for meniscal debridement.',
            'Medications: Lisinopril, atorvastatin, ibuprofen PRN.',
            'Allergies: NKDA.',
            'Social History: Retired, non-smoker, occasional alcohol use.',
          ],
          action: 'accept-decline',
        },
      ],
    },
  };
}
