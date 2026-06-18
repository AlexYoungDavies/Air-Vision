/**
 * Visit note Orders section — reusable components for displaying and expanding orders
 * that are associated with a visit note (radiology, procedures, DME, etc.).
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Divider,
  alpha,
} from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import HealingOutlined from '@mui/icons-material/HealingOutlined';
import AccessibilityNewOutlined from '@mui/icons-material/AccessibilityNewOutlined';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlined from '@mui/icons-material/ExpandLessOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined';
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined';
import type { OrthoOrder } from '../../../data/mockOrthoNoteData';
import { baseInputSx } from './visitNoteFieldStyles';

// ─── Order icon per type ─────────────────────────────────────────────────────

function OrderIcon({ type }: { type: OrthoOrder['iconType'] }) {
  const sx = { fontSize: 16, color: 'primary.main' };
  if (type === 'radiology') return <ImageOutlined sx={sx} />;
  if (type === 'procedure') return <HealingOutlined sx={sx} />;
  return <AccessibilityNewOutlined sx={sx} />;
}

// ─── Expanded order detail form ───────────────────────────────────────────────

function OrderExpandedDetail({
  order,
  onCollapse,
}: {
  order: OrthoOrder;
  onCollapse: () => void;
}) {
  const [sendTo] = useState('Facility A');
  const [expectsResponse, setExpectsResponse] = useState(true);
  const [urgent, setUrgent] = useState(true);
  const [resultMedium, setResultMedium] = useState<string>('film');
  const [diagnosisCodes] = useState(['Osteoarthritis of the knee - M17.0', 'Morbid (Severe) Obesity - E66.01']);
  const [showAdditional, setShowAdditional] = useState(true);

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Title row — click to collapse back to list */}
      <Box
        role="button"
        tabIndex={0}
        onClick={onCollapse}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCollapse();
          }
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.25,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <OrderIcon type={order.iconType} />
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            {order.name}
          </Typography>
          <KeyboardArrowDownOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <ExpandLessOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
      </Box>

      {/* Form body */}
      <Box sx={{ px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Send To */}
        <DetailRow label="Send To">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 14 }}>{sendTo}</Typography>
            <KeyboardArrowDownOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
            1900 W Memorial, Oklahoma City, OK 73134, Ph (405) 748-6521, Fax (405) 748-3006
          </Typography>
        </DetailRow>

        <Divider sx={{ my: 1 }} />
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 1 }}>
          Optional Fields
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        {/* Send Date */}
        <DetailRow label="Send Date">
          <TextField
            size="small"
            placeholder="mm/dd/yyyy"
            sx={{
              width: 180,
              '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
              '& .MuiInputBase-input': { fontSize: 13, py: 0, px: 1.5, height: 28, boxSizing: 'border-box' },
            }}
          />
        </DetailRow>

        {/* Expects Response */}
        <DetailRow label="Expects Response">
          <Checkbox
            checked={expectsResponse}
            onChange={(e) => setExpectsResponse(e.target.checked)}
            size="small"
            sx={{ p: 0 }}
          />
        </DetailRow>

        {/* Urgent */}
        <DetailRow label="Urgent">
          <Checkbox
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
            size="small"
            sx={{ p: 0 }}
          />
        </DetailRow>

        {/* Modifiers */}
        <DetailRow label="Modifiers">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Select
              size="small"
              value="RT"
              sx={{
                height: 28,
                fontSize: 13,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                '& .MuiSelect-select': { py: 0, px: 1 },
              }}
            >
              <MenuItem value="RT">RT</MenuItem>
              <MenuItem value="LT">LT</MenuItem>
              <MenuItem value="Mod">Mod</MenuItem>
            </Select>
            <IconButton size="small" sx={{ width: 28, height: 28, border: '1px solid', borderColor: 'divider', borderRadius: '50%' }}>
              <Typography sx={{ fontSize: 14, lineHeight: 1 }}>−</Typography>
            </IconButton>
            <IconButton size="small" sx={{ width: 28, height: 28, border: '1px solid', borderColor: 'divider', borderRadius: '50%' }}>
              <Typography sx={{ fontSize: 14, lineHeight: 1 }}>+</Typography>
            </IconButton>
          </Box>
        </DetailRow>

        {/* Rule Out */}
        <DetailRow label="Rule Out">
          <TextField
            size="small"
            placeholder="Write rule out..."
            sx={{
              flex: 1,
              '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
              '& .MuiInputBase-input': { fontSize: 13, py: 0, px: 1.5, height: 28, boxSizing: 'border-box' },
            }}
          />
        </DetailRow>

        {/* Note */}
        <DetailRow label="Note">
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Button variant="outlined" size="small" startIcon={<AddOutlined sx={{ fontSize: 14 }} />} sx={{ fontSize: 12, height: 28, textTransform: 'none' }}>
              Internal Notes
            </Button>
            <Button variant="outlined" size="small" startIcon={<AddOutlined sx={{ fontSize: 14 }} />} sx={{ fontSize: 12, height: 28, textTransform: 'none' }}>
              External Notes
            </Button>
          </Box>
        </DetailRow>

        {/* Additional Fields toggle */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', my: 0.5 }}
          onClick={() => setShowAdditional((v) => !v)}
        >
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Additional Fields</Typography>
          {showAdditional ? (
            <ExpandLessOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
          ) : (
            <ExpandMoreOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
          )}
        </Box>

        <Collapse in={showAdditional}>
          {/* Result Medium */}
          <DetailRow label="Result Medium">
            <ToggleButtonGroup
              value={resultMedium}
              exclusive
              onChange={(_, v) => { if (v) setResultMedium(v); }}
              size="small"
            >
              {[
                { value: 'cd', label: 'Patient brings CD' },
                { value: 'film', label: 'Patient brings Film' },
                { value: 'mail', label: 'Imaging facility mail results' },
              ].map((opt) => (
                <ToggleButton
                  key={opt.value}
                  value={opt.value}
                  sx={{
                    fontSize: 12,
                    textTransform: 'none',
                    height: 28,
                    px: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.dark', borderColor: 'primary.main' },
                  }}
                >
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </DetailRow>

          {/* Attachments */}
          <DetailRow label="Attachments">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Select
                size="small"
                displayEmpty
                value=""
                sx={{
                  height: 28,
                  fontSize: 13,
                  width: 180,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  '& .MuiSelect-select': { py: 0, px: 1 },
                }}
              >
                <MenuItem value="">Select Attachments</MenuItem>
              </Select>
              <FormControlLabel
                control={<Checkbox size="small" sx={{ p: 0, mr: 0.5 }} />}
                label={<Typography sx={{ fontSize: 12 }}>Include chart note PDF</Typography>}
                sx={{ ml: 0 }}
              />
              <Box
                sx={{
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  bgcolor: 'grey.50',
                  cursor: 'pointer',
                }}
              >
                <CloudUploadOutlined sx={{ fontSize: 24, color: 'text.secondary' }} />
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  drop files here or{' '}
                  <Typography component="span" sx={{ fontSize: 13, color: 'primary.main', cursor: 'pointer' }}>
                    Browse Files
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </DetailRow>

          {/* Diagnosis Code */}
          <DetailRow label="Diagnosis Code">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
              {diagnosisCodes.map((code) => (
                <Chip
                  key={code}
                  label={code}
                  size="small"
                  onDelete={() => {}}
                  sx={{ fontSize: 12, height: 24 }}
                />
              ))}
              <Button size="small" startIcon={<AddOutlined sx={{ fontSize: 14 }} />} sx={{ fontSize: 12, textTransform: 'none' }}>
                Add
              </Button>
            </Box>
          </DetailRow>

          {/* Recipient(s) */}
          <DetailRow label="Recipient(s)">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Select
                size="small"
                displayEmpty
                value=""
                sx={{
                  height: 28,
                  fontSize: 13,
                  width: 180,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  '& .MuiSelect-select': { py: 0, px: 1 },
                }}
              >
                <MenuItem value="">Select Recipients</MenuItem>
              </Select>
              {[0, 1].map((i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: 13, minWidth: 120 }}>Recipient Name</Typography>
                  {(['Fax', 'Email', 'Text'] as const).map((method) => (
                    <FormControlLabel
                      key={method}
                      control={<Checkbox size="small" sx={{ p: 0, mr: 0.25 }} />}
                      label={<Typography sx={{ fontSize: 12 }}>{method}</Typography>}
                      sx={{ ml: 0 }}
                    />
                  ))}
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </DetailRow>
        </Collapse>
      </Box>
    </Box>
  );
}

/** Label-value row inside expanded order detail */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 1,
        minHeight: 28,
      }}
    >
      <Typography
        sx={{
          width: 160,
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 600,
          color: 'primary.dark',
          pt: '5px',
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pt: '4px' }}>
        {children}
      </Box>
    </Box>
  );
}

// ─── Single collapsed order item ──────────────────────────────────────────────

function OrderItem({
  order,
  onRemove,
  readOnly,
}: {
  order: OrthoOrder;
  onRemove: (id: string) => void;
  readOnly?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  if (expanded && !readOnly) {
    return (
      <Box>
        <OrderExpandedDetail order={order} onCollapse={() => setExpanded(false)} />
      </Box>
    );
  }

  const openOrder = () => {
    if (readOnly) return;
    setExpanded(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 0.5,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          pr: 0.5,
        }}
      >
        <Box
          role={readOnly ? undefined : 'button'}
          tabIndex={readOnly ? undefined : 0}
          aria-label={readOnly ? undefined : `Open ${order.name}`}
          onClick={readOnly ? undefined : openOrder}
          onKeyDown={
            readOnly
              ? undefined
              : (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openOrder();
                  }
                }
          }
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            cursor: readOnly ? 'default' : 'pointer',
            py: 1,
            pl: 1,
            pr: 0.5,
            transition: (theme) => theme.transitions.create(['background-color'], { duration: theme.transitions.duration.shortest }),
            ...(readOnly ? {} : { '&:hover': { bgcolor: 'action.hover' } }),
          }}
        >
          <Box sx={{ pt: '2px', flexShrink: 0 }}>
            <OrderIcon type={order.iconType} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                {order.name}
              </Typography>
              {!readOnly && (
                <KeyboardArrowDownOutlined sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
              )}
            </Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.125 }}>
              Created on {order.createdAt}{' '}
              <Box component="span" sx={{ mx: 0.25 }}>|</Box>
              {order.recipientName}
            </Typography>
          </Box>
        </Box>
        {readOnly ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, mt: '4px', mr: '2px' }}>
            <Chip
              icon={<CheckOutlined sx={{ fontSize: 14 }} />}
              label="Submitted"
              size="small"
              sx={{
                height: 24,
                fontSize: 12,
                fontWeight: 500,
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                color: 'success.dark',
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.success.main, 0.24),
                '& .MuiChip-icon': { color: 'success.dark', ml: '6px', mr: '-4px' },
                '& .MuiChip-label': { px: 1 },
              }}
            />
            <IconButton size="small" aria-label="Open PDF" sx={{ flexShrink: 0 }}>
              <PictureAsPdfOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            size="small"
            aria-label="Remove order"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(order.id);
            }}
            sx={{
              flexShrink: 0,
              mt: '6px',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <CloseOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

// ─── Public section component ─────────────────────────────────────────────────

export interface VisitNoteOrdersSectionProps {
  orders: OrthoOrder[];
  onOrdersChange: (orders: OrthoOrder[]) => void;
  /** Render the section without action buttons and with each order as a non-interactive submitted entry. */
  readOnly?: boolean;
}

export function VisitNoteOrdersSection({ orders, onOrdersChange, readOnly }: VisitNoteOrdersSectionProps) {
  const handleRemove = (id: string) => {
    onOrdersChange(orders.filter((o) => o.id !== id));
  };

  return (
    <Box>
      {/* Section header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: readOnly ? 16 : 20 }}
        >
          Orders
        </Typography>
        {!readOnly && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none', fontSize: 13, height: 28 }}
            >
              Submit All
            </Button>
            <IconButton size="small">
              <ContentCopyOutlined sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small">
              <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
            </IconButton>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddOutlined sx={{ fontSize: 14 }} />}
              sx={{ textTransform: 'none', fontSize: 13, height: 28 }}
            >
              Add Order
            </Button>
            <IconButton size="small">
              <MoreHorizOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Order list */}
      {orders.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: 'text.secondary', py: 1 }}>
          No orders added.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} onRemove={handleRemove} readOnly={readOnly} />
          ))}
        </Box>
      )}
    </Box>
  );
}
