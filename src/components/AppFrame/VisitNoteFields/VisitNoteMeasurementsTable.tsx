/**
 * Visit note measurements table: title, measurement name column (left),
 * region columns (Left/Right or Value). Each data cell uses a visit-note-style text input.
 * Optional previous values shown below the input; values/onCellChange for controlled input.
 */

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { baseInputSx } from './visitNoteFieldStyles';

export interface VisitNoteMeasurementsTableProps {
  /** Table title shown above (e.g. "Lumbar Mobility") */
  title: string;
  /** Region column labels for the top row (e.g. ["Left", "Right"] or ["Value"]) */
  columnLabels: string[];
  /** Rows: measurement name + optional previous value per column (aligned with columnLabels) */
  rows: {
    measurementName: string;
    previousValues?: (string | undefined)[];
  }[];
  /** Current cell values [rowIndex][colIndex]. When provided with onCellChange, cells are controlled inputs. */
  values?: (string | undefined)[][];
  /** Called when a cell value changes. When provided, cells render as inputs. */
  onCellChange?: (rowIndex: number, colIndex: number, value: string) => void;
  /** When true, cells are read-only (display value only). */
  readOnly?: boolean;
}

const TABLE_TITLE_SX = {
  fontSize: 14,
  fontWeight: 700,
  color: 'primary.main',
  mb: 1,
} as const;

const MEASUREMENT_NAME_COLUMN_WIDTH = 240;
const TABLE_ROW_HEIGHT = 56;

const TABLE_WRAPPER_SX = {
  borderRadius: 2,
  bgcolor: 'grey.50',
  border: '1px solid',
  borderColor: 'grey.300',
  overflow: 'hidden',
  width: '100%',
} as const;

const HEADER_CELL_SX = {
  fontWeight: 700,
  fontSize: 12,
  color: 'grey.800',
  bgcolor: 'grey.200',
  borderBottom: '1px solid',
  borderRight: '1px solid',
  borderColor: 'grey.300',
  py: 0,
  px: 1.5,
  height: TABLE_ROW_HEIGHT,
  boxSizing: 'border-box',
} as const;

const NAME_CELL_SX = (striped: boolean) => ({
  fontWeight: 600,
  fontSize: 12,
  color: 'grey.800',
  bgcolor: striped ? 'grey.100' : 'grey.200',
  borderBottom: '1px solid',
  borderRight: '1px solid',
  borderColor: 'grey.300',
  py: 0,
  px: 1.5,
  height: TABLE_ROW_HEIGHT,
  boxSizing: 'border-box',
  verticalAlign: 'middle',
}) as const;

const DATA_CELL_SX = {
  bgcolor: 'background.paper',
  borderBottom: '1px solid',
  borderRight: '1px solid',
  borderColor: 'grey.300',
  py: 0,
  px: 1.5,
  height: TABLE_ROW_HEIGHT,
  boxSizing: 'border-box',
  verticalAlign: 'middle',
} as const;

const TABLE_INPUT_SX = {
  width: '100%',
  '& .MuiInputBase-root': {
    ...baseInputSx,
    height: 28,
  },
  '& .MuiInputBase-input': {
    py: 0,
    px: 1.5,
    fontSize: 14,
    height: 28,
    boxSizing: 'border-box',
  },
} as const;

const PREV_VALUE_SX = {
  fontSize: 11,
  color: 'text.secondary',
  mt: 0.25,
} as const;

const FOOTER_HINT_SX = {
  fontSize: 12,
  color: 'text.secondary',
  mt: 0.5,
} as const;

export function VisitNoteMeasurementsTable({
  title,
  columnLabels,
  rows,
  values,
  onCellChange,
  readOnly = false,
}: VisitNoteMeasurementsTableProps) {
  const isEditable = !readOnly && onCellChange != null;
  const cellValues = values ?? rows.map(() => columnLabels.map(() => undefined));

  return (
    <Box>
      <Typography component="h4" sx={TABLE_TITLE_SX}>
        {title}
      </Typography>
      <TableContainer sx={TABLE_WRAPPER_SX}>
        <Table size="small" sx={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...HEADER_CELL_SX,
                  width: MEASUREMENT_NAME_COLUMN_WIDTH,
                  minWidth: MEASUREMENT_NAME_COLUMN_WIDTH,
                  maxWidth: MEASUREMENT_NAME_COLUMN_WIDTH,
                }}
              >
                Measurement Name
              </TableCell>
              {columnLabels.map((label) => (
                <TableCell key={label} sx={HEADER_CELL_SX}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={row.measurementName}>
                <TableCell
                  sx={{
                    ...NAME_CELL_SX(rowIndex % 2 === 1),
                    width: MEASUREMENT_NAME_COLUMN_WIDTH,
                    minWidth: MEASUREMENT_NAME_COLUMN_WIDTH,
                    maxWidth: MEASUREMENT_NAME_COLUMN_WIDTH,
                  }}
                >
                  {row.measurementName}
                </TableCell>
                {columnLabels.map((_, colIndex) => {
                  const prevValue = row.previousValues?.[colIndex];
                  const cellValue = cellValues[rowIndex]?.[colIndex] ?? '';
                  return (
                    <TableCell key={colIndex} sx={DATA_CELL_SX}>
                      {isEditable ? (
                        <>
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Add here"
                            value={cellValue}
                            onChange={(e) => onCellChange?.(rowIndex, colIndex, e.target.value)}
                            sx={TABLE_INPUT_SX}
                            fullWidth
                          />
                          {prevValue != null && prevValue !== '' && (
                            <Box component="div" sx={PREV_VALUE_SX}>
                              Prev: {prevValue}
                            </Box>
                          )}
                        </>
                      ) : (
                        <>
                          <Box component="span" sx={{ fontSize: 13, color: cellValue ? 'text.primary' : 'text.disabled', fontStyle: cellValue ? 'normal' : 'italic' }}>
                            {cellValue || 'Add here'}
                          </Box>
                          {prevValue != null && prevValue !== '' && (
                            <Box component="div" sx={PREV_VALUE_SX}>
                              Prev: {prevValue}
                            </Box>
                          )}
                        </>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 1 }}>
        <Typography sx={FOOTER_HINT_SX}>Leave unneeded sections blank.</Typography>
      </Box>
    </Box>
  );
}
