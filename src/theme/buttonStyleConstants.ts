/**
 * Applied to visit note Sign / Scribe toolbar controls that intentionally keep
 * custom sizing (pill toolbar, recording UI) and are excluded from global
 * 28px / 36px / 44px height rules.
 */
export const VISIT_NOTE_BUTTON_EXEMPT_CLASS = 'visit-note-button-exempt';

/** @deprecated Use BUTTON_BORDER_RADIUS_BY_SIZE for size-specific radius. */
export const BUTTON_BORDER_RADIUS = 10;

/** Button corner radius by size token. */
export const BUTTON_BORDER_RADIUS_BY_SIZE = {
  small: 8,
  medium: 10,
  large: 12,
} as const;

/**
 * Text buttons that behave like inline links (no surface, no tactile depth).
 * Excluded from neutral tactile styling.
 */
export const BUTTON_LINK_CLASS = 'app-button-link';

/** Standard button / field heights by size token. */
export const BUTTON_HEIGHTS = {
  small: 28,
  medium: 36,
  large: 44,
} as const;

export type FieldSize = keyof typeof BUTTON_HEIGHTS;
export type FieldVariant = 'outlined' | 'filled';

/** All text fields, dropdowns, and search fields use 8px corners. */
export const FIELD_BORDER_RADIUS = 8;

/** Filled field surface — #000 at 5% opacity (light mode). */
export const FIELD_FILLED_BG_LIGHT = 'rgba(0, 0, 0, 0.05)';
export const FIELD_FILLED_BG_DARK = 'rgba(255, 255, 255, 0.08)';
/** Filled field hover — slightly higher opacity for interactivity. */
export const FIELD_FILLED_BG_HOVER_LIGHT = 'rgba(0, 0, 0, 0.08)';
export const FIELD_FILLED_BG_HOVER_DARK = 'rgba(255, 255, 255, 0.12)';

/** Outlined field border — subtle default, slightly darker on hover (not full black). */
export const FIELD_OUTLINE_BORDER_LIGHT = 'rgba(0, 0, 0, 0.12)';
export const FIELD_OUTLINE_BORDER_HOVER_LIGHT = 'rgba(0, 0, 0, 0.2)';
export const FIELD_OUTLINE_BORDER_DARK = 'rgba(255, 255, 255, 0.16)';
export const FIELD_OUTLINE_BORDER_HOVER_DARK = 'rgba(255, 255, 255, 0.24)';

/** Lighter neutral button outline (not full-strength divider black). */
export const NEUTRAL_BUTTON_BORDER_LIGHT = 'rgba(0, 0, 0, 0.1)';
export const NEUTRAL_BUTTON_BORDER_DARK = 'rgba(255, 255, 255, 0.16)';

/** AppIconButton variant class hooks (styled via theme + component). */
export const ICON_BUTTON_VARIANT_CLASS = {
  primary: 'app-icon-button--primary',
  secondary: 'app-icon-button--secondary',
  emphasis: 'app-icon-button--emphasis',
} as const;
