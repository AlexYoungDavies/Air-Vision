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
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pt: 0,
        pr: 1,
        pb: 1,
        pl: 0,
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '9px',
          overflow: 'hidden',
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
