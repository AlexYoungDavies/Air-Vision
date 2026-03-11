import { Box, IconButton, TextField, Avatar, Button } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import History from '@mui/icons-material/History';
import Search from '@mui/icons-material/Search';
import SmartToy from '@mui/icons-material/SmartToy';

const ICON_SIZE = 18;

export function HeaderBar() {
  return (
    <Box
      component="header"
      sx={{
        height: 'fit-content',
        px: 2,
        pt: 0.5,
        pb: 0.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          aria-label="Back"
          sx={{
            color: 'text.secondary',
            width: 28,
            height: 28,
            borderRadius: '9px',
          }}
        >
          <ArrowBack sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Forward"
          sx={{
            color: 'text.secondary',
            width: 28,
            height: 28,
            borderRadius: '9px',
          }}
        >
          <ArrowForward sx={{ fontSize: ICON_SIZE }} />
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
          <History sx={{ fontSize: ICON_SIZE }} />
        </IconButton>
      </Box>

      <TextField
        placeholder="Search for anything"
        size="small"
        variant="outlined"
        hiddenLabel
        sx={{
          width: 360,
          flexShrink: 0,
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
              <Search sx={{ fontSize: ICON_SIZE }} />
            </Box>
          ),
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
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
          startIcon={<SmartToy sx={{ fontSize: ICON_SIZE }} />}
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
