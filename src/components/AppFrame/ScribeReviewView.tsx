import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import FormatListBulletedRounded from '@mui/icons-material/FormatListBulletedRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import {
  type MockScribePostProcessedOutput,
  type MockScribeSection,
  type MockScribeSectionId,
  type MockScribeTranscriptLine,
  type MockScribeVisit,
} from '../../data/mockTodaysVisits';
import { VISIT_NOTE_BUTTON_EXEMPT_CLASS } from '../../theme/buttonStyleConstants';
import { ScribeScrollFadeArea } from './ScribeScrollFadeArea';

type TopTab = 'scribe' | 'transcript';
type SectionFilter = 'all' | MockScribeSectionId;

const SECTION_FILTERS: { id: SectionFilter; label: string }[] = [
  { id: 'subjective', label: 'Subjective' },
  { id: 'objective', label: 'Objective' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'plan', label: 'Plan' },
];

/** Pill-style filter button matching the design's lavender selected state. */
function FilterPill({
  selected,
  onClick,
  children,
  ariaLabel,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        height: 28,
        px: 1.25,
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        color: selected ? 'primary.main' : 'text.secondary',
        bgcolor: (theme) =>
          selected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
        transition: (theme) =>
          theme.transitions.create(['background-color', 'color'], { duration: 150 }),
        '&:hover': {
          bgcolor: (theme) =>
            selected
              ? alpha(theme.palette.primary.main, 0.14)
              : alpha(theme.palette.text.primary, 0.04),
        },
      }}
    >
      {children}
    </Box>
  );
}

interface ScribeSectionListItemProps {
  title: string;
  body: string;
  checked: boolean;
  onToggle: () => void;
}

/**
 * Single generated section item — a checkbox-titled block with body copy.
 * The checkbox lets the provider include / exclude the item from the chart
 * submission; design renders the checked state as a filled primary-color
 * square with a white check.
 */
function ScribeSectionItem({ title, body, checked, onToggle }: ScribeSectionListItemProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Checkbox
          checked={checked}
          onChange={onToggle}
          size="small"
          inputProps={{ 'aria-label': `Include ${title} in chart submission` }}
          sx={{
            p: 0.25,
            color: (theme) => alpha(theme.palette.text.secondary, 0.4),
            '&.Mui-checked': { color: 'primary.main' },
            '& .MuiSvgIcon-root': { fontSize: 22 },
          }}
        />
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: 13,
          color: 'text.secondary',
          lineHeight: 1.55,
          // Indent body to align with the title (past the checkbox).
          pl: 4,
        }}
      >
        {body}
      </Typography>
    </Box>
  );
}

interface ScribeSectionGroupProps {
  section: MockScribeSection;
  includedItemIds: ReadonlySet<string>;
  onToggleItem: (itemId: string) => void;
}

function ScribeSectionGroup({ section, includedItemIds, onToggleItem }: ScribeSectionGroupProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        py: 1,
        '&:not(:last-of-type)': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          py: 0.5,
        }}
      >
        {section.title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {section.items.map((item) => (
          <ScribeSectionItem
            key={item.id}
            title={item.title}
            body={item.body}
            checked={includedItemIds.has(item.id)}
            onToggle={() => onToggleItem(item.id)}
          />
        ))}
      </Box>
    </Box>
  );
}

interface TranscriptViewProps {
  transcript: MockScribeTranscriptLine[];
  patientName: string;
}

/**
 * Minimal two-voice transcript: provider lines align left in the brand color,
 * patient lines align right in a neutral tone. Designed to feel like a chat
 * log so the provider can quickly skim the conversation that produced the
 * generated note.
 */
function TranscriptView({ transcript, patientName }: TranscriptViewProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, py: 1.5 }}>
      {transcript.map((line) => {
        const isProvider = line.speaker === 'provider';
        const speakerLabel = isProvider ? 'Provider' : patientName;
        return (
          <Box
            key={line.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isProvider ? 'flex-start' : 'flex-end',
              gap: 0.25,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                color: isProvider ? 'primary.main' : 'text.secondary',
              }}
            >
              {speakerLabel}
            </Typography>
            <Box
              sx={{
                maxWidth: '85%',
                px: 1.25,
                py: 0.875,
                borderRadius: '10px',
                bgcolor: (theme) =>
                  isProvider
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.text.primary, 0.04),
                color: 'text.primary',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {line.text}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export interface ScribeReviewViewProps {
  visit: MockScribeVisit;
  output: MockScribePostProcessedOutput;
  /** Provider clicked "Submit to Chart" — clear session + return to list. */
  onSubmitToChart: () => void;
  /** Provider chose "Discard" from More Actions — drop the session. */
  onDiscard: () => void;
}

/**
 * Post-processed Scribe preview surfaced after recording finishes. Two top
 * tabs (Scribe / Transcription & Context); the Scribe tab lets the provider
 * filter sections via pills and toggle individual generated items in/out of
 * the chart submission.
 */
export function ScribeReviewView({ visit, output, onSubmitToChart, onDiscard }: ScribeReviewViewProps) {
  const [topTab, setTopTab] = useState<TopTab>('scribe');
  const [filter, setFilter] = useState<SectionFilter>('all');

  // All generated items are included by default; provider can untick any
  // they don't want sent to the chart.
  const allItemIds = useMemo(
    () => output.sections.flatMap((s) => s.items.map((i) => i.id)),
    [output.sections],
  );
  const [includedItemIds, setIncludedItemIds] = useState<ReadonlySet<string>>(
    () => new Set(allItemIds),
  );

  const toggleItem = (id: string) =>
    setIncludedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const visibleSections = useMemo(
    () =>
      filter === 'all'
        ? output.sections
        : output.sections.filter((s) => s.id === filter),
    [filter, output.sections],
  );

  const [moreActionsAnchor, setMoreActionsAnchor] = useState<HTMLElement | null>(null);
  const moreActionsOpen = Boolean(moreActionsAnchor);
  const closeMoreActions = () => setMoreActionsAnchor(null);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top tabs: Scribe / Transcription & Context */}
      <Tabs
        value={topTab}
        onChange={(_, v: TopTab) => setTopTab(v)}
        variant="fullWidth"
        sx={{
          flexShrink: 0,
          minHeight: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '& .MuiTabs-indicator': { height: 2 },
          '& .MuiTab-root': {
            minHeight: 0,
            py: 1,
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 600,
          },
        }}
      >
        <Tab value="scribe" label="Scribe" />
        <Tab value="transcript" label="Transcription & Context" />
      </Tabs>

      {topTab === 'scribe' ? (
        <>
          {/* Section filter pills (with "All" hamburger reset on the left) */}
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              py: 1,
              overflowX: 'auto',
              // Hide native scrollbar so the pills look like a clean toolbar.
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            <FilterPill
              selected={filter === 'all'}
              onClick={() => setFilter('all')}
              ariaLabel="Show all sections"
            >
              <FormatListBulletedRounded sx={{ fontSize: 18 }} />
            </FilterPill>
            {SECTION_FILTERS.map((opt) => (
              <FilterPill
                key={opt.id}
                selected={filter === opt.id}
                onClick={() => setFilter(opt.id)}
              >
                {opt.label}
              </FilterPill>
            ))}
          </Box>

          {/* Sections list — soft top/bottom fade matches the rest of the
              Scribe flow (pre-visit, recording, paused). */}
          <ScribeScrollFadeArea>
            <Box sx={{ pb: 1 }}>
              {visibleSections.map((section) => (
                <ScribeSectionGroup
                  key={section.id}
                  section={section}
                  includedItemIds={includedItemIds}
                  onToggleItem={toggleItem}
                />
              ))}
            </Box>
          </ScribeScrollFadeArea>
        </>
      ) : (
        <ScribeScrollFadeArea>
          <TranscriptView transcript={output.transcript} patientName={visit.patientName} />
        </ScribeScrollFadeArea>
      )}

      {/* Footer actions — pill-style "Submit to Chart" + circular More Actions
          icon, matching the recording/paused stages so all Scribe footers
          read as the same surface. The top fade from `ScribeScrollFadeArea`
          replaces the previous hard divider. */}
      <Box
        sx={{
          width: '100%',
          flexShrink: 0,
          pt: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
        }}
      >
        <IconButton
          className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
          aria-label="More actions"
          aria-haspopup="menu"
          aria-expanded={moreActionsOpen}
          onClick={(e) => setMoreActionsAnchor(e.currentTarget)}
          sx={{
            width: 48,
            height: 48,
            minWidth: 48,
            minHeight: 48,
            flexShrink: 0,
            borderRadius: '50%',
            border: '1px solid',
            borderColor: (t) => alpha(t.palette.text.secondary, 0.4),
            color: 'text.secondary',
            '&:hover': {
              bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
            },
          }}
        >
          <MoreHorizRounded sx={{ fontSize: 20 }} />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
          startIcon={<CheckRounded />}
          onClick={onSubmitToChart}
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            height: 48,
            minHeight: 48,
            borderRadius: '999px',
          }}
        >
          Submit to Chart
        </Button>

        <Menu
          anchorEl={moreActionsAnchor}
          open={moreActionsOpen}
          onClose={closeMoreActions}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              elevation: 4,
              sx: { mt: -0.5, borderRadius: 2, minWidth: 200 },
            },
          }}
        >
          <MenuItem onClick={closeMoreActions} sx={{ fontSize: 13, gap: 1 }}>
            <EditOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
            Edit note
          </MenuItem>
          <MenuItem onClick={closeMoreActions} sx={{ fontSize: 13, gap: 1 }}>
            <ContentCopyOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
            Copy to clipboard
          </MenuItem>
          <MenuItem onClick={closeMoreActions} sx={{ fontSize: 13, gap: 1 }}>
            <RefreshRounded sx={{ fontSize: 18, color: 'text.secondary' }} />
            Re-generate
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMoreActions();
              onDiscard();
            }}
            sx={{ fontSize: 13, gap: 1, color: 'error.main' }}
          >
            <DeleteOutlineRounded sx={{ fontSize: 18 }} />
            Discard recording
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
