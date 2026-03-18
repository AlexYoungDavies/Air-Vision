import React, { useMemo, useState, createContext, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import type { AccentKey, PaletteMode } from './accents';
import { ACCENT_KEYS } from './accents';
import { createAppTheme } from './createAppTheme';

interface AppThemeContextValue {
  accentKey: AccentKey;
  setAccentKey: (key: AccentKey) => void;
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function useAccent() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error('useAccent must be used within AppThemeProvider');
  return ctx;
}

interface AppThemeProviderProps {
  children: React.ReactNode;
}

const DEFAULT_ACCENT: AccentKey = 'green';
const STORAGE_ACCENT_KEY = 'app-accent';
const STORAGE_MODE_KEY = 'app-mode';

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [accentKey, setAccentKeyState] = useState<AccentKey>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ACCENT_KEY);
      if (stored && ACCENT_KEYS.includes(stored as AccentKey)) {
        return stored as AccentKey;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ACCENT;
  });

  const [mode, setModeState] = useState<PaletteMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_MODE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // ignore
    }
    return 'light';
  });

  const setAccentKey = React.useCallback((key: AccentKey) => {
    setAccentKeyState(key);
    try {
      localStorage.setItem(STORAGE_ACCENT_KEY, key);
    } catch {
      // ignore
    }
  }, []);

  const setMode = React.useCallback((next: PaletteMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const theme = useMemo(() => createAppTheme(accentKey, mode), [accentKey, mode]);
  const contextValue = useMemo(
    () => ({ accentKey, setAccentKey, mode, setMode }),
    [accentKey, setAccentKey, mode, setMode]
  );

  return (
    <AppThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
}
