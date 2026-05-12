import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Pixel height of the top/bottom fade gradients applied to the Scribe
 * scrollable content area. Kept small so the gradient feels like a soft mask
 * rather than a heavy overlay.
 */
export const SCROLL_FADE_HEIGHT = 24;

/**
 * Wraps content in a flex-column scroll container with subtle gradient masks
 * pinned to the top and bottom of the visible area, so content visually fades
 * in and out of the scroll viewport. The gradients fade from the Scribe panel
 * background (`background.default`) to transparent.
 *
 * Place inside a flex-column parent (it claims `flex: 1; minHeight: 0`).
 *
 * Shared by every stage of the Scribe flow (pre-visit, recording, paused,
 * post-recording review) so they all read as the same surface.
 */
export function ScribeScrollFadeArea({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: SCROLL_FADE_HEIGHT,
          background: (t) =>
            `linear-gradient(to bottom, ${t.palette.background.default} 0%, ${alpha(
              t.palette.background.default,
              0,
            )} 100%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: SCROLL_FADE_HEIGHT,
          background: (t) =>
            `linear-gradient(to top, ${t.palette.background.default} 0%, ${alpha(
              t.palette.background.default,
              0,
            )} 100%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </Box>
  );
}
