import React, { useState, useCallback, useMemo, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Paper,
  useTheme,
} from '@mui/material';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import BoltOutlined from '@mui/icons-material/BoltOutlined';
import StopOutlined from '@mui/icons-material/StopOutlined';
import PauseOutlined from '@mui/icons-material/PauseOutlined';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import { keyframes } from '@mui/system';
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
import LockOutlined from '@mui/icons-material/LockOutlined';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import type { Appointment } from '../../data/mockAppointments';
import { VISIT_NOTE_BUTTON_EXEMPT_CLASS } from '../../theme/buttonStyleConstants';
import {
  VISIT_NOTE_SECTIONS,
  DEFAULT_VISIT_NOTE_DATA,
  EMPTY_VISIT_NOTE_DATA,
  CPT_CODE_OPTIONS,
  getVisibleVisitNoteSections,
  ORTHO_PLAN_ORDERS_SUBSECTION,
  ORTHO_PLAN_SERVICES_SUBSECTION,
  type VisitNoteData,
  type SectionDef,
  type SubsectionDef,
} from '../../data/visitNoteSections';
import {
  ORTHO_PATIENT_IDS,
  DEFAULT_ORTHO_VISIT_NOTE_DATA,
  DEFAULT_ORTHO_NOTE_EXTRAS,
  EMPTY_ORTHO_NOTE_EXTRAS,
  type OrthoNoteExtras,
} from '../../data/mockOrthoNoteData';
import { VisitNoteOrdersSection } from './VisitNoteFields/VisitNoteOrdersSection';
import { VisitNoteServicesSection } from './VisitNoteFields/VisitNoteServicesSection';
import { AICheckIcon } from '../icons';
import { useAssistantShortcutOverrideOptional } from './AssistantShortcutsContext';
import {
  VISIT_NOTE_SIGNED_ASSISTANT_SHORTCUTS,
  VISIT_NOTE_UNSIGNED_ASSISTANT_SHORTCUTS,
} from './assistantPanelShortcuts';
import { useAppScribe } from './AppScribeContext';
import {
  useAICheckActionsOptional,
  type AICheckSuggestionResolution,
} from './AICheckActionsContext';
import { useAppAssistantOptional } from './AppAssistantContext';

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

/** Dictate toolbar icon – uses currentColor for text/accent. */
function DictateIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20" fill="none">
      <path
        d="M17.3487 10.4081C17.5756 10.4081 17.7655 10.4914 17.9184 10.6579C18.0712 10.8242 18.129 11.0216 18.0909 11.25C17.924 12.4123 17.4284 13.4078 16.6044 14.2352C15.7804 15.0626 14.7832 15.5467 13.6139 15.6877V16.7259C13.6139 16.9538 13.536 17.1464 13.3796 17.3037C13.223 17.4608 13.0312 17.5391 12.8045 17.5391C12.5778 17.539 12.3852 17.4607 12.2261 17.3037C12.0672 17.1464 11.9874 16.9538 11.9874 16.7259V15.6877C10.8183 15.5467 9.81999 15.0607 8.99262 14.2301C8.16519 13.3992 7.66767 12.4022 7.50065 11.2397C7.4625 11.0114 7.52136 10.8159 7.67643 10.6528C7.83137 10.4898 8.02169 10.4081 8.24718 10.4081C8.47263 10.4082 8.6684 10.4893 8.8342 10.6517C9.00003 10.814 9.10825 11.0073 9.15864 11.2315C9.35151 12.1003 9.79004 12.802 10.4737 13.3357C11.1574 13.8693 11.9302 14.1365 12.7925 14.1365C13.6668 14.1365 14.4455 13.8663 15.1287 13.3265C15.812 12.7866 16.2498 12.0881 16.4427 11.2315C16.4931 11.0073 16.6006 10.814 16.7639 10.6517C16.9272 10.4894 17.1221 10.4081 17.3487 10.4081Z"
        fill="currentColor"
      />
      <path
        d="M12.8012 3.50432C13.5207 3.50443 14.1315 3.75558 14.6339 4.25781C15.1364 4.76022 15.388 5.37179 15.388 6.09169V10.4081C15.388 11.128 15.1364 11.7396 14.6339 12.242C14.1315 12.7441 13.5206 12.9954 12.8012 12.9955C12.0816 12.9955 11.4699 12.7443 10.9674 12.242C10.4649 11.7396 10.2133 11.128 10.2133 10.4081V6.09169C10.2133 5.37179 10.4649 4.76022 10.9674 4.25781C11.4699 3.75542 12.0815 3.50432 12.8012 3.50432Z"
        fill="currentColor"
      />
      <path
        d="M5.72114 2.32422C6.10442 2.32436 6.41538 2.61902 6.41558 2.98211C6.41558 3.34537 6.10454 3.63987 5.72114 3.64001C5.08192 3.64001 4.56337 4.13127 4.56337 4.73684V15.2632C4.56337 15.8687 5.08192 16.36 5.72114 16.36C6.10454 16.3601 6.41558 16.6546 6.41558 17.0179C6.41539 17.381 6.10443 17.6756 5.72114 17.6758C4.99044 17.6758 4.33328 17.3821 3.86892 16.9151C3.40457 17.3821 2.74741 17.6758 2.01671 17.6758C1.63342 17.6756 1.32245 17.381 1.32227 17.0179C1.32227 16.6546 1.6333 16.3601 2.01671 16.36C2.65593 16.36 3.17448 15.8687 3.17448 15.2632V4.73684C3.17447 4.13127 2.65592 3.64001 2.01671 3.64001C1.6333 3.63987 1.32227 3.34537 1.32227 2.98211C1.32247 2.61902 1.63343 2.32436 2.01671 2.32422C2.74712 2.32422 3.4046 2.61716 3.86892 3.08388C4.33325 2.61716 4.99073 2.32422 5.72114 2.32422Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

/** Scribe toolbar icon – uses currentColor (white on primary button). */
function ScribeIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20" fill="none">
      <path
        d="M17.3217 10.3926C17.5259 10.3926 17.6968 10.4717 17.8344 10.6299C17.9719 10.7879 18.0239 10.9754 17.9896 11.1924C17.8394 12.2966 17.3934 13.2423 16.6517 14.0283C15.9101 14.8143 15.0127 15.2742 13.9603 15.4082V16.3945C13.9603 16.611 13.8902 16.794 13.7494 16.9434C13.6085 17.0926 13.4359 17.167 13.2318 17.167C13.0279 17.167 12.8544 17.0925 12.7113 16.9434C12.5682 16.794 12.4965 16.611 12.4965 16.3945V15.4082C11.4443 15.2742 10.5458 14.8125 9.80115 14.0234C9.05646 13.2341 8.6087 12.287 8.45838 11.1826C8.42404 10.9657 8.47701 10.78 8.61658 10.625C8.75602 10.4702 8.92731 10.3926 9.13025 10.3926C9.33316 10.3927 9.50935 10.4698 9.65857 10.624C9.80782 10.7782 9.90522 10.9618 9.95056 11.1748C10.1241 12.0001 10.5188 12.6668 11.1342 13.1738C11.7494 13.6807 12.445 13.9346 13.2211 13.9346C14.0079 13.9346 14.7087 13.6779 15.3236 13.165C15.9386 12.6522 16.3326 11.9885 16.5062 11.1748C16.5516 10.9618 16.6483 10.7782 16.7953 10.624C16.9423 10.4698 17.1177 10.3926 17.3217 10.3926Z"
        fill="currentColor"
      />
      <path
        d="M13.2289 3.83398C13.8764 3.83409 14.4262 4.07268 14.8783 4.5498C15.3306 5.0271 15.557 5.60808 15.557 6.29199V10.3926C15.557 11.0765 15.3306 11.6575 14.8783 12.1348C14.4262 12.6118 13.8763 12.8505 13.2289 12.8506C12.5812 12.8506 12.0307 12.612 11.5785 12.1348C11.1262 11.6575 10.8998 11.0765 10.8998 10.3926V6.29199C10.8998 5.60808 11.1262 5.0271 11.5785 4.5498C12.0307 4.07253 12.5812 3.83398 13.2289 3.83398Z"
        fill="currentColor"
      />
      <path
        d="M9.7002 0.399414C10.0868 0.399414 10.4004 0.71301 10.4004 1.09961C10.4004 1.48621 10.0868 1.7998 9.7002 1.7998H3.7002C3.3136 1.7998 3 1.48621 3 1.09961C3 0.71301 3.3136 0.399414 3.7002 0.399414H9.7002Z"
        fill="currentColor"
      />
      <path
        d="M8.7002 7.0002C9.08679 7.0002 9.40039 6.6866 9.40039 6.3C9.40039 5.9134 9.08679 5.5998 8.7002 5.5998H3.7002C3.3136 5.5998 3 5.9134 3 6.3C3 6.6866 3.3136 7.0002 3.7002 7.0002H8.7002Z"
        fill="currentColor"
      />
      <path
        d="M6.7002 10.8002C7.08679 10.8002 7.40039 11.1138 7.40039 11.5004C7.40039 11.887 7.08679 12.2006 6.7002 12.2006H3.7002C3.3136 12.2006 3 11.887 3 11.5004C3 11.1138 3.3136 10.8002 3.7002 10.8002H6.7002Z"
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
  canEdit = true,
  onCitationClick,
  highlightedCitationInNote,
}: {
  sectionId: string;
  title: string;
  content: string;
  onEdit: () => void;
  /** When false, the per-section Edit pencil is hidden — e.g. after the note
   *  has been signed and no addendum is in progress. */
  canEdit?: boolean;
  onCitationClick?: (citationNumber: number) => void;
  highlightedCitationInNote?: number;
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
          {canEdit && (
            <IconButton size="small" onClick={onEdit} aria-label="Edit" title="Edit" sx={iconButtonSx}>
              <EditOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <IconButton size="small" onClick={handleCopyLink} aria-label="Copy link" title="Copy link" sx={iconButtonSx}>
            <LinkOutlined sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
      <Box>
        {(sectionId === 'objective' || sectionId === 'assessment') ? (
          <ReadViewSectionFormatted sectionId={sectionId} content={content} onCitationClick={onCitationClick} highlightedCitationInNote={highlightedCitationInNote} />
        ) : (
          <ReadViewParagraphsWithCitations sectionId={sectionId} content={content} onCitationClick={onCitationClick} highlightedCitationInNote={highlightedCitationInNote} />
        )}
      </Box>
    </Box>
  );
}

/**
 * Empty-state placeholder shown for each SOAP block in read view before the
 * scribe has populated the chart (i.e. before "Submit to Chart"). Mirrors
 * the visual hierarchy of the edit-view section headers (large bold title
 * with a caret) so the empty note still scans as a structured chart, and
 * tells the provider where the content will land.
 */
function ReadViewEmptySectionBlock({
  sectionId,
  title,
}: {
  sectionId: string;
  title: string;
}) {
  return (
    <Box
      id={`read-${sectionId}`}
      sx={{
        mb: 3,
        scrollMarginTop: 24,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 0.5,
          mb: 1.5,
        }}
      >
        <KeyboardArrowDownOutlined sx={{ fontSize: 24, color: 'text.primary' }} />
        <Typography sx={{ fontWeight: 700, fontSize: 36, lineHeight: 1.2 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ pl: 4.25 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14, lineHeight: 1.6 }}>
          Content will appear here after you’ve completed your scribe.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14, lineHeight: 1.6 }}>
          (You can also fill the note manually in Edit mode, accessible in the toolbar)
        </Typography>
      </Box>
    </Box>
  );
}

/** Renders objective/assessment read content with paragraphs and bulleted lists (measurements, goal progress). */
function ReadViewSectionFormatted({
  sectionId,
  content,
  onCitationClick,
  highlightedCitationInNote,
}: {
  sectionId: string;
  content: string;
  onCitationClick?: (citationNumber: number) => void;
  highlightedCitationInNote?: number;
}) {
  const segments = content.split(/\n\n+/).filter(Boolean);
  const nodes: React.ReactNode[] = [];
  let segIdx = 0;
  let contentSegmentIndex = 0;
  const citations = SECTION_CITATION_NUMBERS[sectionId] ?? [];
  const typographySx = { fontSize: 14, lineHeight: 1.6 } as const;
  const listSx = { mt: 0.5, mb: 1, pl: 2.5 } as const;

  const pushParagraphWithCitation = (text: string) => {
    const citationNums = citations[contentSegmentIndex] !== undefined ? [citations[contentSegmentIndex]] : [];
    if (citationNums.length > 0) contentSegmentIndex++;
    return (
      <Box key={segIdx} component="span" sx={{ display: 'block', mb: 1 }}>
        <Typography component="span" variant="body2" sx={typographySx}>
          {text}
          {citationNums.length > 0 && (
            <>
              {' '}
              {citationNums.map((n) => (
                <CitationBadge key={n} number={n} onClick={onCitationClick} isHighlighted={highlightedCitationInNote === n} />
              ))}
            </>
          )}
        </Typography>
      </Box>
    );
  };

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
      nodes.push(pushParagraphWithCitation(lines[0]));
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
      nodes.push(pushParagraphWithCitation(lines[0]));
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
        <Box key={segIdx} component="ul" sx={{ ...listSx, mb: 1 }}>
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
  /** Called when the user clicks "AI Check" in the toolbar (typically opens the Ask Athelas chat with an AI Check report). */
  onAICheckClick?: () => void;
  /** Number of available AI Check suggestions; rendered as a badge on the AI Check toolbar button. */
  aiCheckSuggestionCount?: number;
  /** When provided, the Scribe button opens the Scribe panel and shows active state when open. */
  onScribeClick?: () => void;
  /** When true, the Scribe button shows active state (panel open). */
  isScribePanelOpen?: boolean;
  /** Current Scribe recording state; when not idle, the toolbar shows the recording/processing UI. */
  scribeRecordingState?: ScribeRecordingState;
  /** Called when user pauses or resumes recording. */
  onScribePause?: () => void;
  /** Called when user ends the recording (toolbar then shows processing, then returns to normal). */
  onScribeEndRecording?: () => void;
  /** When provided, citation badges are clickable and this is called with the citation number (opens citation panel). */
  onCitationClick?: (citationNumber: number) => void;
  /** When set, the citation badge with this number is shown as highlighted (e.g. when user selects a card in the citation panel). */
  highlightedCitationInNote?: number;
}

/** Citation details panel for the secondary content panel: one card per citation (source label, quote, kind badge). */
export function CitationPanelContent({
  highlightedCitationNumber,
  onCitationCardClick,
}: {
  /** When set, scroll this citation’s card into view after mount. */
  highlightedCitationNumber?: number;
  /** Called when a citation card is clicked; use to highlight the corresponding citation in the note. */
  onCitationCardClick?: (citationNumber: number) => void;
} = {}) {
  const cardRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  useEffect(() => {
    if (highlightedCitationNumber == null) return;
    const el = cardRefs.current.get(highlightedCitationNumber);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [highlightedCitationNumber]);

  const noteQuotesPerSource = getNoteQuotesPerSource();

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {CARRY_FORWARD_CITATION_DETAILS.map((detail) => {
        const isActive = highlightedCitationNumber === detail.number;
        const noteQuotes = noteQuotesPerSource[detail.number] ?? [];
        return (
        <Paper
          key={detail.number}
          ref={(ref) => {
            cardRefs.current.set(detail.number, ref);
          }}
          component="button"
          type="button"
          variant="outlined"
          onClick={() => onCitationCardClick?.(detail.number)}
          sx={{
            p: 1.5,
            width: '100%',
            textAlign: 'left',
            cursor: onCitationCardClick ? 'pointer' : undefined,
            bgcolor: isActive ? 'primary.light' : 'background.paper',
            border: '1px solid',
            borderColor: isActive ? 'primary.main' : 'divider',
            '&:hover': onCitationCardClick ? { bgcolor: isActive ? 'primary.light' : 'action.hover' } : undefined,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', flex: 1 }}>
              {detail.sourceLabel}
            </Typography>
            <Chip
              label={detail.kind}
              size="small"
              sx={{
                flexShrink: 0,
                fontSize: 10,
                height: 20,
                fontWeight: 600,
                bgcolor: detail.kind === 'Direct' ? 'primary.light' : 'grey.200',
                color: detail.kind === 'Direct' ? 'primary.dark' : 'text.secondary',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {noteQuotes.map((quote, idx) => (
              <Typography
                key={idx}
                variant="body2"
                sx={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                "{quote}"
              </Typography>
            ))}
          </Box>
        </Paper>
        );
      })}
    </Box>
  );
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

/**
 * SOAP narrative content for the Read view of orthopedic notes.
 * Mirrors the content authored in DEFAULT_ORTHO_VISIT_NOTE_DATA + DEFAULT_ORTHO_NOTE_EXTRAS
 * (knee OA visit) summarized into a standard SOAP layout. Formatting rules:
 *  - Subjective/Plan use ReadViewParagraphsWithCitations (paragraphs separated by "\n\n",
 *    inline newlines preserved verbatim).
 *  - Objective/Assessment use ReadViewSectionFormatted (a "Heading:" line followed by a
 *    "\n\n" blank line then a list of newline-separated items renders as a bold heading
 *    with a bulleted list).
 */
const SOAP_READ_VIEW_CONTENT_ORTHO: Record<string, string> = {
  subjective:
    'Right knee pain, ongoing for approximately 18 months, progressively worsening. 64-year-old patient presents for evaluation of chronic right knee pain rated 6/10 at rest and 8/10 with weight-bearing activity. Pain is described as a deep, aching discomfort localized to the medial joint line, worse in the morning with 20–30 minutes of stiffness and again at the end of the day after prolonged standing.\n\n' +
    'Patient reports intermittent mechanical symptoms including crepitus, occasional catching, and a sensation of instability when descending stairs. Symptoms are exacerbated by walking more than two blocks, climbing stairs, and squatting; partially relieved by rest, ice, and over-the-counter NSAIDs.\n\n' +
    'Onset 07/15/2024 on the right side; condition currently worsening. Patient has trialed 12 months of conservative management — acetaminophen, ibuprofen 600 mg TID, a 6-week course of physical therapy focused on quadriceps strengthening, and activity modification — with inadequate symptom relief. Denies recent trauma, fevers, chills, erythema, or night sweats. Reports difficulty with ADLs including yard work, grocery shopping, and recreational walking.\n\n' +
    'Pain rating: 6/10\n\n' +
    'Exacerbating factors: walking more than two blocks, climbing stairs, squatting, prolonged weight-bearing, and end-of-day activity after extended standing.\n' +
    'Alleviating factors: rest, ice, elevation, over-the-counter NSAIDs (ibuprofen 600 mg), and activity modification.',
  objective:
    'Vitals: BP 132/78, HR 74, T 98.4°F, BMI 29. General: alert, well-appearing, in no acute distress.\n' +
    'Right Knee Examination:\n\n' +
    'Inspection: mild varus alignment, no erythema, no obvious effusion, well-healed arthroscopic portal scars.\n' +
    'Palpation: tenderness along the medial joint line; no warmth.\n' +
    'Range of motion: active flexion 0–115° (limited by pain); passive flexion to 120° with crepitus.\n' +
    'Strength: quadriceps 4/5, hamstrings 5/5.\n' +
    'Special tests: negative Lachman, negative anterior/posterior drawer, negative McMurray; mild medial joint line tenderness with compression.\n' +
    'Stability: ligamentously stable to varus/valgus stress at 0° and 30°.\n' +
    'Gait: antalgic gait favoring the right lower extremity.',
  assessment:
    'Chronic right knee pain and functional limitation consistent with primary osteoarthritis of the right knee. Clinical examination and prior history suggest degenerative joint disease with mechanical symptoms impacting daily activities. Diagnostic knee radiographs have been ordered to evaluate the degree of joint space narrowing and degenerative changes.\n\n' +
    'Diagnosis:\n\n' +
    'M17.11 — Unilateral primary osteoarthritis, right knee.\n\n' +
    'Continued care: patient will follow up for repeat viscosupplement injection as indicated and ongoing management of right knee osteoarthritis. Radiographic results will be reviewed at next visit to determine degree of joint space narrowing and guide further treatment planning.\n\n' +
    "Additional notes: patient tolerated today's visit well. Weight loss counseling provided. Instructed to use prescribed knee orthosis during weight-bearing activity and to follow up if symptoms acutely worsen prior to scheduled return.",
  // Plan narrative — Orders and Services are rendered as visual sections below the
  // plan block (see read view rendering), not duplicated in this narrative text.
  plan:
    'Intra-articular viscosupplement injection using hylan G-F 20 (Synvisc) 16 mg was ordered for symptomatic management of right knee osteoarthritis following inadequate response to conservative therapy. The injection is intended to improve joint lubrication, reduce pain, and enhance functional mobility.\n\n' +
    'A prefabricated knee brace was ordered to provide joint stabilization and support during ambulation and daily activities. The orthosis is intended to reduce mechanical stress on the right knee joint, improve stability, and assist with pain management in the setting of degenerative joint disease.',
};

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

/** Citation numbers to show per read-view section (source numbers; same source = same number). */
const SECTION_CITATION_NUMBERS: Record<string, number[]> = {
  subjective: [1, 1, 1],   // chief-complaint, HPI, exacerbating all from source 1
  objective: [],
  assessment: [2],         // diagnosis-summary from source 2
  plan: [3, 4, 1],         // treatment-plan → 3, goals → 4, plan-of-care → 1
};

/** Builds per-source arrays of quoted text from the current note (one entry per reference). */
function getNoteQuotesPerSource(): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  const sections: (keyof typeof SOAP_READ_VIEW_CONTENT)[] = ['subjective', 'assessment', 'plan'];
  for (const sectionId of sections) {
    const content = SOAP_READ_VIEW_CONTENT[sectionId];
    const citations = SECTION_CITATION_NUMBERS[sectionId];
    if (!content || !citations?.length) continue;
    const segments = content.split(/\n\n+/).filter(Boolean);
    let citationIndex = 0;
    for (let segIdx = 0; segIdx < segments.length && citationIndex < citations.length; segIdx++) {
      const segment = segments[segIdx];
      const isLastSegment = segIdx === segments.length - 1;
      const remainingCitations = citations.length - citationIndex;
      if (isLastSegment && remainingCitations > 1) {
        for (let i = citationIndex; i < citations.length; i++) {
          const src = citations[i];
          if (!result[src]) result[src] = [];
          result[src].push(segment);
        }
        break;
      }
      const src = citations[citationIndex];
      if (!result[src]) result[src] = [];
      result[src].push(segment);
      citationIndex++;
    }
  }
  return result;
}

export type CarryForwardKind = 'Direct' | 'Blended';

/** Per-citation details for the secondary panel (source label, kind; note quotes added at render). */
export interface CitationDetail {
  number: number;
  sourceLabel: string;
  kind: CarryForwardKind;
}

/** Citation details for read-view panel (mock quotes from “original” notes). */
export const CARRY_FORWARD_CITATION_DETAILS: CitationDetail[] = [
  { number: 1, sourceLabel: 'Initial Eval, Mar 4th 2026', kind: 'Direct' },
  { number: 2, sourceLabel: 'Follow-up, Mar 7th 2026', kind: 'Direct' },
  { number: 3, sourceLabel: 'Progress Note, Mar 9th', kind: 'Blended' },
  { number: 4, sourceLabel: 'previous note, Mar 9th 2026', kind: 'Blended' },
];

/** Inline citation badge for read view: number in pastel accent container; clickable to open citation panel. */
function CitationBadge({
  number,
  onClick,
  isHighlighted,
}: {
  number: number;
  onClick?: (citationNumber: number) => void;
  isHighlighted?: boolean;
}) {
  const isClickable = Boolean(onClick);
  return (
    <Box
      component="span"
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? () => onClick?.(number) : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(number);
              }
            }
          : undefined
      }
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 18,
        height: 18,
        px: 0.5,
        borderRadius: '4px',
        fontSize: 11,
        fontWeight: 600,
        color: 'primary.main',
        bgcolor: 'primary.light',
        border: '1px solid',
        borderColor: isHighlighted ? 'primary.main' : 'transparent',
        ml: 0.25,
        verticalAlign: 'text-bottom',
        ...(isClickable && {
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: 1,
          },
        }),
      }}
    >
      {number}
    </Box>
  );
}

/** Renders read-view content as paragraphs with inline citation badges (subjective, plan). */
function ReadViewParagraphsWithCitations({
  sectionId,
  content,
  onCitationClick,
  highlightedCitationInNote,
}: {
  sectionId: string;
  content: string;
  onCitationClick?: (citationNumber: number) => void;
  highlightedCitationInNote?: number;
}) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  const citations = SECTION_CITATION_NUMBERS[sectionId] ?? [];
  const baseSx = {
    fontFamily: 'inherit',
    fontSize: 14,
    lineHeight: 1.6,
    color: 'text.primary',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    m: 0,
    mb: 1,
  };

  return (
    <Box>
      {paragraphs.map((text, i) => {
        const isLast = i === paragraphs.length - 1;
        const citationNums = isLast ? citations.slice(i) : (citations[i] !== undefined ? [citations[i]] : []);
        return (
          <Typography key={i} component="pre" sx={{ ...baseSx, display: 'block' }}>
            {text}
            {citationNums.length > 0 && (
              <>
                {' '}
                {citationNums.map((n) => (
                  <CitationBadge key={n} number={n} onClick={onCitationClick} isHighlighted={highlightedCitationInNote === n} />
                ))}
              </>
            )}
          </Typography>
        );
      })}
    </Box>
  );
}

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

const NOTE_TEMPLATE_OPTIONS = [
  'Knee Sprain', 'ACL Tear', 'Annual Physical', 'Follow-up', 'Consultation', 'Lab Review',
  'Hypertension Follow-up', 'Wellness Exam', 'Sports Physical', 'Migraine Management',
  'Diabetes Check', 'Prenatal Care', 'Thyroid Follow-up', 'Allergy Testing', 'Cardiac Screening',
  'Skin Check', 'Asthma Follow-up', 'Joint Pain', 'Sleep Study Follow-up', 'Anxiety Management',
];

const CLINICAL_STAGE_OPTIONS = ['Initial Evaluation', 'Progress Note', 'Follow-up'];

const pulseOpacity = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

/** Fake transcript shown after ending a Scribe recording (prototype). */
export const FAKE_SCRIBE_TRANSCRIPT = `Patient reports ongoing right knee pain, approximately 4/10, worse with prolonged standing and going downstairs. Denies swelling, locking, or giving way. No recent trauma. Previous PT completed with good improvement; symptoms returned after returning to running.

Current medications: ibuprofen PRN. No new medications. Allergies: NKDA.

Assessment: Right knee pain, likely patellofemoral. Plan: Continue home exercise program, consider imaging if no improvement in 4 weeks.`;

export type ScribeRecordingState = 'idle' | 'recording' | 'paused' | 'processing';

/** Scribe setup + transcript panel for the secondary content panel. */
export function ScribePanelContent({
  view,
  appointment,
  patientName,
  onStartRecording,
  onBack,
}: {
  view: 'setup' | 'transcript';
  appointment: Appointment;
  patientName: string;
  onStartRecording: () => void;
  onBack?: () => void;
}) {
  const [fastTranscription, setFastTranscription] = useState(false);

  if (view === 'transcript') {
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Transcript
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography component="pre" sx={{ fontFamily: 'inherit', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {FAKE_SCRIBE_TRANSCRIPT}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {onBack && (
        <Button startIcon={<KeyboardArrowRightOutlined sx={{ transform: 'rotate(180deg)' }} />} onClick={onBack} sx={{ alignSelf: 'flex-start', textTransform: 'none', color: 'text.secondary', mb: 0.5 }}>
          All Visits
        </Button>
      )}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        New Scribe
      </Typography>
      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mb: 0.5 }}>
        Starting a Scribe for:
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        {patientName}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {appointment.date} • {appointment.time}
        </Typography>
        {appointment.tags?.[0] && (
          <Chip label={appointment.tags[0]} size="small" sx={{ borderRadius: 1 }} />
        )}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' }, '&.Mui-expanded': { m: 0 } }}>
          <AccordionSummary expandIcon={<ExpandMoreOutlined />} sx={{ minHeight: 48 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={500}>Summary of Previous Visit</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Optional summary from the last visit will appear here.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', borderTop: 0, '&:before': { display: 'none' }, '&.Mui-expanded': { m: 0 } }}>
          <AccordionSummary expandIcon={<ExpandMoreOutlined />} sx={{ minHeight: 48 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={500}>Pre-charting Note (Optional)</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Add any pre-charting notes here.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', borderTop: 0, '&:before': { display: 'none' }, '&.Mui-expanded': { m: 0 } }}>
          <AccordionSummary expandIcon={<ExpandMoreOutlined />} sx={{ minHeight: 48 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <BoltOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={500}>Fast Transcription</Typography>
              <Switch size="small" checked={fastTranscription} onChange={(_, c) => setFastTranscription(c)} sx={{ ml: 'auto' }} />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Typography variant="body2" color="text.secondary">
              When enabled, transcription is prioritized for speed.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, py: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Button startIcon={<UploadFileOutlined />} size="medium" sx={{ textTransform: 'none' }}>
          Import Record
        </Button>
        <Button variant="contained" color="primary" startIcon={<ScribeIcon sx={{ fontSize: 20 }} />} onClick={onStartRecording} sx={{ textTransform: 'none', boxShadow: 'none' }}>
          Start Recording
        </Button>
      </Box>
    </Box>
  );
}

/**
 * Tri-state that drives the post-sign toolbar variants:
 *  - `none`         → signed but no addendum in progress (shows the
 *                     "This note has been signed." pill with Add Addendum).
 *  - `reasonPrompt` → user clicked Add Addendum; toolbar expands to a card
 *                     asking for a reason before unlocking the note.
 *  - `editing`      → reason captured (or skipped); note is editable again
 *                     and toolbar shows the Finalize & Re-sign affordance.
 */
export type VisitNoteAddendumState = 'none' | 'reasonPrompt' | 'editing';

// Phase durations for the floating-toolbar morph animation. Total ≈ 560ms.
//   out    : current content fades to 0 (the shell stays visible)
//   morph  : container width/height + shell properties ease to the new
//            variant's measured dimensions and visual styling
//   in     : new content fades from 0 to 1
const TOOLBAR_MORPH_OUT_MS = 140;
const TOOLBAR_MORPH_RESIZE_MS = 260;
const TOOLBAR_MORPH_IN_MS = 160;
const TOOLBAR_MORPH_EASE = 'cubic-bezier(0.32, 0.72, 0.24, 1)';

/**
 * Per-variant rendering split so `ToolbarMorph` can animate the toolbar
 * shell (background, border, shadow, radius) independently of the content
 * sitting inside it. Keeping the shell on its own always-visible layer is
 * what produces the "the toolbar resizes while the content fades" feel —
 * if we faded the whole inner subtree the shell would vanish mid-morph.
 */
interface ToolbarVariant {
  /**
   * sx applied to the shell layer (the visible pill/card/recording card).
   * Width/height are managed by `ToolbarMorph` during transitions and
   * must NOT be set here — set `minWidth` if a variant needs to be
   * intrinsically wider than its content.
   */
  shellSx: SxProps<Theme>;
  /** Inner content (buttons, text, inputs) rendered on the fading layer. */
  content: ReactNode;
}

/**
 * Animates between the visit-note toolbar variants in a coordinated three
 * phase sequence so swapping between e.g. the open-note toolbar and the
 * signed/addendum pill feels intentional rather than abrupt:
 *
 *   1. fade out the currently displayed content (shell stays visible)
 *   2. ease the wrapper from the old dimensions to the new variant's
 *      measured dimensions, while CSS-transitioning the shell's
 *      bg/border/shadow/radius to the new variant's shell styling
 *   3. fade the new content in
 *
 * Target dimensions are pulled from a `visibility: hidden` mirror of the
 * new variant rendered into a portal on `document.body`. Rendering the
 * variant in a hidden mirror keeps measurement honest if the layout
 * changes, and `visibility: hidden` removes it from the tab order so
 * `autoFocus` and click handlers on the duplicated DOM can't steal focus
 * or fire.
 *
 * When the variant prop doesn't change, the wrapper transparently keeps
 * the latest content on screen so things like the recording timer can
 * tick without triggering a transition.
 */
function ToolbarMorph({
  variantKey,
  variant,
}: {
  variantKey: string;
  variant: ToolbarVariant;
}) {
  const [displayedKey, setDisplayedKey] = useState(variantKey);
  const [displayedVariant, setDisplayedVariant] = useState<ToolbarVariant>(variant);
  const [phase, setPhase] = useState<'idle' | 'out' | 'morph' | 'in'>('idle');
  const [explicitSize, setExplicitSize] = useState<{ w: number; h: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const latestVariantRef = useRef(variant);
  useEffect(() => {
    latestVariantRef.current = variant;
  }, [variant]);
  // Mirror `displayedKey` into a ref so the transition effect can read
  // the latest value without depending on it. If it depended on the
  // state, `setDisplayedKey` inside the t1 callback would trigger a
  // cleanup that cancels the still-pending t2/t3 timers, leaving the
  // animation stuck in the morph phase with content at opacity 0.
  const displayedKeyRef = useRef(displayedKey);
  useEffect(() => {
    displayedKeyRef.current = displayedKey;
  }, [displayedKey]);

  // Keep displayed content in sync with the latest prop while the variant
  // is stable so per-frame updates (recording timer, mode toggle, etc.)
  // flow through without retriggering the animation.
  useEffect(() => {
    if (phase === 'idle' && variantKey === displayedKey) {
      setDisplayedVariant(variant);
    }
  }, [variant, phase, variantKey, displayedKey]);

  useEffect(() => {
    if (variantKey === displayedKeyRef.current) return;

    // Freeze the current visible dimensions so the wrapper has something
    // concrete to morph *from* (otherwise it'd be at `auto`, which CSS
    // can't transition).
    const currentRect = containerRef.current?.getBoundingClientRect();
    if (currentRect) {
      setExplicitSize({ w: currentRect.width, h: currentRect.height });
    }
    setPhase('out');

    const t1 = window.setTimeout(() => {
      setDisplayedKey(variantKey);
      setDisplayedVariant(latestVariantRef.current);
      setPhase('morph');
      // Wait for the new variant to mount in the hidden mirror, then
      // pull the natural dimensions from there.
      requestAnimationFrame(() => {
        const newRect = measureRef.current?.getBoundingClientRect();
        if (newRect && newRect.width > 0 && newRect.height > 0) {
          setExplicitSize({ w: newRect.width, h: newRect.height });
        }
      });
    }, TOOLBAR_MORPH_OUT_MS);

    const t2 = window.setTimeout(() => {
      setPhase('in');
    }, TOOLBAR_MORPH_OUT_MS + TOOLBAR_MORPH_RESIZE_MS);

    const t3 = window.setTimeout(() => {
      setPhase('idle');
      setExplicitSize(null);
    }, TOOLBAR_MORPH_OUT_MS + TOOLBAR_MORPH_RESIZE_MS + TOOLBAR_MORPH_IN_MS);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [variantKey]);

  const isContentHidden = phase === 'out' || phase === 'morph';
  // We transition the shell's visual properties (color, border, shadow,
  // radius) so that e.g. the pill border-radius can change between
  // variants without an abrupt switch.
  const shellTransition = `background-color ${TOOLBAR_MORPH_RESIZE_MS}ms ${TOOLBAR_MORPH_EASE}, background ${TOOLBAR_MORPH_RESIZE_MS}ms ${TOOLBAR_MORPH_EASE}, border-color ${TOOLBAR_MORPH_RESIZE_MS}ms ${TOOLBAR_MORPH_EASE}, box-shadow ${TOOLBAR_MORPH_RESIZE_MS}ms ${TOOLBAR_MORPH_EASE}, border-radius ${TOOLBAR_MORPH_RESIZE_MS}ms ${TOOLBAR_MORPH_EASE}`;
  const sizeTransition = `width ${TOOLBAR_MORPH_RESIZE_MS}ms ${TOOLBAR_MORPH_EASE}, height ${TOOLBAR_MORPH_RESIZE_MS}ms ${TOOLBAR_MORPH_EASE}`;
  const contentOpacityTransition = `opacity ${
    phase === 'out' ? TOOLBAR_MORPH_OUT_MS : TOOLBAR_MORPH_IN_MS
  }ms ease`;

  return (
    <>
      {/*
        The morph wrapper IS the toolbar shell — putting the visual
        styling here avoids an extra nesting layer that was both
        clipping the shell's drop shadow (when the outer had
        `overflow: hidden`) and breaking percentage sizing of the
        content layer once the wrapper relaxed back to `auto`.

        Content fades via a `& > *` opacity selector applied to direct
        children of the shell, so the shell's own bg/border/shadow stays
        at full opacity throughout the animation while the buttons /
        textarea / etc. inside it fade out → morph → fade in.
      */}
      <Box
        ref={containerRef}
        sx={[
          displayedVariant.shellSx as SxProps<Theme>,
          {
            width: explicitSize ? `${explicitSize.w}px` : undefined,
            height: explicitSize ? `${explicitSize.h}px` : undefined,
            transition: `${sizeTransition}, ${shellTransition}`,
            willChange: 'width, height, background-color, border-color, box-shadow, border-radius',
            '& > *': {
              opacity: isContentHidden ? 0 : 1,
              transition: contentOpacityTransition,
              willChange: 'opacity',
            },
          },
        ] as SxProps<Theme>}
      >
        {displayedVariant.content}
      </Box>
      {typeof document !== 'undefined' &&
        createPortal(
          <Box
            ref={measureRef}
            aria-hidden
            sx={[
              variant.shellSx as SxProps<Theme>,
              {
                position: 'fixed',
                top: 0,
                left: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                zIndex: -1,
              },
            ] as SxProps<Theme>}
          >
            {variant.content}
          </Box>,
          document.body,
        )}
    </>
  );
}

/** Floating toolbar at bottom center: Scribe, AI Check, Dictate | view/edit toggle. */
function VisitNoteFloatingToolbar({
  mode,
  onModeChange,
  onAICheckClick,
  aiCheckSuggestionCount,
  onScribeClick,
  isScribePanelOpen,
  scribeRecordingState,
  onScribePause,
  onScribeEndRecording,
  signStatus,
  addendumState,
  addendumReason,
  onAddendumReasonChange,
  onAddAddendumClick,
  onAddendumCancel,
  onAddendumSkip,
  onAddendumProceed,
  onFinalizeAddendum,
}: {
  mode: 'edit' | 'read';
  onModeChange: (next: 'edit' | 'read') => void;
  onAICheckClick?: () => void;
  aiCheckSuggestionCount?: number;
  onScribeClick?: () => void;
  isScribePanelOpen?: boolean;
  scribeRecordingState?: ScribeRecordingState;
  onScribePause?: () => void;
  onScribeEndRecording?: () => void;
  signStatus: 'signed' | 'unsigned';
  addendumState: VisitNoteAddendumState;
  addendumReason: string;
  onAddendumReasonChange: (next: string) => void;
  onAddAddendumClick: () => void;
  onAddendumCancel: () => void;
  onAddendumSkip: () => void;
  onAddendumProceed: () => void;
  onFinalizeAddendum: () => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isRecordingActive = scribeRecordingState === 'recording' || scribeRecordingState === 'paused';
  const isProcessing = scribeRecordingState === 'processing';
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [noiseBars] = useState(() => Array.from({ length: 12 }, () => 0.3 + Math.random() * 0.7));

  useEffect(() => {
    if (!isRecordingActive) {
      setRecordingSeconds(0);
      return;
    }
    const t = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecordingActive]);

  const mm = Math.floor(recordingSeconds / 60);
  const ss = recordingSeconds % 60;
  const timerLabel = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;

  const toolbarBg = isDark
    ? (theme.palette.background as { paper?: string }).paper
    : alpha(theme.palette.background.paper, 0.98);
  const toolbarBorder = theme.palette.divider;
  const toolbarShadow = isDark
    ? '0px 4px 20px rgba(0,0,0,0.4)'
    : '0px 4px 24px rgba(0,0,0,0.08)';
  const toolbarGlow = isDark
    ? '0 8px 28px rgba(0,0,0,0.25)'
    : `0 8px 28px ${alpha(theme.palette.primary.main, 0.18)}`;

  const modeToggleTrackBg = isDark ? alpha(theme.palette.common.white, 0.08) : theme.palette.grey[200];

  // Shared sticky-bottom anchor used by every toolbar variant so they all
  // live in the same spot on screen regardless of which one is rendering.
  const stickyAnchorSx = {
    position: 'sticky',
    bottom: 12,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 10,
  } as const;

  // Pill-shape shared by the signed and addendum-editing variants so they
  // visually match the dimensions of the normal note toolbar.
  const pillSx = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1.5,
    borderRadius: '9999px',
    border: '1px solid',
    borderColor: toolbarBorder,
    bgcolor: toolbarBg,
    boxShadow: `${toolbarShadow}, ${toolbarGlow}`,
    pl: 0.5,
    pr: 0.5,
    py: 0.5,
    minWidth: 480,
  } as const;

  // Shared rounded-rect shell used by the toolbar variants whose visual
  // footprint matches the open-note bar (signed-locked, signed-editing,
  // open). The morph wrapper CSS-transitions between these shells so
  // e.g. signed → open feels like the same physical bar resizing. We
  // intentionally use the same 28px corner radius as the addendum-reason
  // and recording cards so transitions between any pair of variants
  // morph the width without a jarring radius jump as well.
  const pillShellSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 1.5,
    borderRadius: 3.5,
    border: '1px solid',
    borderColor: toolbarBorder,
    bgcolor: toolbarBg,
    boxShadow: `${toolbarShadow}, ${toolbarGlow}`,
    pl: 0.5,
    pr: 0.5,
    py: 0.5,
  };

  // Single keying scheme so the morph wrapper knows when to fire its
  // out → resize → in animation. Anything that changes the visible
  // toolbar variant becomes its own key. Things that just tweak the
  // visible content within a variant (mode toggle, recording timer)
  // do NOT change the key, so they update in place.
  let variantKey: string;
  let variant: ToolbarVariant;

  if (isProcessing || isRecordingActive) {
    variantKey = isProcessing
      ? 'recording-processing'
      : `recording-${scribeRecordingState ?? 'recording'}`;
    const gradientBg = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;
    variant = {
      shellSx: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        borderRadius: 3.5,
        minWidth: 320,
        border: '1px solid transparent',
        background: gradientBg,
        boxShadow: 3,
        overflow: 'hidden',
      },
      content: (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.75 }}>
            <Typography variant="caption" sx={{ color: 'primary.contrastText', fontWeight: 600 }}>
              {isProcessing ? 'Processing...' : 'Recording'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" className={VISIT_NOTE_BUTTON_EXEMPT_CLASS} sx={{ color: 'primary.contrastText' }}>
                <Box sx={{ width: 16, height: 16, border: 1, borderColor: 'primary.contrastText', borderRadius: 0.5 }} />
              </IconButton>
              <IconButton size="small" className={VISIT_NOTE_BUTTON_EXEMPT_CLASS} sx={{ color: 'primary.contrastText' }}>
                <Typography sx={{ fontSize: 14 }}>−</Typography>
              </IconButton>
            </Box>
          </Box>
          {!isProcessing && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 0.5 }}>
                <ScribeIcon sx={{ fontSize: 22, color: 'primary.contrastText' }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.35, height: 24 }}>
                  {noiseBars.map((h, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 4,
                        height: `${h * 100}%`,
                        minHeight: 4,
                        borderRadius: 1,
                        bgcolor: 'primary.contrastText',
                        animation: `${pulseOpacity} 0.8s ease-in-out infinite`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" sx={{ color: 'primary.contrastText', fontWeight: 600, ml: 'auto' }}>
                  {timerLabel}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
                  onClick={onScribePause}
                  startIcon={<PauseOutlined />}
                  sx={{
                    bgcolor: 'primary.contrastText',
                    color: 'primary.main',
                    textTransform: 'none',
                    '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.9) },
                  }}
                >
                  {scribeRecordingState === 'paused' ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
                  onClick={onScribeEndRecording}
                  startIcon={<StopOutlined />}
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.4)',
                    color: 'primary.contrastText',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                  }}
                >
                  End Recording
                </Button>
              </Box>
            </>
          )}
        </>
      ),
    };
  } else if (signStatus === 'signed' && addendumState === 'none') {
    variantKey = 'signed-locked';
    variant = {
      shellSx: { ...pillShellSx, minWidth: 480 },
      content: (
        <>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: (t) => alpha(t.palette.text.primary, 0.06),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              flexShrink: 0,
              ml: '4px',
            }}
          >
            <LockOutlined sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>
              This note has been signed.
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.3 }}>
              To make edit, add an addendum.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
            onClick={onAddAddendumClick}
            startIcon={<SignatureAltIcon />}
            sx={{
              height: 44,
              minHeight: 44,
              py: 0,
              px: 2.25,
              borderRadius: '9999px',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'none',
              flexShrink: 0,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none', bgcolor: 'primary.dark' },
            }}
          >
            Add Addendum
          </Button>
        </>
      ),
    };
  } else if (signStatus === 'signed' && addendumState === 'reasonPrompt') {
    variantKey = 'signed-reason';
    const reasonProvided = addendumReason.trim().length > 0;
    variant = {
      shellSx: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: 'min(720px, calc(100vw - 32px))',
        borderRadius: 3.5,
        border: '1px solid',
        borderColor: toolbarBorder,
        bgcolor: toolbarBg,
        boxShadow: `${toolbarShadow}, ${toolbarGlow}`,
        p: 2,
      },
      content: (
        <>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>
            To proceed, provide an addendum reason.
          </Typography>
          <TextField
            value={addendumReason}
            onChange={(e) => onAddendumReasonChange(e.target.value)}
            placeholder="Write something here..."
            multiline
            minRows={4}
            fullWidth
            variant="outlined"
            autoFocus
            inputProps={{ 'aria-label': 'Addendum reason' }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: 14,
                bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
                borderRadius: 2,
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: (t) => alpha(t.palette.text.primary, 0.16) },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="outlined"
              className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
              onClick={onAddendumCancel}
              sx={{
                height: 40,
                minHeight: 40,
                px: 2.25,
                borderRadius: '9999px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                color: 'text.primary',
                borderColor: (t) => alpha(t.palette.text.primary, 0.16),
                '&:hover': {
                  borderColor: 'text.primary',
                  bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
                },
              }}
            >
              Cancel
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              variant="text"
              className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
              onClick={onAddendumSkip}
              sx={{
                height: 40,
                minHeight: 40,
                px: 1.5,
                color: 'primary.main',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Skip
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
              onClick={onAddendumProceed}
              disabled={!reasonProvided}
              endIcon={<ArrowForwardRounded />}
              sx={{
                height: 40,
                minHeight: 40,
                px: 2.5,
                borderRadius: '9999px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none', bgcolor: 'primary.dark' },
              }}
            >
              Proceed
            </Button>
          </Box>
        </>
      ),
    };
  } else if (signStatus === 'signed' && addendumState === 'editing') {
    variantKey = 'signed-editing';
    variant = {
      shellSx: { ...pillShellSx, minWidth: 480 },
      content: (
        <>
          <Typography
            sx={{
              flex: 1,
              fontSize: 14,
              fontWeight: 700,
              color: 'text.primary',
              pl: 1.5,
            }}
          >
            Finalize changes…
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
            onClick={onFinalizeAddendum}
            startIcon={<SignatureAltIcon />}
            sx={{
              height: 44,
              minHeight: 44,
              py: 0,
              px: 2.25,
              borderRadius: '9999px',
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'none',
              flexShrink: 0,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none', bgcolor: 'primary.dark' },
            }}
          >
            Finalize & Re-sign
          </Button>
        </>
      ),
    };
  } else {
    variantKey = 'open';
    variant = {
      shellSx: { ...pillShellSx, gap: 1 },
      content: (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
            {/* Scribe (primary, left) */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
              onClick={onScribeClick}
              startIcon={<ScribeIcon sx={{ fontSize: 20, color: 'primary.contrastText' }} />}
              sx={{
                height: 44,
                minHeight: 44,
                py: 0,
                px: 2,
                borderRadius: '9999px',
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 0,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none', bgcolor: 'primary.dark' },
                ...(isScribePanelOpen && { boxShadow: 'none' }),
              }}
            >
              Scribe
            </Button>

            {/* AI Check */}
            <Button
              variant="text"
              size="small"
              className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
              onClick={onAICheckClick}
              startIcon={<AICheckIcon sx={{ fontSize: 24, color: 'primary.main' }} />}
              endIcon={
                aiCheckSuggestionCount && aiCheckSuggestionCount > 0 ? (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 18,
                      minWidth: 18,
                      px: 0.5,
                      borderRadius: '9999px',
                      bgcolor: (t) => alpha(t.palette.warning.main, 0.16),
                      color: 'warning.dark',
                      fontSize: 12,
                      fontWeight: 700,
                      lineHeight: 1,
                      verticalAlign: 'middle',
                    }}
                  >
                    {aiCheckSuggestionCount}
                  </Box>
                ) : undefined
              }
              sx={{
                height: 44,
                minHeight: 44,
                py: 0,
                px: 1.5,
                borderRadius: '9999px',
                color: 'primary.main',
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 0,
                width: 'auto',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: 'action.hover' },
                '& .MuiButton-endIcon > *:nth-of-type(1)': { fontSize: 12 },
              }}
            >
              AI Check
            </Button>

            {/* Dictate */}
            <Button
              variant="text"
              size="small"
              className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
              startIcon={<DictateIcon sx={{ fontSize: 20, color: 'primary.main' }} />}
              sx={{
                height: 44,
                minHeight: 44,
                py: 0,
                px: 1.5,
                borderRadius: '9999px',
                color: 'primary.main',
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 0,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Dictate
            </Button>
          </Box>

          <Box sx={{ width: '1px', height: 24, flexShrink: 0, bgcolor: 'divider', borderRadius: 1 }} role="separator" />

          {/* View (read) / Edit segmented control */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              borderRadius: '9999px',
              bgcolor: modeToggleTrackBg,
              p: 0.5,
              flexShrink: 0,
            }}
          >
            <IconButton
              size="small"
              onClick={() => onModeChange('read')}
              aria-label="View note"
              title="View"
              className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
              aria-pressed={mode === 'read'}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                color: mode === 'read' ? 'primary.main' : 'text.secondary',
                bgcolor: mode === 'read' ? 'background.paper' : 'transparent',
                boxShadow: mode === 'read' ? (isDark ? '0 1px 4px rgba(0,0,0,0.45)' : '0 1px 4px rgba(0,0,0,0.12)') : 'none',
                '&:hover': { bgcolor: mode === 'read' ? 'background.paper' : 'action.hover' },
              }}
            >
              <VisibilityOutlined sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onModeChange('edit')}
              aria-label="Edit note"
              title="Edit"
              className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
              aria-pressed={mode === 'edit'}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                color: mode === 'edit' ? 'primary.main' : 'text.secondary',
                bgcolor: mode === 'edit' ? 'background.paper' : 'transparent',
                boxShadow: mode === 'edit' ? (isDark ? '0 1px 4px rgba(0,0,0,0.45)' : '0 1px 4px rgba(0,0,0,0.12)') : 'none',
                '&:hover': { bgcolor: mode === 'edit' ? 'background.paper' : 'action.hover' },
              }}
            >
              <EditOutlined sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </>
      ),
    };
  }

  return (
    <Box sx={stickyAnchorSx}>
      <ToolbarMorph variantKey={variantKey} variant={variant} />
    </Box>
  );
}

type EditingReadSectionId = (typeof SOAP_READ_SECTION_IDS)[number] | null;
type ReadSoapSectionId = (typeof SOAP_READ_SECTION_IDS)[number];
/** Per-SOAP-section text that the AI Check has appended to the read view. */
type AiAppendedReadContent = Partial<Record<ReadSoapSectionId, string>>;

/**
 * Logical target a suggestion modifies. The caller maps this to the right
 * DOM id depending on whether the note is in read or edit mode, since the
 * two layouts have different anchors.
 */
type AICheckHighlightTarget =
  | { kind: 'soap'; section: ReadSoapSectionId; subsectionAnchorId: string }
  | { kind: 'services' };

/**
 * Outcome of applying a single AI Check suggestion to the note. The caller
 * uses this both to mark the resolution as "applied" (so re-renders don't
 * re-run it) and to drive the post-apply UI affordances — auto-scrolling
 * to and momentarily highlighting wherever the change landed.
 */
interface AICheckSuggestionApplyResult {
  /** When true, the caller should not run this suggestion's effect again. */
  applied: boolean;
  /** Where to scroll-and-flash so the provider visually sees the change. */
  highlight?: AICheckHighlightTarget;
  /**
   * Text to append to a SOAP read-view section. The read view renders from
   * a static narrative (not `data`), so changes the suggestion makes to
   * `data` are mirrored here for read mode.
   */
  appendedReadContent?: { section: ReadSoapSectionId; text: string };
}

const LEFT_KNEE_EXAM_BLOCK =
  'Left Knee Examination:\n\n' +
  'Inspection: Normal alignment, no erythema, no effusion, no surgical scars.\n' +
  'Palpation: No tenderness, no warmth.\n' +
  'Range of motion: Active flexion 0–135°, full and pain-free.\n' +
  'Strength: Quadriceps 5/5, hamstrings 5/5.\n' +
  'Special tests: Negative Lachman, negative anterior/posterior drawer, negative McMurray.\n' +
  'Stability: Ligamentously stable to varus/valgus stress at 0° and 30°.\n' +
  'Gait: Normal gait; weight-bearing symmetric.';

const HISTORICAL_RECORDS_BLOCK =
  'Additional historical records:\n' +
  '• Past Medical History: Hypertension, hyperlipidemia, BMI 29.\n' +
  '• Past Surgical History: Right knee arthroscopy 2009 for meniscal debridement.\n' +
  '• Medications: Lisinopril, atorvastatin, ibuprofen PRN.\n' +
  '• Allergies: NKDA.\n' +
  '• Social History: Retired, non-smoker, occasional alcohol use.';

/**
 * Mutate the visit-note state in response to a single AI Check suggestion
 * resolution. Returns metadata describing what changed so the caller can
 * scroll the provider to the modified section and flash a transient
 * highlight there.
 *
 * Suggestion IDs mirror those produced by `buildDefaultAICheckSeed`.
 */
function applyAICheckSuggestion({
  suggestionId,
  resolution,
  isOrtho,
  setData,
  setOrthoExtras,
}: {
  suggestionId: string;
  resolution: AICheckSuggestionResolution;
  isOrtho: boolean;
  setData: React.Dispatch<React.SetStateAction<VisitNoteData>>;
  setOrthoExtras: React.Dispatch<React.SetStateAction<OrthoNoteExtras | null>>;
}): AICheckSuggestionApplyResult {
  // Declined / dismissed resolutions are terminal and don't mutate the note.
  if (resolution.kind === 'declined' || resolution.kind === 'input-declined') {
    return { applied: true };
  }

  const appendParagraph = (prev: string, next: string) => {
    const trimmed = prev.trimEnd();
    if (!trimmed) return next;
    return `${trimmed}\n\n${next}`;
  };

  switch (suggestionId) {
    case 'sug-injection-units': {
      // Ortho: fill in the units cell on the Hylan G-F 20 (Synvisc) line so
      // the missing-units warning called out in the suggestion copy
      // resolves visibly in the Services table.
      if (resolution.kind !== 'input-accepted') return { applied: true };
      if (!isOrtho) return { applied: true };
      const units = resolution.value;
      setOrthoExtras((prev) => {
        if (!prev) return prev;
        const services = prev.services.map((cat) => ({
          ...cat,
          rows: cat.rows.map((row) =>
            row.cptCode === 'J7325' ? { ...row, units } : row,
          ),
        }));
        return { ...prev, services };
      });
      return { applied: true, highlight: { kind: 'services' } };
    }

    case 'sug-modifier-25-same-day': {
      if (resolution.kind !== 'accepted') return { applied: true };
      if (!isOrtho) return { applied: true };
      setOrthoExtras((prev) => {
        if (!prev) return prev;
        const services = prev.services.map((cat) =>
          cat.id === 'cat-evaluations'
            ? {
                ...cat,
                rows: cat.rows.map((row) =>
                  row.cptCode === '99214' ? { ...row, modifier: '25' } : row,
                ),
              }
            : cat,
        );
        return { ...prev, services };
      });
      return { applied: true, highlight: { kind: 'services' } };
    }

    case 'sug-future-plan': {
      if (resolution.kind !== 'input-accepted') return { applied: true };
      const addition = resolution.value;
      setData((prev) => ({
        ...prev,
        plan: {
          ...prev.plan,
          'treatment-plan': {
            ...prev.plan['treatment-plan'],
            content: appendParagraph(prev.plan['treatment-plan'].content, addition),
          },
        },
      }));
      return {
        applied: true,
        highlight: {
          kind: 'soap',
          section: 'plan',
          subsectionAnchorId: 'subsection-treatment-plan',
        },
        appendedReadContent: { section: 'plan', text: addition },
      };
    }

    case 'sug-left-knee': {
      if (resolution.kind !== 'accepted') return { applied: true };
      setData((prev) => ({
        ...prev,
        objective: {
          ...prev.objective,
          'objective-comments': {
            ...prev.objective['objective-comments'],
            comments: appendParagraph(
              prev.objective['objective-comments'].comments,
              LEFT_KNEE_EXAM_BLOCK,
            ),
          },
        },
      }));
      return {
        applied: true,
        highlight: {
          kind: 'soap',
          section: 'objective',
          subsectionAnchorId: 'subsection-objective-comments',
        },
        appendedReadContent: { section: 'objective', text: LEFT_KNEE_EXAM_BLOCK },
      };
    }

    case 'sug-historical': {
      if (resolution.kind !== 'accepted') return { applied: true };
      setData((prev) => ({
        ...prev,
        subjective: {
          ...prev.subjective,
          'history-of-present-illness': {
            ...prev.subjective['history-of-present-illness'],
            historyOfCondition: appendParagraph(
              prev.subjective['history-of-present-illness'].historyOfCondition,
              HISTORICAL_RECORDS_BLOCK,
            ),
          },
        },
      }));
      return {
        applied: true,
        highlight: {
          kind: 'soap',
          section: 'subjective',
          subsectionAnchorId: 'subsection-history-of-present-illness',
        },
        appendedReadContent: { section: 'subjective', text: HISTORICAL_RECORDS_BLOCK },
      };
    }

    default:
      // Unknown suggestion id — still mark as applied so we don't poll it on
      // every render, but don't touch the note data.
      return { applied: true };
  }
}

export function VisitNoteContent({
  noteId: _noteId,
  appointment,
  onAICheckClick,
  aiCheckSuggestionCount,
  onScribeClick,
  isScribePanelOpen,
  scribeRecordingState,
  onScribePause,
  onScribeEndRecording,
  onCitationClick,
  highlightedCitationInNote,
}: VisitNoteContentProps) {
  const isOrthoPatient = ORTHO_PATIENT_IDS.has(appointment.patientId);
  // True once the provider has clicked "Submit to Chart" in the scribe
  // post-processed preview for this patient. Pre-submission the note renders
  // an empty placeholder; post-submission the SOAP content + edit-mode
  // fields are seeded with the populated default data — i.e. the demo
  // narrative is "the scribe just wrote your note for you".
  const { isChartSubmittedForPatientId } = useAppScribe();
  const isChartPopulated = isChartSubmittedForPatientId(appointment.patientId);
  const [mode, setMode] = useState<'edit' | 'read'>('read');
  const [editingReadSectionId, setEditingReadSectionId] = useState<EditingReadSectionId>(null);
  const [data, setData] = useState<VisitNoteData>(() =>
    isChartPopulated
      ? isOrthoPatient
        ? DEFAULT_ORTHO_VISIT_NOTE_DATA
        : DEFAULT_VISIT_NOTE_DATA
      : EMPTY_VISIT_NOTE_DATA,
  );
  const [orthoExtras, setOrthoExtras] = useState<OrthoNoteExtras | null>(() => {
    if (!isOrthoPatient) return null;
    return isChartPopulated ? DEFAULT_ORTHO_NOTE_EXTRAS : EMPTY_ORTHO_NOTE_EXTRAS;
  });
  const [noteTemplate, setNoteTemplate] = useState(appointment.template);
  const [clinicalStage, setClinicalStage] = useState(appointment.clinicalStage);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [collapsedSubsections, setCollapsedSubsections] = useState<Set<string>>(new Set());
  // Addendum flow surfaced by the toolbar once a note is signed. Reset
  // whenever the appointment or sign-status changes so a fresh chart never
  // boots in mid-addendum.
  const [addendumState, setAddendumState] = useState<VisitNoteAddendumState>('none');
  const [addendumReason, setAddendumReason] = useState('');
  const assistantShortcutOverride = useAssistantShortcutOverrideOptional();

  // Reset to the correct seed (empty vs populated) whenever the underlying
  // appointment changes. Without this, switching patients would leave the
  // previous patient's data on screen.
  useEffect(() => {
    setNoteTemplate(appointment.template);
    setClinicalStage(appointment.clinicalStage);
    const isOrtho = ORTHO_PATIENT_IDS.has(appointment.patientId);
    if (isChartPopulated) {
      setData(isOrtho ? DEFAULT_ORTHO_VISIT_NOTE_DATA : DEFAULT_VISIT_NOTE_DATA);
      setOrthoExtras(isOrtho ? DEFAULT_ORTHO_NOTE_EXTRAS : null);
    } else {
      setData(EMPTY_VISIT_NOTE_DATA);
      setOrthoExtras(isOrtho ? EMPTY_ORTHO_NOTE_EXTRAS : null);
    }
    setAddendumState('none');
    setAddendumReason('');
    // Intentionally NOT depending on `isChartPopulated` — the transition
    // from empty → populated is handled by the dedicated effect below so
    // that manual edits made before submit-to-chart don't get clobbered on
    // an unrelated re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment.id, appointment.template, appointment.clinicalStage]);

  // Once the scribe finishes (i.e. "Submit to Chart" has been clicked for
  // this patient), backfill the visit-note state with the populated SOAP
  // content + extras so the demo feels like the scribe just wrote the note.
  // The previous (empty) flag is tracked so we only run the transition
  // once, not on every re-render where `isChartPopulated` happens to be
  // true (e.g. after the user has further edited the populated data).
  const prevIsChartPopulatedRef = useRef(isChartPopulated);
  useEffect(() => {
    const wasPopulated = prevIsChartPopulatedRef.current;
    prevIsChartPopulatedRef.current = isChartPopulated;
    if (wasPopulated || !isChartPopulated) return;
    const isOrtho = ORTHO_PATIENT_IDS.has(appointment.patientId);
    setData(isOrtho ? DEFAULT_ORTHO_VISIT_NOTE_DATA : DEFAULT_VISIT_NOTE_DATA);
    setOrthoExtras(isOrtho ? DEFAULT_ORTHO_NOTE_EXTRAS : null);
  }, [isChartPopulated, appointment.patientId]);

  // Apply AI Check suggestion acceptances to the note's actual data so the
  // chat-side "Accept" actions visibly mutate the chart. The effect tracks
  // which suggestions have already been applied (keyed by appointment) so
  // re-renders don't re-apply the same change. Reset on patient switch so
  // a note re-opened later picks the suggestion change up again on its
  // first render.
  //
  // Companion state:
  //  - `aiAppendedReadContent` mirrors a suggestion's data mutation into the
  //    read-view narrative, since read mode renders from a static SOAP map
  //    rather than `data`.
  //  - `aiHighlightTarget` triggers the scroll + flash effect; the token is
  //    bumped on each accept so repeated accepts of different suggestions
  //    all re-fire the animation.
  const aiCheckActions = useAICheckActionsOptional();
  const aiCheckResolutions = aiCheckActions?.resolutions;
  // When the user navigates away from the visit note (closes it, switches
  // tabs, opens a different patient, …) the assistant panel may still be
  // sitting on an AI Check report tied to *this* note. Drop it back to a
  // fresh chat on unmount so stale context doesn't follow them around.
  // Read the latest callback through a ref so the cleanup only fires on
  // actual unmount, not on every callback identity change.
  const appAssistant = useAppAssistantOptional();
  const resetAICheckOnUnmountRef = useRef(appAssistant?.resetAICheckChatIfShowing);
  useEffect(() => {
    resetAICheckOnUnmountRef.current = appAssistant?.resetAICheckChatIfShowing;
  }, [appAssistant?.resetAICheckChatIfShowing]);
  useEffect(() => {
    return () => {
      resetAICheckOnUnmountRef.current?.();
    };
  }, []);
  const appliedSuggestionsRef = useRef<{
    appointmentId: string;
    applied: Set<string>;
  }>({ appointmentId: appointment.id, applied: new Set() });
  const [aiAppendedReadContent, setAiAppendedReadContent] = useState<AiAppendedReadContent>({});
  const [aiHighlightTarget, setAiHighlightTarget] = useState<{
    target: AICheckHighlightTarget;
    token: number;
  } | null>(null);
  const aiHighlightTokenRef = useRef(0);
  useEffect(() => {
    if (appliedSuggestionsRef.current.appointmentId !== appointment.id) {
      appliedSuggestionsRef.current = {
        appointmentId: appointment.id,
        applied: new Set(),
      };
      setAiAppendedReadContent({});
      setAiHighlightTarget(null);
    }
  }, [appointment.id]);
  useEffect(() => {
    if (!aiCheckResolutions) return;
    const applied = appliedSuggestionsRef.current.applied;
    const isOrtho = ORTHO_PATIENT_IDS.has(appointment.patientId);
    let latestHighlight: AICheckHighlightTarget | null = null;
    Object.entries(aiCheckResolutions).forEach(([suggestionId, resolution]) => {
      if (applied.has(suggestionId)) return;
      const result = applyAICheckSuggestion({
        suggestionId,
        resolution,
        isOrtho,
        setData,
        setOrthoExtras,
      });
      if (!result.applied) return;
      applied.add(suggestionId);
      if (result.appendedReadContent) {
        const { section, text } = result.appendedReadContent;
        setAiAppendedReadContent((prev) => ({
          ...prev,
          [section]: prev[section] ? `${prev[section]}\n\n${text}` : text,
        }));
      }
      if (result.highlight) {
        latestHighlight = result.highlight;
      }
    });
    if (latestHighlight) {
      aiHighlightTokenRef.current += 1;
      setAiHighlightTarget({
        target: latestHighlight,
        token: aiHighlightTokenRef.current,
      });
    }
  }, [aiCheckResolutions, appointment.patientId]);

  // Scroll the note to wherever a freshly accepted suggestion landed, then
  // flash a soft primary-tinted background over the target so the addition
  // is visually unmistakable. Runs after the apply effect's state updates
  // are flushed so the new content is in the DOM when we scroll/animate.
  // The right DOM target depends on the current mode — read view anchors
  // are `read-{sectionId}` / `ai-services-block`, edit view anchors are
  // `subsection-{id}` / `subsection-services`.
  const theme = useTheme();
  useEffect(() => {
    if (!aiHighlightTarget) return;
    const { target } = aiHighlightTarget;
    const domId =
      target.kind === 'soap'
        ? mode === 'read'
          ? `read-${target.section}`
          : target.subsectionAnchorId
        : mode === 'read'
          ? 'ai-services-block'
          : 'subsection-services';
    // Defer one frame so React commits the read-content/services-state
    // updates before we measure/scroll.
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(domId);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const flash = alpha(theme.palette.primary.main, 0.16);
      const animation = el.animate(
        [
          { backgroundColor: flash, offset: 0 },
          { backgroundColor: flash, offset: 0.35 },
          { backgroundColor: 'rgba(0,0,0,0)', offset: 1 },
        ],
        { duration: 2200, easing: 'ease-out' },
      );
      animation.onfinish = () => {
        // Ensure the background lands back at transparent in case the
        // browser leaves the final keyframe applied.
        el.style.backgroundColor = '';
      };
    });
    return () => cancelAnimationFrame(raf);
  }, [aiHighlightTarget, theme, mode]);

  const signStatus = data.notarize.notarize.signStatus;
  // Once a note is signed, the chart is read-only until the user explicitly
  // opens an addendum. Editing affordances (the per-section pencil in read
  // view, the floating toolbar's Edit toggle, inline forms, etc.) are gated
  // on this flag so the only way to mutate a signed note is via the
  // addendum flow.
  const canEditNote = signStatus === 'unsigned' || addendumState === 'editing';
  // When the note becomes signed (and we aren't actively editing an
  // addendum), the chart should be read-only. Reset any in-progress addendum
  // state if the note is unsigned again (e.g. via the "Unsign Note" link in
  // the Notarize section) so the toolbar returns to its normal pill. Also
  // clear any in-progress per-section edit if the user signs the note while
  // a SOAP section is being edited inline from read view.
  useEffect(() => {
    if (signStatus === 'unsigned') {
      setAddendumState('none');
      setAddendumReason('');
      return;
    }
    if (addendumState !== 'editing') {
      if (mode === 'edit') {
        setMode('read');
      }
      setEditingReadSectionId(null);
    }
  }, [signStatus, addendumState, mode]);

  useEffect(() => {
    if (!assistantShortcutOverride) return;
    const { setShortcutOverride } = assistantShortcutOverride;
    setShortcutOverride(
      data.notarize.notarize.signStatus === 'signed'
        ? VISIT_NOTE_SIGNED_ASSISTANT_SHORTCUTS
        : VISIT_NOTE_UNSIGNED_ASSISTANT_SHORTCUTS,
    );
    return () => setShortcutOverride(null);
  }, [data.notarize.notarize.signStatus, assistantShortcutOverride]);
  const [activeAnchorId, setActiveAnchorId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sections/subsections actually rendered in this note (varies by template).
  // Drives both the left TOC and the scroll-spy anchor list so the two stay
  // in lockstep with whatever the body renders.
  const visibleSections = useMemo(
    () => getVisibleVisitNoteSections(isOrthoPatient),
    [isOrthoPatient],
  );
  const visibleAnchorIds = useMemo(
    () => visibleSections.flatMap((s) => s.subsections.map((sub) => sub.anchorId)),
    [visibleSections],
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const anchorIds =
      mode === 'read'
        ? SOAP_READ_SECTION_IDS.map((id) => `read-${id}`)
        : visibleAnchorIds;

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
  }, [mode, visibleAnchorIds]);

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
            visibleSections.map((section) => (
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
            pt: 3,
            pb: 2,
            px: 2,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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
                  // Pre-scribe-submit: render the empty placeholder block
                  // so providers see where each SOAP section will fill in.
                  if (!isChartPopulated) {
                    return (
                      <ReadViewEmptySectionBlock
                        key={sectionId}
                        sectionId={sectionId}
                        title={SOAP_READ_SECTION_LABELS[sectionId]}
                      />
                    );
                  }
                  const readContentSource = isOrthoPatient
                    ? SOAP_READ_VIEW_CONTENT_ORTHO
                    : SOAP_READ_VIEW_CONTENT;
                  const baseContent = readContentSource[sectionId] ?? '';
                  const appended = aiAppendedReadContent[sectionId];
                  const combinedContent = appended
                    ? `${baseContent.trimEnd()}\n\n${appended}`
                    : baseContent;
                  return (
                    <ReadViewSectionBlock
                      key={sectionId}
                      sectionId={sectionId}
                      title={SOAP_READ_SECTION_LABELS[sectionId]}
                      content={combinedContent}
                      onEdit={() => setEditingReadSectionId(sectionId)}
                      canEdit={canEditNote}
                      onCitationClick={onCitationClick}
                      highlightedCitationInNote={highlightedCitationInNote}
                    />
                  );
                })}
                {/* Ortho-only: Orders and Services rendered as read-only visual sections.
                    Edit-mode counterparts live inside the Plan section block; here they
                    appear after the Plan narrative as standalone sections (matching the
                    edit view layout, minus header/per-row controls). Hidden pre-submit
                    so the empty placeholder layout stays clean. */}
                {isOrthoPatient && orthoExtras && isChartPopulated && (
                  <>
                    <Box sx={{ mb: 1 }}>
                      <VisitNoteOrdersSection
                        readOnly
                        orders={orthoExtras.orders}
                        onOrdersChange={(orders) =>
                          setOrthoExtras((prev) => (prev ? { ...prev, orders } : prev))
                        }
                      />
                    </Box>
                    <Box id="ai-services-block" sx={{ scrollMarginTop: 24, borderRadius: 1 }}>
                      <VisitNoteServicesSection
                        readOnly
                        categories={orthoExtras.services}
                        onCategoriesChange={(services) =>
                          setOrthoExtras((prev) => (prev ? { ...prev, services } : prev))
                        }
                      />
                    </Box>
                  </>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 14, lineHeight: 1.6 }}>
                    Primary provider is Daniel McGuffie, PT, DPT, OCS. Referring provider on file is Lauren Chambers (fax: +1 (585) 784-7981). Plan of Care PDF to be faxed to referring provider upon signing.
                  </Typography>
                  <SignNoteBlock data={data.notarize.notarize} onUpdate={updateNotarize} />
                </Box>
              </>
            ) : (
            visibleSections.map((section) => {
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
                    // Ortho's Orders/Services live in `visibleSections` so they
                    // show up in the TOC, but they're rendered below this map
                    // (as their own components — they have their own headers
                    // and don't fit the standard subsection wrapper).
                    if (sub.id === ORTHO_PLAN_ORDERS_SUBSECTION.id || sub.id === ORTHO_PLAN_SERVICES_SUBSECTION.id) {
                      return null;
                    }
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
                                minRows={2}
                                value={data.subjective['chief-complaint'].content}
                                onChange={(e) => updateChiefComplaintContent(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                              {!isOrthoPatient && (
                                <>
                                  <VisitNoteTextArea
                                    label="Patient Comments"
                                    placeholder="Add details about morning stiffness, getting up from bed, and impact on the day..."
                                    minRows={2}
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
                                </>
                              )}
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
                                minRows={2}
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
                                minRows={2}
                                value={data.subjective['exacerbating-factors'].exacerbatingFactors}
                                onChange={(e) => updateExacerbatingFactors('exacerbatingFactors', e.target.value)}
                                sx={{ width: '100%' }}
                              />
                              <VisitNoteTextArea
                                label="Alleviating Factors"
                                placeholder="Add here"
                                minRows={2}
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
                                minRows={2}
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
                          {isOrthoPatient ? (
                            <>
                              <VisitNoteMeasurementsTable
                                title="Inspection"
                                columnLabels={['Label']}
                                rows={[
                                  { measurementName: 'Alignment' },
                                  { measurementName: 'Erythema' },
                                  { measurementName: 'Effusion' },
                                  { measurementName: 'Surgical scarring' },
                                ]}
                                values={data.objective.measurements['lumbar-mobility']}
                                onCellChange={(ri, ci, v) => updateMeasurementCell('lumbar-mobility', ri, ci, v)}
                                readOnly={false}
                              />
                              <VisitNoteMeasurementsTable
                                title="General"
                                columnLabels={['Label', 'Label']}
                                rows={[
                                  { measurementName: 'Varus Stress (0°)' },
                                  { measurementName: 'Valgus Stress (0°)' },
                                  { measurementName: 'Varus Stress (30°)' },
                                  { measurementName: 'Valgus Stress (30°)' },
                                ]}
                                values={data.objective.measurements.thoracic}
                                onCellChange={(ri, ci, v) => updateMeasurementCell('thoracic', ri, ci, v)}
                                readOnly={false}
                              />
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
                        </Box>
                      )}

                      {section.id === 'assessment' && sub.id === 'diagnosis-summary' && (
                        <>
                          {mode === 'edit' ? (
                            <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {!isOrthoPatient && (
                                <VisitNoteChipSelect
                                  label="CPT codes"
                                  options={CPT_CODE_OPTIONS}
                                  value={data.assessment['diagnosis-summary'].cptCodes}
                                  onChange={updateDiagnosisSummaryCptCodes}
                                  placeholder="Add CPT codes"
                                  searchPlaceholder="Search CPT codes..."
                                  sx={{ width: '100%' }}
                                />
                              )}
                              <VisitNoteTextArea
                                label="Summary"
                                placeholder="Describe the diagnoses the provider has selected..."
                                minRows={2}
                                value={data.assessment['diagnosis-summary'].summary}
                                onChange={(e) => updateDiagnosisSummarySummary(e.target.value)}
                                sx={{ width: '100%' }}
                              />
                              {isOrthoPatient && orthoExtras && (
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                  <Typography
                                    component="label"
                                    sx={{
                                      width: 180,
                                      flexShrink: 0,
                                      fontSize: 14,
                                      fontWeight: 600,
                                      color: 'primary.dark',
                                      pt: '6px',
                                    }}
                                  >
                                    Diagnosis Code
                                  </Typography>
                                  <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center', pt: '4px' }}>
                                    {orthoExtras.diagnosisCodes.map((dc) => (
                                      <Chip
                                        key={dc.code}
                                        label={`${dc.label} - ${dc.code}`}
                                        size="small"
                                        onDelete={() => {
                                          setOrthoExtras((prev) =>
                                            prev
                                              ? { ...prev, diagnosisCodes: prev.diagnosisCodes.filter((d) => d.code !== dc.code) }
                                              : prev,
                                          );
                                        }}
                                        sx={{ fontSize: 12, height: 24 }}
                                      />
                                    ))}
                                    <Button
                                      size="small"
                                      startIcon={<AddOutlined sx={{ fontSize: 14 }} />}
                                      sx={{ fontSize: 12, height: 24, textTransform: 'none' }}
                                    >
                                      Add
                                    </Button>
                                  </Box>
                                </Box>
                              )}
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
                                minRows={2}
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
                                minRows={2}
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
                                minRows={2}
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

                      {section.id === 'plan' && sub.id === 'goals' && !isOrthoPatient && (
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

                      {section.id === 'plan' && sub.id === 'plan-of-care' && !isOrthoPatient && (
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
                  {/* Orders and Services — part of Plan section for ortho patients. */}
                  {/* Anchor ids match the ortho Plan subsections in `visibleSections` so TOC links scroll here. */}
                  {section.id === 'plan' && mode === 'edit' && isOrthoPatient && orthoExtras && (
                    <>
                      <Box
                        id={ORTHO_PLAN_ORDERS_SUBSECTION.anchorId}
                        sx={{ mb: 2, pt: 1, px: 2, scrollMarginTop: 24 }}
                      >
                        <VisitNoteOrdersSection
                          orders={orthoExtras.orders}
                          onOrdersChange={(orders) =>
                            setOrthoExtras((prev) => (prev ? { ...prev, orders } : prev))
                          }
                        />
                      </Box>
                      <Box
                        id={ORTHO_PLAN_SERVICES_SUBSECTION.anchorId}
                        sx={{ mb: 2, pt: 1, px: 2, scrollMarginTop: 24 }}
                      >
                        <VisitNoteServicesSection
                          categories={orthoExtras.services}
                          onCategoriesChange={(services) =>
                            setOrthoExtras((prev) => (prev ? { ...prev, services } : prev))
                          }
                        />
                      </Box>
                    </>
                  )}
                </Collapse>
              </Box>
            );
          })
            )}
          </Box>
          <VisitNoteFloatingToolbar
            mode={mode}
            onModeChange={setMode}
            onAICheckClick={onAICheckClick}
            aiCheckSuggestionCount={aiCheckSuggestionCount}
            onScribeClick={onScribeClick}
            isScribePanelOpen={isScribePanelOpen}
            scribeRecordingState={scribeRecordingState}
            onScribePause={onScribePause}
            onScribeEndRecording={onScribeEndRecording}
            signStatus={signStatus}
            addendumState={addendumState}
            addendumReason={addendumReason}
            onAddendumReasonChange={setAddendumReason}
            onAddAddendumClick={() => setAddendumState('reasonPrompt')}
            onAddendumCancel={() => {
              setAddendumState('none');
              setAddendumReason('');
            }}
            onAddendumSkip={() => {
              setAddendumReason('');
              setAddendumState('editing');
              setMode('edit');
            }}
            onAddendumProceed={() => {
              setAddendumState('editing');
              setMode('edit');
            }}
            onFinalizeAddendum={() => {
              setAddendumState('none');
              setAddendumReason('');
              setMode('read');
            }}
          />
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
        bgcolor: data.signStatus === 'signed' ? 'primary.light' : 'action.hover',
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
        className={VISIT_NOTE_BUTTON_EXEMPT_CLASS}
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
          minRows={2}
          value={data.subjective['chief-complaint'].content}
          onChange={(e) => updateChiefComplaintContent(e.target.value)}
          sx={{ width: '100%' }}
        />
        <VisitNoteTextArea
          label="Patient Comments"
          placeholder="Add details about morning stiffness, getting up from bed, and impact on the day..."
          minRows={2}
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
          minRows={2}
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
          minRows={2}
          value={data.subjective['exacerbating-factors'].exacerbatingFactors}
          onChange={(e) => updateExacerbatingFactors('exacerbatingFactors', e.target.value)}
          sx={{ width: '100%' }}
        />
        <VisitNoteTextArea
          label="Alleviating Factors"
          placeholder="Add here"
          minRows={2}
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
          minRows={2}
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
          minRows={2}
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
          minRows={2}
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
          minRows={2}
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
          minRows={2}
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
