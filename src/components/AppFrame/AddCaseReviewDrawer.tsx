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
} from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import FormatBoldOutlined from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlined from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlined from '@mui/icons-material/FormatUnderlinedOutlined';
import StrikethroughSOutlined from '@mui/icons-material/StrikethroughSOutlined';
import FormatListBulletedOutlined from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlined from '@mui/icons-material/FormatListNumberedOutlined';
import type { Patient } from '../../data/mockPatients';
import {
  getAppointmentsForPatient,
  type Appointment,
} from '../../data/mockAppointments';
import { CPT_CODE_OPTIONS } from '../../data/visitNoteSections';

const DRAWER_WIDTH = 520;
const RICH_TEXT_MIN_HEIGHT = 360;

interface CodeOption {
  value: string;
  label: string;
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

/**
 * Mock ICD-10 codes used by the case review drawer's diagnosis multi-select.
 * Kept colocated with the only consumer so we don't pollute the broader
 * data layer with one-off fixtures.
 */
const ICD10_CODE_OPTIONS: CodeOption[] = [
  { value: 'M54.5', label: 'M54.5 – Low back pain' },
  { value: 'M25.561', label: 'M25.561 – Pain in right knee' },
  { value: 'M25.562', label: 'M25.562 – Pain in left knee' },
  { value: 'M75.100', label: 'M75.100 – Rotator cuff tear, unspecified shoulder' },
  { value: 'M23.205', label: 'M23.205 – Derangement of meniscus, unspecified knee' },
  { value: 'S83.511A', label: 'S83.511A – Sprain of ACL, right knee, initial encounter' },
  { value: 'S83.512A', label: 'S83.512A – Sprain of ACL, left knee, initial encounter' },
  { value: 'M17.11', label: 'M17.11 – Unilateral primary osteoarthritis, right knee' },
  { value: 'M17.12', label: 'M17.12 – Unilateral primary osteoarthritis, left knee' },
  { value: 'M77.10', label: 'M77.10 – Lateral epicondylitis, unspecified elbow' },
  { value: 'G56.00', label: 'G56.00 – Carpal tunnel syndrome, unspecified upper limb' },
  { value: 'M51.36', label: 'M51.36 – Other intervertebral disc degeneration, lumbar region' },
  { value: 'M62.838', label: 'M62.838 – Other muscle spasm' },
  { value: 'R52', label: 'R52 – Pain, unspecified' },
  { value: 'I10', label: 'I10 – Essential (primary) hypertension' },
  { value: 'E11.9', label: 'E11.9 – Type 2 diabetes mellitus without complications' },
  { value: 'J45.909', label: 'J45.909 – Unspecified asthma, uncomplicated' },
];

export interface AddCaseReviewDrawerProps {
  open: boolean;
  patient: Patient;
  onClose: () => void;
  onSubmit?: (review: {
    caseId: string | null;
    visitId: string | null;
    contentHtml: string;
    cptCodes: string[];
    icd10Codes: string[];
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
  const [cptCodes, setCptCodes] = useState<CodeOption[]>([]);
  const [icd10Codes, setIcd10Codes] = useState<CodeOption[]>([]);

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

  // Clear the selected visit when the case changes and the visit no longer
  // belongs to the selected case (keeps the two dropdowns in sync).
  useEffect(() => {
    if (!selectedVisit) return;
    if (selectedCase && selectedVisit.caseId !== selectedCase.id) {
      setSelectedVisit(null);
    }
  }, [selectedCase, selectedVisit]);

  const resetForm = () => {
    setSelectedCase(null);
    setSelectedVisit(null);
    setContentHtml('');
    setCptCodes([]);
    setIcd10Codes([]);
  };

  const handleClose = () => {
    onClose();
  };

  // Reset the form after the close animation finishes so the user doesn't
  // see fields wipe out before the drawer slides away.
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
      cptCodes: cptCodes.map((c) => c.value),
      icd10Codes: icd10Codes.map((c) => c.value),
    });
    handleClose();
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
      {/* Header */}
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
            Add Case Review
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {patient.fullName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} aria-label="Close">
          <CloseOutlined sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Body */}
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
        <FieldRow label="Case">
          <Autocomplete<CaseOption, false, false, false>
            value={selectedCase}
            onChange={(_, v) => setSelectedCase(v)}
            options={caseOptions}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select a case" size="small" />
            )}
            slotProps={{
              paper: { sx: { fontSize: 14 } },
            }}
          />
        </FieldRow>

        <FieldRow label="Visit">
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

        <FieldRow label="Review">
          <RichTextEditor value={contentHtml} onChange={setContentHtml} />
        </FieldRow>

        <FieldRow label="CPT Codes">
          <Autocomplete<CodeOption, true, false, false>
            multiple
            value={cptCodes}
            onChange={(_, v) => setCptCodes(v)}
            options={CPT_CODE_OPTIONS}
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
                    label={option.value}
                    sx={{ height: 22, fontSize: 12, fontWeight: 500 }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} placeholder={cptCodes.length === 0 ? 'Add CPT codes' : ''} size="small" />
            )}
          />
        </FieldRow>

        <FieldRow label="ICD-10 Codes">
          <Autocomplete<CodeOption, true, false, false>
            multiple
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
                    label={option.value}
                    sx={{ height: 22, fontSize: 12, fontWeight: 500 }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={icd10Codes.length === 0 ? 'Add ICD-10 codes' : ''}
                size="small"
              />
            )}
          />
        </FieldRow>
      </Box>

      {/* Footer */}
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
        <Button variant="text" color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Review
        </Button>
      </Box>
    </Drawer>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
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

// ─── Rich text editor ────────────────────────────────────────────────────────

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

function RichTextEditor({ value, onChange, placeholder = 'Write a review…' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [activeFormats, setActiveFormats] = useState<FormatCommand[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Keep the editor's DOM in sync with the controlled value when the value
  // changes from the outside (e.g. when the form resets after closing).
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
        // queryCommandState can throw in older browsers for unsupported
        // commands; ignore and continue.
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
    // execCommand is deprecated but remains the simplest cross-browser way to
    // apply inline formatting inside a contentEditable region without pulling
    // in a third-party editor for what is intentionally a lightweight field.
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
              // We manage selection visuals through `value`/`activeFormats`;
              // mousedown is preferred over click so the editor doesn't lose
              // its current selection before the command runs.
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
        aria-label="Case review"
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
