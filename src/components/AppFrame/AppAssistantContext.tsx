import { createContext, useContext, type ReactNode } from 'react';
import type { AICheckReport } from './AICheckChat';

export interface AppAssistantContextValue {
  /**
   * Opens the global Ask Athelas panel and seeds it with a new chat that
   * surfaces an AI Check report. If a chat is already open it is moved into
   * history first (matching the panel's "New chat" behavior).
   */
  openAssistantWithAICheck: (report: AICheckReport) => void;
}

const AppAssistantContext = createContext<AppAssistantContextValue | null>(null);

export function AppAssistantProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AppAssistantContextValue;
}) {
  return <AppAssistantContext.Provider value={value}>{children}</AppAssistantContext.Provider>;
}

export function useAppAssistant(): AppAssistantContextValue {
  const ctx = useContext(AppAssistantContext);
  if (!ctx) {
    throw new Error('useAppAssistant must be used within AppAssistantProvider');
  }
  return ctx;
}

/** Same as {@link useAppAssistant} but tolerates being called outside the provider. */
export function useAppAssistantOptional(): AppAssistantContextValue | null {
  return useContext(AppAssistantContext);
}
