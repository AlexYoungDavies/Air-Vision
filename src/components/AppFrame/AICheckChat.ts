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
 * visit note. Uses realistic CPT/modifier examples (rather than the demo
 * placeholder numbers in the design mockup) so the suggestions read as
 * something a coding/billing AI might actually surface.
 */
export function buildDefaultAICheckSeed(): SeededAssistantChat {
  return {
    userPrompt: 'Run an AI check on this note',
    report: {
      beforePercent: 78,
      afterPercent: 94,
      suggestions: [
        {
          id: 'sug-modifier-25',
          title: 'Better modifier for billing',
          description:
            "For the 99213 office visit billed alongside 97140 (manual therapy), no modifier was added. Adding modifier -25 (significant, separately identifiable E/M service) better matches your documentation and supports separate payment for the evaluation.",
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
