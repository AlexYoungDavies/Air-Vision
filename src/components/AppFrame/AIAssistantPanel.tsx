import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import { AppIconButton } from '../AppIconButton';

const PANEL_WIDTH = 280;

export interface AIAssistantPanelProps {
  onClose: () => void;
}

export function AIAssistantPanel({ onClose }: AIAssistantPanelProps) {
  const [inputValue, setInputValue] = useState('');

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

      {/* Chat content area - empty */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
        }}
      />

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
