import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Chip, TextField, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import hoverAnimationData from '../../assets/hover.json';
import { AppIconButton } from '../AppIconButton';
import {
  DEFAULT_ASSISTANT_SHORTCUTS,
  type AIAssistantShortcut,
} from './assistantPanelShortcuts';

/** Matches `AppFrame` side panel width. */
const PANEL_WIDTH = 280;

const lottieSlowSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

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
/** Hover.json is ~80.56 frames @ 29.97fps ≈ 2.69s. Speed factor to get 2s per half. */
const GREETING_LOTTIE_SPEED = (80.56 / 29.97) / 2;

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

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

type DemoPhase = 'greeting' | 'awaiting_rule_update' | 'complete';

const AI_DAY_OVERVIEW =
  "Here's what's worth knowing about today's visits: several patients on your schedule have open pre-visit tasks or results to review before you see them.\n\nHeads-up: your last appointment is a New Patient visit. With the booked duration, it runs about 15 minutes past your published end-of-day availability—worth adjusting that block or your rules if you need to protect your end time.";

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
}

export function AIAssistantPanel({
  onClose,
  userFirstName = 'Alex',
  shortcuts = DEFAULT_ASSISTANT_SHORTCUTS,
  onShortcutClick,
}: AIAssistantPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [demoPhase, setDemoPhase] = useState<DemoPhase>('greeting');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const greetingLottieRef = useRef<LottieRefCurrentProps | null>(null);
  const directionRef = useRef(1);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    const lottie = greetingLottieRef.current;
    if (!lottie) return;
    lottie.setSpeed(GREETING_LOTTIE_SPEED);
    lottie.setDirection(1);
    directionRef.current = 1;
    lottie.play();
  }, []);

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

  const handleGreetingLottieComplete = () => {
    const nextDir = (directionRef.current === 1 ? -1 : 1) as 1 | -1;
    directionRef.current = nextDir;
    greetingLottieRef.current?.setDirection(nextDir);
    greetingLottieRef.current?.play();
  };

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
          { id: nextMessageId(), role: 'assistant', text: assistantText },
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
      setMessages((prev) => [...prev, { id: nextMessageId(), role: 'user', text: userText }]);
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
      setMessages((prev) => [...prev, { id: nextMessageId(), role: 'user', text }]);
      scheduleAssistantReply(AI_RULES_CONFIRMED, { advanceToComplete: true });
      setInputValue('');
      return;
    }

    if (demoPhase !== 'complete' && hasConversation && looksLikeSchedulingRuleUpdate(text)) {
      setMessages((prev) => [...prev, { id: nextMessageId(), role: 'user', text }]);
      scheduleAssistantReply(AI_RULES_CONFIRMED, { advanceToComplete: true });
      setInputValue('');
      return;
    }

    if (demoPhase === 'complete') {
      setMessages((prev) => [...prev, { id: nextMessageId(), role: 'user', text }]);
      scheduleAssistantReply(AI_DEMO_WRAP_UP);
      setInputValue('');
      return;
    }

    setMessages((prev) => [...prev, { id: nextMessageId(), role: 'user', text }]);
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
          justifyContent: 'flex-end',
          px: 2,
          py: 1.5,
        }}
      >
        <AppIconButton
          tooltip="Close"
          aria-label="Close"
          onClick={onClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseOutlined sx={{ fontSize: 20 }} />
        </AppIconButton>
      </Box>

      {hasConversation ? (
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
            {messages.map((msg) => (
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
            ))}
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
            <Box sx={{ width: 80, height: 80, animation: `${lottieSlowSpin} 20s linear infinite` }}>
              <Lottie
                lottieRef={greetingLottieRef}
                animationData={hoverAnimationData}
                loop={false}
                onComplete={handleGreetingLottieComplete}
                style={{ width: 80, height: 80 }}
                rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
              />
            </Box>

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

      <Box
        sx={{
          flexShrink: 0,
          pl: 0,
          pr: 1,
          pt: 1,
          pb: 1,
        }}
      >
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
      </Box>
    </Box>
  );
}
