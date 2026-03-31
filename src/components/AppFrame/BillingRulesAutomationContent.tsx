import { useMemo, useState } from 'react';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { MOCK_BILLING_RULE_ROWS, type BillingRuleList } from '../../data/mockBillingRules';

const SUBTAB_HEIGHT = 36;

const TABLE_HEADER_SX = {
  fontWeight: 600,
  fontSize: 13,
  bgcolor: 'background.paper',
  color: 'text.secondary',
  borderBottom: 1,
  borderColor: 'divider',
  py: 1,
  whiteSpace: 'nowrap' as const,
};

const TABLE_CELL_SX = {
  fontSize: 13,
  borderBottom: 1,
  borderColor: 'divider',
  py: 1,
  verticalAlign: 'middle' as const,
};

const NOTES_CELL_SX = {
  ...TABLE_CELL_SX,
  verticalAlign: 'top' as const,
  py: 2,
};

const BILLING_SUBTABS: { id: BillingRuleList; label: string }[] = [
  { id: 'applied', label: 'Applied Rules' },
  { id: 'site', label: 'Site Rules' },
];

export function BillingRulesAutomationContent() {
  const [subTab, setSubTab] = useState<BillingRuleList>('applied');

  const rows = useMemo(
    () => MOCK_BILLING_RULE_ROWS.filter((r) => r.list === subTab),
    [subTab],
  );

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
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          pt: 2,
          pb: 1.5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.75,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {BILLING_SUBTABS.map(({ id, label }) => {
          const selected = subTab === id;
          return (
            <Button
              key={id}
              variant="text"
              onClick={() => setSubTab(id)}
              disableRipple
              aria-pressed={selected}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                borderRadius: '10px',
                minWidth: 0,
                px: 2,
                py: 0.875,
                minHeight: SUBTAB_HEIGHT,
                boxShadow: 'none',
                ...(selected
                  ? {
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'action.selected' },
                    }
                  : {
                      color: 'text.secondary',
                      bgcolor: 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                    }),
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>

      <TableContainer sx={{ flex: 1, minHeight: 0, overflow: 'auto', bgcolor: 'background.paper' }}>
        <Table size="small" stickyHeader sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={TABLE_HEADER_SX}>Rule ID</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Scope</TableCell>
              <TableCell sx={TABLE_HEADER_SX}># Usage</TableCell>
              <TableCell sx={{ ...TABLE_HEADER_SX, whiteSpace: 'normal' }}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ruleId} hover>
                <TableCell sx={{ ...TABLE_CELL_SX, fontWeight: 500 }}>{row.ruleId}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.scope}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.usageCount}</TableCell>
                <TableCell sx={NOTES_CELL_SX}>
                  <Typography component="div" variant="body2" sx={{ fontSize: 13, lineHeight: 1.55 }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Reason for rule:{' '}
                    </Box>
                    {row.reason}
                  </Typography>
                  <Typography
                    component="div"
                    variant="body2"
                    sx={{ fontSize: 13, lineHeight: 1.55, mt: 1.5, whiteSpace: 'pre-line' }}
                  >
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      Explanation of rule:{' '}
                    </Box>
                    {row.explanation}
                  </Typography>
                  {row.showEdit ? (
                    <Button
                      size="small"
                      startIcon={<EditOutlined sx={{ fontSize: 18 }} />}
                      sx={{
                        mt: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: 13,
                        p: 0,
                        minWidth: 0,
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      Edit
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
