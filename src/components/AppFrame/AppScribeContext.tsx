import { createContext, useContext, type ReactNode } from 'react';

export interface AppScribeContextValue {
  /** Opens the global Scribe side panel and selects today’s visit for this patient when present. */
  openScribeForPatientId: (patientId: string) => void;
  closeGlobalScribePanel: () => void;
  isGlobalScribePanelOpen: boolean;
  /** Patient id for the visit currently selected in the global Scribe panel, if any. */
  globalScribeSelectedPatientId: string | null;
}

const AppScribeContext = createContext<AppScribeContextValue | null>(null);

export function AppScribeProvider({ children, value }: { children: ReactNode; value: AppScribeContextValue }) {
  return <AppScribeContext.Provider value={value}>{children}</AppScribeContext.Provider>;
}

export function useAppScribe(): AppScribeContextValue {
  const ctx = useContext(AppScribeContext);
  if (!ctx) {
    throw new Error('useAppScribe must be used within AppScribeProvider');
  }
  return ctx;
}
