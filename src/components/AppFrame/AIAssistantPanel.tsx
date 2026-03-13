import { useState, useRef, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import hoverAnimationData from '../../assets/hover.json';
import { AppIconButton } from '../AppIconButton';

const PANEL_WIDTH = 280;

const lottieSlowSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const greetingEntrance = keyframes`
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`;
/** Hover.json is ~80.56 frames @ 29.97fps ≈ 2.69s. Speed factor to get 2s per half. */
const GREETING_LOTTIE_SPEED = (80.56 / 29.97) / 2;

export interface AIAssistantPanelProps {
  onClose: () => void;
}

export function AIAssistantPanel({ onClose }: AIAssistantPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const greetingLottieRef = useRef<LottieRefCurrentProps | null>(null);
  const directionRef = useRef(1);

  useEffect(() => {
    const lottie = greetingLottieRef.current;
    if (!lottie) return;
    lottie.setSpeed(GREETING_LOTTIE_SPEED);
    lottie.setDirection(1);
    directionRef.current = 1;
    lottie.play();
  }, []);

  const handleGreetingLottieComplete = () => {
    const nextDir = (directionRef.current === 1 ? -1 : 1) as 1 | -1;
    directionRef.current = nextDir;
    greetingLottieRef.current?.setDirection(nextDir);
    greetingLottieRef.current?.play();
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    // Non-functional for demo
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
      {/* Header: close only */}
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

      {/* Chat content area: greeting when empty */}
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
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
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
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center', fontWeight: 500 }}
          >
            How can I help you?
          </Typography>
        </Box>
      </Box>

      {/* Composer: text on top (grows with wrap), bottom row = Attach + Send */}
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
              sx={{
                bgcolor: 'grey.700',
                color: 'common.white',
                width: 36,
                height: 36,
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'grey.800',
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
