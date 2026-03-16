/**
 * Chip selection multi-select: label, selected items as removable chips,
 * "+ Add" button that opens a dropdown with search input and checkbox list.
 * Styled per design: label (grey → dark blue on hover/active), + Add (grey → blue hover/active),
 * chips (light grey, dark text, X to remove), dropdown (search + blue-bordered input, checkbox list).
 */

import { useState, useRef, useMemo } from 'react';
import type { SxProps, Theme } from '@mui/material';
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Popover,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
} from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { SearchIcon } from '../../icons';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { fieldRowSx, LABEL_WIDTH } from './visitNoteFieldStyles';

export interface VisitNoteChipSelectOption {
  value: string;
  label: string;
}

export interface VisitNoteChipSelectProps {
  label: string;
  options: VisitNoteChipSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  sx?: SxProps<Theme>;
}

const LABEL_DEFAULT = {
  color: 'text.secondary',
  transition: 'color 0.2s',
} as const;

const LABEL_ACTIVE = {
  color: 'primary.dark',
} as const;

const ADD_BUTTON_BASE = {
  textTransform: 'none',
  fontWeight: 500,
  fontSize: 14,
  borderRadius: 2,
  px: 1.5,
  py: 0.75,
  minHeight: 28,
  transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
} as const;

const ADD_BUTTON_DEFAULT = {
  ...ADD_BUTTON_BASE,
  color: 'text.secondary',
  bgcolor: 'grey.200',
  border: '1px solid transparent',
  '&:hover': {
    bgcolor: 'primary.light',
    borderColor: 'primary.dark',
    color: 'primary.dark',
    border: '1px solid',
  },
} as const;

const ADD_BUTTON_ACTIVE = {
  ...ADD_BUTTON_BASE,
  bgcolor: 'primary.light',
  color: 'primary.dark',
  border: '1px solid transparent',
  '&:hover': {
    bgcolor: 'primary.light',
    opacity: 0.9,
  },
} as const;

const CHIP_SX = {
  bgcolor: 'grey.200',
  color: 'grey.800',
  fontWeight: 500,
  fontSize: 13,
  '& .MuiChip-deleteIcon': {
    color: 'grey.600',
    fontSize: 18,
    '&:hover': {
      color: 'grey.800',
    },
  },
} as const;

const SEARCH_INPUT_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'background.paper',
    '& fieldset': {
      borderColor: 'grey.300',
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: 'grey.400',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      borderWidth: 2,
    },
  },
  '& .MuiInputBase-input': {
    py: 1,
    px: 1.5,
    fontSize: 14,
  },
} as const;

const LIST_ITEM_SX = {
  py: 0.5,
  '& .MuiListItemIcon-root': {
    minWidth: 36,
  },
  '& .MuiCheckbox-root': {
    p: 0.5,
    color: 'grey.400',
    '&.Mui-checked': {
      color: 'primary.main',
    },
  },
} as const;

export function VisitNoteChipSelect({
  label,
  options,
  value,
  onChange,
  placeholder: _placeholder = 'Add items',
  searchPlaceholder = 'Search...',
  disabled = false,
  errorMessage,
  sx,
}: VisitNoteChipSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);

  const selectedSet = useMemo(() => new Set(value), [value]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q),
    );
  }, [options, search]);

  const handleToggle = (optionValue: string) => {
    if (selectedSet.has(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveChip = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
      setSearch('');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearch('');
  };

  const optionByValue = useMemo(() => {
    const m = new Map<string, VisitNoteChipSelectOption>();
    options.forEach((o) => m.set(o.value, o));
    return m;
  }, [options]);

  return (
    <Box
      sx={[
        {
          ...fieldRowSx,
          alignItems: 'flex-start',
          mb: 1.5,
          '&:hover .visit-note-chip-select-label': disabled ? undefined : LABEL_ACTIVE,
        },
        ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
      ]}
    >
      <Typography
        component="label"
        className={`visit-note-field-label visit-note-chip-select-label${disabled ? ' disabled' : ''}`}
        sx={{
          width: LABEL_WIDTH,
          flexShrink: 0,
          fontWeight: 600,
          fontSize: 14,
          pt: '6px',
          lineHeight: 1.4,
          ...(open ? LABEL_ACTIVE : LABEL_DEFAULT),
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Box
          ref={anchorRef}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {value.map((v) => {
            const opt = optionByValue.get(v);
            const displayLabel = opt ? opt.label : v;
            return (
              <Chip
                key={v}
                label={displayLabel}
                onDelete={disabled ? undefined : () => handleRemoveChip(v)}
                size="small"
                sx={CHIP_SX}
              />
            );
          })}
          <Button
            size="small"
            startIcon={<AddOutlined sx={{ fontSize: 18 }} />}
            onClick={handleOpen}
            disabled={disabled}
            sx={open ? ADD_BUTTON_ACTIVE : ADD_BUTTON_DEFAULT}
          >
            Add
          </Button>
        </Box>

        <Popover
          open={open}
          onClose={handleClose}
          anchorEl={anchorRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: 4,
                minWidth: 280,
                maxWidth: 400,
                overflow: 'hidden',
              },
            },
          }}
        >
          <Box sx={{ p: 1.5 }}>
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: 'action.active' }} />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearch('')}
                      aria-label="Clear search"
                      sx={{ p: 0.25 }}
                    >
                      <CloseOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={SEARCH_INPUT_SX}
            />
            <List
              dense
              sx={{
                maxHeight: 280,
                overflow: 'auto',
                py: 0,
                mt: 0.5,
              }}
            >
              {filteredOptions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, px: 1.5 }}>
                  No options match
                </Typography>
              ) : (
                filteredOptions.map((opt) => {
                  const checked = selectedSet.has(opt.value);
                  return (
                    <ListItemButton
                      key={opt.value}
                      onClick={() => handleToggle(opt.value)}
                      sx={LIST_ITEM_SX}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={checked}
                          disableRipple
                          size="small"
                          sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={opt.label} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItemButton>
                  );
                })
              )}
            </List>
          </Box>
        </Popover>

        {errorMessage && (
          <Typography className="visit-note-error" component="span" sx={{ mt: 0.5 }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
