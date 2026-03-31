import { useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
} from '@mui/material';
import { SearchIcon } from '../icons';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import MedicationOutlined from '@mui/icons-material/MedicationOutlined';
import { MOCK_PATIENTS } from '../../data/mockPatients';
import { SEARCHABLE_NOTES, SEARCHABLE_TASKS, SEARCHABLE_MEDICATIONS } from '../../data/mockSearchData';

export interface SpotlightSearchProps {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
}

type ResultType = 'patient' | 'note' | 'task' | 'medication';

interface SearchResult {
  type: ResultType;
  id: string;
  title: string;
  subtitle?: string;
  path: string;
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function matchQuery(text: string, q: string): boolean {
  if (!q) return false;
  return normalize(text).includes(normalize(q));
}

export function SpotlightSearch({ open, onClose, query, onQueryChange }: SpotlightSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const backdropColor = (theme.palette.background as { backdrop?: string }).backdrop ?? 'rgba(0,0,0,0.4)';

  useEffect(() => {
    if (open) {
      onQueryChange('');
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open, onQueryChange]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const results = useMemo((): SearchResult[] => {
    const q = query.trim();
    if (!q) return [];

    const out: SearchResult[] = [];

    MOCK_PATIENTS.forEach((p) => {
      if (matchQuery(p.fullName, q) || matchQuery(p.case ?? '', q) || matchQuery(p.mrn, q)) {
        out.push({
          type: 'patient',
          id: p.id,
          title: p.fullName,
          subtitle: p.case ?? p.reasonForVisit,
          path: `/patients/${p.id}`,
        });
      }
    });

    SEARCHABLE_NOTES.forEach((n) => {
      if (matchQuery(n.patient, q) || matchQuery(n.template, q) || matchQuery(n.date, q)) {
        out.push({
          type: 'note',
          id: n.id,
          title: `${n.patient} · ${n.template}`,
          subtitle: n.date,
          path: '/',
        });
      }
    });

    SEARCHABLE_TASKS.forEach((t) => {
      if (matchQuery(t.title, q) || matchQuery(t.due, q)) {
        out.push({
          type: 'task',
          id: t.id,
          title: t.title,
          subtitle: t.due,
          path: '/',
        });
      }
    });

    SEARCHABLE_MEDICATIONS.forEach((m) => {
      if (matchQuery(m.name, q) || matchQuery(m.dose, q) || matchQuery(m.frequency, q)) {
        out.push({
          type: 'medication',
          id: m.id,
          title: m.name,
          subtitle: `${m.dose} · ${m.frequency}`,
          path: '/patients',
        });
      }
    });

    return out.slice(0, 20);
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!open) return null;

  const IconForType = (type: ResultType) => {
    switch (type) {
      case 'patient':
        return PersonOutlined;
      case 'note':
        return DescriptionOutlined;
      case 'task':
        return TaskAltOutlined;
      case 'medication':
        return MedicationOutlined;
    }
  };

  return (
    <Box
      role="presentation"
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        bgcolor: backdropColor,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: '15vh',
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%',
          maxWidth: 560,
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '70vh',
        }}
      >
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            placeholder="Search pages and patients..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            variant="outlined"
            size="small"
            hiddenLabel
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                fontSize: 15,
                borderWidth: 2,
                borderColor: 'primary.main',
                '& fieldset': { borderWidth: 2, borderColor: 'primary.main' },
                '&:hover fieldset': { borderColor: 'primary.dark' },
              },
            }}
            slotProps={{
              input: {
                sx: { py: 1.25 },
              },
            }}
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 1.5, display: 'flex', color: 'text.secondary' }}>
                  <SearchIcon sx={{ fontSize: 22 }} />
                </Box>
              ),
              endAdornment: (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  ⌘K to search
                </Typography>
              ),
            }}
          />
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {!query.trim() ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Type to search patients, visit notes, tasks, and medications.
              </Typography>
            </Box>
          ) : results.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No results found
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding sx={{ py: 0.5 }}>
              {results.map((r) => {
                const Icon = IconForType(r.type);
                return (
                  <ListItemButton
                    key={`${r.type}-${r.id}`}
                    onClick={() => handleSelect(r.path)}
                    sx={{ py: 1, borderRadius: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={r.title}
                      secondary={r.subtitle}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
