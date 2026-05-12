import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Outcome of a single AI Check suggestion, broken down by card kind so the
 * note can react appropriately when applying it:
 *  - `accepted` / `declined`            → accept-decline cards
 *  - `input-accepted` (with `value`)    → input cards where the provider
 *                                          confirmed with the check icon
 *  - `input-declined`                   → input cards where the provider
 *                                          dismissed with the X icon
 */
export type AICheckSuggestionResolution =
  | { kind: 'accepted' }
  | { kind: 'declined' }
  | { kind: 'input-accepted'; value: string }
  | { kind: 'input-declined' };

export interface AICheckActionsContextValue {
  /** Current resolution per suggestion id. Missing entry = still pending. */
  resolutions: Readonly<Record<string, AICheckSuggestionResolution>>;
  /** Records a new resolution; later resolutions overwrite earlier ones. */
  resolveSuggestion: (
    suggestionId: string,
    resolution: AICheckSuggestionResolution,
  ) => void;
}

const AICheckActionsContext = createContext<AICheckActionsContextValue | null>(null);

/**
 * Holds the resolutions chosen for each AI Check suggestion so they can be
 * read by both the suggestion card (to render the post-resolution state) and
 * the visit note (to actually apply the change to its data). Lives at
 * AppFrame so a single conversation between the side panel and the canvas
 * note is possible without prop-drilling through unrelated layers.
 */
export function AICheckActionsProvider({ children }: { children: ReactNode }) {
  const [resolutions, setResolutions] = useState<
    Record<string, AICheckSuggestionResolution>
  >({});

  const resolveSuggestion = useCallback(
    (suggestionId: string, resolution: AICheckSuggestionResolution) => {
      setResolutions((prev) => ({ ...prev, [suggestionId]: resolution }));
    },
    [],
  );

  const value = useMemo<AICheckActionsContextValue>(
    () => ({ resolutions, resolveSuggestion }),
    [resolutions, resolveSuggestion],
  );

  return (
    <AICheckActionsContext.Provider value={value}>
      {children}
    </AICheckActionsContext.Provider>
  );
}

export function useAICheckActions(): AICheckActionsContextValue {
  const ctx = useContext(AICheckActionsContext);
  if (!ctx) {
    throw new Error('useAICheckActions must be used within AICheckActionsProvider');
  }
  return ctx;
}

/** Same as {@link useAICheckActions} but tolerates being called outside the provider. */
export function useAICheckActionsOptional(): AICheckActionsContextValue | null {
  return useContext(AICheckActionsContext);
}

/**
 * Convenience: true once an `accepted` / `input-accepted` resolution exists
 * for the given id. Used by visit-note effects that should only apply a
 * suggestion once (combined with their own "already applied" tracking).
 */
export function isSuggestionAccepted(
  resolution: AICheckSuggestionResolution | undefined,
): boolean {
  return resolution?.kind === 'accepted' || resolution?.kind === 'input-accepted';
}
