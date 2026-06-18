import { Box, FormControl, MenuItem, Select, Typography, type SelectProps } from '@mui/material';
import type { FieldSize, FieldVariant } from '../../theme/buttonStyleConstants';
import { fieldLabelSx, getFieldShellSx, labeledFieldWrapperSx } from './fieldStyles';

export interface AppSelectFieldProps extends Omit<SelectProps, 'size' | 'variant' | 'label'> {
  label?: string;
  fieldSize?: FieldSize;
  fieldVariant?: FieldVariant;
  formControlSx?: SelectProps['sx'];
}

/** Standard dropdown — label above field, outlined or filled surface. */
export function AppSelectField({
  label,
  fieldSize = 'small',
  fieldVariant = 'outlined',
  formControlSx,
  sx,
  children,
  ...selectProps
}: AppSelectFieldProps) {
  return (
    <Box sx={labeledFieldWrapperSx}>
      {label ? (
        <Typography component="label" sx={fieldLabelSx}>
          {label}
        </Typography>
      ) : null}
      <FormControl fullWidth sx={formControlSx}>
        <Select
          variant="outlined"
          sx={[
            getFieldShellSx(fieldSize, fieldVariant),
            {
              '& .MuiSelect-select': {
                py: 0,
                px: 1.5,
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                boxSizing: 'border-box',
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...selectProps}
        >
          {children}
        </Select>
      </FormControl>
    </Box>
  );
}

export { MenuItem as AppSelectMenuItem };
