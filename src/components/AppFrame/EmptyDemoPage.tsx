import { Box, Typography } from '@mui/material';

const MESSAGE =
  'Nothing was build here for this demo, but I like your curiosity 😉';

export function EmptyDemoPage() {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {MESSAGE}
      </Typography>
    </Box>
  );
}
