/**
 * Visit note Services section — CPT/ICD billing rows grouped by category.
 * Layout: CPT+Mod | Description | (ICD + Units) stacked | Actions
 */

import {
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import CommentOutlined from '@mui/icons-material/CommentOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import SyncAltOutlined from '@mui/icons-material/SyncAltOutlined';
import type { OrthoServiceCategory, OrthoServiceRow } from '../../../data/mockOrthoNoteData';
import { baseInputSx } from './visitNoteFieldStyles';

// ─── Column widths (shared between header + rows for perfect alignment) ────────

const COL_CPT_W = 80;   // CPT code select
const COL_MOD_W = 60;   // Modifier select
const COL_ICD_W = 96;   // ICD-10 select
const COL_UNITS_W = 64; // Units input
const COL_ACTIONS_W = 56; // comment + delete icons

// ─── Input styles using visit-note base with always-on grey background ─────────

const NOTE_SELECT_SX = {
  ...baseInputSx,
  backgroundColor: 'action.hover',
  '&:hover': {
    backgroundColor: 'action.selected',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  },
} as const;

const cptSelectSx = {
  ...NOTE_SELECT_SX,
  width: COL_CPT_W,
  '& .MuiSelect-select': {
    py: 0,
    px: 1,
    pr: '20px !important',
    fontSize: 13,
    fontWeight: 500,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
} as const;

const modSelectSx = {
  ...NOTE_SELECT_SX,
  width: COL_MOD_W,
  '& .MuiSelect-select': {
    py: 0,
    px: 1,
    pr: '20px !important',
    fontSize: 13,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
} as const;

const icdSelectSx = {
  ...NOTE_SELECT_SX,
  width: COL_ICD_W,
  '& .MuiSelect-select': {
    py: 0,
    px: 1,
    pr: '20px !important',
    fontSize: 13,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
} as const;

const unitInputSx = {
  width: COL_UNITS_W,
  '& .MuiInputBase-root': {
    ...baseInputSx,
    backgroundColor: 'action.hover',
    height: 28,
    '&:hover': {
      backgroundColor: 'action.selected',
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    },
  },
  '& .MuiInputBase-input': {
    py: 0,
    px: 1.5,
    fontSize: 13,
    height: 28,
    boxSizing: 'border-box' as const,
  },
} as const;

// ─── ICD+Units pairs — stacked vertically ────────────────────────────────────

function IcdUnitsPairs({
  icdCodes,
  units,
  onIcdChange,
  onUnitsChange,
}: {
  icdCodes: string[];
  units: string;
  onIcdChange: (codes: string[]) => void;
  onUnitsChange: (value: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {icdCodes.map((code, idx) => (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* ICD select */}
          <Select
            size="small"
            value={code}
            onChange={(e) => {
              const next = [...icdCodes];
              next[idx] = String(e.target.value);
              onIcdChange(next);
            }}
            sx={icdSelectSx}
          >
            <MenuItem value={code}>{code}</MenuItem>
          </Select>

          {/* Remove ICD */}
          <IconButton
            size="small"
            onClick={() => onIcdChange(icdCodes.filter((_, i) => i !== idx))}
            sx={{ width: 20, height: 20, border: '1px solid', borderColor: 'divider', borderRadius: '50%', p: 0 }}
          >
            <Typography sx={{ fontSize: 13, lineHeight: 1, userSelect: 'none' }}>−</Typography>
          </IconButton>

          {/* Add ICD */}
          <IconButton
            size="small"
            onClick={() => onIcdChange([...icdCodes, ''])}
            sx={{ width: 20, height: 20, border: '1px solid', borderColor: 'divider', borderRadius: '50%', p: 0 }}
          >
            <Typography sx={{ fontSize: 13, lineHeight: 1, userSelect: 'none' }}>+</Typography>
          </IconButton>

          {/* Units — shown alongside each ICD row; only first row has the input, rest share */}
          {idx === 0 && (
            <TextField
              size="small"
              placeholder="Units"
              value={units}
              onChange={(e) => onUnitsChange(e.target.value)}
              sx={unitInputSx}
            />
          )}
          {idx > 0 && <Box sx={{ width: COL_UNITS_W }} />}
        </Box>
      ))}

      {icdCodes.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: COL_ICD_W }} />
          <IconButton
            size="small"
            onClick={() => onIcdChange([''])}
            sx={{ width: 20, height: 20, border: '1px solid', borderColor: 'divider', borderRadius: '50%', p: 0 }}
          >
            <Typography sx={{ fontSize: 13, lineHeight: 1, userSelect: 'none' }}>+</Typography>
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

// ─── Single service row ───────────────────────────────────────────────────────

function ServiceRow({
  row,
  onChange,
  onDelete,
}: {
  row: OrthoServiceRow;
  onChange: (updated: OrthoServiceRow) => void;
  onDelete: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        py: 0.75,
      }}
    >
      {/* CPT + Modifier */}
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, pt: '1px' }}>
        <Select size="small" value={row.cptCode} sx={cptSelectSx}>
          <MenuItem value={row.cptCode}>{row.cptCode}</MenuItem>
        </Select>
        <Select size="small" value={row.modifier} sx={modSelectSx}>
          <MenuItem value={row.modifier}>{row.modifier}</MenuItem>
        </Select>
      </Box>

      {/* Description */}
      <Typography
        sx={{
          flex: 1,
          fontSize: 13,
          color: 'text.primary',
          lineHeight: '28px',
          pt: '1px',
          minWidth: 0,
        }}
      >
        {row.description}
      </Typography>

      {/* ICD + Units — stacked */}
      <Box sx={{ flexShrink: 0, pt: '1px' }}>
        <IcdUnitsPairs
          icdCodes={row.icdCodes}
          units={row.units}
          onIcdChange={(codes) => onChange({ ...row, icdCodes: codes })}
          onUnitsChange={(units) => onChange({ ...row, units })}
        />
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: COL_ACTIONS_W, pt: '1px' }}>
        <IconButton size="small" aria-label="Comment">
          <CommentOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
        </IconButton>
        <IconButton size="small" aria-label="Delete" onClick={onDelete}>
          <DeleteOutlineOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
        </IconButton>
      </Box>
    </Box>
  );
}

// ─── Service category block with aligned header row ───────────────────────────

function ServiceCategoryBlock({
  category,
  onChange,
}: {
  category: OrthoServiceCategory;
  onChange: (updated: OrthoServiceCategory) => void;
}) {
  const handleRowChange = (idx: number, updated: OrthoServiceRow) => {
    const rows = [...category.rows];
    rows[idx] = updated;
    onChange({ ...category, rows });
  };

  const handleRowDelete = (idx: number) => {
    onChange({ ...category, rows: category.rows.filter((_, i) => i !== idx) });
  };

  return (
    <Box sx={{ py: 0.5 }}>
      {/* Category header row — columns align with service rows */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Category label spans CPT+Mod+Description columns */}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: 'text.primary',
            flex: 1,
          }}
        >
          {category.label}
        </Typography>

        {/* ICD-10 header — aligns with ICD selects */}
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: 'text.secondary',
            width: COL_ICD_W + 20 + 20 + 8 + 8 + COL_UNITS_W, // ICD + buttons + units
            flexShrink: 0,
          }}
        >
          ICD-10
        </Typography>

        {/* Actions spacer */}
        <Box sx={{ width: COL_ACTIONS_W, flexShrink: 0 }} />
      </Box>

      {/* Service rows */}
      {category.rows.map((row, idx) => (
        <ServiceRow
          key={row.id}
          row={row}
          onChange={(updated) => handleRowChange(idx, updated)}
          onDelete={() => handleRowDelete(idx)}
        />
      ))}
    </Box>
  );
}

// ─── Public section component ─────────────────────────────────────────────────

export interface VisitNoteServicesSectionProps {
  categories: OrthoServiceCategory[];
  onCategoriesChange: (categories: OrthoServiceCategory[]) => void;
}

export function VisitNoteServicesSection({
  categories,
  onCategoriesChange,
}: VisitNoteServicesSectionProps) {
  const handleCategoryChange = (idx: number, updated: OrthoServiceCategory) => {
    const next = [...categories];
    next[idx] = updated;
    onCategoriesChange(next);
  };

  return (
    <Box>
      {/* Section header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 2,
          mb: 1.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 20 }}>
          Services
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Button variant="outlined" size="small" sx={{ textTransform: 'none', fontSize: 13, height: 28 }}>
            Clear All
          </Button>
          <IconButton size="small">
            <ContentCopyOutlined sx={{ fontSize: 16 }} />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SyncAltOutlined sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', fontSize: 13, height: 28 }}
          >
            Apply all ICD to all Services
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddOutlined sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', fontSize: 13, height: 28 }}
          >
            Add Service
          </Button>
        </Box>
      </Box>

      {/* Category blocks */}
      <Box
        sx={{
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {categories.map((cat, categoryIndex) => (
          <Box key={cat.id} sx={{ px: 0 }}>
            <ServiceCategoryBlock
              category={cat}
              onChange={(updated) => handleCategoryChange(categoryIndex, updated)}
            />
          </Box>
        ))}
        {categories.length === 0 && (
          <Typography sx={{ fontSize: 13, color: 'text.secondary', p: 2 }}>
            No services added.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
