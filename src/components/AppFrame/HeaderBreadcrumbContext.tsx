import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface HeaderBreadcrumbCrumb {
  label: string;
  /** Router path for navigable crumbs. */
  to?: string;
  /** Custom click handler (e.g. close a visit note without changing route). */
  onClick?: () => void;
}

interface HeaderBreadcrumbContextValue {
  crumbs: HeaderBreadcrumbCrumb[] | null;
  setCrumbs: (crumbs: HeaderBreadcrumbCrumb[] | null) => void;
}

const HeaderBreadcrumbContext = createContext<HeaderBreadcrumbContextValue | null>(null);

export function HeaderBreadcrumbProvider({ children }: { children: ReactNode }) {
  const [crumbs, setCrumbsState] = useState<HeaderBreadcrumbCrumb[] | null>(null);
  const setCrumbs = useCallback((next: HeaderBreadcrumbCrumb[] | null) => {
    setCrumbsState(next);
  }, []);
  const value = useMemo(() => ({ crumbs, setCrumbs }), [crumbs, setCrumbs]);
  return (
    <HeaderBreadcrumbContext.Provider value={value}>{children}</HeaderBreadcrumbContext.Provider>
  );
}

export function useHeaderBreadcrumbs() {
  const ctx = useContext(HeaderBreadcrumbContext);
  if (!ctx) {
    throw new Error('useHeaderBreadcrumbs must be used within HeaderBreadcrumbProvider');
  }
  return ctx;
}

/** Optional hook for pages that may render outside the provider in tests. */
export function useOptionalHeaderBreadcrumbs() {
  return useContext(HeaderBreadcrumbContext);
}
