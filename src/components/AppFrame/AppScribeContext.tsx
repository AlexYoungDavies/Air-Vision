import { createContext, useContext, type ReactNode } from 'react';

export interface AppScribeContextValue {
  /** Opens the global Scribe side panel and selects today’s visit for this patient when present. */
  openScribeForPatientId: (patientId: string) => void;
  closeGlobalScribePanel: () => void;
  isGlobalScribePanelOpen: boolean;
  /** Patient id for the visit currently selected in the global Scribe panel, if any. */
  globalScribeSelectedPatientId: string | null;
  /**
   * True once the provider has clicked "Submit to Chart" from the
   * post-processed Scribe preview for this patient's visit. The visit-note
   * surface uses this to decide whether to render the populated SOAP content
   * or the empty pre-visit placeholder.
   */
  isChartSubmittedForPatientId: (patientId: string) => boolean;
  /** Records that the Scribe output has been pushed to this patient's chart. */
  markChartSubmittedForPatientId: (patientId: string) => void;
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
