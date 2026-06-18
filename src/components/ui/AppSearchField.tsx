import { InputAdornment } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { SearchIcon } from '../icons';
import type { AppTextFieldProps } from './AppTextField';
import { AppTextField } from './AppTextField';

export type AppSearchFieldProps = Omit<AppTextFieldProps, 'InputProps'> & {
  InputProps?: TextFieldProps['InputProps'];
};

/** Search input with leading icon — same sizing/label rules as AppTextField. */
export function AppSearchField({ placeholder = 'Search', InputProps, sx, fieldVariant, ...rest }: AppSearchFieldProps) {
  return (
    <AppTextField
      placeholder={placeholder}
      fieldVariant={fieldVariant}
      InputProps={{
        ...InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          </InputAdornment>
        ),
      }}
      sx={[
        fieldVariant === 'filled'
          ? {}
          : {
              '& .MuiOutlinedInput-root': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'grey.50',
              },
            },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
}
