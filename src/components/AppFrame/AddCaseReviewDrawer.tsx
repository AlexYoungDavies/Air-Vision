import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Button,
  Autocomplete,
  TextField,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
} from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import FormatBoldOutlined from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlined from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlined from '@mui/icons-material/FormatUnderlinedOutlined';
import StrikethroughSOutlined from '@mui/icons-material/StrikethroughSOutlined';
import FormatListBulletedOutlined from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlined from '@mui/icons-material/FormatListNumberedOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import RemoveOutlined from '@mui/icons-material/RemoveOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import type { Patient } from '../../data/mockPatients';
import {
  getAppointmentsForPatient,
  type Appointment,
} from '../../data/mockAppointments';
import { getAttachmentsForPatient, type Attachment } from '../../data/mockAttachments';

const DRAWER_WIDTH = 700;
const RICH_TEXT_MIN_HEIGHT = 280;

const BILLABLE_FIELD_HEIGHT = 28;
const BILLABLE_FIELD_BG = 'rgba(0, 0, 0, 0.05)';
const BILLABLE_FIELD_RADIUS = '8px';

const billableOutlinedInputSx = {
  height: BILLABLE_FIELD_HEIGHT,
  minHeight: BILLABLE_FIELD_HEIGHT,
  borderRadius: BILLABLE_FIELD_RADIUS,
  bgcolor: BILLABLE_FIELD_BG,
  fontSize: 13,
  '& fieldset': { border: 'none' },
  '&:hover fieldset': { border: 'none' },
  '&.Mui-focused fieldset': { border: 'none' },
  '& .MuiInputBase-input': {
    py: 0,
    px: 1.25,
    height: `${BILLABLE_FIELD_HEIGHT}px`,
    boxSizing: 'border-box',
  },
  '& .MuiAutocomplete-input': {
    py: '0 !important',
  },
  '& .MuiAutocomplete-endAdornment': {
    top: '50%',
    transform: 'translateY(-50%)',
    right: 4,
  },
  '& .MuiAutocomplete-endAdornment .MuiIconButton-root': {
    width: 22,
    height: 22,
    p: 0,
  },
  '& .MuiSelect-select': {
    py: 0,
    pl: 1.25,
    pr: '28px !important',
    minHeight: `${BILLABLE_FIELD_HEIGHT}px !important`,
    height: `${BILLABLE_FIELD_HEIGHT}px`,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  '& .MuiSelect-icon': {
    fontSize: 18,
    color: 'text.secondary',
    right: 6,
  },
};

const billableTextFieldSx = {
  '& .MuiOutlinedInput-root': billableOutlinedInputSx,
};

interface CodeOption {
  value: string;
  label: string;
}

interface BillableCptOption {
  value: string;
  label: string;
  description: string;
}

interface CaseOption {
  id: string;
  name: string;
}

interface VisitOption {
  id: string;
  caseId: string;
  label: string;
  sublabel: string;
}

interface AttachmentOption {
  id: string;
  name: string;
}

interface BillableServiceRow {
  id: string;
  cptCode: BillableCptOption | null;
  modifier: string;
  icdAssociations: (CodeOption | null)[];
  units: number;
}

const ICD10_CODE_OPTIONS: CodeOption[] = [
  { value: 'M25.56', label: 'M25.56 - code description here' },
  { value: 'M29.11', label: 'M29.11 - code description here' },
  { value: 'M54.5', label: 'M54.5 - Low back pain' },
  { value: 'M25.561', label: 'M25.561 - Pain in right knee' },
  { value: 'M25.562', label: 'M25.562 - Pain in left knee' },
  { value: 'M75.100', label: 'M75.100 - Rotator cuff tear, unspecified shoulder' },
  { value: 'M23.205', label: 'M23.205 - Derangement of meniscus, unspecified knee' },
  { value: 'S83.511A', label: 'S83.511A - Sprain of ACL, right knee, initial encounter' },
  { value: 'S83.512A', label: 'S83.512A - Sprain of ACL, left knee, initial encounter' },
  { value: 'M17.11', label: 'M17.11 - Unilateral primary osteoarthritis, right knee' },
  { value: 'M17.12', label: 'M17.12 - Unilateral primary osteoarthritis, left knee' },
  { value: 'M77.10', label: 'M77.10 - Lateral epicondylitis, unspecified elbow' },
  { value: 'G56.00', label: 'G56.00 - Carpal tunnel syndrome, unspecified upper limb' },
  { value: 'M51.36', label: 'M51.36 - Other intervertebral disc degeneration, lumbar region' },
  { value: 'M62.838', label: 'M62.838 - Other muscle spasm' },
  { value: 'R52', label: 'R52 - Pain, unspecified' },
  { value: 'I10', label: 'I10 - Essential (primary) hypertension' },
  { value: 'E11.9', label: 'E11.9 - Type 2 diabetes mellitus without complications' },
  { value: 'J45.909', label: 'J45.909 - Unspecified asthma, uncomplicated' },
];

const BILLABLE_CPT_OPTIONS: BillableCptOption[] = [
  { value: '91667', label: '91667', description: 'Imaging documentation review' },
  { value: '99203', label: '99203', description: 'General remote diagnosis analysis' },
  { value: '97110', label: '97110', description: 'Therapeutic exercise' },
  { value: '97112', label: '97112', description: 'Neuromuscular re-education' },
  { value: '97140', label: '97140', description: 'Manual therapy' },
  { value: '97116', label: '97116', description: 'Gait training' },
  { value: '97530', label: '97530', description: 'Therapeutic activities' },
  { value: '97161', label: '97161', description: 'PT evaluation low complexity' },
  { value: '97162', label: '97162', description: 'PT evaluation moderate complexity' },
  { value: '97163', label: '97163', description: 'PT evaluation high complexity' },
];

const MODIFIER_OPTIONS = ['', '25', '59', '76', '77', 'LT', 'RT'];

function createServiceRow(): BillableServiceRow {
  return {
    id: `svc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    cptCode: null,
    modifier: '',
    icdAssociations: [null],
    units: 1,
  };
}

export interface AddCaseReviewDrawerProps {
  open: boolean;
  patient: Patient;
  onClose: () => void;
  onSubmit?: (review: {
    caseId: string | null;
    visitId: string | null;
    contentHtml: string;
    icd10Codes: string[];
    attachmentIds: string[];
    isBillable: boolean;
    billableServices: Array<{
      cptCode: string;
      modifier: string | null;
      icd10Codes: string[];
      units: number;
    }>;
  }) => void;
}

export function AddCaseReviewDrawer({
  open,
  patient,
  onClose,
  onSubmit,
}: AddCaseReviewDrawerProps) {
  const appointments = useMemo<Appointment[]>(
    () => getAppointmentsForPatient(patient.id),
    [patient.id],
  );

  const attachmentOptions = useMemo<AttachmentOption[]>(
    () =>
      getAttachmentsForPatient(patient.id).map((attachment: Attachment) => ({
        id: attachment.id,
        name: attachment.name,
      })),
    [patient.id],
  );

  const caseOptions = useMemo<CaseOption[]>(() => {
    const seen = new Set<string>();
    const out: CaseOption[] = [];
    for (const a of appointments) {
      if (seen.has(a.caseId)) continue;
      seen.add(a.caseId);
      out.push({ id: a.caseId, name: a.caseName });
    }
    return out;
  }, [appointments]);

  const [selectedCase, setSelectedCase] = useState<CaseOption | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<VisitOption | null>(null);
  const [contentHtml, setContentHtml] = useState<string>('');
  const [icd10Codes, setIcd10Codes] = useState<CodeOption[]>([]);
  const [attachments, setAttachments] = useState<AttachmentOption[]>([]);
  const [isBillable, setIsBillable] = useState(false);
  const [billableServices, setBillableServices] = useState<BillableServiceRow[]>([]);

  const visitOptions = useMemo<VisitOption[]>(() => {
    const list = selectedCase
      ? appointments.filter((a) => a.caseId === selectedCase.id)
      : appointments;
    return list.map((a) => ({
      id: a.id,
      caseId: a.caseId,
      label: `${a.date} · ${a.time}`,
      sublabel: `${a.clinicalStage} — ${a.provider}`,
    }));
  }, [appointments, selectedCase]);

  const serviceIcdOptions = useMemo(
    () => (icd10Codes.length > 0 ? icd10Codes : ICD10_CODE_OPTIONS),
    [icd10Codes],
  );

  useEffect(() => {
    if (!selectedVisit) return;
    if (selectedCase && selectedVisit.caseId !== selectedCase.id) {
      setSelectedVisit(null);
    }
  }, [selectedCase, selectedVisit]);

  useEffect(() => {
    if (isBillable && billableServices.length === 0) {
      setBillableServices([createServiceRow()]);
    }
    if (!isBillable) {
      setBillableServices([]);
    }
  }, [isBillable, billableServices.length]);

  const resetForm = () => {
    setSelectedCase(null);
    setSelectedVisit(null);
    setContentHtml('');
    setIcd10Codes([]);
    setAttachments([]);
    setIsBillable(false);
    setBillableServices([]);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (open) return;
    const t = setTimeout(resetForm, 250);
    return () => clearTimeout(t);
  }, [open]);

  const handleSubmit = () => {
    onSubmit?.({
      caseId: selectedCase?.id ?? null,
      visitId: selectedVisit?.id ?? null,
      contentHtml,
      icd10Codes: icd10Codes.map((c) => c.value),
      attachmentIds: attachments.map((a) => a.id),
      isBillable,
      billableServices: billableServices
        .filter((row) => row.cptCode)
        .map((row) => ({
          cptCode: row.cptCode!.value,
          modifier: row.modifier || null,
          icd10Codes: row.icdAssociations.filter(Boolean).map((icd) => icd!.value),
          units: row.units,
        })),
    });
    handleClose();
  };

  const updateServiceRow = (id: string, patch: Partial<BillableServiceRow>) => {
    setBillableServices((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addServiceRow = () => {
    setBillableServices((prev) => [...prev, createServiceRow()]);
  };

  const removeServiceRow = (id: string) => {
    setBillableServices((prev) => prev.filter((row) => row.id !== id));
  };

  const addIcdAssociation = (serviceId: string) => {
    setBillableServices((prev) =>
      prev.map((row) =>
        row.id === serviceId ? { ...row, icdAssociations: [...row.icdAssociations, null] } : row,
      ),
    );
  };

  const removeIcdAssociation = (serviceId: string, index: number) => {
    setBillableServices((prev) =>
      prev.map((row) => {
        if (row.id !== serviceId) return row;
        const next = row.icdAssociations.filter((_, i) => i !== index);
        return { ...row, icdAssociations: next.length > 0 ? next : [null] };
      }),
    );
  };

  const updateIcdAssociation = (serviceId: string, index: number, value: CodeOption | null) => {
    setBillableServices((prev) =>
      prev.map((row) => {
        if (row.id !== serviceId) return row;
        const next = [...row.icdAssociations];
        next[index] = value;
        return { ...row, icdAssociations: next };
      }),
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: DRAWER_WIDTH,
            maxWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 16, lineHeight: 1.3 }}>
            Non-visit Note
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {patient.fullName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} aria-label="Close">
          <CloseOutlined sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          px: 2.5,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <FieldRow label="Case (Optional)">
            <Autocomplete<CaseOption, false, false, false>
              value={selectedCase}
              onChange={(_, v) => setSelectedCase(v)}
              options={caseOptions}
              getOptionLabel={(o) => o.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select a case" size="small" />
              )}
            />
          </FieldRow>
          <FieldRow label="Visit (Optional)">
            <Autocomplete<VisitOption, false, false, false>
              value={selectedVisit}
              onChange={(_, v) => setSelectedVisit(v)}
              options={visitOptions}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderOption={(props, option) => {
                const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & {
                  key?: React.Key;
                };
                return (
                  <Box
                    component="li"
                    key={key ?? option.id}
                    {...rest}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start !important', py: 0.75 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14 }}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.sublabel}
                    </Typography>
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select a visit" size="small" />
              )}
            />
          </FieldRow>
        </Box>

        <FieldRow label="Note">
          <RichTextEditor value={contentHtml} onChange={setContentHtml} />
        </FieldRow>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <FieldRow label="ICD-10(s)">
            <Autocomplete<CodeOption, true, false, false>
              multiple
              limitTags={1}
              value={icd10Codes}
              onChange={(_, v) => setIcd10Codes(v)}
              options={ICD10_CODE_OPTIONS}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(a, b) => a.value === b.value}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const tagProps = getTagProps({ index });
                  return (
                    <Chip
                      {...tagProps}
                      key={option.value}
                      size="small"
                      label={option.label}
                      sx={{ height: 24, maxWidth: '100%', '& .MuiChip-label': { fontSize: 12 } }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={icd10Codes.length === 0 ? 'Select ICD-10 codes' : ''}
                  size="small"
                />
              )}
            />
          </FieldRow>
          <FieldRow label="Attachments">
            <Autocomplete<AttachmentOption, true, false, false>
              multiple
              limitTags={1}
              value={attachments}
              onChange={(_, v) => setAttachments(v)}
              options={attachmentOptions}
              getOptionLabel={(o) => o.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const tagProps = getTagProps({ index });
                  return (
                    <Chip
                      {...tagProps}
                      key={option.id}
                      size="small"
                      label={option.name}
                      sx={{ height: 24, maxWidth: '100%', '& .MuiChip-label': { fontSize: 12 } }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={attachments.length === 0 ? 'Select attachments' : ''}
                  size="small"
                />
              )}
            />
          </FieldRow>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={isBillable}
              onChange={(_, checked) => setIsBillable(checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontSize: 14 }}>
              This note is billable.
            </Typography>
          }
          sx={{ mx: 0, alignSelf: 'flex-start' }}
        />

        {isBillable && (
          <BillableServicesSection
            services={billableServices}
            icdOptions={serviceIcdOptions}
            onAddService={addServiceRow}
            onRemoveService={removeServiceRow}
            onUpdateService={updateServiceRow}
            onAddIcdAssociation={addIcdAssociation}
            onRemoveIcdAssociation={removeIcdAssociation}
            onUpdateIcdAssociation={updateIcdAssociation}
          />
        )}
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1,
          px: 2.5,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Button variant="text" color="inherit" size="small" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" size="small" onClick={handleSubmit}>
          Create Note
        </Button>
      </Box>
    </Drawer>
  );
}

function BillableServicesSection({
  services,
  icdOptions,
  onAddService,
  onRemoveService,
  onUpdateService,
  onAddIcdAssociation,
  onRemoveIcdAssociation,
  onUpdateIcdAssociation,
}: {
  services: BillableServiceRow[];
  icdOptions: CodeOption[];
  onAddService: () => void;
  onRemoveService: (id: string) => void;
  onUpdateService: (id: string, patch: Partial<BillableServiceRow>) => void;
  onAddIcdAssociation: (serviceId: string) => void;
  onRemoveIcdAssociation: (serviceId: string, index: number) => void;
  onUpdateIcdAssociation: (serviceId: string, index: number, value: CodeOption | null) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) 56px 32px',
          gap: 1,
          px: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
          Billable Services
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
          ICD-10
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
          Units
        </Typography>
        <Box />
      </Box>

      {services.map((row) => (
        <Box
          key={row.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) 56px 32px',
            gap: 1,
            alignItems: 'start',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
              <Autocomplete<BillableCptOption, false, false, false>
                value={row.cptCode}
                onChange={(_, v) => onUpdateService(row.id, { cptCode: v })}
                options={BILLABLE_CPT_OPTIONS}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(a, b) => a.value === b.value}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Code" size="small" sx={billableTextFieldSx} />
                )}
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Select
                size="small"
                variant="outlined"
                value={row.modifier}
                displayEmpty
                onChange={(e) => onUpdateService(row.id, { modifier: e.target.value })}
                sx={{
                  width: 72,
                  flexShrink: 0,
                  fontSize: 13,
                  height: BILLABLE_FIELD_HEIGHT,
                  borderRadius: BILLABLE_FIELD_RADIUS,
                  bgcolor: BILLABLE_FIELD_BG,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-select': {
                    py: 0,
                    pl: 1.25,
                    pr: '28px !important',
                    minHeight: `${BILLABLE_FIELD_HEIGHT}px !important`,
                    height: `${BILLABLE_FIELD_HEIGHT}px`,
                    display: 'flex',
                    alignItems: 'center',
                    color: row.modifier ? 'text.primary' : 'text.secondary',
                  },
                  '& .MuiSelect-icon': { fontSize: 18, color: 'text.secondary', right: 6 },
                }}
                renderValue={(selected) => (selected ? selected : 'Mod')}
              >
                {MODIFIER_OPTIONS.map((mod) => (
                  <MenuItem key={mod || 'none'} value={mod} sx={{ fontSize: 13 }}>
                    {mod || '—'}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            {row.cptCode && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.75, fontSize: 12, lineHeight: 1.35 }}
              >
                {row.cptCode.description}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
            {row.icdAssociations.map((icd, index) => (
              <Box key={`${row.id}-icd-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <Autocomplete<CodeOption, false, false, false>
                  value={icd}
                  onChange={(_, v) => onUpdateIcdAssociation(row.id, index, v)}
                  options={icdOptions}
                  getOptionLabel={(o) => o.value}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="ICD-10" size="small" sx={billableTextFieldSx} />
                  )}
                  sx={{ flex: 1, minWidth: 0 }}
                />
                <IconButton
                  size="small"
                  aria-label="Remove ICD-10 association"
                  onClick={() => onRemoveIcdAssociation(row.id, index)}
                  sx={{ flexShrink: 0, width: 28, height: 28, color: 'text.secondary' }}
                >
                  <RemoveOutlined sx={{ fontSize: 16 }} />
                </IconButton>
                {index === row.icdAssociations.length - 1 && (
                  <IconButton
                    size="small"
                    aria-label="Add ICD-10 association"
                    onClick={() => onAddIcdAssociation(row.id)}
                    sx={{ flexShrink: 0, width: 28, height: 28, color: 'text.secondary' }}
                  >
                    <AddOutlined sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>

          <TextField
            size="small"
            type="number"
            value={row.units}
            onChange={(e) =>
              onUpdateService(row.id, { units: Math.max(1, Number(e.target.value) || 1) })
            }
            inputProps={{ min: 1, 'aria-label': 'Units' }}
            sx={{
              ...billableTextFieldSx,
              '& .MuiOutlinedInput-root .MuiInputBase-input': {
                px: 1,
                textAlign: 'center',
              },
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
          />

          <IconButton
            size="small"
            aria-label="Remove service"
            onClick={() => onRemoveService(row.id)}
            sx={{ width: 28, height: 28, color: 'text.secondary', alignSelf: 'start' }}
          >
            <DeleteOutlineOutlined sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="text"
        color="primary"
        startIcon={<AddOutlined sx={{ fontSize: 18 }} />}
        onClick={onAddService}
        sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600, px: 0.5 }}
      >
        Add Service
      </Button>
    </Box>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', letterSpacing: 0.2 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

type FormatCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikeThrough'
  | 'insertUnorderedList'
  | 'insertOrderedList';

const TOOLBAR_BUTTONS: { command: FormatCommand; label: string; Icon: typeof FormatBoldOutlined }[] = [
  { command: 'bold', label: 'Bold', Icon: FormatBoldOutlined },
  { command: 'italic', label: 'Italic', Icon: FormatItalicOutlined },
  { command: 'underline', label: 'Underline', Icon: FormatUnderlinedOutlined },
  { command: 'strikeThrough', label: 'Strikethrough', Icon: StrikethroughSOutlined },
  { command: 'insertUnorderedList', label: 'Bulleted list', Icon: FormatListBulletedOutlined },
  { command: 'insertOrderedList', label: 'Numbered list', Icon: FormatListNumberedOutlined },
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function RichTextEditor({ value, onChange, placeholder = 'Write a note…' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [activeFormats, setActiveFormats] = useState<FormatCommand[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const refreshActiveFormats = () => {
    if (typeof document === 'undefined') return;
    const next: FormatCommand[] = [];
    for (const { command } of TOOLBAR_BUTTONS) {
      try {
        if (document.queryCommandState(command)) next.push(command);
      } catch {
        // ignore unsupported commands
      }
    }
    setActiveFormats(next);
  };

  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || !editorRef.current) return;
      if (!editorRef.current.contains(sel.anchorNode)) return;
      refreshActiveFormats();
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const exec = (command: FormatCommand) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    refreshActiveFormats();
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: isFocused ? 'primary.main' : 'divider',
        borderRadius: 1,
        boxShadow: isFocused ? (theme) => `0 0 0 1px ${theme.palette.primary.main}` : 'none',
        bgcolor: 'background.paper',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 0.75,
          py: 0.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <ToggleButtonGroup
          size="small"
          value={activeFormats}
          aria-label="Text formatting"
          sx={{
            '& .MuiToggleButton-root': {
              border: 0,
              borderRadius: 1,
              px: 0.75,
              py: 0.25,
              color: 'text.secondary',
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                color: 'primary.main',
                '&:hover': { bgcolor: 'action.selected' },
              },
            },
          }}
        >
          {TOOLBAR_BUTTONS.map(({ command, label, Icon }) => (
            <ToggleButton
              key={command}
              value={command}
              aria-label={label}
              onMouseDown={(e) => {
                e.preventDefault();
                exec(command);
              }}
            >
              <Tooltip title={label}>
                <Icon sx={{ fontSize: 18 }} />
              </Tooltip>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          Formatting
        </Typography>
      </Box>
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Non-visit note"
        data-placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
        onKeyUp={refreshActiveFormats}
        onMouseUp={refreshActiveFormats}
        sx={{
          flex: 1,
          minHeight: RICH_TEXT_MIN_HEIGHT,
          maxHeight: 560,
          overflow: 'auto',
          px: 1.5,
          py: 1.25,
          fontSize: 14,
          lineHeight: 1.55,
          color: 'text.primary',
          outline: 'none',
          '& p': { m: 0, mb: 1 },
          '& ul, & ol': { mt: 0, mb: 1, pl: 3 },
          '&:empty::before': {
            content: 'attr(data-placeholder)',
            color: 'text.disabled',
            pointerEvents: 'none',
          },
        }}
      />
    </Box>
  );
}
