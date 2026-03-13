import React, { useMemo, useState, createContext, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import type { AccentKey } from './accents';
import { createAppTheme } from './createAppTheme';

interface AccentContextValue {
  accentKey: AccentKey;
  setAccentKey: (key: AccentKey) => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error('useAccent must be used within AppThemeProvider');
  return ctx;
}

interface AppThemeProviderProps {
  children: React.ReactNode;
}

const DEFAULT_ACCENT: AccentKey = 'green';

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [accentKey, setAccentKeyState] = useState<AccentKey>(() => {
    try {
      const stored = localStorage.getItem('app-accent');
      if (stored && ['green', 'blue', 'yellow', 'lilac', 'orange'].includes(stored)) {
        return stored as AccentKey;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ACCENT;
  });

  const setAccentKey = React.useCallback((key: AccentKey) => {
    setAccentKeyState(key);
    try {
      localStorage.setItem('app-accent', key);
    } catch {
      // ignore
    }
  }, []);

  const theme = useMemo(() => createAppTheme(accentKey), [accentKey]);
  const contextValue = useMemo(
    () => ({ accentKey, setAccentKey }),
    [accentKey, setAccentKey]
  );

  return (
    <AccentContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AccentContext.Provider>
  );
}
