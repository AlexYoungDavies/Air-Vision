import { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import ArrowDownwardOutlined from '@mui/icons-material/ArrowDownwardOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { AppIconButton } from '../AppIconButton';
import {
  CASH_FLOW_WEEKS,
  CHECKS_LINE_ITEMS,
  CHECKS_WEEKLY,
  DEPOSIT_LINE_ITEMS,
  DEPOSIT_STACK_KEYS,
  DEPOSIT_STACK_WEEKS,
  DETAIL_TABLE_PAGE_SIZE,
  FILTER_DATE_RANGE_LABEL,
  POSTED_LINE_ITEMS,
  POSTED_WEEKLY,
  SUMMARY_CARDS,
  WATERFALL_LINE_ITEMS,
} from '../../data/mockRemittances';

const HEADER_CONTROL_HEIGHT = 28;
const CHART_MAX_AMOUNT = 100_000;

const TABLE_HEADER_SX = {
  fontWeight: 600,
  fontSize: 13,
  bgcolor: 'action.hover',
  color: 'text.secondary',
  borderBottom: 1,
  borderColor: 'divider',
  py: 1.25,
  whiteSpace: 'nowrap' as const,
};

const TABLE_CELL_SX = {
  fontSize: 13,
  borderBottom: 1,
  borderColor: 'divider',
  py: 1.25,
};

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function formatSummaryValue(value: number, format: 'compactK' | 'standard') {
  if (format === 'compactK') return `$${(value / 1000).toFixed(2)}K`;
  return formatUsd(value);
}

function OutlinedPeriodSelects() {
  const [grain, setGrain] = useState('week');
  const [source, setSource] = useState('all');
  const selectSx = {
    minWidth: 148,
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
    height: HEADER_CONTROL_HEIGHT,
    fontSize: 13,
    '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' },
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <FormControl size="small">
        <Select
          value={grain}
          onChange={(e) => setGrain(e.target.value)}
          sx={selectSx}
          inputProps={{ 'aria-label': 'Time period' }}
        >
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small">
        <Select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          sx={selectSx}
          inputProps={{ 'aria-label': 'Deposit source' }}
        >
          <MenuItem value="all">Deposit Source</MenuItem>
          <MenuItem value="bcbs">BCBS</MenuItem>
          <MenuItem value="era">ERA</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function FilterDateChip() {
  return (
    <Chip
      size="small"
      icon={<CalendarMonthOutlined sx={{ fontSize: '18px !important', color: 'text.secondary' }} />}
      label={FILTER_DATE_RANGE_LABEL}
      onDelete={() => {}}
      sx={{
        fontWeight: 500,
        fontSize: 13,
        borderRadius: '8px',
        bgcolor: 'action.hover',
        border: '1px solid',
        borderColor: 'divider',
        '& .MuiChip-deleteIcon': { fontSize: 18 },
      }}
    />
  );
}

function RemittanceTableToolbar() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        py: 1.5,
        px: 2,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterListOutlined fontSize="small" />}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            minHeight: HEADER_CONTROL_HEIGHT,
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          Filter
        </Button>
        <FilterDateChip />
      </Box>
      <AppIconButton tooltip="Download" aria-label="Download">
        <DownloadOutlined fontSize="small" />
      </AppIconButton>
    </Box>
  );
}

function formatTickLabel(value: number) {
  if (value === 0) return '0';
  if (value >= 1000) {
    const k = value / 1000;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return String(value);
}

function RemittanceWeeklyBarChart({
  weeks,
  barColor,
  maxAmount: maxAmountProp,
}: {
  weeks: readonly { label: string; amount: number }[];
  barColor: string;
  maxAmount?: number;
}) {
  const maxAmount = useMemo(() => {
    if (maxAmountProp != null) return maxAmountProp;
    const m = Math.max(...weeks.map((w) => w.amount), 1);
    return Math.ceil((m * 1.18) / 1000) * 1000;
  }, [weeks, maxAmountProp]);

  const ticks = useMemo(() => {
    const parts = 4;
    return Array.from({ length: parts + 1 }, (_, i) => Math.round((maxAmount * (parts - i)) / parts));
  }, [maxAmount]);

  const chartHeight = 220;
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', minHeight: chartHeight + 48 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pr: 1,
          pt: 0.5,
          pb: 4,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', alignSelf: 'center', mb: 'auto', mt: 2 }}
        >
          Amount
        </Typography>
        {ticks.map((t) => (
          <Typography key={t} variant="caption" color="text.secondary" sx={{ lineHeight: 1, fontSize: 11 }}>
            {formatTickLabel(t)}
          </Typography>
        ))}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: chartHeight,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          {ticks.map((t) => (
            <Box
              key={t}
              sx={{
                borderTop: 1,
                borderColor: 'divider',
                width: '100%',
                opacity: t === 0 ? 0 : 1,
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 0.75,
            height: chartHeight,
            pt: 0.5,
            px: 0.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {weeks.map((w) => {
            const h = Math.min(1, w.amount / maxAmount) * chartHeight;
            return (
              <Box
                key={w.label}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: '70%',
                    maxWidth: 40,
                    height: Math.max(h, 4),
                    bgcolor: barColor,
                    borderRadius: '4px 4px 0 0',
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 0.75, mt: 1, px: 0.5 }}>
          {weeks.map((w) => (
            <Typography
              key={w.label}
              variant="caption"
              color="text.secondary"
              sx={{
                flex: 1,
                minWidth: 0,
                textAlign: 'center',
                fontSize: 9,
                lineHeight: 1.2,
                display: 'block',
              }}
            >
              {w.label}
            </Typography>
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          Date Range
        </Typography>
      </Box>
    </Box>
  );
}

function CashFlowWaterfallChart() {
  return <RemittanceWeeklyBarChart weeks={CASH_FLOW_WEEKS} barColor="primary.main" maxAmount={CHART_MAX_AMOUNT} />;
}

function MoneyCalloutsSection() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {SUMMARY_CARDS.map((card) => (
        <Card key={card.id} variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {card.title}
              </Typography>
              <InfoOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 28, lineHeight: 1.2 }}>
              {formatSummaryValue(card.value, card.format)}
            </Typography>
            {card.badgeText != null && (
              <Chip
                label={card.badgeText}
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  fontWeight: 600,
                  fontSize: 11,
                  bgcolor: 'action.hover',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

function WaterfallSection() {
  const [waterfallGrain, setWaterfallGrain] = useState('week');
  const [wfPage, setWfPage] = useState(0);
  const [wfRowsPerPage, setWfRowsPerPage] = useState(DETAIL_TABLE_PAGE_SIZE);
  const wfSlice = WATERFALL_LINE_ITEMS.slice(wfPage * wfRowsPerPage, wfPage * wfRowsPerPage + wfRowsPerPage);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
            Cash Flow Waterfall
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Monitor how insurance payments flow through your system.
          </Typography>
        </Box>
        <FormControl size="small">
          <Select
            value={waterfallGrain}
            onChange={(e) => setWaterfallGrain(e.target.value)}
            sx={{
              minWidth: 120,
              borderRadius: '8px',
              height: HEADER_CONTROL_HEIGHT,
              fontSize: 13,
              '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' },
            }}
            inputProps={{ 'aria-label': 'Cash flow period' }}
          >
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ p: 2 }}>
        <CashFlowWaterfallChart />
      </Box>
      <Divider />
      <RemittanceTableToolbar />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={TABLE_HEADER_SX}>Date Range</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Payer</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Channel</TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                  Amount ($)
                  <ArrowDownwardOutlined sx={{ fontSize: 16 }} />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wfSlice.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={TABLE_CELL_SX}>{row.dateRange}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.payer}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.channel}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={WATERFALL_LINE_ITEMS.length}
        page={wfPage}
        onPageChange={(_, p) => setWfPage(p)}
        rowsPerPage={wfRowsPerPage}
        onRowsPerPageChange={(e) => {
          setWfRowsPerPage(Number.parseInt(e.target.value, 10));
          setWfPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
}

function DepositsSection() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
            Deposits
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Monitor insurance deposits received over time.
          </Typography>
        </Box>
        <OutlinedPeriodSelects />
      </Box>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <StackedDepositsChart />
      </Box>
      <Divider />
      <RemittanceTableToolbar />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={TABLE_HEADER_SX}>Date Range</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Deposit Source</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  Deposits Amt ($)
                  <ArrowDownwardOutlined sx={{ fontSize: 16 }} />
                </Box>
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Matched Amt ($)
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Non-Insurance Amt ($)
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Non-Athelas Amt ($)
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Dollars Matched (%)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DEPOSIT_LINE_ITEMS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={TABLE_CELL_SX}>{row.dateRange}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.depositSource}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{formatUsd(row.depositsAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.matchedAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.nonInsuranceAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.nonAthelasAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>
                  {row.dollarsMatchedPct.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={DEPOSIT_LINE_ITEMS.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number.parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
}

function ChecksSection() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
            Checks
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Monitor insurance payment checks processed and their matching status to deposits over time.
          </Typography>
        </Box>
        <OutlinedPeriodSelects />
      </Box>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <RemittanceWeeklyBarChart weeks={CHECKS_WEEKLY} barColor="warning.main" maxAmount={10_000} />
      </Box>
      <Divider />
      <RemittanceTableToolbar />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={TABLE_HEADER_SX}>Date Range</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Deposit Source</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  Checks Amt ($)
                  <ArrowDownwardOutlined sx={{ fontSize: 16 }} />
                </Box>
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Matched Amt ($)
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Posted Amt ($)
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Unposted Amt ($)
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Non-Athelas Amt ($)
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Dollars Matched (%)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CHECKS_LINE_ITEMS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={TABLE_CELL_SX}>{row.dateRange}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.depositSource}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{formatUsd(row.checksAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.matchedAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.postedAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.unpostedAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.nonAthelasAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>
                  {row.dollarsMatchedPct.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={CHECKS_LINE_ITEMS.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number.parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
}

function PostedPaymentsSection() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
            Posted Payments
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Monitor insurance payments posted to claims and verified against bank deposits.
          </Typography>
        </Box>
        <OutlinedPeriodSelects />
      </Box>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <RemittanceWeeklyBarChart weeks={POSTED_WEEKLY} barColor="success.main" maxAmount={36_000} />
      </Box>
      <Divider />
      <RemittanceTableToolbar />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={TABLE_HEADER_SX}>Date Range</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>Batch / Source</TableCell>
              <TableCell sx={TABLE_HEADER_SX}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  Posted Amt ($)
                  <ArrowDownwardOutlined sx={{ fontSize: 16 }} />
                </Box>
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Verified Amt ($)
              </TableCell>
              <TableCell sx={TABLE_HEADER_SX} align="right">
                Verified (%)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {POSTED_LINE_ITEMS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={TABLE_CELL_SX}>{row.dateRange}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{row.batch}</TableCell>
                <TableCell sx={TABLE_CELL_SX}>{formatUsd(row.postedAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>{formatUsd(row.verifiedAmt)}</TableCell>
                <TableCell sx={{ ...TABLE_CELL_SX, textAlign: 'right' }}>
                  {row.verifiedPct.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={POSTED_LINE_ITEMS.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number.parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
}

function StackedDepositsChart() {
  const maxTotal = useMemo(
    () => Math.max(...DEPOSIT_STACK_WEEKS.map((w) => Object.values(w.segments).reduce((a, b) => a + b, 0)), 1),
    []
  );
  const chartHeight = 200;
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', minHeight: chartHeight + 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', flexShrink: 0, gap: 0.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              alignSelf: 'center',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Amount
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              height: chartHeight,
              pr: 0.5,
            }}
          >
            {[100_000, 75_000, 50_000, 25_000, 0].map((t) => (
              <Typography key={t} variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {t === 0 ? '0' : `${t / 1000}K`}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 0.5,
            height: chartHeight,
            borderLeft: 1,
            borderBottom: 1,
            borderColor: 'divider',
            pl: 1,
            pb: 0.5,
          }}
        >
          {DEPOSIT_STACK_WEEKS.map((week) => {
            const total = Object.values(week.segments).reduce((a, b) => a + b, 0);
            return (
              <Box
                key={week.label}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: '75%',
                    maxWidth: 44,
                    height: `${(total / maxTotal) * 100}%`,
                    minHeight: 4,
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    borderRadius: '4px 4px 0 0',
                    overflow: 'hidden',
                  }}
                >
                  {DEPOSIT_STACK_KEYS.map(({ key, color }) => {
                    const v = week.segments[key];
                    if (v <= 0) return null;
                    const pct = (v / total) * 100;
                    return (
                      <Box key={key} sx={{ height: `${pct}%`, minHeight: v > 0 ? 1 : 0, bgcolor: color, width: '100%' }} />
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 0.5, mt: 1, ml: 7 }}>
        {DEPOSIT_STACK_WEEKS.map((w) => (
          <Typography
            key={w.label}
            variant="caption"
            color="text.secondary"
            sx={{ flex: 1, textAlign: 'center', fontSize: 9, lineHeight: 1.2 }}
          >
            {w.label}
          </Typography>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
        Date Range
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          mt: 3,
          rowGap: 1,
        }}
      >
        {DEPOSIT_STACK_KEYS.map(({ key, label, color }) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: color, borderRadius: 0.5, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontWeight: 500, fontSize: 12 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function OverviewTab() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 2 }}>
      <MoneyCalloutsSection />
      <WaterfallSection />
      <DepositsSection />
      <ChecksSection />
      <PostedPaymentsSection />
    </Box>
  );
}

function DepositsTab() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 2 }}>
      <MoneyCalloutsSection />
      <DepositsSection />
    </Box>
  );
}

function ChecksTab() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 2 }}>
      <MoneyCalloutsSection />
      <ChecksSection />
    </Box>
  );
}

function PostedPaymentsTab() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 2 }}>
      <MoneyCalloutsSection />
      <PostedPaymentsSection />
    </Box>
  );
}

const REMITTANCE_TABS = ['Overview', 'Deposits', 'Checks', 'Posted Payments'] as const;

export function RemittancesPage() {
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
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          borderBottom: 1,
          borderColor: 'divider',
          pr: 1.5,
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons={false}
          sx={{
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
          }}
        >
          {REMITTANCE_TABS.map((label, idx) => (
            <Tab key={label} label={label} value={idx} />
          ))}
        </Tabs>
        <Badge
          overlap="rectangular"
          variant="dot"
          color="error"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mr: 0.5, '& .MuiBadge-badge': { top: 6, right: 10 } }}
        >
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<AccountBalanceOutlined sx={{ fontSize: 20 }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              minHeight: HEADER_CONTROL_HEIGHT,
              px: 1,
            }}
          >
            Manage Bank Accounts
          </Button>
        </Badge>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {tab === 0 && <OverviewTab />}
        {tab === 1 && <DepositsTab />}
        {tab === 2 && <ChecksTab />}
        {tab === 3 && <PostedPaymentsTab />}
      </Box>
    </Box>
  );
}
