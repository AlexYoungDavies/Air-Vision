import type { Palette, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    background: Palette['background'] & {
      /** Tonal gradient start (e.g. home page hero). */
      gradientStart?: string;
      /** Tonal gradient end (e.g. home page hero). */
      gradientEnd?: string;
    };
  }
  interface PaletteOptions {
    background?: PaletteOptions['background'] & {
      gradientStart?: string;
      gradientEnd?: string;
    };
  }
}
