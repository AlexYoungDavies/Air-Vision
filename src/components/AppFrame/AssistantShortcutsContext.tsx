import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AIAssistantShortcut } from './assistantPanelShortcuts';

interface AssistantShortcutsContextValue {
  shortcutOverride: AIAssistantShortcut[] | null;
  setShortcutOverride: (shortcuts: AIAssistantShortcut[] | null) => void;
}

const AssistantShortcutsContext = createContext<AssistantShortcutsContextValue | null>(null);

export function AssistantShortcutsProvider({ children }: { children: ReactNode }) {
  const [shortcutOverride, setShortcutOverride] = useState<AIAssistantShortcut[] | null>(null);
  const value = useMemo(
    () => ({ shortcutOverride, setShortcutOverride }),
    [shortcutOverride],
  );
  return (
    <AssistantShortcutsContext.Provider value={value}>{children}</AssistantShortcutsContext.Provider>
  );
}

export function useAssistantShortcutOverride(): AssistantShortcutsContextValue {
  const ctx = useContext(AssistantShortcutsContext);
  if (!ctx) {
    throw new Error('useAssistantShortcutOverride must be used within AssistantShortcutsProvider');
  }
  return ctx;
}

/** Same as {@link useAssistantShortcutOverride} but returns null outside the provider (e.g. isolated demos). */
export function useAssistantShortcutOverrideOptional(): AssistantShortcutsContextValue | null {
  return useContext(AssistantShortcutsContext);
}
