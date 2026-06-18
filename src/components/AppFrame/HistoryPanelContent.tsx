import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from '@mui/material';
import EventOutlined from '@mui/icons-material/EventOutlined';
import EventRepeatOutlined from '@mui/icons-material/EventRepeatOutlined';
import DrawOutlined from '@mui/icons-material/DrawOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import PersonOffOutlined from '@mui/icons-material/PersonOffOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import MedicationOutlined from '@mui/icons-material/MedicationOutlined';
import ScienceOutlined from '@mui/icons-material/ScienceOutlined';
import VaccinesOutlined from '@mui/icons-material/VaccinesOutlined';
import ChatBubbleOutlineOutlined from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import FolderOpenOutlined from '@mui/icons-material/FolderOpenOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { AppIconButton } from '../AppIconButton';
import { SearchIcon } from '../icons';
import {
  ACTIVITY_FILTER_OPTIONS,
  formatActivityTimestamp,
  getActivityFilterGroup,
  getDefaultActivityFilters,
  getPatientActivity,
  isClinicalActivity,
  isCommentActivity,
  matchesActivitySearch,
  sortPatientActivity,
  type ActivityFilterGroup,
  type PatientActivityEntry,
  type PatientActivityIconType,
} from '../../data/mockPatientActivity';

const ICON_COLUMN_WIDTH = 20;

type ActivityViewMode = 'all' | 'clinical' | 'comments';

const ACTIVITY_ICONS: Record<PatientActivityIconType, React.ComponentType<SvgIconProps>> = {
  appointment: EventOutlined,
  'appointment-rescheduled': EventRepeatOutlined,
  'visit-note': DrawOutlined,
  claim: DescriptionOutlined,
  payment: CreditCardOutlined,
  document: InsertDriveFileOutlined,
  patient: PersonOutlineOutlined,
  'patient-edited': EditOutlined,
  'patient-deleted': PersonOffOutlined,
  order: Inventory2Outlined,
  imaging: ImageOutlined,
  medication: MedicationOutlined,
  labs: ScienceOutlined,
  immunization: VaccinesOutlined,
  comment: ChatBubbleOutlineOutlined,
};

const CURRENT_USER = 'Firstname Lastname';

function ActivityIcon({ type }: { type: PatientActivityIconType }) {
  const Icon = ACTIVITY_ICONS[type];
  return <Icon sx={{ fontSize: ICON_COLUMN_WIDTH, color: 'text.secondary', display: 'block' }} />;
}

function ActivityAttachmentBox({ fileName }: { fileName: string }) {
  return (
    <Box
      sx={{
        mt: 0.75,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.75,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        minWidth: 0,
      }}
    >
      <AttachFileOutlined sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0 }} />
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: 13,
          color: 'primary.main',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {fileName}
      </Typography>
      <AppIconButton tooltip="View file" aria-label="View file">
        <VisibilityOutlined fontSize="small" />
      </AppIconButton>
      <AppIconButton tooltip="Open folder" aria-label="Open folder">
        <FolderOpenOutlined fontSize="small" />
      </AppIconButton>
    </Box>
  );
}

function ActivityNoteBox({ content }: { content: string }) {
  return (
    <Box
      sx={{
        mt: 0.75,
        px: 1.25,
        py: 0.75,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="body2" sx={{ fontSize: 13, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
        {content}
      </Typography>
    </Box>
  );
}

function ActivityTimelineEntry({
  entry,
  isLast,
}: {
  entry: PatientActivityEntry;
  isLast: boolean;
}) {
  const subtitle = entry.userName
    ? `${entry.userName} • ${formatActivityTimestamp(entry.occurredAt)}`
    : formatActivityTimestamp(entry.occurredAt);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'stretch',
        mx: -1,
        px: 1,
        py: 0.75,
        borderRadius: 1,
        transition: 'background-color 0.15s ease',
        cursor: 'default',
        '&:hover': {
          bgcolor: 'grey.50',
        },
      }}
    >
      <Box
        sx={{
          width: ICON_COLUMN_WIDTH,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flexShrink: 0, lineHeight: 0 }}>
          <ActivityIcon type={entry.icon} />
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: '1px',
              flex: 1,
              minHeight: 12,
              bgcolor: 'divider',
              mt: 0.75,
              mb: -0.25,
            }}
          />
        )}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 1.75, pt: 0.125 }}>
        <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.45, color: 'text.primary' }}>
          <Box component="span" sx={{ fontWeight: 600 }}>
            {entry.item}
          </Box>{' '}
          {entry.action}
        </Typography>
        {entry.attachment && <ActivityAttachmentBox fileName={entry.attachment.fileName} />}
        {entry.noteContent && <ActivityNoteBox content={entry.noteContent} />}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: entry.attachment || entry.noteContent ? 0.75 : 0.25, fontSize: 12 }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

function viewModeButtonSx(active: boolean) {
  return {
    textTransform: 'none' as const,
    fontWeight: 600,
    fontSize: 13,
    minWidth: 'auto',
    px: 1.25,
    py: 0.375,
    ...(active
      ? {
          bgcolor: 'action.selected',
          color: 'primary.main',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'action.selected' },
        }
      : {
          color: 'text.secondary',
          '&:hover': { bgcolor: 'background.paper' },
        }),
  };
}

export interface HistoryPanelContentProps {
  patientId: string;
}

export function HistoryPanelContent({ patientId }: HistoryPanelContentProps) {
  const baseActivity = useMemo(() => getPatientActivity(patientId), [patientId]);
  const [customNotes, setCustomNotes] = useState<PatientActivityEntry[]>([]);
  const [draftNote, setDraftNote] = useState('');
  const [viewMode, setViewMode] = useState<ActivityViewMode>('all');
  const [enabledFilters, setEnabledFilters] = useState<Set<ActivityFilterGroup>>(() =>
    getDefaultActivityFilters(),
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allEntries = useMemo(
    () => sortPatientActivity([...customNotes, ...baseActivity]),
    [baseActivity, customNotes],
  );

  const visibleFilterOptions = useMemo(() => {
    if (viewMode === 'clinical') {
      return ACTIVITY_FILTER_OPTIONS.filter((option) => option.id !== 'comments');
    }
    if (viewMode === 'comments') {
      return ACTIVITY_FILTER_OPTIONS.filter((option) => option.id === 'comments');
    }
    return ACTIVITY_FILTER_OPTIONS;
  }, [viewMode]);

  const entries = useMemo(() => {
    return allEntries.filter((entry) => {
      if (viewMode === 'clinical' && !isClinicalActivity(entry)) return false;
      if (viewMode === 'comments' && !isCommentActivity(entry)) return false;
      if (!enabledFilters.has(getActivityFilterGroup(entry))) return false;
      if (!matchesActivitySearch(entry, searchQuery)) return false;
      return true;
    });
  }, [allEntries, viewMode, enabledFilters, searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;
    const frame = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [searchOpen]);

  const handleViewModeClick = (mode: 'clinical' | 'comments') => {
    setViewMode((current) => {
      if (current === mode) {
        setEnabledFilters(getDefaultActivityFilters());
        return 'all';
      }
      if (mode === 'clinical') {
        setEnabledFilters(
          new Set(ACTIVITY_FILTER_OPTIONS.filter((option) => option.id !== 'comments').map((option) => option.id)),
        );
      } else {
        setEnabledFilters(new Set(['comments']));
      }
      return mode;
    });
  };

  const handleToggleFilter = (group: ActivityFilterGroup) => {
    setEnabledFilters((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleAddNote = () => {
    const trimmed = draftNote.trim();
    if (!trimmed) return;
    setCustomNotes((prev) => [
      {
        id: `${patientId}-note-${Date.now()}`,
        patientId,
        icon: 'comment',
        item: 'Note',
        action: 'added',
        occurredAt: new Date().toISOString(),
        userName: CURRENT_USER,
        noteContent: trimmed,
      },
      ...prev,
    ]);
    setDraftNote('');
  };

  const activeFilterCount = visibleFilterOptions.filter((option) => !enabledFilters.has(option.id)).length;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 1.5,
          py: 1,
        }}
      >
        {searchOpen ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search activity…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputRef={searchInputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              slotProps={{
                input: {
                  'aria-label': 'Search activity timeline',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 32,
                  fontSize: 13,
                  bgcolor: 'background.paper',
                },
              }}
            />
            <AppIconButton tooltip="Close search" aria-label="Close search" onClick={handleCloseSearch}>
              <CloseOutlined fontSize="small" />
            </AppIconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => handleViewModeClick('clinical')}
                sx={viewModeButtonSx(viewMode === 'clinical')}
              >
                Clinical
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => handleViewModeClick('comments')}
                sx={viewModeButtonSx(viewMode === 'comments')}
              >
                Comments
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <AppIconButton
                tooltip="Filter activity"
                aria-label="Filter activity"
                active={Boolean(filterAnchor) || activeFilterCount > 0}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
              >
                <FilterListOutlined fontSize="small" />
              </AppIconButton>
              <AppIconButton
                tooltip="Search activity"
                aria-label="Search activity"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon sx={{ fontSize: 18 }} />
              </AppIconButton>
            </Box>
          </Box>
        )}
      </Box>

      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { mt: 0.5, p: 1.5, minWidth: 220, maxWidth: 280 },
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Show activity types
        </Typography>
        <FormGroup>
          {visibleFilterOptions.map((option) => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  size="small"
                  checked={enabledFilters.has(option.id)}
                  onChange={() => handleToggleFilter(option.id)}
                />
              }
              label={option.label}
              sx={{
                mx: 0,
                '& .MuiFormControlLabel-label': { fontSize: 13 },
              }}
            />
          ))}
        </FormGroup>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, gap: 1 }}>
          <Button
            size="small"
            onClick={() => setEnabledFilters(new Set(visibleFilterOptions.map((option) => option.id)))}
            sx={{ textTransform: 'none', fontWeight: 600, minWidth: 'auto', px: 1 }}
          >
            Select all
          </Button>
          <Button
            size="small"
            onClick={() => setEnabledFilters(new Set())}
            sx={{ textTransform: 'none', fontWeight: 600, minWidth: 'auto', px: 1 }}
          >
            Clear all
          </Button>
        </Box>
      </Popover>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          px: 2,
          py: 1.5,
        }}
      >
        {entries.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {searchQuery.trim()
                ? 'No activity matches your search.'
                : viewMode === 'clinical'
                  ? 'No clinical activity to show.'
                  : viewMode === 'comments'
                    ? 'No comments yet.'
                    : 'No activity matches the current filters.'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {entries.map((entry, index) => (
              <ActivityTimelineEntry
                key={entry.id}
                entry={entry}
                isLast={index === entries.length - 1}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          bgcolor: 'background.paper',
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          size="small"
          placeholder="Add a note to the activity timeline…"
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleAddNote();
            }
          }}
          slotProps={{
            input: {
              'aria-label': 'Activity timeline note',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              fontSize: 14,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="small"
            disabled={!draftNote.trim()}
            onClick={handleAddNote}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Add note
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
