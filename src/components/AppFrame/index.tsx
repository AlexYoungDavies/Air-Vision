import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SideNav } from './SideNav';
import { HeaderBar } from './HeaderBar';
import { AppCanvas } from './AppCanvas';
import { AIAssistantPanel } from './AIAssistantPanel';
import { ColorPickerPopover } from './ColorPickerPopover';
import { useAccent } from '../../theme/AppThemeProvider';

export interface AppFrameProps {
  children?: React.ReactNode;
}

export function AppFrame({ children }: AppFrameProps) {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPickerAnchorRef = useRef<HTMLDivElement>(null);
  const { accentKey, setAccentKey } = useAccent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'R') {
        e.preventDefault();
        setColorPickerOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Invisible anchor for color picker popover (top-center) */}
      <Box
        ref={colorPickerAnchorRef}
        sx={{
          position: 'fixed',
          top: 72,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          pointerEvents: 'none',
        }}
      />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SideNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((c) => !c)}
        />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0,
            bgcolor: 'background.default',
          }}
        >
          <HeaderBar
            navCollapsed={navCollapsed}
            onToggleNav={() => setNavCollapsed((c) => !c)}
            onAskAthelasClick={() => setAiAssistantOpen((o) => !o)}
          />
          <AppCanvas>{children ?? <Outlet />}</AppCanvas>
        </Box>
        {aiAssistantOpen && (
          <AIAssistantPanel onClose={() => setAiAssistantOpen(false)} />
        )}
      </Box>
      <ColorPickerPopover
        open={colorPickerOpen}
        anchorEl={colorPickerAnchorRef.current}
        onClose={() => setColorPickerOpen(false)}
        selectedAccentKey={accentKey}
        onSelectAccent={setAccentKey}
      />
    </Box>
  );
}
