import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddOutlined from '@mui/icons-material/AddOutlined';
import ArrowDownwardOutlined from '@mui/icons-material/ArrowDownwardOutlined';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined';
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import PersonAddAlt1Outlined from '@mui/icons-material/PersonAddAlt1Outlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import { AppIconButton } from '../AppIconButton';
import {
  ALL_CLAIMS_TOTAL,
  MOCK_CLAIM_ROWS,
  type ClaimRow,
  type ClaimStatusVariant,
} from '../../data/mockClaims';

const HEADER_CONTROL_HEIGHT = 28;

const TOOLBAR_TEXT_BUTTON_SX = {
  textTransform: 'none' as const,
  fontWeight: 500,
  borderRadius: '8px',
  minHeight: HEADER_CONTROL_HEIGHT,
};

const TABLE_HEADER_SX = {
  fontWeight: 600,
  fontSize: 13,
  bgcolor: 'background.paper',
  color: 'text.secondary',
  borderBottom: 1,
  borderColor: 'divider',
  py: 1,
  whiteSpace: 'nowrap' as const,
};

const TABLE_CELL_SX = {
  fontSize: 13,
  borderBottom: 1,
  borderColor: 'divider',
  py: 1,
  verticalAlign: 'middle' as const,
};

const STATUS_META: Record<
  ClaimStatusVariant,
  { label: string; icon: ReactElement; iconColor: string; borderColor: string }
> = {
  self_pay_unpaid: {
    label: 'Self Pay: Patient Unpaid',
    icon: <AttachMoneyOutlined sx={{ fontSize: 16 }} />,
    iconColor: 'text.secondary',
    borderColor: 'divider',
  },
  initial_review: {
    label: 'Initial Review Required',
    icon: <WarningAmberOutlined sx={{ fontSize: 16 }} />,
    iconColor: 'warning.main',
    borderColor: 'warning.light',
  },
  submission_error: {
    label: 'Submission Error',
    icon: <ErrorOutlineOutlined sx={{ fontSize: 16 }} />,
    iconColor: 'error.main',
    borderColor: 'error.light',
  },
  submission_pending: {
    label: 'Submission Pending',
    icon: <AutorenewOutlined sx={{ fontSize: 16 }} />,
    iconColor: 'text.secondary',
    borderColor: 'divider',
  },
};

function StatusBadge({ variant }: { variant: ClaimStatusVariant }) {
  const meta = STATUS_META[variant];
  return (
    <Chip
      size="small"
      variant="outlined"
      icon={meta.icon}
      label={meta.label}
      sx={{
        height: 26,
        fontWeight: 500,
        fontSize: 12,
        borderColor: meta.borderColor,
        bgcolor: 'background.paper',
        '& .MuiChip-label': { px: 0.75 },
        '& .MuiChip-icon': { ml: 0.5, mr: -0.25, color: meta.iconColor },
      }}
    />
  );
}

function StageCell({ label, pct }: { label: string; pct: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={24}
          thickness={5}
          sx={{
            color: 'action.hover',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
        <CircularProgress
          variant="determinate"
          value={pct}
          size={24}
          thickness={5}
          sx={{
            color: 'primary.main',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

function AssigneeCell({ assignees }: { assignees: ClaimRow['assignees'] }) {
  if (assignees.kind === 'invite') {
    return (
      <Box
        component="button"
        type="button"
        aria-label="Add assignee"
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: 'none',
          p: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.selected' },
        }}
      >
        <PersonAddAlt1Outlined sx={{ fontSize: 18 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {assignees.items.map((a, i) => (
        <Avatar
          key={`${a.initials}-${i}`}
          sx={{
            width: 28,
            height: 28,
            fontSize: 11,
            fontWeight: 600,
            bgcolor: a.bgcolor,
            color: a.color ?? 'common.white',
          }}
        >
          {a.initials}
        </Avatar>
      ))}
      {assignees.overflow != null && assignees.overflow > 0 && (
        <Avatar
          sx={{
            width: 28,
            height: 28,
            fontSize: 11,
            fontWeight: 700,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
          }}
        >
          +{assignees.overflow}
        </Avatar>
      )}
    </Box>
  );
}

export function ClaimsPage() {
  const [claimsScope, setClaimsScope] = useState<'all' | 'mine'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedIds(new Set());
  }, [claimsScope]);

  const rows = useMemo(
    () =>
      claimsScope === 'all'
        ? MOCK_CLAIM_ROWS
        : MOCK_CLAIM_ROWS.filter((r) => r.assignees.kind === 'stack'),
    [claimsScope]
  );

  const allSelected = rows.length > 0 && selectedIds.size === rows.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(rows.map((r) => r.id)));
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Title row: scope tabs + global actions */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          py: 1.5,
          px: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'stretch', gap: 0.5 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => setClaimsScope('all')}
            sx={{
              ...TOOLBAR_TEXT_BUTTON_SX,
              px: 1.5,
              py: 0.75,
              ...(claimsScope === 'all'
                ? { bgcolor: 'primary.light', color: 'primary.main' }
                : { color: 'text.secondary' }),
            }}
          >
            All Claims ({ALL_CLAIMS_TOTAL})
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => setClaimsScope('mine')}
            sx={{
              ...TOOLBAR_TEXT_BUTTON_SX,
              px: 1.5,
              py: 0.75,
              ...(claimsScope === 'mine'
                ? { bgcolor: 'primary.light', color: 'primary.main' }
                : { color: 'text.secondary' }),
            }}
          >
            My Claims
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AppIconButton tooltip="History" aria-label="History">
            <HistoryOutlined fontSize="small" />
          </AppIconButton>
          <AppIconButton tooltip="Download" aria-label="Download">
            <DownloadOutlined fontSize="small" />
          </AppIconButton>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddOutlined sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              boxShadow: 'none',
              ml: 0.5,
              minHeight: HEADER_CONTROL_HEIGHT,
              height: HEADER_CONTROL_HEIGHT,
              py: 0,
              px: 1.5,
            }}
          >
            Create Claim
          </Button>
        </Box>
      </Box>

      {/* Toolbar: filters + table chrome */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: 'wrap',
          py: 1.25,
          px: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterListOutlined fontSize="small" />}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            minHeight: HEADER_CONTROL_HEIGHT,
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          Filter
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TuneOutlined fontSize="small" />}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '8px',
              minHeight: HEADER_CONTROL_HEIGHT,
              borderColor: 'divider',
              color: 'text.primary',
            }}
          >
            Display
          </Button>
          <Button variant="text" color="primary" size="small" sx={{ ...TOOLBAR_TEXT_BUTTON_SX, px: 1.25 }}>
            Clear
          </Button>
          <Button variant="text" size="small" disabled sx={{ ...TOOLBAR_TEXT_BUTTON_SX, px: 1.25 }}>
            Save
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: 0, boxShadow: 'none' }}
      >
        <Table size="small" stickyHeader sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ ...TABLE_HEADER_SX, width: 48 }}>
                <Checkbox
                  size="small"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  inputProps={{ 'aria-label': 'Select all claims' }}
                />
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Claim ID</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Status</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Stage</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Patient</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Provider</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  Date of Service
                  <ArrowDownwardOutlined sx={{ fontSize: 16, color: 'text.primary' }} />
                </Box>
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Assignees</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover selected={selectedIds.has(row.id)}>
                <TableCell padding="checkbox" sx={TABLE_CELL_SX}>
                  <Checkbox
                    size="small"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                    inputProps={{ 'aria-label': `Select claim ${row.claimNumericId}` }}
                  />
                </TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, fontWeight: 500 }}>{row.claimNumericId}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>
                  <StatusBadge variant={row.status} />
                </TableCell>
                <TableCell sx={TABLE_CELL_SX}>
                  <StageCell label={row.stageLabel} pct={row.stageRingPct} />
                </TableCell>
                <TableCell sx={TABLE_CELL_SX}>
                  {row.patientId ? (
                    <Link
                      component={RouterLink}
                      to={`/patients/${row.patientId}`}
                      underline="hover"
                      sx={{ fontWeight: 500, fontSize: 13, color: 'primary.main' }}
                    >
                      {row.patientName}
                    </Link>
                  ) : (
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
                      {row.patientName}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.provider}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.dateOfService}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>
                  <AssigneeCell assignees={row.assignees} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
