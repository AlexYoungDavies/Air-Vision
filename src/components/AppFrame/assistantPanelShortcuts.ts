import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { ComponentType } from 'react';
import WbSunnyOutlined from '@mui/icons-material/WbSunnyOutlined';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
import NotificationImportantOutlined from '@mui/icons-material/NotificationImportantOutlined';

export interface AIAssistantShortcut {
  id: string;
  label: string;
  /** Leading icon inside the chip. */
  Icon: ComponentType<SvgIconProps>;
}

/** Default shortcuts for the home / day-overview Ask Athelas demo. */
export const DEFAULT_ASSISTANT_SHORTCUTS: AIAssistantShortcut[] = [
  { id: 'tell-me-about-my-day', label: "Today's Overview", Icon: WbSunnyOutlined },
  { id: 'whats-waiting-on-me', label: "My Todo's", Icon: HourglassEmptyOutlined },
  { id: 'key-alerts-today', label: 'Important Alerts', Icon: NotificationImportantOutlined },
];

/**
 * Returns shortcuts for the current route. Extend this map as each page defines its own set.
 * Paths not listed fall back to {@link DEFAULT_ASSISTANT_SHORTCUTS}.
 */
export function getAssistantShortcutsForPath(_pathname: string): AIAssistantShortcut[] {
  // Add route branches here, e.g. visits vs patients, when each page defines shortcuts.
  return DEFAULT_ASSISTANT_SHORTCUTS;
}
