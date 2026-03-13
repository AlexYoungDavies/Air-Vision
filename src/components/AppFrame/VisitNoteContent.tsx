import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Link,
  SvgIcon,
  Collapse,
  TextField,
  Slider,
  Chip,
  Select,
  MenuItem,
  Switch,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  VisitNoteTextArea,
  VisitNoteTextField,
  VisitNoteDateField,
  VisitNoteRadioSelect,
  VisitNoteMeasurementsTable,
  VisitNoteChipSelect,
  VisitNoteFieldWrapper,
  VisitNoteSelect,
  baseInputSx,
} from './VisitNoteFields';
import AddOutlined from '@mui/icons-material/AddOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowRightOutlined from '@mui/icons-material/KeyboardArrowRightOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import ShowChartOutlined from '@mui/icons-material/ShowChartOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import type { Appointment } from '../../data/mockAppointments';
import hoverAnimationData from '../../assets/hover.json';
import {
  VISIT_NOTE_SECTIONS,
  DEFAULT_VISIT_NOTE_DATA,
  CPT_CODE_OPTIONS,
  type VisitNoteData,
  type SectionDef,
  type SubsectionDef,
} from '../../data/visitNoteSections';

// Signature icon (same as Notes tab on home page)
function SignatureAltIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 22 22" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.87476 2.52051C7.71484 2.52051 8.37685 2.86603 8.7609 3.53564C9.10748 4.13992 9.17166 4.91522 9.1145 5.69303C8.99885 7.26585 8.3478 9.29709 7.57121 11.253C7.54831 11.3107 7.52364 11.3681 7.50049 11.4258C7.57204 11.3914 7.64527 11.3549 7.71891 11.3139C8.1853 11.0542 8.64427 10.6893 9.05721 10.3041C9.46775 9.92118 9.81728 9.53281 10.0643 9.23885C10.1873 9.09251 10.2839 8.97097 10.349 8.88704C10.3814 8.84512 10.4064 8.81259 10.4224 8.79126C10.4302 8.78077 10.4358 8.77285 10.4394 8.76798C10.4412 8.76554 10.443 8.76261 10.443 8.76261L10.4438 8.76172L11.2065 7.71077L11.647 8.93359C11.9571 9.79558 12.2325 10.4476 12.5001 10.9075C12.7769 11.3831 12.9846 11.5453 13.1061 11.5923C13.1771 11.6197 13.3255 11.6515 13.6629 11.441C14.0145 11.2216 14.4682 10.7985 15.0567 10.0991L15.6654 9.37581L16.1659 10.177C16.6507 10.9518 17.0599 11.3134 17.5149 11.5028C17.9966 11.7032 18.6287 11.7546 19.6642 11.689L19.752 13.0604C18.683 13.1281 17.7777 13.1026 16.9858 12.773C16.4118 12.5341 15.9471 12.1547 15.524 11.6388C15.1288 12.0528 14.7538 12.3808 14.3907 12.6074C13.8389 12.9517 13.2272 13.1136 12.6102 12.8751C12.0437 12.656 11.6358 12.1554 11.3122 11.5994C11.1297 11.2859 10.9548 10.9188 10.7813 10.5064C10.5571 10.7548 10.2922 11.0334 9.99536 11.3103C9.53538 11.7393 8.98507 12.1826 8.38761 12.5152C7.91458 12.7786 7.38016 12.9869 6.81746 13.0452C6.53103 13.6963 6.23866 14.3294 5.9554 14.9259C10.3478 14.1421 14.0538 14.0053 19.7985 14.1686L19.76 15.5427C13.6607 15.3693 9.93903 15.5363 5.20345 16.4648C5.16943 16.5326 5.13735 16.6003 5.10409 16.6662C4.73237 17.4024 4.40891 18.0165 4.17847 18.4467C4.06328 18.6617 3.97073 18.8312 3.90723 18.9471C3.87563 19.0048 3.85145 19.0494 3.83472 19.0796C3.82633 19.0947 3.81941 19.1066 3.81502 19.1145C3.81292 19.1183 3.81168 19.1214 3.81055 19.1235L3.80876 19.1261C3.80876 19.1261 3.80824 19.1267 3.20809 18.7913L2.60832 18.4556L2.60921 18.4539L2.63159 18.4136C2.64746 18.3849 2.67067 18.3417 2.70142 18.2856C2.76299 18.1732 2.8534 18.0077 2.96639 17.7968C3.1052 17.5377 3.27704 17.2093 3.47485 16.8273C2.99503 16.9338 2.50194 17.0467 1.99333 17.1684L1.67285 15.831C2.58271 15.6133 3.44381 15.4209 4.27157 15.25C4.63545 14.5092 5.02737 13.6847 5.41203 12.8241C4.70921 12.4917 4.23399 11.85 3.9502 11.1259C3.55734 10.1234 3.47242 8.8635 3.58765 7.66512C3.70339 6.46168 4.02928 5.23832 4.53296 4.29386C5.0121 3.39556 5.78456 2.52051 6.87476 2.52051ZM6.87476 3.89551C6.5901 3.89551 6.17003 4.14588 5.74593 4.94108C5.34644 5.69017 5.0582 6.72871 4.95548 7.79671C4.85229 8.86994 4.94462 9.8924 5.2312 10.6237C5.41816 11.1008 5.66132 11.4038 5.95988 11.5601C6.0731 11.2895 6.18501 11.018 6.29289 10.7463C7.06304 8.80668 7.64383 6.94171 7.74308 5.59277C7.7933 4.90976 7.71067 4.46743 7.56852 4.21956C7.4638 4.03697 7.29508 3.89551 6.87476 3.89551Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

const SOAP_READ_SECTION_IDS = ['subjective', 'objective', 'assessment', 'plan'] as const;
const SOAP_READ_SECTION_LABELS: Record<(typeof SOAP_READ_SECTION_IDS)[number], string> = {
  subjective: 'Subjective',
  objective: 'Objective',
  assessment: 'Assessment',
  plan: 'Plan',
};

function ReadViewSectionBlock({
  sectionId,
  title,
  content,
  onEdit,
}: {
  sectionId: string;
  title: string;
  content: string;
  onEdit: () => void;
}) {
  const blockId = `read-${sectionId}`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(content);
  };

  const handleCopyLink = () => {
    const url = `${window.location.pathname}${window.location.search}#${blockId}`;
    void navigator.clipboard.writeText(url);
  };

  const iconButtonSx = {
    width: 28,
    height: 28,
    borderRadius: '8px',
    color: 'primary.main',
    '&:hover': { bgcolor: 'action.hover' },
  } as const;

  return (
    <Box
      id={blockId}
      sx={{
        mb: 3,
        scrollMarginTop: 24,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          py: 0.5,
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <IconButton size="small" onClick={handleCopy} aria-label="Copy" title="Copy" sx={iconButtonSx}>
            <ContentCopyOutlined sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={onEdit} aria-label="Edit" title="Edit" sx={iconButtonSx}>
            <EditOutlined sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={handleCopyLink} aria-label="Copy link" title="Copy link" sx={iconButtonSx}>
            <LinkOutlined sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
      <Box>
        {(sectionId === 'objective' || sectionId === 'assessment') ? (
          <ReadViewSectionFormatted content={content} />
        ) : (
          <Typography
            component="pre"
            sx={{
              fontFamily: 'inherit',
              fontSize: 14,
              lineHeight: 1.6,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              m: 0,
            }}
          >
            {content}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/** Renders objective/assessment read content with paragraphs and bulleted lists (measurements, goal progress). */
function ReadViewSectionFormatted({ content }: { content: string }) {
  const segments = content.split(/\n\n+/).filter(Boolean);
  const nodes: React.ReactNode[] = [];
  let segIdx = 0;
  const typographySx = { fontSize: 14, lineHeight: 1.6 } as const;
  const listSx = { mt: 0.5, mb: 1, pl: 2.5 } as const;

  while (segIdx < segments.length) {
    const segment = segments[segIdx];
    const lines = segment.split(/\n/).filter(Boolean);
    if (lines.length === 0) {
      segIdx++;
      continue;
    }
    const singleLine = lines.length === 1;
    const firstEndsWithColon = lines[0].trimEnd().endsWith(':');

    if (singleLine && firstEndsWithColon) {
      // Heading; next segment is the bullet list
      const nextSegment = segments[segIdx + 1];
      const bulletLines = nextSegment ? nextSegment.split(/\n/).filter(Boolean) : [];
      nodes.push(
        <Box key={segIdx} sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, ...typographySx }}>
            {lines[0]}
          </Typography>
          {bulletLines.length > 0 && (
            <Box component="ul" sx={listSx}>
              {bulletLines.map((line, i) => (
                <Typography key={i} component="li" variant="body2" sx={typographySx}>
                  {line}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      );
      segIdx += bulletLines.length > 0 ? 2 : 1;
      continue;
    }

    if (lines.length === 2 && lines[1].trimEnd().endsWith(':')) {
      // Intro paragraph + heading; next segment is the bullet list (e.g. "Patient performs...\nLumbar Mobility:")
      nodes.push(
        <Typography key={segIdx} variant="body2" sx={{ mb: 1, ...typographySx }}>
          {lines[0]}
        </Typography>
      );
      const nextSegment = segments[segIdx + 1];
      const bulletLines = nextSegment ? nextSegment.split(/\n/).filter(Boolean) : [];
      nodes.push(
        <Box key={`${segIdx}-list`} sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, ...typographySx }}>
            {lines[1]}
          </Typography>
          {bulletLines.length > 0 && (
            <Box component="ul" sx={listSx}>
              {bulletLines.map((line, i) => (
                <Typography key={i} component="li" variant="body2" sx={typographySx}>
                  {line}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      );
      segIdx += bulletLines.length > 0 ? 2 : 1;
      continue;
    }

    if (singleLine) {
      nodes.push(
        <Typography key={segIdx} variant="body2" sx={{ mb: 1, ...typographySx }}>
          {lines[0]}
        </Typography>
      );
      segIdx++;
      continue;
    }

    if (firstEndsWithColon) {
      nodes.push(
        <Box key={segIdx} sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, ...typographySx }}>
            {lines[0]}
          </Typography>
          <Box component="ul" sx={listSx}>
            {lines.slice(1).map((line, i) => (
              <Typography key={i} component="li" variant="body2" sx={typographySx}>
                {line}
              </Typography>
            ))}
          </Box>
        </Box>
      );
    } else {
      nodes.push(
        <Box key={segIdx} component="ul" sx={{ mb: 1, ...listSx }}>
          {lines.map((line, i) => (
            <Typography key={i} component="li" variant="body2" sx={typographySx}>
              {line}
            </Typography>
          ))}
        </Box>
      );
    }
    segIdx++;
  }

  return (
    <Box sx={{ '& ul': { '& li': { mb: 0.25 } } }}>
      {nodes}
    </Box>
  );
}

export interface VisitNoteContentProps {
  noteId: string;
  appointment: Appointment;
  /** When provided, the AI Check button opens/closes the secondary content panel. */
  onAICheckClick?: () => void;
  /** When true, the AI Check button shows active state (panel open). */
  isAIPanelOpen?: boolean;
}

const NAV_SECTION_LABEL = {
  fontSize: 10,
  fontWeight: 700,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  mb: 0.75,
} as const;

const NAV_LINK = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: 'text.primary',
  py: 0.5,
  px: 1,
  borderRadius: '4px',
  textDecoration: 'none',
  '&:hover': { bgcolor: 'action.hover' },
} as const;

const NAV_LINK_ACTIVE = {
  ...NAV_LINK,
  fontWeight: 500,
  color: 'primary.dark',
  bgcolor: 'primary.light',
  borderRadius: '4px',
} as const;

/** SOAP narrative content for Read view (concise formatted summary). */
const SOAP_READ_VIEW_CONTENT: Record<string, string> = {
  subjective:
    'Patient presents with low back stiffness and pain, reported as worse than typical, with associated pain during bed mobility and sit-to-stand transitions. Patient reports significant discomfort when getting up from bed each morning, describing stiffness during the transition from lying to sitting to standing. Morning stiffness persists throughout the day, easing slightly with light movement. Symptoms negatively impact daily activities and contribute to increased fatigue by end of day.\n\n' +
    'Onset date 03/04/2025, following a weekend of yard work and prolonged driving. No prior lumbar surgery. Patient denies radicular symptoms, numbness, or weakness in the lower extremities. Condition is currently maintaining bilaterally.\n\n' +
    'Pain rating: 5/10\n\n' +
    'Exacerbating factors: prolonged sitting, bending forward, lifting heavy objects, long car rides, inactivity, and morning hours.\n' +
    'Alleviating factors: short walks, heat application, frequent position changes, avoiding prolonged sitting, and rest in a supported reclined position.',
  objective:
    'Patient performs adequately on lumbar measurements but has shown little improvement from previous visits.\n' +
    'Lumbar Mobility:\n\n' +
    'Lumbar Flexion: L 48° (prev. 52°) / R 45° (prev. 48°)\n' +
    'Lumbar Extension: L 18° (prev. 22°) / R 16° (prev. 20°)\n' +
    'Lumbar Side Bend Left: 24° (prev. 28°)\n' +
    'Lumbar Side Bend Right: 22° (prev. 26°)\n\n' +
    'Thoracic Measurements:\n\n' +
    'Thoracic Rotation Left: 34° (prev. 38°)\n' +
    'Thoracic Rotation Right: 32° (prev. 35°)\n' +
    'Thoracic Extension: L 16° (prev. 18°) / R 15° (prev. 18°)\n' +
    'Thoracic Side Bend: L 20° (prev. 24°) / R 19° (prev. 22°)\n\n' +
    'General Upright Range of Motion:\n\n' +
    'Standing Forward Reach: 26 cm (prev. 28 cm)\n' +
    'Sit-to-Stand (30 sec): 9 reps (prev. 10)\n' +
    'Single-Leg Stance Left: 10 sec (prev. 12 sec)\n' +
    'Single-Leg Stance Right: 12 sec (prev. 14 sec)',
  assessment:
    'Low back pain with lumbar stiffness and limited mobility. Patient would benefit from continued therapeutic exercise and manual therapy to improve range of motion and function. Progress toward goals is gradual. Patient is engaged in treatment and compliant with home exercise program recommendations.\n' +
    'Goal Progress:\n\n' +
    'Improve lumbar flexion ROM (ST, target 04/15/2025): Lumbar flexion ~48° L / 45° R; mild improvement with warm-up. ~15% progress.\n' +
    'Reduce pain with bed mobility (ST, target 04/15/2025): Pain 5/10 with bed mobility; improved with consistent HEP. ~20% progress.\n' +
    'Independent HEP and activity modification (LT, target 05/30/2025): Performing HEP 4–5x/week; using lumbar support when driving. ~40% progress.\n' +
    'Return to prior level of activity (LT, target 06/15/2025): Able to drive 30 min with minimal discomfort; not yet ready for prolonged yard work. ~25% progress.',
  plan:
    'Therapeutic exercise (97110): lumbar ROM, core stabilization, and hip flexor stretching 2x/week. Manual therapy (97140): soft tissue mobilization and joint mobilization to lumbar and thoracic segments as indicated. Patient to continue home exercise program (lumbar stretches, cat-cow, supported bridge) daily. Care to continue addressing ongoing lumbar stiffness and pain, maintaining mobility gains, and supporting the patient\'s ability to perform daily activities and bed mobility with less discomfort. Reassess in 2 weeks for progress toward goals.',
};

const SECTION_HEADER = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 2,
  py: 1,
  px: 1,
  mb: 1,
} as const;

const SUBSECTION_HEADER = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  py: 0.75,
  px: 1,
  mb: 1,
} as const;

/** Carry-forward source text shown beside subsection headings in edit view (mock values). */
const CARRY_FORWARD_SOURCES: Partial<Record<string, string>> = {
  'chief-complaint': 'Initial Eval, Mar 4th 2026',
  'history-of-present-illness': 'Initial Eval, Mar 4th 2026',
  'exacerbating-factors': 'Initial Eval, Mar 4th 2026',
  'diagnosis-summary': 'Follow-up, Mar 7th 2026',
  'treatment-plan': 'Progress Note, Mar 9th',
  goals: 'previous note, Mar 9th 2026',
  'plan-of-care': 'Initial Eval, Mar 4th 2026',
};

function CarryForwardSourceTag({ source }: { source: string }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        color: 'text.secondary',
      }}
    >
      <HistoryOutlined sx={{ fontSize: 16, color: 'grey.400' }} />
      <Typography
        component="span"
        variant="caption"
        sx={{ fontStyle: 'italic', fontWeight: 500, color: 'grey.400' }}
      >
        {source}
      </Typography>
    </Box>
  );
}

/**
 * Visit note content: left TOC (anchor links) + main content (Subjective, Objective, Assessment, Plan, Other).
 * Two views: editable (form fields) and read (formatted text).
 */
const ALL_ANCHOR_IDS = VISIT_NOTE_SECTIONS.flatMap((s) => s.subsections.map((sub) => sub.anchorId));

const NOTE_TEMPLATE_OPTIONS = [
  'Knee Sprain', 'ACL Tear', 'Annual Physical', 'Follow-up', 'Consultation', 'Lab Review',
  'Hypertension Follow-up', 'Wellness Exam', 'Sports Physical', 'Migraine Management',
  'Diabetes Check', 'Prenatal Care', 'Thyroid Follow-up', 'Allergy Testing', 'Cardiac Screening',
  'Skin Check', 'Asthma Follow-up', 'Joint Pain', 'Sleep Study Follow-up', 'Anxiety Management',
];

const CLINICAL_STAGE_OPTIONS = ['Initial Evaluation', 'Progress Note', 'Follow-up'];

const CHECK_NOTE_LOTTIE_SIZE = 22;

type EditingReadSectionId = (typeof SOAP_READ_SECTION_IDS)[number] | null;

export function VisitNoteContent({ noteId: _noteId, appointment, onAICheckClick, isAIPanelOpen }: VisitNoteContentProps) {
  const [mode, setMode] = useState<'edit' | 'read'>('read');
  const [editingReadSectionId, setEditingReadSectionId] = useState<EditingReadSectionId>(null);
  const checkNoteLottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [data, setData] = useState<VisitNoteData>(DEFAULT_VISIT_NOTE_DATA);
  const [noteTemplate, setNoteTemplate] = useState(appointment.template);
  const [clinicalStage, setClinicalStage] = useState(appointment.clinicalStage);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [collapsedSubsections, setCollapsedSubsections] = useState<Set<string>>(new Set());

  useEffect(() => {
    setNoteTemplate(appointment.template);
    setClinicalStage(appointment.clinicalStage);
  }, [appointment.id, appointment.template, appointment.clinicalStage]);
  const [activeAnchorId, setActiveAnchorId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const anchorIds =
      mode === 'read'
        ? SOAP_READ_SECTION_IDS.map((id) => `read-${id}`)
        : ALL_ANCHOR_IDS;

    const updateActive = () => {
      const containerRect = container.getBoundingClientRect();
      const topOffset = 120;
      let current: string | null = null;
      for (const anchorId of anchorIds) {
        const el = document.getElementById(anchorId);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= containerRect.top + topOffset) {
          current = anchorId;
        }
      }
      setActiveAnchorId((prev) => (prev !== current ? current : prev));
    };

    updateActive();
    container.addEventListener('scroll', updateActive, { passive: true });
    return () => container.removeEventListener('scroll', updateActive);
  }, [mode]);

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const toggleSubsection = useCallback((subsectionKey: string) => {
    setCollapsedSubsections((prev) => {
      const next = new Set(prev);
      if (next.has(subsectionKey)) next.delete(subsectionKey);
      else next.add(subsectionKey);
      return next;
    });
  }, []);

  const updateChiefComplaintContent = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        'chief-complaint': {
          ...prev.subjective['chief-complaint'],
          content: value,
        },
      },
    }));
  }, []);

  const updateChiefComplaintDetailedExplanation = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        'chief-complaint': {
          ...prev.subjective['chief-complaint'],
          detailedExplanation: value,
        },
      },
    }));
  }, []);

  const updateChiefComplaintDateOfOnset = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        'chief-complaint': {
          ...prev.subjective['chief-complaint'],
          dateOfOnset: value,
        },
      },
    }));
  }, []);

  const updateChiefComplaintPainRating = useCallback((value: string | null) => {
    setData((prev) => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        'chief-complaint': {
          ...prev.subjective['chief-complaint'],
          painRating: value,
        },
      },
    }));
  }, []);

  const updateHistoryOfPresentIllness = useCallback(
    (field: keyof VisitNoteData['subjective']['history-of-present-illness'], value: string | null) => {
      setData((prev) => ({
        ...prev,
        subjective: {
          ...prev.subjective,
          'history-of-present-illness': {
            ...prev.subjective['history-of-present-illness'],
            [field]:
              field === 'stateOfCondition' || field === 'sideOfIssue' ? value : (value ?? ''),
          },
        },
      }));
    },
    [],
  );

  const updateExacerbatingFactors = useCallback((field: 'exacerbatingFactors' | 'alleviatingFactors', value: string) => {
    setData((prev) => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        'exacerbating-factors': {
          ...prev.subjective['exacerbating-factors'],
          [field]: value,
        },
      },
    }));
  }, []);

  const updateObjectiveComments = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      objective: {
        ...prev.objective,
        'objective-comments': {
          ...prev.objective['objective-comments'],
          comments: value,
        },
      },
    }));
  }, []);

  type MeasurementTableId = keyof VisitNoteData['objective']['measurements'];
  const updateMeasurementCell = useCallback(
    (tableId: MeasurementTableId, rowIndex: number, colIndex: number, value: string) => {
      setData((prev) => {
        const table = prev.objective.measurements[tableId];
        const nextRows = table.map((row, r) =>
          r === rowIndex ? [...row.slice(0, colIndex), value, ...row.slice(colIndex + 1)] : [...row],
        );
        return {
          ...prev,
          objective: {
            ...prev.objective,
            measurements: {
              ...prev.objective.measurements,
              [tableId]: nextRows,
            },
          },
        };
      });
    },
    [],
  );

  const updateDiagnosisSummaryCptCodes = useCallback((value: string[]) => {
    setData((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        'diagnosis-summary': {
          ...prev.assessment['diagnosis-summary'],
          cptCodes: value,
        },
      },
    }));
  }, []);

  const updateDiagnosisSummarySummary = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        'diagnosis-summary': {
          ...prev.assessment['diagnosis-summary'],
          summary: value,
        },
      },
    }));
  }, []);

  const updateContinuedCare = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        'continued-care': {
          ...prev.assessment['continued-care'],
          content: value,
        },
      },
    }));
  }, []);

  const updateAdditionalNotes = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        'additional-notes': {
          ...prev.assessment['additional-notes'],
          content: value,
        },
      },
    }));
  }, []);

  const updateTreatmentPlanContent = useCallback((value: string) => {
    setData((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        'treatment-plan': { ...prev.plan['treatment-plan'], content: value },
      },
    }));
  }, []);

  const updatePlanGoal = useCallback(
    (
      goalIndex: number,
      field: keyof VisitNoteData['plan']['goals']['goals'][0],
      value: string | number
    ) => {
      setData((prev) => {
        const goals = [...prev.plan.goals.goals];
        goals[goalIndex] = { ...goals[goalIndex], [field]: value };
        return {
          ...prev,
          plan: { ...prev.plan, goals: { ...prev.plan.goals, goals } },
        };
      });
    },
    []
  );

  const updatePlanOfCare = useCallback(
    (
      field: keyof VisitNoteData['plan']['plan-of-care'],
      value: string | number
    ) => {
      setData((prev) => ({
        ...prev,
        plan: {
          ...prev.plan,
          'plan-of-care': { ...prev.plan['plan-of-care'], [field]: value },
        },
      }));
    },
    []
  );

  const updateNotarize = useCallback(
    (field: keyof VisitNoteData['notarize']['notarize'], value: string | boolean | string[]) => {
      setData((prev) => ({
        ...prev,
        notarize: {
          ...prev.notarize,
          notarize: { ...prev.notarize.notarize, [field]: value },
        },
      }));
    },
    []
  );

  /** Visit count from duration, frequency, and care timeline (start/end). */
  const planOfCareVisitCount = (() => {
    const poc = data.plan['plan-of-care'];
    const start = poc.careTimelineStart ? new Date(poc.careTimelineStart).getTime() : null;
    const end = poc.careTimelineEnd ? new Date(poc.careTimelineEnd).getTime() : null;
    const freqNum = parseInt(poc.frequencyValue, 10);
    if (!start || !end || end < start || !Number.isFinite(freqNum) || freqNum <= 0) return 0;
    const days = (end - start) / (24 * 60 * 60 * 1000);
    if (days <= 0) return 0;
    switch (poc.frequencyUnit) {
      case 'per-week':
        return Math.round((days / 7) * freqNum);
      case 'per-month':
        return Math.round((days / 30.44) * freqNum);
      case 'per-year':
        return Math.round((days / 365.25) * freqNum);
      default:
        return 0;
    }
  })();

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Visit note header: case name, date, details + template/stage dropdowns */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          pt: 2,
          pb: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Lower Back Stiffness
            </Typography>
            <Box
              component="p"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                m: 0,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body2" color="text.secondary" component="span">
                {appointment.date}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ px: '2px' }}>
                •
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span">
                {appointment.provider}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ px: '2px' }}>
                •
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span">
                {appointment.facility}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '9px',
                pt: '3px',
                px: '2px',
              }}
            >
              <VisitNoteSelect
                label="Note template"
                options={NOTE_TEMPLATE_OPTIONS.map((t) => ({ value: t, label: t }))}
                value={noteTemplate}
                onChange={(e) => setNoteTemplate(String(e.target.value))}
                placeholder="Select template"
                showLabel={false}
              />
              <Typography component="span" variant="body2" sx={{ color: 'rgba(102, 102, 102, 0.35)', fontSize: 20, px: 0.5 }}>
                /
              </Typography>
              <VisitNoteSelect
                label="Clinical stage"
                options={CLINICAL_STAGE_OPTIONS.map((s) => ({ value: s, label: s }))}
                value={clinicalStage}
                onChange={(e) => setClinicalStage(String(e.target.value))}
                placeholder="Select stage"
                showLabel={false}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        {/* Left nav: table of contents (anchor links) — does not scroll */}
        <Box
          component="nav"
          sx={{
            width: 200,
            flexShrink: 0,
            py: 2,
            pl: 2,
            pr: 1,
          }}
        >
          {mode === 'read' ? (
            SOAP_READ_SECTION_IDS.map((sectionId) => {
              const blockId = `read-${sectionId}`;
              const isActive = activeAnchorId === blockId;
              return (
                <Box key={sectionId} sx={{ mb: 1.5 }}>
                  <Link
                    href={`#${blockId}`}
                    sx={isActive ? NAV_LINK_ACTIVE : NAV_LINK}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(blockId)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {SOAP_READ_SECTION_LABELS[sectionId]}
                  </Link>
                </Box>
              );
            })
          ) : (
            VISIT_NOTE_SECTIONS.map((section) => (
              <Box key={section.id} sx={{ mb: 1.5 }}>
                <Typography sx={NAV_SECTION_LABEL}>{section.label}</Typography>
                {section.subsections.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`#${sub.anchorId}`}
                    sx={sub.anchorId === activeAnchorId ? NAV_LINK_ACTIVE : NAV_LINK}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(sub.anchorId)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {sub.label}
                  </Link>
                ))}
              </Box>
            ))
          )}
        </Box>

        {/* Main content: sections and subsections */}
        <Box
          ref={scrollContainerRef}
          component="main"
          sx={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            overflow: 'auto',
            pt: 7,
            pb: 2,
            px: 2,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1.5,
              pt: 0,
              pb: 0,
              pr: 0,
              bgcolor: 'transparent',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <IconButton
              size="small"
              onClick={() => setMode('edit')}
              aria-label="Edit note"
              title="Edit"
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                ...(mode === 'edit' && {
                  bgcolor: 'action.selected',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'action.selected' },
                }),
              }}
            >
              <EditOutlined sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setMode('read')}
              aria-label="Read view"
              title="Read"
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                ...(mode === 'read' && {
                  bgcolor: 'action.selected',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'action.selected' },
                }),
              }}
            >
              <VisibilityOutlined sx={{ fontSize: 18 }} />
            </IconButton>
            </Box>
            <Button
              variant="text"
              size="small"
              onClick={onAICheckClick}
              startIcon={
                <Box
                  component="span"
                  sx={{
                    width: CHECK_NOTE_LOTTIE_SIZE,
                    height: CHECK_NOTE_LOTTIE_SIZE,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& > div': { width: CHECK_NOTE_LOTTIE_SIZE, height: CHECK_NOTE_LOTTIE_SIZE },
                  }}
                >
                  <Lottie
                    lottieRef={checkNoteLottieRef}
                    animationData={hoverAnimationData}
                    loop={false}
                    autoplay={false}
                    onDOMLoaded={() => {
                      checkNoteLottieRef.current?.goToAndStop(0, true);
                    }}
                    style={{ width: CHECK_NOTE_LOTTIE_SIZE, height: CHECK_NOTE_LOTTIE_SIZE }}
                    rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
                  />
                </Box>
              }
              onMouseEnter={() => {
                checkNoteLottieRef.current?.setDirection(1);
                checkNoteLottieRef.current?.play();
              }}
              onMouseLeave={() => {
                checkNoteLottieRef.current?.setDirection(-1);
                checkNoteLottieRef.current?.play();
              }}
              sx={{
                py: 0.25,
                px: 1,
                borderRadius: '9px',
                bgcolor: isAIPanelOpen ? 'action.selected' : 'rgba(0, 102, 70, 0.1)',
                border: '1px solid',
                borderColor: isAIPanelOpen ? 'action.selected' : 'rgba(0, 102, 70, 0.1)',
                color: 'primary.main',
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: isAIPanelOpen ? 'action.selected' : 'rgba(0, 102, 70, 0.15)',
                  borderColor: isAIPanelOpen ? 'action.selected' : 'rgba(0, 102, 70, 0.2)',
                },
              }}
            >
              AI Check
            </Button>
          </Box>
          <Box sx={{ width: '100%', maxWidth: 820, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {mode === 'read' ? (
              <>
                {SOAP_READ_SECTION_IDS.map((sectionId) => {
                  if (sectionId === editingReadSectionId) {
                    const section = VISIT_NOTE_SECTIONS.find((s) => s.id === sectionId);
                    if (!section) return null;
                    return (
                      <Box
                        id={`read-${sectionId}`}
                        key={sectionId}
                        sx={{ mb: 3, scrollMarginTop: 24 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                            py: 0.5,
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24 }}>
                            {SOAP_READ_SECTION_LABELS[sectionId]}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<SaveOutlined />}
                            onClick={() => setEditingReadSectionId(null)}
                            sx={{ textTransform: 'none' }}
                          >
                            Save
                          </Button>
                        </Box>
                        <SingleSectionEditForm
                          section={section}
                          data={data}
                          mode="edit"
                          planOfCareVisitCount={planOfCareVisitCount}
                          updateChiefComplaintContent={updateChiefComplaintContent}
                          updateChiefComplaintDetailedExplanation={updateChiefComplaintDetailedExplanation}
                          updateChiefComplaintDateOfOnset={updateChiefComplaintDateOfOnset}
                          updateChiefComplaintPainRating={updateChiefComplaintPainRating}
                          updateHistoryOfPresentIllness={updateHistoryOfPresentIllness}
                          updateExacerbatingFactors={updateExacerbatingFactors}
                          updateObjectiveComments={updateObjectiveComments}
                          updateMeasurementCell={updateMeasurementCell}
                          updateDiagnosisSummaryCptCodes={updateDiagnosisSummaryCptCodes}
                          updateDiagnosisSummarySummary={updateDiagnosisSummarySummary}
                          updateContinuedCare={updateContinuedCare}
                          updateAdditionalNotes={updateAdditionalNotes}
                          updateTreatmentPlanContent={updateTreatmentPlanContent}
                          updatePlanGoal={updatePlanGoal}
                          updatePlanOfCare={updatePlanOfCare}
                          updateNotarize={updateNotarize}
                        />
                      </Box>
                    );
                  }
                  return (
                    <ReadViewSectionBlock
                      key={sectionId}
                      sectionId={sectionId}
                      title={SOAP_READ_SECTION_LABELS[sectionId]}
                      content={SOAP_READ_VIEW_CONTENT[sectionId] ?? ''}
                      onEdit={() => setEditingReadSectionId(sectionId)}
                    />
                  );
                })}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 14, lineHeight: 1.6 }}>
                    Primary provider is Daniel McGuffie, PT, DPT, OCS. Referring provider on file is Lauren Chambers (fax: +1 (585) 784-7981). Plan of Care PDF to be faxed to referring provider upon signing.
                  </Typography>
                  <SignNoteBlock data={data.notarize.notarize} onUpdate={updateNotarize} />
                </Box>
              </>
            ) : (
            VISIT_NOTE_SECTIONS.map((section) => {
            const isCollapsed = collapsedSections.has(section.id);
            return (
              <Box key={section.id} sx={{ mb: 3 }}>
                <Box sx={SECTION_HEADER}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                    onClick={() => toggleSection(section.id)}
                  >
                    {isCollapsed ? (
                      <KeyboardArrowRightOutlined sx={{ fontSize: 20 }} />
                    ) : (
                      <KeyboardArrowDownOutlined sx={{ fontSize: 20 }} />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 36 }}>
                      {section.label}
                    </Typography>
                  </Box>
                  {mode === 'edit' && (
                    <Button
                      size="small"
                      startIcon={<AddOutlined sx={{ fontSize: 18 }} />}
                      sx={{ textTransform: 'none', fontWeight: 500 }}
                    >
                      Add to Section
                    </Button>
                  )}
                </Box>

                <Collapse in={!isCollapsed}>
                  {section.subsections.map((sub) => {
                    const isSubCollapsed = collapsedSubsections.has(sub.anchorId);
                    return (
                    <Box
                      key={sub.id}
                      id={sub.anchorId}
                      sx={{
                        mb: 2,
                        scrollMarginTop: 24,
                        pt: 1,
                        pb: 1,
                        px: 2,
                      }}
                    >
                      <Box
                        sx={{
                          ...SUBSECTION_HEADER,
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleSubsection(sub.anchorId)}
                      >
                        {isSubCollapsed ? (
                          <KeyboardArrowRightOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                        ) : (
                          <KeyboardArrowDownOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 24 }}>
                            {sub.label}
                          </Typography>
                          {mode === 'edit' && CARRY_FORWARD_SOURCES[sub.id] && (
                            <CarryForwardSourceTag source={CARRY_FORWARD_SOURCES[sub.id]!} />
                          )}
                        </Box>
                      </Box>

                      <Collapse in={!isSubCollapsed}>
                      {section.id === 'subjective' && sub.id === 'chief-complaint' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <VisitNoteTextArea
                                label="Chief Complaint"
                                placeholder="Add here"
                                minRows={4}
                                value={data.subjective['chief-complaint'].content}
                                onChange={(e) => updateChiefComplaintContent(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                              <VisitNoteTextArea
                                label="Patient Comments"
                                placeholder="Add details about morning stiffness, getting up from bed, and impact on the day..."
                                minRows={3}
                                value={data.subjective['chief-complaint'].detailedExplanation}
                                onChange={(e) => updateChiefComplaintDetailedExplanation(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                              <VisitNoteDateField
                                label="Date of onset"
                                value={data.subjective['chief-complaint'].dateOfOnset}
                                onChange={(e) => updateChiefComplaintDateOfOnset(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                              <VisitNoteRadioSelect
                                label="Pain rating"
                                options={Array.from({ length: 10 }, (_, i) => ({
                                  value: String(i + 1),
                                  label: String(i + 1),
                                }))}
                                value={data.subjective['chief-complaint'].painRating}
                                onChange={updateChiefComplaintPainRating}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <ReadOnlyChiefComplaint data={data.subjective['chief-complaint']} />
                          )}
                        </>
                      )}

                      {section.id === 'subjective' && sub.id === 'history-of-present-illness' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <VisitNoteDateField
                                label="Date of Onset"
                                value={data.subjective['history-of-present-illness'].dateOfOnset}
                                onChange={(e) => updateHistoryOfPresentIllness('dateOfOnset', e.target.value)}
                              />
                              <VisitNoteDateField
                                label="Date of Surgery (If Applicable)"
                                value={data.subjective['history-of-present-illness'].dateOfSurgery}
                                onChange={(e) => updateHistoryOfPresentIllness('dateOfSurgery', e.target.value)}
                              />
                              <VisitNoteRadioSelect
                                label="State of Condition"
                                options={[
                                  { value: 'improving', label: 'Improving' },
                                  { value: 'maintaining', label: 'Maintaining' },
                                  { value: 'worsening', label: 'Worsening' },
                                  { value: 'insidious', label: 'Insidious' },
                                ]}
                                value={data.subjective['history-of-present-illness'].stateOfCondition}
                                onChange={(v) => updateHistoryOfPresentIllness('stateOfCondition', v)}
                                sx={{ width: '100%' }}
                              />
                              <VisitNoteRadioSelect
                                label="Side of Issue"
                                options={[
                                  { value: 'left', label: 'Left' },
                                  { value: 'right', label: 'Right' },
                                  { value: 'bilateral', label: 'Bilateral' },
                                ]}
                                value={data.subjective['history-of-present-illness'].sideOfIssue}
                                onChange={(v) => updateHistoryOfPresentIllness('sideOfIssue', v)}
                                sx={{ width: '100%' }}
                              />
                              <VisitNoteTextArea
                                label="History of Condition"
                                placeholder="Add here"
                                minRows={3}
                                value={data.subjective['history-of-present-illness'].historyOfCondition}
                                onChange={(e) => updateHistoryOfPresentIllness('historyOfCondition', e.target.value)}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <ReadOnlyHistoryOfPresentIllness data={data.subjective['history-of-present-illness']} />
                          )}
                        </>
                      )}

                      {section.id === 'subjective' && sub.id === 'exacerbating-factors' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <VisitNoteTextArea
                                label="Exacerbating Factors"
                                placeholder="Add here"
                                minRows={3}
                                value={data.subjective['exacerbating-factors'].exacerbatingFactors}
                                onChange={(e) => updateExacerbatingFactors('exacerbatingFactors', e.target.value)}
                                sx={{ width: '100%' }}
                              />
                              <VisitNoteTextArea
                                label="Alleviating Factors"
                                placeholder="Add here"
                                minRows={3}
                                value={data.subjective['exacerbating-factors'].alleviatingFactors}
                                onChange={(e) => updateExacerbatingFactors('alleviatingFactors', e.target.value)}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <ReadOnlyExacerbatingFactors data={data.subjective['exacerbating-factors']} />
                          )}
                        </>
                      )}

                      {section.id === 'objective' && sub.id === 'objective-comments' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3 }}>
                              <VisitNoteTextArea
                                label="Comments"
                                placeholder="Add here"
                                minRows={3}
                                value={data.objective['objective-comments'].comments}
                                onChange={(e) => updateObjectiveComments(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <Box sx={{ pl: 3 }}>
                              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                                {data.objective['objective-comments'].comments || '—'}
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}

                      {section.id === 'objective' && sub.id === 'measurements' && (
                        <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <VisitNoteMeasurementsTable
                            title="Lumbar Mobility"
                            columnLabels={['Left', 'Right']}
                            rows={[
                              { measurementName: 'Lumbar Flexion (degrees)', previousValues: ['52', '48'] },
                              { measurementName: 'Lumbar Extension (degrees)', previousValues: ['22', '20'] },
                              { measurementName: 'Lumbar Side Bend Left (degrees)', previousValues: ['28', ''] },
                              { measurementName: 'Lumbar Side Bend Right (degrees)', previousValues: ['', '26'] },
                            ]}
                            values={data.objective.measurements['lumbar-mobility']}
                            onCellChange={(ri, ci, v) => updateMeasurementCell('lumbar-mobility', ri, ci, v)}
                            readOnly={false}
                          />
                          <VisitNoteMeasurementsTable
                            title="Thoracic Measurements"
                            columnLabels={['Left', 'Right']}
                            rows={[
                              { measurementName: 'Thoracic Rotation Left (degrees)', previousValues: ['38', ''] },
                              { measurementName: 'Thoracic Rotation Right (degrees)', previousValues: ['', '35'] },
                              { measurementName: 'Thoracic Extension (degrees)', previousValues: ['18', '18'] },
                              { measurementName: 'Thoracic Side Bend (degrees)', previousValues: ['24', '22'] },
                            ]}
                            values={data.objective.measurements.thoracic}
                            onCellChange={(ri, ci, v) => updateMeasurementCell('thoracic', ri, ci, v)}
                            readOnly={false}
                          />
                          <VisitNoteMeasurementsTable
                            title="General Upright Range of Motion"
                            columnLabels={['Value']}
                            rows={[
                              { measurementName: 'Standing Forward Reach (cm)', previousValues: ['28'] },
                              { measurementName: 'Sit-to-Stand (reps in 30 sec)', previousValues: ['10'] },
                              { measurementName: 'Single-Leg Stance Time – Left (sec)', previousValues: ['12'] },
                              { measurementName: 'Single-Leg Stance Time – Right (sec)', previousValues: ['14'] },
                            ]}
                            values={data.objective.measurements['general-upright']}
                            onCellChange={(ri, ci, v) => updateMeasurementCell('general-upright', ri, ci, v)}
                            readOnly={false}
                          />
                        </Box>
                      )}

                      {section.id === 'assessment' && sub.id === 'diagnosis-summary' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <VisitNoteChipSelect
                                label="CPT codes"
                                options={CPT_CODE_OPTIONS}
                                value={data.assessment['diagnosis-summary'].cptCodes}
                                onChange={updateDiagnosisSummaryCptCodes}
                                placeholder="Add CPT codes"
                                searchPlaceholder="Search CPT codes..."
                                sx={{ width: '100%' }}
                              />
                              <VisitNoteTextArea
                                label="Summary"
                                placeholder="Describe the diagnoses the provider has selected..."
                                minRows={4}
                                value={data.assessment['diagnosis-summary'].summary}
                                onChange={(e) => updateDiagnosisSummarySummary(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <Box sx={{ pl: 3 }}>
                              {data.assessment['diagnosis-summary'].cptCodes.length > 0 && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  CPT codes: {data.assessment['diagnosis-summary'].cptCodes.join(', ')}
                                </Typography>
                              )}
                              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                                {data.assessment['diagnosis-summary'].summary || '—'}
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}

                      {section.id === 'assessment' && sub.id === 'continued-care' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3 }}>
                              <VisitNoteTextArea
                                label="Continued care"
                                placeholder="Reasoning why care should be continued..."
                                minRows={4}
                                value={data.assessment['continued-care'].content}
                                onChange={(e) => updateContinuedCare(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <Box sx={{ pl: 3 }}>
                              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                                {data.assessment['continued-care'].content || '—'}
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}

                      {section.id === 'assessment' && sub.id === 'additional-notes' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3 }}>
                              <VisitNoteTextArea
                                label="Additional notes"
                                placeholder="Extra notes about the diagnosis..."
                                minRows={3}
                                value={data.assessment['additional-notes'].content}
                                onChange={(e) => updateAdditionalNotes(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <Box sx={{ pl: 3 }}>
                              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                                {data.assessment['additional-notes'].content || '—'}
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}

                      {section.id === 'plan' && sub.id === 'treatment-plan' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3 }}>
                              <VisitNoteTextArea
                                label="Treatment Plan"
                                placeholder="Add content..."
                                minRows={4}
                                value={data.plan['treatment-plan'].content}
                                onChange={(e) => updateTreatmentPlanContent(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                            </Box>
                          ) : (
                            <Box sx={{ pl: 3 }}>
                              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                                {data.plan['treatment-plan'].content || '—'}
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}

                      {section.id === 'plan' && sub.id === 'goals' && (
                        <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {data.plan.goals.goals.map((goal, idx) => (
                            <PlanGoalCard
                              key={goal.id}
                              goal={goal}
                              goalIndex={idx}
                              mode={mode}
                              onUpdate={updatePlanGoal}
                            />
                          ))}
                        </Box>
                      )}

                      {section.id === 'plan' && sub.id === 'plan-of-care' && (
                        <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <VisitNoteFieldWrapper label="Duration">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TextField
                                  size="small"
                                  placeholder="0"
                                  value={data.plan['plan-of-care'].durationValue}
                                  onChange={(e) => updatePlanOfCare('durationValue', e.target.value)}
                                  sx={{
                                    width: 72,
                                    '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
                                    '& .MuiInputBase-input': { py: 0, px: 1.5, fontSize: 14, textAlign: 'center' },
                                  }}
                                />
                                <Select
                                  size="small"
                                  value={data.plan['plan-of-care'].durationUnit}
                                  onChange={(e) => updatePlanOfCare('durationUnit', e.target.value as VisitNoteData['plan']['plan-of-care']['durationUnit'])}
                                  displayEmpty
                                  IconComponent={KeyboardArrowDownOutlined}
                                  sx={{
                                    ...baseInputSx,
                                    height: 28,
                                    minWidth: 100,
                                    '& .MuiSelect-select': { py: 0, px: 1.5, fontSize: 14 },
                                  }}
                                >
                                  <MenuItem value="days">Days</MenuItem>
                                  <MenuItem value="weeks">Weeks</MenuItem>
                                  <MenuItem value="months">Months</MenuItem>
                                </Select>
                              </Box>
                            </VisitNoteFieldWrapper>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <VisitNoteFieldWrapper label="Frequency">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TextField
                                  size="small"
                                  placeholder="0"
                                  value={data.plan['plan-of-care'].frequencyValue}
                                  onChange={(e) => updatePlanOfCare('frequencyValue', e.target.value)}
                                  sx={{
                                    width: 72,
                                    '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
                                    '& .MuiInputBase-input': { py: 0, px: 1.5, fontSize: 14, textAlign: 'center' },
                                  }}
                                />
                                <Select
                                  size="small"
                                  value={data.plan['plan-of-care'].frequencyUnit}
                                  onChange={(e) => updatePlanOfCare('frequencyUnit', e.target.value as VisitNoteData['plan']['plan-of-care']['frequencyUnit'])}
                                  displayEmpty
                                  IconComponent={KeyboardArrowDownOutlined}
                                  sx={{
                                    ...baseInputSx,
                                    height: 28,
                                    minWidth: 110,
                                    '& .MuiSelect-select': { py: 0, px: 1.5, fontSize: 14 },
                                  }}
                                >
                                  <MenuItem value="per-week">Per Week</MenuItem>
                                  <MenuItem value="per-month">Per Month</MenuItem>
                                  <MenuItem value="per-year">Per Year</MenuItem>
                                </Select>
                              </Box>
                            </VisitNoteFieldWrapper>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <VisitNoteFieldWrapper label="Care Timeline">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <VisitNoteDateField
                                  label=""
                                  value={data.plan['plan-of-care'].careTimelineStart}
                                  onChange={(e) => updatePlanOfCare('careTimelineStart', e.target.value)}
                                  placeholder="mm/dd/yyyy"
                                />
                                <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>→</Typography>
                                <VisitNoteDateField
                                  label=""
                                  value={data.plan['plan-of-care'].careTimelineEnd}
                                  onChange={(e) => updatePlanOfCare('careTimelineEnd', e.target.value)}
                                  placeholder="mm/dd/yyyy"
                                />
                              </Box>
                            </VisitNoteFieldWrapper>
                          </Box>
                          <VisitNoteFieldWrapper label="Visit Count" sublabel="Auto-calculated" disabled>
                            <TextField
                              size="small"
                              value={planOfCareVisitCount}
                              disabled
                              sx={{
                                width: 72,
                                '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
                                '& .MuiInputBase-input': { py: 0, px: 1.5, fontSize: 14, textAlign: 'center' },
                              }}
                            />
                          </VisitNoteFieldWrapper>
                        </Box>
                      )}

                      {section.id === 'notarize' && sub.id === 'notarize' && (
                        <NotarizeSectionContent data={data.notarize.notarize} onUpdate={updateNotarize} />
                      )}

                      {((section.id !== 'subjective' ||
                        (sub.id !== 'chief-complaint' &&
                          sub.id !== 'history-of-present-illness' &&
                          sub.id !== 'exacerbating-factors')) &&
                        (section.id !== 'objective' ||
                          (sub.id !== 'objective-comments' && sub.id !== 'measurements')) &&
                        (section.id !== 'assessment' ||
                          (sub.id !== 'diagnosis-summary' &&
                            sub.id !== 'continued-care' &&
                            sub.id !== 'additional-notes')) &&
                        (section.id !== 'plan' ||
                          (sub.id !== 'treatment-plan' && sub.id !== 'goals' && sub.id !== 'plan-of-care')) &&
                        (section.id !== 'notarize' || sub.id !== 'notarize') &&
                        mode === 'edit') && (
                        <Box sx={{ pl: 3 }}>
                          <VisitNoteTextArea
                            label=""
                            placeholder="Add content..."
                            minRows={2}
                            sx={{ width: '100%' }}
                          />
                        </Box>
                      )}

                      </Collapse>
                    </Box>
                    );
                  })}
                </Collapse>
              </Box>
            );
          })
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/** Demo providers for Notarize section (in real app would come from API). */
const NOTARIZE_DEMO_PROVIDERS: Record<string, { name: string; credentials: string; signed: boolean }> = {
  'provider-1': { name: 'DANIEL MCGUFFIE', credentials: 'PT, DPT, OCS', signed: true },
};

const FAX_DOCUMENT_OPTIONS = ['Plan of Care PDF', 'Visit Note PDF', 'Facesheet'];

type NotarizeData = VisitNoteData['notarize']['notarize'];

/** Big "Sign Note" / "Signed" block; used in both Notarize section (edit) and read view. */
function SignNoteBlock({
  data,
  onUpdate,
}: {
  data: NotarizeData;
  onUpdate: (field: keyof NotarizeData, value: string | boolean | string[]) => void;
}) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: data.signStatus === 'signed' ? '#EDF5F3' : 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        height: '160px',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<SignatureAltIcon />}
        disabled={data.signStatus === 'signed'}
        onClick={() => data.signStatus === 'unsigned' && onUpdate('signStatus', 'signed')}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          py: 1.5,
          px: 4,
          borderRadius: '9999px',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        {data.signStatus === 'signed' ? 'Signed' : 'Sign Note'}
      </Button>
      {data.signStatus === 'signed' ? (
        <Typography
          component="button"
          type="button"
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            padding: 0,
            font: 'inherit',
            textDecoration: 'underline',
            fontSize: '14px',
            lineHeight: '22px',
            '&:hover': { color: 'primary.main' },
          }}
          onClick={() => onUpdate('signStatus', 'unsigned')}
        >
          Unsign Note
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Please ensure all chart validations have been met.
        </Typography>
      )}
    </Box>
  );
}

function NotarizeSectionContent({
  data,
  onUpdate,
}: {
  data: NotarizeData;
  onUpdate: (field: keyof NotarizeData, value: string | boolean | string[]) => void;
}) {
  const primaryProviderId = data.selectedProviderIds[0];
  const primaryProvider = primaryProviderId ? NOTARIZE_DEMO_PROVIDERS[primaryProviderId] : null;

  return (
    <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {/* 1. Provider selection */}
      <VisitNoteFieldWrapper label="Provider(s)">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {primaryProvider && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <PersonOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {primaryProvider.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {primaryProvider.credentials}
                </Typography>
              </Box>
              {primaryProvider.signed && (
                <Chip
                  size="small"
                  icon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
                  label="Signed"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
          )}
          <Link component="button" type="button" sx={{ fontSize: 14, fontWeight: 500 }}>
            + Add Provider(s)
          </Link>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.overrideCredentialingValidation}
                onChange={(_, v) => onUpdate('overrideCredentialingValidation', v)}
                size="small"
              />
            }
            label="Override Provider Credentialing Validation"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: 14 } }}
          />
        </Box>
      </VisitNoteFieldWrapper>

      {/* 2. Referring provider */}
      <VisitNoteFieldWrapper label="Referring Provider">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <AssignmentOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
          <TextField
            size="small"
            placeholder="Provider name"
            value={data.referringProviderName}
            onChange={(e) => onUpdate('referringProviderName', e.target.value)}
            sx={{
              flex: 1,
              minWidth: 160,
              '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
              '& .MuiInputBase-input': { py: 0, px: 1.5, fontSize: 14 },
            }}
          />
          {data.referringProviderName && (
            <Link
              component="button"
              type="button"
              sx={{ fontSize: 14, color: 'error.main' }}
              onClick={() => onUpdate('referringProviderName', '')}
            >
              Remove
            </Link>
          )}
        </Box>
      </VisitNoteFieldWrapper>

      {/* 3. Fax number for referring provider */}
      <VisitNoteFieldWrapper label="Fax Number*">
        <TextField
          size="small"
          placeholder="+1 (xxx) xxx-xxxx"
          value={data.referringProviderFax}
          onChange={(e) => onUpdate('referringProviderFax', e.target.value)}
          sx={{
            maxWidth: 220,
            '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
            '& .MuiInputBase-input': { py: 0, px: 1.5, fontSize: 14 },
          }}
        />
      </VisitNoteFieldWrapper>

      {/* 4. Option to send fax to referring provider */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.dark', width: 180, flexShrink: 0 }}>
          Fax Note to Ref. Prov.*
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Switch
            size="small"
            checked={data.faxNoteToReferringProvider}
            onChange={(_, v) => onUpdate('faxNoteToReferringProvider', v)}
            color="primary"
          />
          <Select
            size="small"
            value={data.faxDocumentType}
            onChange={(e) => onUpdate('faxDocumentType', e.target.value)}
            displayEmpty
            sx={{
              ...baseInputSx,
              height: 28,
              minWidth: 160,
              '& .MuiSelect-select': { py: 0, px: 1.5, fontSize: 14 },
            }}
          >
            {FAX_DOCUMENT_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
          <Button size="small" variant="outlined" sx={{ textTransform: 'none' }}>
            Preview Plan Of Care PDF
          </Button>
        </Box>
      </Box>

      {/* 5. Request signature from referring provider */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.dark', width: 180, flexShrink: 0 }}>
          Request Signature
        </Typography>
        <Switch
          size="small"
          checked={data.requestSignatureFromReferring}
          onChange={(_, v) => onUpdate('requestSignatureFromReferring', v)}
          color="primary"
        />
      </Box>

      {/* 6. Include facesheet */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.dark', width: 180, flexShrink: 0 }}>
          Add facesheet
        </Typography>
        <Checkbox
          size="small"
          checked={data.includeFacesheet}
          onChange={(_, v) => onUpdate('includeFacesheet', v)}
        />
      </Box>

      {/* 7. Sign block and button */}
      <Box sx={{ mt: 2 }}>
        <SignNoteBlock data={data} onUpdate={onUpdate} />
      </Box>
    </Box>
  );
}

type PlanGoal = VisitNoteData['plan']['goals']['goals'][0];

const GOAL_STATUS_OPTIONS: { value: PlanGoal['status']; label: string }[] = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

function PlanGoalCard({
  goal,
  goalIndex,
  mode,
  onUpdate,
}: {
  goal: PlanGoal;
  goalIndex: number;
  mode: 'edit' | 'read';
  onUpdate: (index: number, field: keyof PlanGoal, value: string | number) => void;
}) {
  const targetDateLabel = goal.targetDate
    ? new Date(goal.targetDate + 'T00:00:00').toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })
    : '';

  return (
    <Box
      sx={{
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderLeftWidth: 6,
        borderRadius: 0.75,
        p: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          {mode === 'edit' ? (
            <TextField
              placeholder="Goal name goes here"
              value={goal.title}
              onChange={(e) => onUpdate(goalIndex, 'title', e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: 200,
                '& .MuiInputBase-root': { ...baseInputSx },
                '& .MuiInputBase-input': { fontSize: 16, fontWeight: 700, color: 'primary.dark' },
              }}
            />
          ) : (
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.dark' }}>
              {goal.title || 'Goal name goes here'}
            </Typography>
          )}
          <Chip
            label={goal.type === 'long-term' ? 'Long Term' : 'Short Term'}
            size="small"
            sx={{ bgcolor: 'action.hover', color: 'text.primary', fontWeight: 500 }}
          />
          {targetDateLabel && (
            <Chip
              label={`Target: ${targetDateLabel}`}
              size="small"
              sx={{ bgcolor: 'action.hover', color: 'text.primary', fontWeight: 500 }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {mode === 'edit' ? (
            <Select
              size="small"
              value={goal.status}
              onChange={(e) => onUpdate(goalIndex, 'status', e.target.value as PlanGoal['status'])}
              displayEmpty
              sx={{
                ...baseInputSx,
                height: 32,
                minWidth: 130,
                '& .MuiSelect-select': { py: 0, px: 1.5, fontSize: 14 },
              }}
            >
              {GOAL_STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {GOAL_STATUS_OPTIONS.find((o) => o.value === goal.status)?.label ?? goal.status}
            </Typography>
          )}
          <Button size="small" sx={{ minWidth: 36 }} aria-label="View progress">
            <ShowChartOutlined sx={{ fontSize: 20 }} />
          </Button>
          <Button size="small" sx={{ minWidth: 36 }} aria-label="Edit goal">
            <EditOutlined sx={{ fontSize: 20 }} />
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mb: 2, ml: 1.5 }}>
        {mode === 'edit' ? (
          <>
            <VisitNoteTextField
              label="Description"
              placeholder="Add here"
              value={goal.description}
              onChange={(e) => onUpdate(goalIndex, 'description', e.target.value)}
              sx={{ maxWidth: '100%' }}
            />
            <VisitNoteTextField
              label="Initial State"
              placeholder="Add here"
              value={goal.initialState}
              onChange={(e) => onUpdate(goalIndex, 'initialState', e.target.value)}
              sx={{ maxWidth: '100%' }}
            />
            <VisitNoteTextField
              label="Current State"
              placeholder="Add here"
              value={goal.currentState}
              onChange={(e) => onUpdate(goalIndex, 'currentState', e.target.value)}
              sx={{ maxWidth: '100%' }}
            />
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.dark', mb: 0.25 }}>Description:</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{goal.description || '—'}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.dark', mb: 0.25 }}>Initial State:</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{goal.initialState || '—'}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.dark', mb: 0.25 }}>Current State:</Typography>
            <Typography variant="body2">{goal.currentState || '—'}</Typography>
          </>
        )}
      </Box>

      <Box sx={{ pl: 2, pr: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Previous visit: {goal.previousVisitPercent}%
        </Typography>
        <Box sx={{ px: 0.5 }}>
          <Slider
            value={goal.previousVisitPercent}
            onChange={mode === 'edit' ? (_, value) => onUpdate(goalIndex, 'previousVisitPercent', value as number) : undefined}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            marks={[{ value: 0, label: '0%' }, { value: 25, label: '25%' }, { value: 50, label: '50%' }, { value: 75, label: '75%' }, { value: 100, label: '100%' }]}
            sx={{ mt: 0.5 }}
            disabled={mode === 'read'}
          />
        </Box>
      </Box>
    </Box>
  );
}

const STATE_OF_CONDITION_LABELS: Record<string, string> = {
  improving: 'Improving',
  maintaining: 'Maintaining',
  worsening: 'Worsening',
  insidious: 'Insidious',
};

const SIDE_OF_ISSUE_LABELS: Record<string, string> = {
  left: 'Left',
  right: 'Right',
  bilateral: 'Bilateral',
};

function ReadOnlyChiefComplaint({
  data,
}: {
  data: VisitNoteData['subjective']['chief-complaint'];
}) {
  const content = data.content?.trim() ?? '';
  const detailedExplanation = data.detailedExplanation?.trim() ?? '';
  const dateOfOnset = data.dateOfOnset
    ? new Date(data.dateOfOnset + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  const painRating = data.painRating ?? null;
  const hasMeta = dateOfOnset || painRating;
  if (!content && !detailedExplanation && !hasMeta) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
        No content recorded.
      </Typography>
    );
  }
  const paragraphs = content ? content.split(/\n\n+/).filter(Boolean) : [];
  const detailParagraphs = detailedExplanation ? detailedExplanation.split(/\n\n+/).filter(Boolean) : [];
  return (
    <Box sx={{ pl: 3, '& p': { mb: 0.75 }, '& p:last-of-type': { mb: 0 } }}>
      {paragraphs.map((para, i) => (
        <Typography key={i} variant="body2">
          {para}
        </Typography>
      ))}
      {detailParagraphs.map((para, i) => (
        <Typography key={`detail-${i}`} variant="body2">
          {para}
        </Typography>
      ))}
      {hasMeta && (
        <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2.5, '& li': { mb: 0.25 } }}>
          {dateOfOnset && (
            <Typography component="li" variant="body2" color="text.secondary">
              Date of onset: {dateOfOnset}
            </Typography>
          )}
          {painRating && (
            <Typography component="li" variant="body2" color="text.secondary">
              Pain rating: {painRating}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

function ReadOnlyHistoryOfPresentIllness({
  data,
}: {
  data: VisitNoteData['subjective']['history-of-present-illness'];
}) {
  const dateOfOnset = data.dateOfOnset
    ? new Date(data.dateOfOnset + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  const dateOfSurgery = data.dateOfSurgery
    ? new Date(data.dateOfSurgery + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  const stateOfCondition = data.stateOfCondition
    ? STATE_OF_CONDITION_LABELS[data.stateOfCondition] ?? data.stateOfCondition
    : null;
  const sideOfIssue = data.sideOfIssue
    ? SIDE_OF_ISSUE_LABELS[data.sideOfIssue] ?? data.sideOfIssue
    : null;
  const historyOfCondition = data.historyOfCondition?.trim() ?? '';
  const hasAny =
    dateOfOnset || dateOfSurgery || stateOfCondition || sideOfIssue || historyOfCondition;
  if (!hasAny) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
        No content recorded.
      </Typography>
    );
  }
  const items: string[] = [];
  if (dateOfOnset) items.push(`Date of onset: ${dateOfOnset}`);
  if (dateOfSurgery) items.push(`Date of surgery (if applicable): ${dateOfSurgery}`);
  if (stateOfCondition) items.push(`State of condition: ${stateOfCondition}`);
  if (sideOfIssue) items.push(`Side of issue: ${sideOfIssue}`);
  const historyParagraphs = historyOfCondition ? historyOfCondition.split(/\n\n+/).filter(Boolean) : [];
  return (
    <Box sx={{ pl: 3 }}>
      {items.length > 0 && (
        <Box component="ul" sx={{ mb: 1, pl: 2.5, '& li': { mb: 0.25 } }}>
          {items.map((text, i) => (
            <Typography key={i} component="li" variant="body2" color="text.secondary">
              {text}
            </Typography>
          ))}
        </Box>
      )}
      {historyParagraphs.map((para, i) => (
        <Typography key={i} variant="body2" sx={{ mb: 0.75 }}>
          {para}
        </Typography>
      ))}
    </Box>
  );
}

function ReadOnlyExacerbatingFactors({
  data,
}: {
  data: VisitNoteData['subjective']['exacerbating-factors'];
}) {
  const exacerbating = data.exacerbatingFactors?.trim() ?? '';
  const alleviating = data.alleviatingFactors?.trim() ?? '';
  if (!exacerbating && !alleviating) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
        No content recorded.
      </Typography>
    );
  }
  const exParagraphs = exacerbating ? exacerbating.split(/\n\n+/).filter(Boolean) : [];
  const alParagraphs = alleviating ? alleviating.split(/\n\n+/).filter(Boolean) : [];
  return (
    <Box sx={{ pl: 3, '& p': { mb: 0.75 } }}>
      {exParagraphs.length > 0 && (
        <>
          <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 0.5 }}>
            Exacerbating factors
          </Typography>
          {exParagraphs.map((para, i) => (
            <Typography key={i} variant="body2">
              {para}
            </Typography>
          ))}
        </>
      )}
      {alParagraphs.length > 0 && (
        <>
          <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
            Alleviating factors
          </Typography>
          {alParagraphs.map((para, i) => (
            <Typography key={i} variant="body2">
              {para}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
}

/** Renders one section's edit form (all subsections). Used when editing a single section from read view. */
function SingleSectionEditForm({
  section,
  data,
  mode,
  planOfCareVisitCount,
  updateChiefComplaintContent,
  updateChiefComplaintDetailedExplanation,
  updateChiefComplaintDateOfOnset,
  updateChiefComplaintPainRating,
  updateHistoryOfPresentIllness,
  updateExacerbatingFactors,
  updateObjectiveComments,
  updateMeasurementCell,
  updateDiagnosisSummaryCptCodes,
  updateDiagnosisSummarySummary,
  updateContinuedCare,
  updateAdditionalNotes,
  updateTreatmentPlanContent,
  updatePlanGoal,
  updatePlanOfCare,
  updateNotarize,
}: {
  section: SectionDef;
  data: VisitNoteData;
  mode: 'edit' | 'read';
  planOfCareVisitCount: number;
  updateChiefComplaintContent: (v: string) => void;
  updateChiefComplaintDetailedExplanation: (v: string) => void;
  updateChiefComplaintDateOfOnset: (v: string) => void;
  updateChiefComplaintPainRating: (v: string | null) => void;
  updateHistoryOfPresentIllness: (
    field: keyof VisitNoteData['subjective']['history-of-present-illness'],
    value: string | null
  ) => void;
  updateExacerbatingFactors: (field: 'exacerbatingFactors' | 'alleviatingFactors', value: string) => void;
  updateObjectiveComments: (v: string) => void;
  updateMeasurementCell: (
    tableId: keyof VisitNoteData['objective']['measurements'],
    rowIndex: number,
    colIndex: number,
    value: string
  ) => void;
  updateDiagnosisSummaryCptCodes: (v: string[]) => void;
  updateDiagnosisSummarySummary: (v: string) => void;
  updateContinuedCare: (v: string) => void;
  updateAdditionalNotes: (v: string) => void;
  updateTreatmentPlanContent: (v: string) => void;
  updatePlanGoal: (goalIndex: number, field: keyof VisitNoteData['plan']['goals']['goals'][0], value: string | number) => void;
  updatePlanOfCare: (
    field: keyof VisitNoteData['plan']['plan-of-care'],
    value: string | number
  ) => void;
  updateNotarize: (
    field: keyof VisitNoteData['notarize']['notarize'],
    value: string | boolean | string[]
  ) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {section.subsections.map((sub) => (
        <Box
          key={sub.id}
          id={sub.anchorId}
          sx={{
            mb: 2,
            scrollMarginTop: 24,
            pt: 1,
            pb: 1,
            px: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 24 }}>
              {sub.label}
            </Typography>
            {mode === 'edit' && CARRY_FORWARD_SOURCES[sub.id] && (
              <CarryForwardSourceTag source={CARRY_FORWARD_SOURCES[sub.id]!} />
            )}
          </Box>
          <SubsectionFormContent
            section={section}
            sub={sub}
            data={data}
            mode={mode}
            planOfCareVisitCount={planOfCareVisitCount}
            updateChiefComplaintContent={updateChiefComplaintContent}
            updateChiefComplaintDetailedExplanation={updateChiefComplaintDetailedExplanation}
            updateChiefComplaintDateOfOnset={updateChiefComplaintDateOfOnset}
            updateChiefComplaintPainRating={updateChiefComplaintPainRating}
            updateHistoryOfPresentIllness={updateHistoryOfPresentIllness}
            updateExacerbatingFactors={updateExacerbatingFactors}
            updateObjectiveComments={updateObjectiveComments}
            updateMeasurementCell={updateMeasurementCell}
            updateDiagnosisSummaryCptCodes={updateDiagnosisSummaryCptCodes}
            updateDiagnosisSummarySummary={updateDiagnosisSummarySummary}
            updateContinuedCare={updateContinuedCare}
            updateAdditionalNotes={updateAdditionalNotes}
            updateTreatmentPlanContent={updateTreatmentPlanContent}
            updatePlanGoal={updatePlanGoal}
            updatePlanOfCare={updatePlanOfCare}
            updateNotarize={updateNotarize}
          />
        </Box>
      ))}
    </Box>
  );
}

/** Renders form or read-only content for one subsection. Shared by full edit view and inline section edit. */
function SubsectionFormContent({
  section,
  sub,
  data,
  mode,
  planOfCareVisitCount,
  updateChiefComplaintContent,
  updateChiefComplaintDetailedExplanation,
  updateChiefComplaintDateOfOnset,
  updateChiefComplaintPainRating,
  updateHistoryOfPresentIllness,
  updateExacerbatingFactors,
  updateObjectiveComments,
  updateMeasurementCell,
  updateDiagnosisSummaryCptCodes,
  updateDiagnosisSummarySummary,
  updateContinuedCare,
  updateAdditionalNotes,
  updateTreatmentPlanContent,
  updatePlanGoal,
  updatePlanOfCare,
  updateNotarize,
}: {
  section: SectionDef;
  sub: SubsectionDef;
  data: VisitNoteData;
  mode: 'edit' | 'read';
  planOfCareVisitCount: number;
  updateChiefComplaintContent: (v: string) => void;
  updateChiefComplaintDetailedExplanation: (v: string) => void;
  updateChiefComplaintDateOfOnset: (v: string) => void;
  updateChiefComplaintPainRating: (v: string | null) => void;
  updateHistoryOfPresentIllness: (
    field: keyof VisitNoteData['subjective']['history-of-present-illness'],
    value: string | null
  ) => void;
  updateExacerbatingFactors: (field: 'exacerbatingFactors' | 'alleviatingFactors', value: string) => void;
  updateObjectiveComments: (v: string) => void;
  updateMeasurementCell: (
    tableId: keyof VisitNoteData['objective']['measurements'],
    rowIndex: number,
    colIndex: number,
    value: string
  ) => void;
  updateDiagnosisSummaryCptCodes: (v: string[]) => void;
  updateDiagnosisSummarySummary: (v: string) => void;
  updateContinuedCare: (v: string) => void;
  updateAdditionalNotes: (v: string) => void;
  updateTreatmentPlanContent: (v: string) => void;
  updatePlanGoal: (goalIndex: number, field: keyof VisitNoteData['plan']['goals']['goals'][0], value: string | number) => void;
  updatePlanOfCare: (
    field: keyof VisitNoteData['plan']['plan-of-care'],
    value: string | number
  ) => void;
  updateNotarize: (
    field: keyof VisitNoteData['notarize']['notarize'],
    value: string | boolean | string[]
  ) => void;
}) {
  if (section.id === 'subjective' && sub.id === 'chief-complaint') {
    return mode === 'edit' ? (
      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <VisitNoteTextArea
          label="Chief Complaint"
          placeholder="Add here"
          minRows={4}
          value={data.subjective['chief-complaint'].content}
          onChange={(e) => updateChiefComplaintContent(e.target.value)}
          sx={{ width: '100%' }}
        />
        <VisitNoteTextArea
          label="Patient Comments"
          placeholder="Add details about morning stiffness, getting up from bed, and impact on the day..."
          minRows={3}
          value={data.subjective['chief-complaint'].detailedExplanation}
          onChange={(e) => updateChiefComplaintDetailedExplanation(e.target.value)}
          sx={{ width: '100%' }}
        />
        <VisitNoteDateField
          label="Date of onset"
          value={data.subjective['chief-complaint'].dateOfOnset}
          onChange={(e) => updateChiefComplaintDateOfOnset(e.target.value)}
          sx={{ width: '100%' }}
        />
        <VisitNoteRadioSelect
          label="Pain rating"
          options={Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
          value={data.subjective['chief-complaint'].painRating}
          onChange={updateChiefComplaintPainRating}
          sx={{ width: '100%' }}
        />
      </Box>
    ) : (
      <ReadOnlyChiefComplaint data={data.subjective['chief-complaint']} />
    );
  }
  if (section.id === 'subjective' && sub.id === 'history-of-present-illness') {
    return mode === 'edit' ? (
      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <VisitNoteDateField
          label="Date of Onset"
          value={data.subjective['history-of-present-illness'].dateOfOnset}
          onChange={(e) => updateHistoryOfPresentIllness('dateOfOnset', e.target.value)}
        />
        <VisitNoteDateField
          label="Date of Surgery (If Applicable)"
          value={data.subjective['history-of-present-illness'].dateOfSurgery}
          onChange={(e) => updateHistoryOfPresentIllness('dateOfSurgery', e.target.value)}
        />
        <VisitNoteRadioSelect
          label="State of Condition"
          options={[
            { value: 'improving', label: 'Improving' },
            { value: 'maintaining', label: 'Maintaining' },
            { value: 'worsening', label: 'Worsening' },
            { value: 'insidious', label: 'Insidious' },
          ]}
          value={data.subjective['history-of-present-illness'].stateOfCondition}
          onChange={(v) => updateHistoryOfPresentIllness('stateOfCondition', v)}
          sx={{ width: '100%' }}
        />
        <VisitNoteRadioSelect
          label="Side of Issue"
          options={[
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'bilateral', label: 'Bilateral' },
          ]}
          value={data.subjective['history-of-present-illness'].sideOfIssue}
          onChange={(v) => updateHistoryOfPresentIllness('sideOfIssue', v)}
          sx={{ width: '100%' }}
        />
        <VisitNoteTextArea
          label="History of Condition"
          placeholder="Add here"
          minRows={3}
          value={data.subjective['history-of-present-illness'].historyOfCondition}
          onChange={(e) => updateHistoryOfPresentIllness('historyOfCondition', e.target.value)}
          sx={{ width: '100%' }}
        />
      </Box>
    ) : (
      <ReadOnlyHistoryOfPresentIllness data={data.subjective['history-of-present-illness']} />
    );
  }
  if (section.id === 'subjective' && sub.id === 'exacerbating-factors') {
    return mode === 'edit' ? (
      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <VisitNoteTextArea
          label="Exacerbating Factors"
          placeholder="Add here"
          minRows={3}
          value={data.subjective['exacerbating-factors'].exacerbatingFactors}
          onChange={(e) => updateExacerbatingFactors('exacerbatingFactors', e.target.value)}
          sx={{ width: '100%' }}
        />
        <VisitNoteTextArea
          label="Alleviating Factors"
          placeholder="Add here"
          minRows={3}
          value={data.subjective['exacerbating-factors'].alleviatingFactors}
          onChange={(e) => updateExacerbatingFactors('alleviatingFactors', e.target.value)}
          sx={{ width: '100%' }}
        />
      </Box>
    ) : (
      <ReadOnlyExacerbatingFactors data={data.subjective['exacerbating-factors']} />
    );
  }
  if (section.id === 'objective' && sub.id === 'objective-comments') {
    return mode === 'edit' ? (
      <Box sx={{ pl: 3 }}>
        <VisitNoteTextArea
          label="Comments"
          placeholder="Add here"
          minRows={3}
          value={data.objective['objective-comments'].comments}
          onChange={(e) => updateObjectiveComments(e.target.value)}
          sx={{ width: '100%' }}
        />
      </Box>
    ) : (
      <Box sx={{ pl: 3 }}>
        <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
          {data.objective['objective-comments'].comments || '—'}
        </Typography>
      </Box>
    );
  }
  if (section.id === 'objective' && sub.id === 'measurements') {
    return (
      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <VisitNoteMeasurementsTable
          title="Lumbar Mobility"
          columnLabels={['Left', 'Right']}
          rows={[
            { measurementName: 'Lumbar Flexion (degrees)', previousValues: ['52', '48'] },
            { measurementName: 'Lumbar Extension (degrees)', previousValues: ['22', '20'] },
            { measurementName: 'Lumbar Side Bend Left (degrees)', previousValues: ['28', ''] },
            { measurementName: 'Lumbar Side Bend Right (degrees)', previousValues: ['', '26'] },
          ]}
          values={data.objective.measurements['lumbar-mobility']}
          onCellChange={mode === 'edit' ? (ri, ci, v) => updateMeasurementCell('lumbar-mobility', ri, ci, v) : undefined}
          readOnly={mode === 'read'}
        />
        <VisitNoteMeasurementsTable
          title="Thoracic Measurements"
          columnLabels={['Left', 'Right']}
          rows={[
            { measurementName: 'Thoracic Rotation Left (degrees)', previousValues: ['38', ''] },
            { measurementName: 'Thoracic Rotation Right (degrees)', previousValues: ['', '35'] },
            { measurementName: 'Thoracic Extension (degrees)', previousValues: ['18', '18'] },
            { measurementName: 'Thoracic Side Bend (degrees)', previousValues: ['24', '22'] },
          ]}
          values={data.objective.measurements.thoracic}
          onCellChange={mode === 'edit' ? (ri, ci, v) => updateMeasurementCell('thoracic', ri, ci, v) : undefined}
          readOnly={mode === 'read'}
        />
        <VisitNoteMeasurementsTable
          title="General Upright Range of Motion"
          columnLabels={['Value']}
          rows={[
            { measurementName: 'Standing Forward Reach (cm)', previousValues: ['28'] },
            { measurementName: 'Sit-to-Stand (reps in 30 sec)', previousValues: ['10'] },
            { measurementName: 'Single-Leg Stance Time – Left (sec)', previousValues: ['12'] },
            { measurementName: 'Single-Leg Stance Time – Right (sec)', previousValues: ['14'] },
          ]}
          values={data.objective.measurements['general-upright']}
          onCellChange={mode === 'edit' ? (ri, ci, v) => updateMeasurementCell('general-upright', ri, ci, v) : undefined}
          readOnly={mode === 'read'}
        />
      </Box>
    );
  }
  if (section.id === 'assessment' && sub.id === 'diagnosis-summary') {
    return mode === 'edit' ? (
      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <VisitNoteChipSelect
          label="CPT codes"
          options={CPT_CODE_OPTIONS}
          value={data.assessment['diagnosis-summary'].cptCodes}
          onChange={updateDiagnosisSummaryCptCodes}
          placeholder="Add CPT codes"
          searchPlaceholder="Search CPT codes..."
          sx={{ width: '100%' }}
        />
        <VisitNoteTextArea
          label="Summary"
          placeholder="Describe the diagnoses the provider has selected..."
          minRows={4}
          value={data.assessment['diagnosis-summary'].summary}
          onChange={(e) => updateDiagnosisSummarySummary(e.target.value)}
          sx={{ width: '100%' }}
        />
      </Box>
    ) : (
      <Box sx={{ pl: 3 }}>
        {data.assessment['diagnosis-summary'].cptCodes.length > 0 && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            CPT codes: {data.assessment['diagnosis-summary'].cptCodes.join(', ')}
          </Typography>
        )}
        <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
          {data.assessment['diagnosis-summary'].summary || '—'}
        </Typography>
      </Box>
    );
  }
  if (section.id === 'assessment' && sub.id === 'continued-care') {
    return mode === 'edit' ? (
      <Box sx={{ pl: 3 }}>
        <VisitNoteTextArea
          label="Continued care"
          placeholder="Reasoning why care should be continued..."
          minRows={4}
          value={data.assessment['continued-care'].content}
          onChange={(e) => updateContinuedCare(e.target.value)}
          sx={{ width: '100%' }}
        />
      </Box>
    ) : (
      <Box sx={{ pl: 3 }}>
        <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
          {data.assessment['continued-care'].content || '—'}
        </Typography>
      </Box>
    );
  }
  if (section.id === 'assessment' && sub.id === 'additional-notes') {
    return mode === 'edit' ? (
      <Box sx={{ pl: 3 }}>
        <VisitNoteTextArea
          label="Additional notes"
          placeholder="Extra notes about the diagnosis..."
          minRows={3}
          value={data.assessment['additional-notes'].content}
          onChange={(e) => updateAdditionalNotes(e.target.value)}
          sx={{ width: '100%' }}
        />
      </Box>
    ) : (
      <Box sx={{ pl: 3 }}>
        <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
          {data.assessment['additional-notes'].content || '—'}
        </Typography>
      </Box>
    );
  }
  if (section.id === 'plan' && sub.id === 'treatment-plan') {
    return mode === 'edit' ? (
      <Box sx={{ pl: 3 }}>
        <VisitNoteTextArea
          label="Treatment Plan"
          placeholder="Add content..."
          minRows={4}
          value={data.plan['treatment-plan'].content}
          onChange={(e) => updateTreatmentPlanContent(e.target.value)}
          sx={{ width: '100%' }}
        />
      </Box>
    ) : (
      <Box sx={{ pl: 3 }}>
        <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
          {data.plan['treatment-plan'].content || '—'}
        </Typography>
      </Box>
    );
  }
  if (section.id === 'plan' && sub.id === 'goals') {
    return (
      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.plan.goals.goals.map((goal, idx) => (
          <PlanGoalCard
            key={goal.id}
            goal={goal}
            goalIndex={idx}
            mode={mode}
            onUpdate={updatePlanGoal}
          />
        ))}
      </Box>
    );
  }
  if (section.id === 'plan' && sub.id === 'plan-of-care') {
    return (
      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <VisitNoteFieldWrapper label="Duration">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TextField
                size="small"
                placeholder="0"
                value={data.plan['plan-of-care'].durationValue}
                onChange={(e) => updatePlanOfCare('durationValue', e.target.value)}
                sx={{
                  width: 72,
                  '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
                  '& .MuiInputBase-input': { py: 0, px: 1.5, fontSize: 14, textAlign: 'center' },
                }}
              />
              <Select
                size="small"
                value={data.plan['plan-of-care'].durationUnit}
                onChange={(e) => updatePlanOfCare('durationUnit', e.target.value as VisitNoteData['plan']['plan-of-care']['durationUnit'])}
                displayEmpty
                IconComponent={KeyboardArrowDownOutlined}
                sx={{
                  ...baseInputSx,
                  height: 28,
                  minWidth: 100,
                  '& .MuiSelect-select': { py: 0, px: 1.5, fontSize: 14 },
                }}
              >
                <MenuItem value="days">Days</MenuItem>
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="months">Months</MenuItem>
              </Select>
            </Box>
          </VisitNoteFieldWrapper>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <VisitNoteFieldWrapper label="Frequency">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TextField
                size="small"
                placeholder="0"
                value={data.plan['plan-of-care'].frequencyValue}
                onChange={(e) => updatePlanOfCare('frequencyValue', e.target.value)}
                sx={{
                  width: 72,
                  '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
                  '& .MuiInputBase-input': { py: 0, px: 1.5, fontSize: 14, textAlign: 'center' },
                }}
              />
              <Select
                size="small"
                value={data.plan['plan-of-care'].frequencyUnit}
                onChange={(e) => updatePlanOfCare('frequencyUnit', e.target.value as VisitNoteData['plan']['plan-of-care']['frequencyUnit'])}
                displayEmpty
                IconComponent={KeyboardArrowDownOutlined}
                sx={{
                  ...baseInputSx,
                  height: 28,
                  minWidth: 110,
                  '& .MuiSelect-select': { py: 0, px: 1.5, fontSize: 14 },
                }}
              >
                <MenuItem value="per-week">Per Week</MenuItem>
                <MenuItem value="per-month">Per Month</MenuItem>
                <MenuItem value="per-year">Per Year</MenuItem>
              </Select>
            </Box>
          </VisitNoteFieldWrapper>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <VisitNoteFieldWrapper label="Care Timeline">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <VisitNoteDateField
                label=""
                value={data.plan['plan-of-care'].careTimelineStart}
                onChange={(e) => updatePlanOfCare('careTimelineStart', e.target.value)}
                placeholder="mm/dd/yyyy"
              />
              <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>→</Typography>
              <VisitNoteDateField
                label=""
                value={data.plan['plan-of-care'].careTimelineEnd}
                onChange={(e) => updatePlanOfCare('careTimelineEnd', e.target.value)}
                placeholder="mm/dd/yyyy"
              />
            </Box>
          </VisitNoteFieldWrapper>
        </Box>
        <VisitNoteFieldWrapper label="Visit Count" sublabel="Auto-calculated" disabled>
          <TextField
            size="small"
            value={planOfCareVisitCount}
            disabled
            sx={{
              width: 72,
              '& .MuiInputBase-root': { ...baseInputSx, height: 28 },
              '& .MuiInputBase-input': { py: 0, px: 1.5, fontSize: 14, textAlign: 'center' },
            }}
          />
        </VisitNoteFieldWrapper>
      </Box>
    );
  }
  if (section.id === 'notarize' && sub.id === 'notarize') {
    return <NotarizeSectionContent data={data.notarize.notarize} onUpdate={updateNotarize} />;
  }
  return null;
}
