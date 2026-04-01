import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Box, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SwitchTransition } from 'react-transition-group';
import { Outlet } from 'react-router-dom';
import { SideNav } from './SideNav';
import { HeaderBar } from './HeaderBar';
import { AppCanvas } from './AppCanvas';
import { AIAssistantPanel } from './AIAssistantPanel';
import { ScribePanel } from './ScribePanel';
import { ColorPickerPopover } from './ColorPickerPopover';
import { SpotlightSearch } from './SpotlightSearch';
import { useAccent } from '../../theme/AppThemeProvider';
import type { ActiveScribeRecordingSession } from './scribeRecordingSession';
import type { MockScribeVisit } from '../../data/mockTodaysVisits';

const PANEL_WIDTH = 280;
/** Width open/close (canvas + panel move together). */
const PANEL_TRANSITION_MS = 300;
/** Per-step fade when switching Assistant ↔ Scribe (out-in, so total ≈ 2× this). */
const PANEL_CROSSFADE_MS = 150;

export type SidePanel = 'none' | 'assistant' | 'scribe';

export interface AppFrameProps {
  children?: React.ReactNode;
}

export function AppFrame({ children }: AppFrameProps) {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<SidePanel>('none');
  const activePanelRef = useRef<SidePanel>(activePanel);
  activePanelRef.current = activePanel;
  /** Keeps panel content mounted while width animates to 0 on close. */
  const [renderedPanel, setRenderedPanel] = useState<SidePanel>('none');
  const [dictateActive, setDictateActive] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const colorPickerAnchorRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { accentKey, setAccentKey } = useAccent();

  useLayoutEffect(() => {
    if (activePanel !== 'none') {
      setRenderedPanel(activePanel);
    }
  }, [activePanel]);

  const handlePanelWidthTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'width' || e.target !== e.currentTarget) return;
    if (activePanel === 'none') {
      setRenderedPanel('none');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'R') {
        e.preventDefault();
        setColorPickerOpen((open) => !open);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scribeOpen = activePanel === 'scribe';
  const aiAssistantOpen = activePanel === 'assistant';

  const [scribeSelectedVisit, setScribeSelectedVisit] = useState<MockScribeVisit | null>(null);
  const [activeScribeRecording, setActiveScribeRecording] = useState<ActiveScribeRecordingSession | null>(null);

  useEffect(() => {
    if (!activeScribeRecording || activeScribeRecording.phase !== 'recording') return;
    const id = window.setInterval(() => {
      setActiveScribeRecording((s) => {
        if (!s || s.phase !== 'recording') return s;
        return { ...s, seconds: s.seconds + 1 };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeScribeRecording?.phase, activeScribeRecording?.visit.id]);

  const onRecordingViewVisible =
    activePanel === 'scribe' && scribeSelectedVisit?.id === activeScribeRecording?.visit.id;
  /** Live bar while recording or paused, away from the recording UI */
  const showScribeLiveActivity = Boolean(
    activeScribeRecording &&
      (activeScribeRecording.phase === 'recording' || activeScribeRecording.phase === 'paused') &&
      !onRecordingViewVisible,
  );

  const openScribeToRecording = () => {
    if (!activeScribeRecording) return;
    setActivePanel('scribe');
    setScribeSelectedVisit(activeScribeRecording.visit);
  };

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
            dictateActive={dictateActive}
            onDictateClick={() => setDictateActive((a) => !a)}
            scribePanelOpen={scribeOpen}
            onScribeClick={() => {
              if (activePanelRef.current === 'scribe') {
                setActivePanel('none');
              } else {
                setScribeSelectedVisit(null);
                setActivePanel('scribe');
              }
            }}
            scribeLiveActivity={
              showScribeLiveActivity && activeScribeRecording
                ? {
                    phase: activeScribeRecording.phase,
                    seconds: activeScribeRecording.seconds,
                    onPause: () =>
                      setActiveScribeRecording((s) => (s ? { ...s, phase: 'paused' } : s)),
                    onResume: () =>
                      setActiveScribeRecording((s) => (s ? { ...s, phase: 'recording' } : s)),
                    onFinish: () => {
                      setActiveScribeRecording((s) => {
                        const v = s?.visit;
                        if (v) {
                          queueMicrotask(() => {
                            setActivePanel('scribe');
                            setScribeSelectedVisit(v);
                          });
                        }
                        return null;
                      });
                    },
                    onNavigateToRecording: openScribeToRecording,
                  }
                : null
            }
            assistantOpen={aiAssistantOpen}
            onAskAthelasClick={() => {
              setActivePanel((p) => {
                if (p === 'assistant') return 'none';
                return 'assistant';
              });
            }}
            onSearchClick={() => setSpotlightOpen(true)}
          />
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              overflow: 'hidden',
            }}
          >
            <AppCanvas>{children ?? <Outlet />}</AppCanvas>
            <Box
              onTransitionEnd={handlePanelWidthTransitionEnd}
              sx={{
                width: activePanel !== 'none' ? PANEL_WIDTH : 0,
                flexShrink: 0,
                overflow: 'hidden',
                minHeight: 0,
                height: '100%',
                transition: (t) =>
                  t.transitions.create('width', {
                    duration: PANEL_TRANSITION_MS,
                    easing: t.transitions.easing.easeInOut,
                  }),
              }}
            >
              {renderedPanel !== 'none' && (
                <SwitchTransition mode="out-in">
                  <Fade
                    key={renderedPanel}
                    timeout={PANEL_CROSSFADE_MS}
                    easing={{
                      enter: theme.transitions.easing.easeInOut,
                      exit: theme.transitions.easing.easeInOut,
                    }}
                  >
                    <Box
                      sx={{
                        width: PANEL_WIDTH,
                        height: '100%',
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      {renderedPanel === 'assistant' && (
                        <AIAssistantPanel onClose={() => setActivePanel('none')} />
                      )}
                      {renderedPanel === 'scribe' && (
                        <ScribePanel
                          selectedVisit={scribeSelectedVisit}
                          onSelectedVisitChange={setScribeSelectedVisit}
                          activeRecording={activeScribeRecording}
                          onActiveRecordingChange={setActiveScribeRecording}
                        />
                      )}
                    </Box>
                  </Fade>
                </SwitchTransition>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <ColorPickerPopover
        open={colorPickerOpen}
        anchorEl={colorPickerAnchorRef.current}
        onClose={() => setColorPickerOpen(false)}
        selectedAccentKey={accentKey}
        onSelectAccent={setAccentKey}
      />
      <SpotlightSearch
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        query={spotlightQuery}
        onQueryChange={setSpotlightQuery}
      />
    </Box>
  );
}
