import { Box } from '@mui/material';

export interface AppCanvasProps {
  children?: React.ReactNode;
}

export function AppCanvas({ children }: AppCanvasProps) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        overflow: 'auto',
        minHeight: 0,
        pt: 0.5,
        pr: 1,
        pb: 1,
        pl: 1,
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: '100%',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '9px',
          overflow: 'auto',
        }}
      >
        {children ?? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 320,
              color: 'text.secondary',
              typography: 'body2',
            }}
          >
            App content will render here
          </Box>
        )}
      </Box>
    </Box>
  );
}
