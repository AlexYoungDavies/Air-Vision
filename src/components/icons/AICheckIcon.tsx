import * as React from 'react';
import { SvgIcon, type SvgIconProps } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

/** Static four-lobe AI emblem (visit note “AI Check” toolbar). Not the Lottie / animated scribe emblem. */
export function AICheckIcon(props: SvgIconProps) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primaryFade = alpha(primary, 0);
  const baseId = (React as { useId?: () => string }).useId?.() ?? 'ai-check';
  const id0 = `${baseId}-0`;
  const id1 = `${baseId}-1`;
  const id2 = `${baseId}-2`;
  const id3 = `${baseId}-3`;
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none">
      <path d="M19 7C19 3.13401 15.866 0 12 0C8.13401 0 5 3.13401 5 7C5 10.866 8.13401 14 12 14C15.866 14 19 10.866 19 7Z" fill={`url(#${id0})`} />
      <path d="M19 17C19 20.866 15.866 24 12 24C8.13401 24 5 20.866 5 17C5 13.134 8.13401 10 12 10C15.866 10 19 13.134 19 17Z" fill={`url(#${id1})`} />
      <path d="M17 19C20.866 19 24 15.866 24 12C24 8.13401 20.866 5 17 5C13.134 5 10 8.13401 10 12C10 15.866 13.134 19 17 19Z" fill={`url(#${id2})`} />
      <path d="M7 19C3.13401 19 0 15.866 0 12C0 8.13401 3.13401 5 7 5C10.866 5 14 8.13401 14 12C14 15.866 10.866 19 7 19Z" fill={`url(#${id3})`} />
      <defs>
        <linearGradient id={id0} x1="11.5" y1="14" x2="11.5" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor={primary} />
          <stop offset="1" stopColor={primaryFade} />
        </linearGradient>
        <linearGradient id={id1} x1="11.5" y1="10" x2="11.5" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor={primary} />
          <stop offset="1" stopColor={primaryFade} />
        </linearGradient>
        <linearGradient id={id2} x1="10" y1="13" x2="24" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor={primary} />
          <stop offset="1" stopColor={primaryFade} />
        </linearGradient>
        <linearGradient id={id3} x1="14" y1="13" x2="0" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor={primary} />
          <stop offset="1" stopColor={primaryFade} />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
}
