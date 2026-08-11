/**
 * Canonical appointment-type catalog with dedicated UI colors.
 * Use these labels on calendar/list appointments and home schedule rows.
 */

export interface AppointmentTypeVisual {
  /** Strong accent for borders, chips, and row stripes */
  accent: string;
  /** Readable text color paired with the accent */
  text: string;
}

export interface AppointmentType {
  id: string;
  label: string;
  /** Short label for dense calendar/list cells */
  shortLabel: string;
  category: 'evaluation' | 'followUp' | 'progress' | 'discharge' | 'surgical' | 'procedure' | 'other';
  medicare: boolean;
  accent: string;
  text: string;
}

export const MOCK_APPOINTMENT_TYPES: readonly AppointmentType[] = [
  {
    id: 'initial-eval',
    label: 'Initial Evaluation',
    shortLabel: 'IE',
    category: 'evaluation',
    medicare: false,
    accent: '#1565C0',
    text: '#0D3B73',
  },
  {
    id: 'medicare-initial-eval',
    label: 'Medicare Initial Evaluation',
    shortLabel: 'M-IE',
    category: 'evaluation',
    medicare: true,
    accent: '#0277BD',
    text: '#014A73',
  },
  {
    id: 'new-patient-consult',
    label: 'New Patient Consult',
    shortLabel: 'NPC',
    category: 'evaluation',
    medicare: false,
    accent: '#5E35B1',
    text: '#311B6E',
  },
  {
    id: 'consult',
    label: 'Consult',
    shortLabel: 'Con',
    category: 'evaluation',
    medicare: false,
    accent: '#7E57C2',
    text: '#3D2A66',
  },
  {
    id: 'follow-up',
    label: 'Follow-up',
    shortLabel: 'FU',
    category: 'followUp',
    medicare: false,
    accent: '#2E7D32',
    text: '#1B4D1E',
  },
  {
    id: 'medicare-follow-up',
    label: 'Medicare Follow-up',
    shortLabel: 'M-FU',
    category: 'followUp',
    medicare: true,
    accent: '#43A047',
    text: '#245E27',
  },
  {
    id: 'progress-note',
    label: 'Progress Note',
    shortLabel: 'PN',
    category: 'progress',
    medicare: false,
    accent: '#00897B',
    text: '#004D45',
  },
  {
    id: 'medicare-progress-note',
    label: 'Medicare Progress Note',
    shortLabel: 'M-PN',
    category: 'progress',
    medicare: true,
    accent: '#26A69A',
    text: '#145A54',
  },
  {
    id: 're-evaluation',
    label: 'Re-evaluation',
    shortLabel: 'RE',
    category: 'evaluation',
    medicare: false,
    accent: '#3949AB',
    text: '#1E275C',
  },
  {
    id: 'medicare-re-evaluation',
    label: 'Medicare Re-evaluation',
    shortLabel: 'M-RE',
    category: 'evaluation',
    medicare: true,
    accent: '#5C6BC0',
    text: '#2A3266',
  },
  {
    id: 'discharge',
    label: 'Discharge',
    shortLabel: 'DC',
    category: 'discharge',
    medicare: false,
    accent: '#6D4C41',
    text: '#3E2A24',
  },
  {
    id: 'medicare-discharge',
    label: 'Medicare Discharge',
    shortLabel: 'M-DC',
    category: 'discharge',
    medicare: true,
    accent: '#8D6E63',
    text: '#4E3B36',
  },
  {
    id: 'pre-op',
    label: 'Pre-op Visit',
    shortLabel: 'Pre',
    category: 'surgical',
    medicare: false,
    accent: '#0288D1',
    text: '#015079',
  },
  {
    id: 'post-op',
    label: 'Post-op Visit',
    shortLabel: 'Post',
    category: 'surgical',
    medicare: false,
    accent: '#EF6C00',
    text: '#8A3E00',
  },
  {
    id: 'procedure',
    label: 'Procedure',
    shortLabel: 'Proc',
    category: 'procedure',
    medicare: false,
    accent: '#F57C00',
    text: '#8A4500',
  },
  {
    id: 'injection',
    label: 'Injection Visit',
    shortLabel: 'Inj',
    category: 'procedure',
    medicare: false,
    accent: '#D81B60',
    text: '#7A0F36',
  },
  {
    id: 'annual-wellness',
    label: 'Annual Wellness',
    shortLabel: 'AW',
    category: 'other',
    medicare: false,
    accent: '#558B2F',
    text: '#2F4D1A',
  },
  {
    id: 'lab-review',
    label: 'Lab Review',
    shortLabel: 'Lab',
    category: 'other',
    medicare: false,
    accent: '#8E24AA',
    text: '#4A1459',
  },
  {
    id: 'telehealth',
    label: 'Telehealth Visit',
    shortLabel: 'TH',
    category: 'other',
    medicare: false,
    accent: '#0097A7',
    text: '#00545C',
  },
  {
    id: 'walk-in',
    label: 'Walk-in',
    shortLabel: 'WI',
    category: 'other',
    medicare: false,
    accent: '#C62828',
    text: '#6F1616',
  },
] as const;

const FALLBACK_VISUAL: AppointmentTypeVisual = {
  accent: '#757575',
  text: '#2F2F2F',
};

/** Legacy / alternate labels that should resolve to a catalog entry. */
const LABEL_ALIASES: Record<string, string> = {
  'initial consultation': 'Initial Evaluation',
  'initial eval': 'Initial Evaluation',
  ie: 'Initial Evaluation',
  'new patient': 'New Patient Consult',
  'new patient consult': 'New Patient Consult',
  'follow-up visit': 'Follow-up',
  'follow up': 'Follow-up',
  followup: 'Follow-up',
  'progress notes': 'Progress Note',
  '1 on 1': 'Telehealth Visit',
  '1-on-1': 'Telehealth Visit',
  annual: 'Annual Wellness',
  'annual physical': 'Annual Wellness',
  visit: 'Follow-up',
  'post-op': 'Post-op Visit',
  'post op visit': 'Post-op Visit',
  'pre-op': 'Pre-op Visit',
  'pre op visit': 'Pre-op Visit',
  discharge: 'Discharge',
  'discharge note': 'Discharge',
  'medicare ie': 'Medicare Initial Evaluation',
  'medicare fu': 'Medicare Follow-up',
  'medicare pn': 'Medicare Progress Note',
};

const byId = new Map(MOCK_APPOINTMENT_TYPES.map((t) => [t.id, t]));
const byLabel = new Map(MOCK_APPOINTMENT_TYPES.map((t) => [t.label.toLowerCase(), t]));

export function getAppointmentTypeById(id: string): AppointmentType | undefined {
  return byId.get(id);
}

export function getAppointmentTypeByLabel(label: string): AppointmentType | undefined {
  const normalized = label.trim().toLowerCase();
  const aliased = LABEL_ALIASES[normalized];
  if (aliased) return byLabel.get(aliased.toLowerCase());
  return byLabel.get(normalized) ?? byId.get(label);
}

/** Resolve accent/text colors for an appointment type id or display label. */
export function getAppointmentTypeVisual(typeIdOrLabel: string): AppointmentTypeVisual {
  const match = getAppointmentTypeByLabel(typeIdOrLabel) ?? getAppointmentTypeById(typeIdOrLabel);
  if (!match) return FALLBACK_VISUAL;
  return { accent: match.accent, text: match.text };
}

export function getAppointmentTypeLabel(typeIdOrLabel: string): string {
  const match = getAppointmentTypeByLabel(typeIdOrLabel) ?? getAppointmentTypeById(typeIdOrLabel);
  return match?.label ?? typeIdOrLabel;
}
