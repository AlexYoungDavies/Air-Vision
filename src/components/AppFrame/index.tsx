import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { Box, Fade, useMediaQuery } from '@mui/material';
import { useTheme, type Theme } from '@mui/material/styles';
import { SwitchTransition } from 'react-transition-group';
import { Outlet, useLocation } from 'react-router-dom';
import { SideNav } from './SideNav';
import { HeaderBar } from './HeaderBar';
import { AppCanvas } from './AppCanvas';
import { AIAssistantPanel } from './AIAssistantPanel';
import { getAssistantShortcutsForPath } from './assistantPanelShortcuts';
import { AssistantShortcutsProvider, useAssistantShortcutOverride } from './AssistantShortcutsContext';
import { ScribePanel } from './ScribePanel';
import { ColorPickerPopover } from './ColorPickerPopover';
import { SpotlightSearch } from './SpotlightSearch';
import { useAccent } from '../../theme/AppThemeProvider';
import type { ActiveScribeRecordingSession } from './scribeRecordingSession';
import { getScribeVisitForPatientId, type MockScribeVisit } from '../../data/mockTodaysVisits';
import { AppScribeProvider } from './AppScribeContext';
import { AppAssistantProvider, type AppAssistantContextValue } from './AppAssistantContext';
import type { AICheckReport, SeededAssistantChat } from './AICheckChat';

const PANEL_WIDTH = 280;
/** Width open/close (canvas + panel move together). */
const PANEL_TRANSITION_MS = 300;
/** Per-step fade when switching Assistant ↔ Scribe (out-in, so total ≈ 2× this). */
const PANEL_CROSSFADE_MS = 150;
/** Below this viewport width the panel renders as a right-side overlay popover
 *  instead of an inline column that shifts the canvas. */
const COMPACT_PANEL_MAX_WIDTH_PX = 999.95;

export type SidePanel = 'none' | 'assistant' | 'scribe';

export interface AppFrameProps {
  children?: React.ReactNode;
}

function AppFrameMainWorkspace({
  children,
  theme,
  activePanel,
  renderedPanel,
  onPanelTransitionEnd,
  onClosePanel,
  scribeSelectedVisit,
  onScribeSelectedVisitChange,
  activeScribeRecording,
  onActiveScribeRecordingChange,
  pendingAICheck,
}: {
  children: ReactNode;
  theme: Theme;
  activePanel: SidePanel;
  renderedPanel: SidePanel;
  onPanelTransitionEnd: (e: React.TransitionEvent<HTMLDivElement>) => void;
  onClosePanel: () => void;
  scribeSelectedVisit: MockScribeVisit | null;
  onScribeSelectedVisitChange: (v: MockScribeVisit | null) => void;
  activeScribeRecording: ActiveScribeRecordingSession | null;
  onActiveScribeRecordingChange: Dispatch<SetStateAction<ActiveScribeRecordingSession | null>>;
  pendingAICheck: { key: number; seed: SeededAssistantChat } | null;
}) {
  const location = useLocation();
  const { shortcutOverride } = useAssistantShortcutOverride();
  const assistantShortcuts = shortcutOverride ?? getAssistantShortcutsForPath(location.pathname);
  const isCompactPanel = useMediaQuery(`(max-width: ${COMPACT_PANEL_MAX_WIDTH_PX}px)`);
  const isPanelOpen = activePanel !== 'none';

  // Panel body is rendered identically in both layout modes — only the
  // surrounding container differs (inline column vs. fixed-right overlay).
  const panelBody = renderedPanel !== 'none' && (
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
            width: '100%',
            height: '100%',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {renderedPanel === 'assistant' && (
            <AIAssistantPanel
              onClose={onClosePanel}
              shortcuts={assistantShortcuts}
              pendingAICheck={pendingAICheck}
              compact={isCompactPanel}
            />
          )}
          {renderedPanel === 'scribe' && (
            <ScribePanel
              selectedVisit={scribeSelectedVisit}
              onSelectedVisitChange={onScribeSelectedVisitChange}
              activeRecording={activeScribeRecording}
              onActiveRecordingChange={onActiveScribeRecordingChange}
              compact={isCompactPanel}
              onClose={onClosePanel}
            />
          )}
        </Box>
      </Fade>
    </SwitchTransition>
  );

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      <AppCanvas>{children}</AppCanvas>

      {/* Wide-viewport inline panel column — pushes canvas content.
          Collapsed to width: 0 (and gets out of the way entirely) in compact mode. */}
      <Box
        onTransitionEnd={onPanelTransitionEnd}
        sx={{
          width: !isCompactPanel && isPanelOpen ? PANEL_WIDTH : 0,
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
        {!isCompactPanel && panelBody}
      </Box>

          {/* Compact-viewport overlay panel — a floating card that slides in from
          the right over the canvas. Stays mounted while sliding out so the
          transform animation plays cleanly; pointer events disabled when
          closed so the canvas underneath remains interactive. The dismiss
          action lives inside the panel's own header (next to the existing
          icon buttons), not here.

          NOTE: the card is `PANEL_WIDTH + 16` wide rather than `PANEL_WIDTH`
          so that, after the 8px inner padding on each side, the inner content
          area is still exactly `PANEL_WIDTH` — matching the fixed width the
          panel components were designed against. Without this, the panel
          contents would be clipped by 16px. */}
      {isCompactPanel && (
        <Box
          aria-hidden={!isPanelOpen}
          onTransitionEnd={onPanelTransitionEnd}
          sx={{
            position: 'absolute',
            top: 0,
            right: 8,
            bottom: 8,
            width: PANEL_WIDTH + 16,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            overflow: 'hidden',
            // 8px inner padding on both sides so the panel content doesn't bump
            // against the rounded edges of the card.
            px: 1,
            boxShadow: isPanelOpen
              ? '0 12px 32px -12px rgba(0, 0, 0, 0.24), 0 4px 12px -4px rgba(0, 0, 0, 0.12)'
              : 'none',
            // Add the 8px side gap to the closed translate so no edge of the
            // card peeks past the viewport's right edge while it's hidden.
            transform: isPanelOpen ? 'translateX(0)' : 'translateX(calc(100% + 8px))',
            transition: (t) =>
              t.transitions.create(['transform', 'box-shadow'], {
                duration: PANEL_TRANSITION_MS,
                easing: t.transitions.easing.easeInOut,
              }),
            pointerEvents: isPanelOpen ? 'auto' : 'none',
            zIndex: 5,
          }}
        >
          {panelBody}
        </Box>
      )}
    </Box>
  );
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

  /** Fires when the wide-mode width transition or the compact-mode transform
   *  transition completes; in either case, if the panel is now closed we can
   *  safely drop the rendered content so it stops consuming memory/work. */
  const handlePanelWidthTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== 'width' && e.propertyName !== 'transform') return;
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

  /**
   * Drive the post-processing animation: when the session enters `processing`,
   * schedule a one-shot transition to `preview` after a short delay so the
   * provider sees the animated emblem before the post-processed note appears.
   * The duration is intentionally close to a full pulse cycle (~2.2s) of the
   * Scribe emblem so the morph completes before the preview takes over.
   */
  const SCRIBE_PROCESSING_DURATION_MS = 2500;
  useEffect(() => {
    if (!activeScribeRecording || activeScribeRecording.phase !== 'processing') return;
    const visitId = activeScribeRecording.visit.id;
    const id = window.setTimeout(() => {
      setActiveScribeRecording((s) =>
        s && s.visit.id === visitId && s.phase === 'processing'
          ? { ...s, phase: 'preview' }
          : s,
      );
    }, SCRIBE_PROCESSING_DURATION_MS);
    return () => window.clearTimeout(id);
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

  const openScribeForPatientId = useCallback((patientId: string) => {
    const visit = getScribeVisitForPatientId(patientId);
    setScribeSelectedVisit(visit ?? null);
    setActivePanel('scribe');
  }, []);

  const closeGlobalScribePanel = useCallback(() => {
    setActivePanel('none');
  }, []);

  const appScribeValue = useMemo(
    () => ({
      openScribeForPatientId,
      closeGlobalScribePanel,
      isGlobalScribePanelOpen: scribeOpen,
      globalScribeSelectedPatientId: scribeSelectedVisit?.patientId ?? null,
    }),
    [openScribeForPatientId, closeGlobalScribePanel, scribeOpen, scribeSelectedVisit?.patientId],
  );

  const [pendingAICheck, setPendingAICheck] = useState<{
    key: number;
    seed: SeededAssistantChat;
  } | null>(null);
  const aiCheckSeedKeyRef = useRef(0);

  const openAssistantWithAICheck = useCallback(
    (report: AICheckReport) => {
      aiCheckSeedKeyRef.current += 1;
      setPendingAICheck({
        key: aiCheckSeedKeyRef.current,
        seed: { userPrompt: 'Run an AI check on this note', report },
      });
      setActivePanel('assistant');
    },
    [],
  );

  const appAssistantValue = useMemo<AppAssistantContextValue>(
    () => ({ openAssistantWithAICheck }),
    [openAssistantWithAICheck],
  );

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
              showScribeLiveActivity &&
              activeScribeRecording &&
              (activeScribeRecording.phase === 'recording' ||
                activeScribeRecording.phase === 'paused')
                ? {
                    phase: activeScribeRecording.phase,
                    seconds: activeScribeRecording.seconds,
                    onPause: () =>
                      setActiveScribeRecording((s) => (s ? { ...s, phase: 'paused' } : s)),
                    onResume: () =>
                      setActiveScribeRecording((s) => (s ? { ...s, phase: 'recording' } : s)),
                    onFinish: () => {
                      // Mirror the in-panel Finish: kick the session into
                      // `processing` and surface the panel + selected visit so
                      // the provider sees the loader → preview transition.
                      setActiveScribeRecording((s) => {
                        if (!s) return s;
                        queueMicrotask(() => {
                          setActivePanel('scribe');
                          setScribeSelectedVisit(s.visit);
                        });
                        return { ...s, phase: 'processing' };
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
          <AppScribeProvider value={appScribeValue}>
            <AppAssistantProvider value={appAssistantValue}>
              <AssistantShortcutsProvider>
                <AppFrameMainWorkspace
                  theme={theme}
                  activePanel={activePanel}
                  renderedPanel={renderedPanel}
                  onPanelTransitionEnd={handlePanelWidthTransitionEnd}
                  onClosePanel={() => setActivePanel('none')}
                  scribeSelectedVisit={scribeSelectedVisit}
                  onScribeSelectedVisitChange={setScribeSelectedVisit}
                  activeScribeRecording={activeScribeRecording}
                  onActiveScribeRecordingChange={setActiveScribeRecording}
                  pendingAICheck={pendingAICheck}
                >
                  {children ?? <Outlet />}
                </AppFrameMainWorkspace>
              </AssistantShortcutsProvider>
            </AppAssistantProvider>
          </AppScribeProvider>
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
