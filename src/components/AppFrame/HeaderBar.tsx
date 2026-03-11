import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, TextField, Avatar, Button } from '@mui/material';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';

const ICON_SIZE = 18;

export function HeaderBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromBackRef = useRef(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (cameFromBackRef.current) {
      setCanGoForward(true);
      cameFromBackRef.current = false;
    } else {
      setCanGoForward(false);
    }
  }, [location.key]);

  const handleBack = () => {
    cameFromBackRef.current = true;
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        height: 'fit-content',
        pl: 2,
        pr: 2,
        pt: 0.5,
        pb: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <IconButton
          size="small"
          aria-label="Back"
          onClick={handleBack}
          sx={{
            color: 'text.secondary',
            width: 28,
            height: 28,
            borderRadius: '9px',
          }}
        >
          <ArrowBackOutlined sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Forward"
          onClick={handleForward}
          disabled={!canGoForward}
          sx={{
            color: 'text.secondary',
            width: 28,
            height: 28,
            borderRadius: '9px',
          }}
        >
          <ArrowForwardOutlined sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="History"
          sx={{
            color: 'text.secondary',
            width: 28,
            height: 28,
            borderRadius: '9px',
          }}
        >
          <HistoryOutlined sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <TextField
          placeholder="Search for anything"
          size="small"
          variant="outlined"
          hiddenLabel
          sx={{
            width: 360,
            '& .MuiOutlinedInput-root': {
              height: 28,
              bgcolor: 'rgba(0, 0, 0, 0.08)',
              borderRadius: 1,
              fontSize: 14,
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
            },
          }}
        InputProps={{
          startAdornment: (
            <Box component="span" sx={{ mr: 1, display: 'flex', color: 'text.disabled' }}>
              <SearchOutlined sx={{ fontSize: ICON_SIZE }} />
            </Box>
          ),
        }}
      />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            borderRadius: '9px',
            bgcolor: 'grey.400',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.2)',
            fontSize: '0.75rem',
          }}
        >
          P
        </Avatar>
        <Button
          variant="text"
          startIcon={<SmartToyOutlined sx={{ fontSize: ICON_SIZE }} />}
          sx={{
            height: 28,
            px: 1.25,
            py: 0.5,
            borderRadius: '9px',
            bgcolor: 'rgba(0, 102, 70, 0.1)',
            border: '1px solid',
            borderColor: 'rgba(0, 102, 70, 0.1)',
            color: 'primary.main',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '24px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'rgba(0, 102, 70, 0.15)',
              borderColor: 'rgba(0, 102, 70, 0.2)',
            },
          }}
        >
          Ask Athelas
        </Button>
      </Box>
    </Box>
  );
}
