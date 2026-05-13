import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Button, Chip, CircularProgress, Menu, MenuItem, Popover, SvgIcon, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { AppIconButton } from '../AppIconButton';
import { AthelasGreetingEmblem } from './AthelasGreetingEmblem';
import type { AICheckReport, AICheckSuggestion, SeededAssistantChat } from './AICheckChat';
import {
  useAICheckActions,
  type AICheckSuggestionResolution,
} from './AICheckActionsContext';
import {
  DEFAULT_ASSISTANT_SHORTCUTS,
  type AIAssistantShortcut,
} from './assistantPanelShortcuts';
import { END_OF_DAY_LABEL, getTodaysVisitsSummary } from '../../data/mockTodaysVisits';

/** Matches `AppFrame` side panel width. */
const PANEL_WIDTH = 280;

const greetingEntrance = keyframes`
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`;

/** Sweeps a highlight across the clipped gradient so the glyphs “fill” with emphasis. */
const thinkingTextFill = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

/** Pauses before the demo reply lands. */
const ASSISTANT_THINKING_MS = 2000;

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

let messageId = 0;
function nextMessageId(): string {
  messageId += 1;
  return `m-${messageId}`;
}

type ChatRole = 'user' | 'assistant';

interface TextChatMessage {
  id: string;
  role: ChatRole;
  kind: 'text';
  text: string;
}

interface AICheckReportChatMessage {
  id: string;
  role: 'assistant';
  kind: 'ai-check-report';
  report: AICheckReport;
}

type ChatMessage = TextChatMessage | AICheckReportChatMessage;

function isTextMessage(msg: ChatMessage): msg is TextChatMessage {
  return msg.kind === 'text';
}

function findFirstUserText(messages: ChatMessage[]): string | undefined {
  for (const m of messages) {
    if (m.role === 'user' && m.kind === 'text') return m.text;
  }
  return undefined;
}

type DemoPhase = 'greeting' | 'awaiting_rule_update' | 'complete';

type ViewMode = 'chat' | 'all-chats';

interface ChatHistoryItem {
  id: string;
  title: string;
  lastAccessed: Date;
  messages: ChatMessage[];
}

function formatChatTimestamp(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date
      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      .toLowerCase()
      .replace(' ', '');
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

let historyId = 0;
function nextHistoryId(): string {
  historyId += 1;
  return `ch-${historyId}`;
}

function buildInitialHistory(): ChatHistoryItem[] {
  const now = new Date();
  const at = (daysAgo: number, hour: number, min: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, min, 0, 0);
    return d;
  };
  return [
    {
      id: nextHistoryId(),
      title: "Today's Schedule Overview",
      lastAccessed: at(0, 9, 15),
      messages: [
        { id: 'h1-m1', role: 'user', kind: 'text', text: "Today's Overview" },
        { id: 'h1-m2', role: 'assistant', kind: 'text', text: AI_DAY_OVERVIEW },
        { id: 'h1-m3', role: 'user', kind: 'text', text: 'Can you move the new patient slot earlier in the day?' },
        { id: 'h1-m4', role: 'assistant', kind: 'text', text: "The earliest open slot for a New Patient visit (45 min) before your current one is 10:15 AM. Want me to move it there, or would you prefer to adjust the duration instead?" },
      ],
    },
    {
      id: nextHistoryId(),
      title: 'Scheduling Rules Update',
      lastAccessed: at(0, 11, 42),
      messages: [
        { id: 'h2-m1', role: 'user', kind: 'text', text: 'Update my scheduling rules so new patients can only book 9–12' },
        { id: 'h2-m2', role: 'assistant', kind: 'text', text: AI_RULES_CONFIRMED },
        { id: 'h2-m3', role: 'user', kind: 'text', text: 'Perfect, thanks' },
        { id: 'h2-m4', role: 'assistant', kind: 'text', text: "You're welcome. The rule is live—any new patient booking attempts outside that window will be blocked automatically." },
      ],
    },
    {
      id: nextHistoryId(),
      title: "My Todo's",
      lastAccessed: at(1, 14, 30),
      messages: [
        { id: 'h3-m1', role: 'user', kind: 'text', text: "What's waiting on me?" },
        { id: 'h3-m2', role: 'assistant', kind: 'text', text: AI_WAITING },
        { id: 'h3-m3', role: 'user', kind: 'text', text: 'Open the lab result' },
        { id: 'h3-m4', role: 'assistant', kind: 'text', text: "Opening the lab result for James Hartley (CBC, drawn this morning). Flagged: Hemoglobin 9.2 g/dL — low. You may want to review before his 2 PM visit." },
      ],
    },
    {
      id: nextHistoryId(),
      title: 'Patient Alerts',
      lastAccessed: at(2, 10, 0),
      messages: [
        { id: 'h4-m1', role: 'user', kind: 'text', text: 'Key alerts for today' },
        { id: 'h4-m2', role: 'assistant', kind: 'text', text: AI_KEY_ALERTS },
        { id: 'h4-m3', role: 'user', kind: 'text', text: 'Which patients have open pre-visit tasks?' },
        { id: 'h4-m4', role: 'assistant', kind: 'text', text: "Three patients have open tasks: Sarah M. (med reconciliation), David R. (consent form unsigned), and Emily T. (pre-visit questionnaire incomplete). All are scheduled before noon." },
      ],
    },
    {
      id: nextHistoryId(),
      title: 'Lab Results Review',
      lastAccessed: at(3, 16, 20),
      messages: [
        { id: 'h5-m1', role: 'user', kind: 'text', text: 'Any lab results I need to review?' },
        { id: 'h5-m2', role: 'assistant', kind: 'text', text: "You have 4 pending lab results: two are routine follow-ups (lipid panel, HbA1c), one is flagged critical — potassium 6.1 mEq/L for Robert Chen, and one is a pre-op CBC still pending sign-off." },
        { id: 'h5-m3', role: 'user', kind: 'text', text: 'Flag the critical one for a callback' },
        { id: 'h5-m4', role: 'assistant', kind: 'text', text: "Done. Robert Chen's chart is flagged for an urgent callback regarding the potassium result. His contact number on file is (555) 304-1182. Want me to draft a message to your nurse as well?" },
      ],
    },
    {
      id: nextHistoryId(),
      title: 'End of Day Summary',
      lastAccessed: at(5, 17, 0),
      messages: [
        { id: 'h6-m1', role: 'user', kind: 'text', text: 'Give me an end of day summary' },
        { id: 'h6-m2', role: 'assistant', kind: 'text', text: "Here's your summary: you saw 14 patients, completed 12 notes (2 still open), signed 3 prescriptions, and had 1 no-show. Average visit ran 2 minutes over the booked time. Reminder: you have a prior auth due tomorrow for Maria L." },
        { id: 'h6-m3', role: 'user', kind: 'text', text: 'Remind me about the prior auth tomorrow morning' },
        { id: 'h6-m4', role: 'assistant', kind: 'text', text: "Got it—I'll surface that reminder when you open the app tomorrow. Prior auth for Maria L., due by end of day." },
      ],
    },
  ];
}

function formatTypeBreakdown(typeCounts: ReturnType<typeof getTodaysVisitsSummary>['typeCounts']): string {
  const labelFor: Record<keyof typeof typeCounts, { singular: string; plural: string }> = {
    'Follow-up Visit': { singular: 'follow-up', plural: 'follow-ups' },
    'Post-op Visit': { singular: 'post-op', plural: 'post-ops' },
    'Initial Consultation': { singular: 'initial consultation', plural: 'initial consultations' },
    'New Patient': { singular: 'new patient visit', plural: 'new patient visits' },
  };
  const parts: string[] = [];
  (['Follow-up Visit', 'Post-op Visit', 'Initial Consultation', 'New Patient'] as const).forEach((key) => {
    const n = typeCounts[key];
    if (n > 0) {
      const label = n === 1 ? labelFor[key].singular : labelFor[key].plural;
      parts.push(`${n} ${label}`);
    }
  });
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

function buildDayOverviewText(): string {
  const summary = getTodaysVisitsSummary();
  const breakdown = formatTypeBreakdown(summary.typeCounts);

  const reviewBits: string[] = [];
  if (summary.labsCount > 0) reviewBits.push(`${summary.labsCount} with new labs`);
  if (summary.imagingCount > 0) reviewBits.push(`${summary.imagingCount} with new imaging`);
  const reviewDetail = reviewBits.length > 0 ? ` (${reviewBits.join(', ')})` : '';

  const reviewLine =
    summary.patientsWithReviewItems > 0
      ? `• ${summary.patientsWithReviewItems} ${summary.patientsWithReviewItems === 1 ? 'patient has' : 'patients have'} items to review before their visit${reviewDetail}.`
      : `• No patients have outstanding items to review before their visit.`;

  const overrun = summary.overrunPatients[0];
  let overrunLine = '';
  if (overrun?.appointmentTime) {
    const minutesOver = (() => {
      const [, end] = overrun.appointmentTime.split(/\s*[–-]\s*/);
      const endLabel = end?.trim();
      return endLabel ? `to ${endLabel}` : '';
    })();
    overrunLine = `• Heads-up: your last appointment is a New Patient visit at ${overrun.appointmentTime}. The booked duration runs ${minutesOver} — about 15 minutes past your published ${END_OF_DAY_LABEL} availability. Worth tightening that block or moving the visit if you need to protect your end time.`;
  }

  return [
    `Here's how today's schedule looks at a glance:`,
    '',
    `• ${summary.totalVisits} visits booked${breakdown ? ` — ${breakdown}` : ''}.`,
    reviewLine,
    overrunLine,
  ]
    .filter(Boolean)
    .join('\n');
}

const AI_DAY_OVERVIEW = buildDayOverviewText();

const AI_KEY_ALERTS =
  "Here are the key alerts for today: you have patients with open pre-visit tasks or critical results to review before their visits.\n\nImportant: your last slot is a New Patient appointment. It extends about 15 minutes past your published availability for the day, so you may want to tighten your scheduling rules or move that visit.";

const AI_WAITING =
  "You have a few items waiting: two refill requests to sign, one lab result to review before noon, and three unsigned notes from yesterday. Want me to open any of these?";

const AI_RULES_CONFIRMED =
  "Done. I've updated your Scheduling Rules & Restrictions so New Patient appointments can only be booked 9:00 AM–12:00 PM. Your other appointment types are unchanged.";

const AI_DEMO_WRAP_UP =
  "Thanks for walking through the demo. In the full product, I can keep helping with scheduling, alerts, and more.";

const HOME_DEMO_SHORTCUT_IDS = new Set([
  'tell-me-about-my-day',
  'whats-waiting-on-me',
  'key-alerts-today',
]);

function placeholderShortcutReply(label: string): string {
  return `I’ll help with **${label}** here in the full product—for now this is a quick preview of the assistant.`;
}

function looksLikeSchedulingRuleUpdate(text: string): boolean {
  const lower = text.toLowerCase();
  const mentionsWindow =
    (lower.includes('9') && lower.includes('12')) ||
    lower.includes('9am') ||
    lower.includes('12pm') ||
    lower.includes('noon');
  const mentionsNewPatient = lower.includes('new patient');
  return mentionsNewPatient && mentionsWindow;
}

function NewChatIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 7.5C12.4142 7.5 12.75 7.83579 12.75 8.25V10.5C12.75 10.6381 12.8619 10.75 13 10.75H15.25C15.6642 10.75 16 11.0858 16 11.5C16 11.9142 15.6642 12.25 15.25 12.25H13C12.8619 12.25 12.75 12.3619 12.75 12.5V14.75C12.75 15.1642 12.4142 15.5 12 15.5C11.5858 15.5 11.25 15.1642 11.25 14.75V12.5C11.25 12.3619 11.1381 12.25 11 12.25H8.75C8.33579 12.25 8 11.9142 8 11.5C8 11.0858 8.33579 10.75 8.75 10.75H11C11.1381 10.75 11.25 10.6381 11.25 10.5V8.25C11.25 7.83579 11.5858 7.5 12 7.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.3496 3C17.5898 3 18.7108 2.99957 19.5664 3.43555C20.3189 3.81902 20.931 4.43109 21.3145 5.18359C21.7504 6.03924 21.75 7.16018 21.75 9.40039V13.0996C21.75 15.3398 21.7504 16.4608 21.3145 17.3164C20.931 18.0689 20.3189 18.681 19.5664 19.0645C18.7108 19.5004 17.5898 19.5 15.3496 19.5H9.96778C9.35633 19.5 9.0504 19.5003 8.7627 19.5693C8.50767 19.6306 8.26368 19.7311 8.04004 19.8682C7.78775 20.0228 7.57105 20.2395 7.13867 20.6719L5.94434 21.8662C5.89737 21.9132 5.87399 21.937 5.85059 21.959C5.49616 22.2913 5.03245 22.4833 4.54688 22.499C4.51465 22.5001 4.48091 22.5 4.41407 22.5C4.26169 22.5 4.18545 22.5003 4.1211 22.4961C3.11806 22.4313 2.31868 21.6319 2.25391 20.6289C2.24975 20.5646 2.25 20.4883 2.25 20.3359V9.40039C2.25 7.16018 2.24958 6.03924 2.68555 5.18359C3.06902 4.43109 3.68109 3.81902 4.4336 3.43555C5.28924 2.99957 6.41018 3 8.65039 3H15.3496ZM7.75 4.5C6.35003 4.5 5.64999 4.50007 5.11524 4.77246C4.64483 5.01214 4.26215 5.39483 4.02246 5.86523C3.75007 6.39999 3.75 7.10002 3.75 8.5V20.3359C3.75 20.4885 3.75007 20.5653 3.7666 20.6279C3.81259 20.8017 3.94832 20.9374 4.12207 20.9834C4.18475 20.9999 4.26146 21 4.41407 21C4.48094 21 4.51486 21.0002 4.54688 20.9961C4.63431 20.9847 4.71722 20.9502 4.78711 20.8965C4.81266 20.8768 4.83661 20.8528 4.88379 20.8057L5.81446 19.875C6.50602 19.1834 6.85238 18.8372 7.25586 18.5898C7.61368 18.3706 8.00406 18.2083 8.41211 18.1104C8.87239 17.9998 9.36179 18 10.3398 18H16.25C17.65 18 18.35 17.9999 18.8848 17.7275C19.3552 17.4879 19.7379 17.1052 19.9775 16.6348C20.2499 16.1 20.25 15.4 20.25 14V8.5C20.25 7.10002 20.2499 6.39999 19.9775 5.86523C19.7379 5.39483 19.3552 5.01214 18.8848 4.77246C18.35 4.50007 17.65 4.5 16.25 4.5H7.75Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function AllChatsIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 5.75C8.5 5.33579 8.83579 5 9.25 5H20.25C20.6642 5 21 5.33579 21 5.75C21 6.16421 20.6642 6.5 20.25 6.5H9.25C8.83579 6.5 8.5 6.16421 8.5 5.75Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 18.245C8.5 17.8335 8.83355 17.5 9.245 17.5H20.255C20.6665 17.5 21 17.8335 21 18.245C21 18.6565 20.6665 18.99 20.255 18.99H9.245C8.83355 18.99 8.5 18.6565 8.5 18.245Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.245 5C5.66197 5 6 5.33802 6 5.755C6 6.17198 5.66197 6.51 5.245 6.51H4.755C4.33803 6.51 4 6.17198 4 5.755C4 5.33802 4.33803 5 4.755 5H5.245Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25 17.5C5.66421 17.5 6 17.8358 6 18.25C6 18.6642 5.66421 19 5.25 19H4.75C4.33579 19 4 18.6642 4 18.25C4 17.8358 4.33579 17.5 4.75 17.5H5.25Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 12C6 12.4142 5.66421 12.75 5.25 12.75H4.75C4.33579 12.75 4 12.4142 4 12C4 11.5858 4.33579 11.25 4.75 11.25H5.25C5.66421 11.25 6 11.5858 6 12ZM21 12C21 12.4142 20.6642 12.75 20.25 12.75H9.25C8.83579 12.75 8.5 12.4142 8.5 12C8.5 11.5858 8.83579 11.25 9.25 11.25H20.25C20.6642 11.25 21 11.5858 21 12Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

const shortcutChipSx = {
  height: 28,
  minHeight: 28,
  maxHeight: 28,
  width: 'fit-content',
  maxWidth: '100%',
  borderRadius: '6px',
  bgcolor: 'primary.light',
  color: 'primary.dark',
  fontWeight: 500,
  fontSize: 13,
  lineHeight: 1,
  boxSizing: 'border-box' as const,
  '& .MuiChip-icon': {
    color: 'inherit',
    marginLeft: '8px',
    marginRight: 0,
    fontSize: 16,
  },
  '& .MuiChip-label': {
    pl: '4px',
    pr: '8px',
    py: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '28px',
  },
  '&:hover': {
    bgcolor: 'primary.light',
    filter: 'brightness(0.96)',
  },
  '&:active': {
    boxShadow: 'none',
  },
};

export interface AIAssistantPanelProps {
  onClose: () => void;
  userFirstName?: string;
  shortcuts?: AIAssistantShortcut[];
  onShortcutClick?: (shortcutId: string) => void;
  /**
   * Imperative hand-off from the parent: when this object's `key` changes the
   * panel saves the in-progress chat to history and replaces it with the
   * provided seed (a synthetic user prompt + a rich AI Check report message).
   * Used to power "AI Check" from the visit note.
   */
  pendingAICheck?: { key: number; seed: SeededAssistantChat } | null;
  /**
   * When this object's `key` changes, the panel resets to a fresh chat —
   * but only if the current transcript is showing an AI Check report
   * (so manually-typed conversations aren't disturbed). Used by the
   * visit note to drop stale AI Check context on unmount.
   */
  pendingAICheckReset?: { key: number } | null;
  /** When true, render an inline close button in the panel header (used when
   *  the panel is presented as a compact-viewport overlay popover). */
  compact?: boolean;
}

export function AIAssistantPanel({
  onClose,
  userFirstName = 'Alex',
  shortcuts = DEFAULT_ASSISTANT_SHORTCUTS,
  onShortcutClick,
  pendingAICheck,
  pendingAICheckReset,
  compact,
}: AIAssistantPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [demoPhase, setDemoPhase] = useState<DemoPhase>('greeting');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => buildInitialHistory());
  const [chatMenuAnchor, setChatMenuAnchor] = useState<HTMLElement | null>(null);
  const [activeShortcut, setActiveShortcut] = useState<AIAssistantShortcut | null>(null);
  const [tipsAnchor, setTipsAnchor] = useState<HTMLElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const consumedSeedKeyRef = useRef<number | null>(null);
  const consumedResetKeyRef = useRef<number | null>(null);

  const hasConversation = messages.length > 0;

  const rawChatTitle = findFirstUserText(messages) ?? '';
  const chatTitle = rawChatTitle.length > 24 ? rawChatTitle.slice(0, 24) + '…' : rawChatTitle;

  useEffect(() => {
    if (!hasConversation) return;
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, hasConversation, isAssistantThinking]);

  useEffect(() => {
    return () => {
      if (thinkingTimeoutRef.current != null) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!pendingAICheck) return;
    if (consumedSeedKeyRef.current === pendingAICheck.key) return;
    consumedSeedKeyRef.current = pendingAICheck.key;

    if (thinkingTimeoutRef.current != null) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }

    const seed = pendingAICheck.seed;
    setMessages((prev) => {
      const firstUserText = findFirstUserText(prev);
      if (firstUserText) {
        const title = firstUserText.length > 40 ? firstUserText.slice(0, 40) + '…' : firstUserText;
        setChatHistory((h) => [
          { id: nextHistoryId(), title, lastAccessed: new Date(), messages: prev },
          ...h,
        ]);
      }
      return [
        { id: nextMessageId(), role: 'user', kind: 'text', text: seed.userPrompt },
        { id: nextMessageId(), role: 'assistant', kind: 'ai-check-report', report: seed.report },
      ];
    });
    setDemoPhase('complete');
    setInputValue('');
    setIsAssistantThinking(false);
    setViewMode('chat');
    setActiveShortcut(null);
  }, [pendingAICheck]);

  const clearThinkingTimer = useCallback(() => {
    if (thinkingTimeoutRef.current != null) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
  }, []);

  const scheduleAssistantReply = useCallback(
    (
      assistantText: string,
      options?: { advanceToAwaitingRule?: boolean; advanceToComplete?: boolean },
    ) => {
      clearThinkingTimer();
      setIsAssistantThinking(true);
      thinkingTimeoutRef.current = setTimeout(() => {
        thinkingTimeoutRef.current = null;
        setMessages((prev) => [
          ...prev,
          { id: nextMessageId(), role: 'assistant', kind: 'text', text: assistantText },
        ]);
        setIsAssistantThinking(false);
        if (options?.advanceToAwaitingRule) setDemoPhase('awaiting_rule_update');
        if (options?.advanceToComplete) setDemoPhase('complete');
      }, ASSISTANT_THINKING_MS);
    },
    [clearThinkingTimer],
  );

  const appendExchange = useCallback(
    (userText: string, assistantText: string, advanceDemo: boolean) => {
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: 'user', kind: 'text', text: userText },
      ]);
      scheduleAssistantReply(assistantText, advanceDemo ? { advanceToAwaitingRule: true } : undefined);
    },
    [scheduleAssistantReply],
  );

  const handleShortcut = useCallback(
    (shortcut: AIAssistantShortcut) => {
      if (hasConversation && isAssistantThinking) return;
      onShortcutClick?.(shortcut.id);

      const isHomeDemoShortcut = HOME_DEMO_SHORTCUT_IDS.has(shortcut.id);
      if (isHomeDemoShortcut && demoPhase === 'complete') return;

      setActiveShortcut(shortcut);

      if (shortcut.id === 'tell-me-about-my-day') {
        appendExchange("Today's Overview", AI_DAY_OVERVIEW, true);
        return;
      }
      if (shortcut.id === 'key-alerts-today') {
        appendExchange('Important Alerts', AI_KEY_ALERTS, true);
        return;
      }
      if (shortcut.id === 'whats-waiting-on-me') {
        appendExchange("My Todo's", AI_WAITING, false);
        return;
      }

      if (!isHomeDemoShortcut) {
        appendExchange(shortcut.label, placeholderShortcutReply(shortcut.label), false);
      }
    },
    [appendExchange, demoPhase, hasConversation, isAssistantThinking, onShortcutClick],
  );

  const handleNewChat = useCallback(() => {
    clearThinkingTimer();
    setMessages((prev) => {
      const firstUserText = findFirstUserText(prev);
      if (firstUserText) {
        const title = firstUserText.length > 40 ? firstUserText.slice(0, 40) + '…' : firstUserText;
        setChatHistory((h) => [
          { id: nextHistoryId(), title, lastAccessed: new Date(), messages: prev },
          ...h,
        ]);
      }
      return [];
    });
    setDemoPhase('greeting');
    setInputValue('');
    setIsAssistantThinking(false);
    setViewMode('chat');
    setActiveShortcut(null);
  }, [clearThinkingTimer]);

  // Parent-driven reset: when the visit note unmounts it bumps
  // `pendingAICheckReset.key` so the now-orphaned AI Check chat can be
  // dropped back to a fresh state. Only acts if the current transcript
  // contains an AI Check report — typed-out conversations are left alone.
  useEffect(() => {
    if (!pendingAICheckReset) return;
    if (consumedResetKeyRef.current === pendingAICheckReset.key) return;
    consumedResetKeyRef.current = pendingAICheckReset.key;
    setMessages((prev) => {
      const hasAICheck = prev.some((m) => m.kind === 'ai-check-report');
      if (!hasAICheck) return prev;
      clearThinkingTimer();
      const firstUserText = findFirstUserText(prev);
      if (firstUserText) {
        const title = firstUserText.length > 40 ? firstUserText.slice(0, 40) + '…' : firstUserText;
        setChatHistory((h) => [
          { id: nextHistoryId(), title, lastAccessed: new Date(), messages: prev },
          ...h,
        ]);
      }
      setDemoPhase('greeting');
      setInputValue('');
      setIsAssistantThinking(false);
      setViewMode('chat');
      setActiveShortcut(null);
      return [];
    });
  }, [pendingAICheckReset, clearThinkingTimer]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    if (hasConversation && isAssistantThinking) return;

    if (demoPhase === 'greeting') {
      const lower = text.toLowerCase();
      if (lower.includes('about my day') || lower.includes('my day')) {
        appendExchange(text, AI_DAY_OVERVIEW, true);
        setInputValue('');
        return;
      }
      if (lower.includes('waiting')) {
        appendExchange(text, AI_WAITING, false);
        setInputValue('');
        return;
      }
      if (lower.includes('alert')) {
        appendExchange(text, AI_KEY_ALERTS, true);
        setInputValue('');
        return;
      }
    }

    if (demoPhase === 'awaiting_rule_update') {
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: 'user', kind: 'text', text },
      ]);
      scheduleAssistantReply(AI_RULES_CONFIRMED, { advanceToComplete: true });
      setInputValue('');
      return;
    }

    if (demoPhase !== 'complete' && hasConversation && looksLikeSchedulingRuleUpdate(text)) {
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: 'user', kind: 'text', text },
      ]);
      scheduleAssistantReply(AI_RULES_CONFIRMED, { advanceToComplete: true });
      setInputValue('');
      return;
    }

    if (demoPhase === 'complete') {
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: 'user', kind: 'text', text },
      ]);
      scheduleAssistantReply(AI_DEMO_WRAP_UP);
      setInputValue('');
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: nextMessageId(), role: 'user', kind: 'text', text },
    ]);
    scheduleAssistantReply(
      "Try asking about your day, what's waiting on you, or key alerts—or use the shortcuts when you open the panel.",
    );
    setInputValue('');
  };

  return (
    <Box
      sx={{
        width: PANEL_WIDTH,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          px: 1,
          py: 0.5,
        }}
      >
        {(hasConversation || viewMode === 'all-chats') && (
          <AppIconButton
            tooltip="New chat"
            aria-label="New chat"
            onClick={handleNewChat}
            sx={{ color: 'text.secondary', flexShrink: 0 }}
          >
            <NewChatIcon sx={{ fontSize: 18 }} />
          </AppIconButton>
        )}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {viewMode === 'all-chats' ? (
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
              All Chats
            </Typography>
          ) : hasConversation ? (
            <Box
              component="button"
              onClick={(e: React.MouseEvent<HTMLElement>) => setChatMenuAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.25,
                overflow: 'hidden',
                cursor: 'pointer',
                userSelect: 'none',
                background: 'none',
                border: 'none',
                p: 0,
                borderRadius: 1,
                maxWidth: '100%',
                '&:hover': { opacity: 0.7 },
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {chatTitle}
              </Typography>
              <KeyboardArrowDownOutlined
                sx={{
                  fontSize: 15,
                  color: 'text.secondary',
                  flexShrink: 0,
                  transition: 'transform 0.15s',
                  transform: chatMenuAnchor ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </Box>
          ) : null}
        </Box>

        <AppIconButton
          tooltip={viewMode === 'all-chats' ? 'Back to chat' : 'All chats'}
          aria-label={viewMode === 'all-chats' ? 'Back to chat' : 'All chats'}
          onClick={() => setViewMode((v) => (v === 'all-chats' ? 'chat' : 'all-chats'))}
          sx={{
            color: viewMode === 'all-chats' ? 'primary.main' : 'text.secondary',
            flexShrink: 0,
          }}
        >
          <AllChatsIcon sx={{ fontSize: 18 }} />
        </AppIconButton>
        {compact && (
          <AppIconButton
            tooltip="Close"
            aria-label="Close panel"
            onClick={onClose}
            sx={{ color: 'text.secondary', flexShrink: 0 }}
          >
            <CloseOutlined sx={{ fontSize: 18 }} />
          </AppIconButton>
        )}
      </Box>

      <Menu
        anchorEl={chatMenuAnchor}
        open={Boolean(chatMenuAnchor)}
        onClose={() => setChatMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              width: PANEL_WIDTH - 16,
              maxHeight: 320,
              mt: 0.5,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              borderRadius: 2,
            },
          },
        }}
      >
        {chatHistory.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              clearThinkingTimer();
              setMessages(item.messages);
              setDemoPhase('complete');
              setIsAssistantThinking(false);
              setActiveShortcut(null);
              setViewMode('chat');
              setChatMenuAnchor(null);
            }}
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              mx: 0.5,
              gap: 1,
              '&:first-of-type': { mt: 0.5 },
              '&:last-of-type': { mb: 0.5 },
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.title}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>
                {formatChatTimestamp(item.lastAccessed)}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {viewMode === 'all-chats' ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            py: 0.5,
          }}
        >
          {chatHistory.map((item) => (
            <Box
              key={item.id}
              onClick={() => {
                setMessages(item.messages);
                setDemoPhase('complete');
                setActiveShortcut(null);
                setViewMode('chat');
              }}              sx={{
                px: 1,
                py: 0.75,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'text.primary',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: 'text.secondary',
                  mt: 0.25,
                  lineHeight: 1.4,
                }}
              >
                {formatChatTimestamp(item.lastAccessed)}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : hasConversation ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            pl: 0,
            pr: 1,
            py: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 1.25,
              minHeight: '100%',
              boxSizing: 'border-box',
              px: 1,
            }}
          >
            {messages.map((msg) => {
              if (!isTextMessage(msg)) {
                return (
                  <Box key={msg.id} sx={{ alignSelf: 'flex-start', width: '100%' }}>
                    <AICheckReportBubble report={msg.report} />
                  </Box>
                );
              }
              return (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: msg.role === 'user' ? '90%' : '100%',
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      display: 'inline-block',
                      maxWidth: '100%',
                      fontSize: 13,
                      lineHeight: 1.45,
                      whiteSpace: 'pre-wrap',
                      color: 'text.primary',
                      ...(msg.role === 'user'
                        ? {
                            px: 1.25,
                            py: 1,
                            borderRadius: '10px',
                            bgcolor: 'action.selected',
                          }
                        : {
                            py: 0.25,
                            bgcolor: 'transparent',
                          }),
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              );
            })}
            {isAssistantThinking ? (
              <Box sx={{ alignSelf: 'flex-start', maxWidth: '100%' }}>
                <Typography
                  component="span"
                  sx={(theme) => ({
                    display: 'inline-block',
                    fontSize: 13,
                    lineHeight: 1.45,
                    fontStyle: 'italic',
                    fontWeight: 500,
                    backgroundImage: `linear-gradient(90deg,
                      ${theme.palette.text.secondary} 0%,
                      ${theme.palette.text.secondary} 38%,
                      ${theme.palette.primary.main} 50%,
                      ${theme.palette.text.secondary} 62%,
                      ${theme.palette.text.secondary} 100%)`,
                    backgroundSize: '220% 100%',
                    backgroundPosition: '0% 50%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                    animation: `${thinkingTextFill} 1.75s ease-in-out infinite`,
                  })}
                >
                  Thinking…
                </Typography>
              </Box>
            ) : null}
            <div ref={transcriptEndRef} />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '100%',
              animation: `${greetingEntrance} 0.4s ease-out forwards`,
            }}
          >
            <AthelasGreetingEmblem size={80} />

            <Typography
              sx={{
                mt: 2,
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.25,
                color: 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              {getTimeGreeting()}, {userFirstName}
            </Typography>
            <Typography
              sx={{
                mt: 0.75,
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.4,
                color: 'text.primary',
              }}
            >
              How can I help you today?
            </Typography>

            <Typography
              sx={{
                mt: 6,
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 400,
                color: 'text.secondary',
              }}
            >
              Shortcuts for this page
            </Typography>

            <Box
              sx={{
                mt: 1.5,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                gap: 1,
              }}
            >
              {shortcuts.map((shortcut) => {
                const { Icon } = shortcut;
                return (
                  <Chip
                    key={shortcut.id}
                    icon={<Icon />}
                    label={shortcut.label}
                    title={shortcut.label}
                    disabled={hasConversation && isAssistantThinking}
                    onClick={() => handleShortcut(shortcut)}
                    sx={shortcutChipSx}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      )}

      {viewMode !== 'all-chats' && <Box
        sx={{
          flexShrink: 0,
          pl: 0,
          pr: 1,
          pt: 1,
          pb: 1,
        }}
      >
        {activeShortcut && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.875,
              mb: 0.5,
              borderRadius: 1,
              bgcolor: 'primary.light',
            }}
          >
            <Typography
              sx={{
                flex: 1,
                minWidth: 0,
                fontSize: 13,
                fontWeight: 700,
                color: 'primary.dark',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {activeShortcut.label}
            </Typography>

            {activeShortcut.tips && (
              <Box
                component="button"
                onClick={(e: React.MouseEvent<HTMLElement>) => setTipsAnchor(e.currentTarget)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(255,255,255,0.55)',
                  border: '1px solid',
                  borderColor: 'rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'primary.dark',
                  lineHeight: '18px',
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
                }}
              >
                Tips
              </Box>
            )}

            <Box
              component="button"
              onClick={() => setActiveShortcut(null)}
              aria-label="Dismiss"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                height: 18,
                p: 0,
                border: 'none',
                borderRadius: '50%',
                bgcolor: 'transparent',
                cursor: 'pointer',
                color: 'primary.dark',
                flexShrink: 0,
                fontSize: 14,
                lineHeight: 1,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' },
              }}
            >
              ✕
            </Box>
          </Box>
        )}

        <Popover
          open={Boolean(tipsAnchor)}
          anchorEl={tipsAnchor}
          onClose={() => setTipsAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: PANEL_WIDTH - 16,
                p: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
              },
            },
          }}
        >
          {activeShortcut && (
            <>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', mb: 0.75 }}>
                {activeShortcut.label}
              </Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.55 }}>
                {activeShortcut.tips}
              </Typography>
            </>
          )}
        </Popover>

        <Box
          sx={{
            bgcolor: 'action.hover',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'transparent',
            '&:hover': { borderColor: 'divider' },
            '&:focus-within': {
              borderColor: 'primary.main',
              borderWidth: 1,
            },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={12}
            placeholder="Give me questions or tasks..."
            disabled={hasConversation && isAssistantThinking}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            inputProps={{
              'aria-label': 'Message AI assistant',
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: 14,
                py: 1,
                px: 1.5,
                alignItems: 'flex-start',
              },
              '& .MuiInputBase-input': {
                py: 0,
                minHeight: 24,
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 0.5,
              pb: 0.5,
            }}
          >
            <AppIconButton
              tooltip="Attach Files"
              aria-label="Attach Files"
              sx={{ color: 'text.secondary' }}
            >
              <AttachFileOutlined sx={{ fontSize: 20 }} />
            </AppIconButton>
            <AppIconButton
              tooltip="Send"
              aria-label="Send"
              onClick={handleSend}
              disabled={hasConversation && isAssistantThinking}
              sx={{
                bgcolor: 'grey.700',
                color: 'common.white',
                width: 36,
                height: 36,
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'grey.800',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              <SendOutlined sx={{ fontSize: 18 }} />
            </AppIconButton>
          </Box>
        </Box>
      </Box>}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* AI Check rich content                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Renders an AI Check report inline in the chat transcript: a small
 * "Acceptance" header card showing the before → after percentages, then a
 * stack of suggestion cards. Each card surfaces either Accept/Decline actions
 * or an inline text input depending on the suggestion type.
 */
function AICheckReportBubble({ report }: { report: AICheckReport }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <AICheckAcceptanceCard
        beforePercent={report.beforePercent}
        afterPercent={report.afterPercent}
      />
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'text.secondary',
          mt: 0.5,
          ml: 0.25,
        }}
      >
        Suggestions ({report.suggestions.length})
      </Typography>
      {report.suggestions.map((suggestion) => (
        <AICheckSuggestionCard key={suggestion.id} suggestion={suggestion} />
      ))}
    </Box>
  );
}

/**
 * Single circular percentage gauge: a light grey track with a colored progress
 * arc, the percent value centered inside, and a label below.
 */
function AcceptanceRing({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) {
  const size = 56;
  const thickness = 4;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', width: size, height: size }}>
        {/* Background track */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{
            color: 'grey.200',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        {/* Colored progress arc */}
        <CircularProgress
          variant="determinate"
          value={value}
          size={size}
          thickness={thickness}
          sx={{
            color,
            position: 'absolute',
            top: 0,
            left: 0,
            '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
          }}
        />
        {/* Centered percentage */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', lineHeight: 1 }}
          >
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.2 }}>
        {label}
      </Typography>
    </Box>
  );
}

function AICheckAcceptanceCard({
  beforePercent,
  afterPercent,
}: {
  beforePercent: number;
  afterPercent: number;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 600,
          color: 'text.primary',
          textAlign: 'center',
          mb: 2,
        }}
      >
        Acceptance Likelihood
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-around',
          gap: 2,
        }}
      >
        <AcceptanceRing
          value={beforePercent}
          color="warning.main"
          label="Without changes"
        />
        <AcceptanceRing
          value={afterPercent}
          color="success.main"
          label="With changes"
        />
      </Box>
    </Box>
  );
}

function AICheckSuggestionCard({ suggestion }: { suggestion: AICheckSuggestion }) {
  const { resolutions, resolveSuggestion } = useAICheckActions();
  const resolution: AICheckSuggestionResolution | undefined = resolutions[suggestion.id];
  const decided = resolution !== undefined;

  const isAccepted =
    resolution?.kind === 'accepted' || resolution?.kind === 'input-accepted';

  // Input-style cards remember their last value so a re-render after
  // acceptance keeps the captured text visible in the field.
  const [inputValue, setInputValue] = useState(() =>
    resolution?.kind === 'input-accepted' ? resolution.value : '',
  );

  // Mark accepted input as edited-once so we can keep it read-only after
  // confirmation without losing the value the user typed.
  const inputLocked = resolution?.kind === 'input-accepted';

  const handleAcceptInput = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    resolveSuggestion(suggestion.id, { kind: 'input-accepted', value: trimmed });
  };

  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 1,
        bgcolor: 'background.paper',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.1)',
        opacity: decided ? 0.65 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: 'text.primary',
          lineHeight: 1.3,
          mb: 0.5,
        }}
      >
        {suggestion.title}
      </Typography>
      {suggestion.description && (
        <Typography
          sx={{
            fontSize: 12,
            color: 'text.primary',
            lineHeight: 1.5,
            mb: suggestion.bullets ? 0.75 : 1,
          }}
        >
          {suggestion.description}
        </Typography>
      )}
      {suggestion.bullets && suggestion.bullets.length > 0 && (
        <Box
          component="ul"
          sx={{
            m: 0,
            mb: 1,
            pl: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.25,
          }}
        >
          {suggestion.bullets.map((line, idx) => (
            <Box
              key={idx}
              component="li"
              sx={{
                fontSize: 12,
                color: 'text.primary',
                lineHeight: 1.5,
              }}
            >
              {line}
            </Box>
          ))}
        </Box>
      )}

      {suggestion.action === 'input' ? (
        <AICheckSuggestionInputRow
          placeholder={suggestion.inputPlaceholder ?? 'Add details…'}
          value={inputValue}
          onChange={setInputValue}
          onAccept={handleAcceptInput}
          onDecline={() =>
            resolveSuggestion(suggestion.id, { kind: 'input-declined' })
          }
          decided={decided}
          locked={inputLocked}
          isAccepted={isAccepted}
        />
      ) : decided ? (
        <Chip
          size="small"
          icon={
            isAccepted ? (
              <CheckOutlined sx={{ fontSize: 14 }} />
            ) : (
              <CloseOutlined sx={{ fontSize: 14 }} />
            )
          }
          label={isAccepted ? 'Accepted' : 'Declined'}
          sx={(theme) => ({
            height: 24,
            fontSize: 11,
            fontWeight: 600,
            borderRadius: '999px',
            bgcolor: isAccepted
              ? alpha(theme.palette.primary.main, 0.1)
              : 'action.hover',
            color: isAccepted ? 'primary.main' : 'text.secondary',
            '& .MuiChip-icon': {
              color: 'inherit',
              ml: '6px',
              mr: '-2px',
            },
          })}
        />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => resolveSuggestion(suggestion.id, { kind: 'accepted' })}
            startIcon={<CheckOutlined sx={{ fontSize: 14 }} />}
            sx={{
              minHeight: 28,
              height: 28,
              px: 1.25,
              borderRadius: '999px',
              fontSize: 12,
              fontWeight: 600,
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
              color: 'primary.main',
              '& .MuiButton-startIcon': { mr: 0.5 },
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
              },
            }}
          >
            Accept
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => resolveSuggestion(suggestion.id, { kind: 'declined' })}
            startIcon={<CloseOutlined sx={{ fontSize: 14 }} />}
            sx={{
              minHeight: 28,
              height: 28,
              px: 1.25,
              borderRadius: '999px',
              fontSize: 12,
              fontWeight: 600,
              color: 'primary.main',
              '& .MuiButton-startIcon': { mr: 0.5 },
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
              },
            }}
          >
            Decline
          </Button>
        </Box>
      )}
    </Box>
  );
}

/**
 * Inline input + check/X icon buttons used by every "input" style AI Check
 * suggestion. Once the user confirms with the check icon (or dismisses with
 * the X) the row becomes read-only and the icons hide so the resolved value
 * still reads back inside the card.
 */
function AICheckSuggestionInputRow({
  placeholder,
  value,
  onChange,
  onAccept,
  onDecline,
  decided,
  locked,
  isAccepted,
}: {
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  onAccept: () => void;
  onDecline: () => void;
  decided: boolean;
  locked: boolean;
  isAccepted: boolean;
}) {
  const canAccept = value.trim().length > 0;
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        borderRadius: 1.5,
        bgcolor: 'action.hover',
        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        pr: 0.5,
        '&:focus-within': {
          borderColor: theme.palette.primary.main,
        },
      })}
    >
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={locked}
        variant="outlined"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && canAccept && !decided) {
            e.preventDefault();
            onAccept();
          }
        }}
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            fontSize: 13,
            borderRadius: 0,
            bgcolor: 'transparent',
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused fieldset': { border: 'none' },
            '&.Mui-disabled': {
              color: 'text.primary',
              WebkitTextFillColor: 'unset',
            },
          },
          '& .MuiOutlinedInput-input': {
            py: 0.875,
            px: 1.25,
          },
          '& .MuiOutlinedInput-input.Mui-disabled': {
            WebkitTextFillColor: 'unset',
            color: 'text.primary',
          },
        }}
      />
      {decided ? (
        <Chip
          size="small"
          icon={
            isAccepted ? (
              <CheckOutlined sx={{ fontSize: 12 }} />
            ) : (
              <CloseOutlined sx={{ fontSize: 12 }} />
            )
          }
          label={isAccepted ? 'Saved' : 'Dismissed'}
          sx={(theme) => ({
            height: 22,
            fontSize: 10,
            fontWeight: 600,
            borderRadius: '999px',
            mr: 0.25,
            bgcolor: isAccepted
              ? alpha(theme.palette.primary.main, 0.1)
              : 'action.selected',
            color: isAccepted ? 'primary.main' : 'text.secondary',
            '& .MuiChip-icon': {
              color: 'inherit',
              ml: '4px',
              mr: '-2px',
            },
            '& .MuiChip-label': { px: 0.75 },
          })}
        />
      ) : (
        <>
          <AppIconButton
            tooltip="Accept suggestion"
            size="small"
            onClick={onAccept}
            disabled={!canAccept}
            sx={(theme) => ({
              width: 26,
              height: 26,
              borderRadius: '50%',
              color: 'primary.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-disabled': {
                color: 'text.disabled',
              },
            })}
          >
            <CheckOutlined sx={{ fontSize: 16 }} />
          </AppIconButton>
          <AppIconButton
            tooltip="Dismiss suggestion"
            size="small"
            onClick={onDecline}
            sx={(theme) => ({
              width: 26,
              height: 26,
              borderRadius: '50%',
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha(theme.palette.text.primary, 0.06),
              },
            })}
          >
            <CloseOutlined sx={{ fontSize: 16 }} />
          </AppIconButton>
        </>
      )}
    </Box>
  );
}
