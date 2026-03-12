import { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  SvgIcon,
} from '@mui/material';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';

const ICON_SIZE = 18;

function CalendarLeftPanelIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M9 12.5C9 12.9142 8.66421 13.25 8.25 13.25H7.75C7.33579 13.25 7 12.9142 7 12.5C7 12.0858 7.33579 11.75 7.75 11.75H8.25C8.66421 11.75 9 12.0858 9 12.5Z" />
      <path d="M11 12.5C11 12.9142 11.3358 13.25 11.75 13.25H12.25C12.6642 13.25 13 12.9142 13 12.5C13 12.0858 12.6642 11.75 12.25 11.75H11.75C11.3358 11.75 11 12.0858 11 12.5Z" />
      <path d="M13 16C13 16.4142 12.6642 16.75 12.25 16.75H11.75C11.3358 16.75 11 16.4142 11 16C11 15.5858 11.3358 15.25 11.75 15.25H12.25C12.6642 15.25 13 15.5858 13 16Z" />
      <path d="M15 12.5C15 12.9142 15.3358 13.25 15.75 13.25H16.25C16.6642 13.25 17 12.9142 17 12.5C17 12.0858 16.6642 11.75 16.25 11.75H15.75C15.3358 11.75 15 12.0858 15 12.5Z" />
      <path d="M9 16C9 16.4142 8.66421 16.75 8.25 16.75H7.75C7.33579 16.75 7 16.4142 7 16C7 15.5858 7.33579 15.25 7.75 15.25H8.25C8.66421 15.25 9 15.5858 9 16Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.8 4C17.6343 4 17.5 3.86569 17.5 3.7V3.25C17.5 2.83579 17.1642 2.5 16.75 2.5C16.3358 2.5 16 2.83579 16 3.25V3.7C16 3.86569 15.8657 4 15.7 4H8.3C8.13431 4 8 3.86569 8 3.7V3.25C8 2.83579 7.66421 2.5 7.25 2.5C6.83579 2.5 6.5 2.83579 6.5 3.25V3.7C6.5 3.86569 6.36569 4 6.2 4H6.11111C4.39289 4 3 5.39289 3 7.11111V15.6C3 17.8402 3 18.9603 3.43597 19.816C3.81947 20.5686 4.43139 21.1805 5.18404 21.564C6.03969 22 7.15979 22 9.4 22H14.6C16.8402 22 17.9603 22 18.816 21.564C19.5686 21.1805 20.1805 20.5686 20.564 19.816C21 18.9603 21 17.8402 21 15.6V7.11111C21 5.39289 19.6071 4 17.8889 4H17.8ZM5.3 9.25C5.01997 9.25 4.87996 9.25 4.773 9.3045C4.67892 9.35243 4.60243 9.42892 4.5545 9.523C4.5 9.62996 4.5 9.76997 4.5 10.05V16.5C4.5 17.9001 4.5 18.6002 4.77248 19.135C5.01217 19.6054 5.39462 19.9878 5.86502 20.2275C6.3998 20.5 7.09987 20.5 8.5 20.5H15.5C16.9001 20.5 17.6002 20.5 18.135 20.2275C18.6054 19.9878 18.9878 19.6054 19.2275 19.135C19.5 18.6002 19.5 17.9001 19.5 16.5V10.05C19.5 9.76997 19.5 9.62996 19.4455 9.523C19.3976 9.42892 19.3211 9.35243 19.227 9.3045C19.12 9.25 18.98 9.25 18.7 9.25H5.3ZM19.5 7.1875C19.5 7.24554 19.5 7.27456 19.4976 7.29901C19.4742 7.5364 19.2864 7.72421 19.049 7.74759C19.0246 7.75 18.9955 7.75 18.9375 7.75H5.0625C5.00446 7.75 4.97544 7.75 4.95099 7.74759C4.7136 7.72421 4.52579 7.5364 4.50241 7.29901C4.5 7.27456 4.5 7.24554 4.5 7.1875C4.5 7.01337 4.5 6.92631 4.50722 6.85297C4.57737 6.14081 5.14081 5.57737 5.85297 5.50722C5.92631 5.5 6.01337 5.5 6.1875 5.5H17.8125C17.9866 5.5 18.0737 5.5 18.147 5.50722C18.8592 5.57737 19.4226 6.14081 19.4928 6.85297C19.5 6.92631 19.5 7.01337 19.5 7.1875Z"
      />
    </SvgIcon>
  );
}

function BulletListLeftPanelIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.5 5H21V6.5H8.5V5Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.5 17.5H21V18.99H8.5V17.5Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6 5V6.51H4V5H6Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6 17.5V19H4V17.5H6Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6 12.75H4V11.25H6V12.75ZM21 12.75H8.5V11.25H21V12.75Z" />
    </SvgIcon>
  );
}

type RightPanelTab = 'patients' | 'notes' | 'tasks' | 'messages';

export function HomePageContent() {
  const [rightTab, setRightTab] = useState<RightPanelTab>('patients');

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        background: 'linear-gradient(to bottom, #f3faf8 0%, #d7f1ea 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        pt: 3,
        pb: 8,
        px: 8,
      }}
    >
      {/* Greeting */}
      <Box sx={{ maxWidth: 578 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: 26.08,
            fontWeight: 500,
            lineHeight: 38 / 26.08,
            color: 'text.primary',
            mb: 0.5,
          }}
        >
          Morning, Dr. Garcia.
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 22 / 14,
            color: 'text.primary',
          }}
        >
          Today you have 23 patients. You also have 6 notes to sign and 4
          outstanding tasks.
        </Typography>
      </Box>

      {/* Two-panel layout */}
      <Box
        sx={{
          display: 'flex',
          gap: 0.75,
          flex: 1,
          minHeight: 0,
          height: '100%',
          alignItems: 'stretch',
          overflow: 'visible',
        }}
      >
        {/* Left card - Schedule */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '-8px 4px 52px 0px rgba(0,0,0,0.12)',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1,
              pl: 1.5,
              pr: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 18 / 12,
                  color: 'text.primary',
                }}
              >
                Aug 8th, 2024
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.25 }}>
                <IconButton
                  size="small"
                  aria-label="Previous"
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '9px',
                    color: 'text.primary',
                  }}
                >
                  <ChevronLeftOutlined sx={{ fontSize: ICON_SIZE }} />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="Next"
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '9px',
                    color: 'text.primary',
                  }}
                >
                  <ChevronRightOutlined sx={{ fontSize: ICON_SIZE }} />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.25 }}>
              <IconButton
                size="small"
                aria-label="Calendar"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '9px',
                  color: 'text.primary',
                }}
              >
                <CalendarLeftPanelIcon sx={{ fontSize: ICON_SIZE }} />
              </IconButton>
              <IconButton
                size="small"
                aria-label="List view"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '9px',
                  color: 'text.primary',
                }}
              >
                <BulletListLeftPanelIcon sx={{ fontSize: ICON_SIZE }} />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              minHeight: 640,
              bgcolor: 'background.paper',
            }}
          />
        </Box>

        {/* Right card - Dynamic surface (Patients, Open Notes, Tasks, Messages) */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '8px 4px 52px 0px rgba(0,0,0,0.12)',
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
            }}
          >
            <ToggleButtonGroup
              value={rightTab}
              exclusive
              onChange={(_, v) => v != null && setRightTab(v)}
              size="small"
              sx={{
                '& .MuiToggleButtonGroup-grouped': {
                  border: 'none',
                  borderRadius: '9px',
                  px: 1,
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                  },
                },
              }}
            >
              <ToggleButton value="patients" aria-label="Patients">
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  Patients
                </Typography>
              </ToggleButton>
              <ToggleButton value="notes" aria-label="Open Notes">
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  Open Notes
                </Typography>
              </ToggleButton>
              <ToggleButton value="tasks" aria-label="Tasks">
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  Tasks
                </Typography>
              </ToggleButton>
              <ToggleButton value="messages" aria-label="Messages">
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  Messages
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              size="small"
              aria-label="More"
              sx={{
                width: 28,
                height: 28,
                borderRadius: '9px',
                color: 'text.primary',
              }}
            >
              <CategoryOutlined sx={{ fontSize: ICON_SIZE }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              minHeight: 640,
              bgcolor: 'background.paper',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
