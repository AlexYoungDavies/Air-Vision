import { createContext, useContext, type ReactNode } from 'react';

/**
 * One order captured during Scribe that is awaiting provider approve/decline.
 * Added to the home page "Tasks" list once the provider submits the scribe
 * output to the chart so they can confirm any orders the scribe staged.
 */
export interface ScribePendingOrderTask {
  id: string;
  patientId: string;
  patientName: string;
  /** Primary text — order name, e.g. "Radiologic examination, knee; 3 views". */
  orderName: string;
  /** Secondary text — fulfilling vendor / lab / imaging facility. */
  orderProvider: string;
  /** Human-readable visit date label, e.g. "Today". */
  visitDateLabel: string;
  /** ms epoch when the order entered the pending state. */
  createdAt: number;
}

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
  /**
   * Orders captured during scribe that are still awaiting provider
   * approve/decline. Surfaces in the home page "Tasks" list.
   */
  scribePendingOrderTasks: readonly ScribePendingOrderTask[];
  /** Removes the task from the pending list — provider approved the order. */
  approveScribeOrderTask: (id: string) => void;
  /** Removes the task from the pending list — provider declined the order. */
  declineScribeOrderTask: (id: string) => void;
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
