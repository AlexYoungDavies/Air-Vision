import { useState } from 'react';
import { Box } from '@mui/material';
import { SideNav } from './SideNav';
import { HeaderBar } from './HeaderBar';
import { AppCanvas } from './AppCanvas';

export interface AppFrameProps {
  children?: React.ReactNode;
}

export function AppFrame({ children }: AppFrameProps) {
  const [navCollapsed, setNavCollapsed] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SideNav
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((c) => !c)}
        />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            bgcolor: 'background.default',
          }}
        >
          <HeaderBar />
          <AppCanvas>{children}</AppCanvas>
        </Box>
      </Box>
    </Box>
  );
}
