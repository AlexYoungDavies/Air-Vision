import { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ViewListOutlined from '@mui/icons-material/ViewListOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';

const ICON_SIZE = 18;

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
                <CalendarMonthOutlined sx={{ fontSize: ICON_SIZE }} />
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
                <ViewListOutlined sx={{ fontSize: ICON_SIZE }} />
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
