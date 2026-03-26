import { useState } from 'react';
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { BillingRulesAutomationContent } from './BillingRulesAutomationContent';
import { PatientStatementsAutomationContent } from './PatientStatementsAutomationContent';

const AUTOMATION_TABS = [
  'Billing Rules',
  'Patient Statements',
  'Insurance Intake',
  'Text Blasts',
  'Encounter Imports',
  'Charge Master',
] as const;

/** Same tab chrome as `RemittancesPage` (underline indicator, typography). */
const REMITTANCE_STYLE_TABS_SX = {
  minHeight: 0,
  flex: 1,
  minWidth: 0,
  '& .MuiTabs-flexContainer': { gap: 0 },
  '& .MuiTabs-indicator': { height: 2 },
  '& .MuiTab-root': {
    minHeight: 0,
    minWidth: 'unset',
    py: 1.5,
    px: 2,
    textTransform: 'none',
    fontWeight: 500,
    fontSize: 14,
  },
} as const;

export function AutomationsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        p: 0,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '9px',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            pr: 1.5,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons={false}
            sx={REMITTANCE_STYLE_TABS_SX}
          >
            {AUTOMATION_TABS.map((label, idx) => (
              <Tab key={label} id={`automation-tab-${idx}`} disableRipple value={idx} label={label} />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: tab === 0 ? 'hidden' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            ...(tab === 0 ? { p: 0, bgcolor: 'background.paper' } : tab === 1 ? { p: 0, bgcolor: 'grey.50' } : { p: 2, bgcolor: 'background.paper' }),
          }}
          role="tabpanel"
          aria-labelledby={`automation-tab-${tab}`}
        >
          {tab === 0 ? (
            <BillingRulesAutomationContent />
          ) : tab === 1 ? (
            <PatientStatementsAutomationContent />
          ) : (
            <Typography variant="body1" color="text.secondary">
              {AUTOMATION_TABS[tab]} — content for this automation area will go here.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
