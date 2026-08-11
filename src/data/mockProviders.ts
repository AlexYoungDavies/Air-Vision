/**
 * Canonical provider roster used across scheduling, billing, and filters.
 */

export interface Provider {
  id: string;
  /** Short name for calendar columns and filters */
  displayName: string;
  /** Full name with title for billing and clinical docs */
  fullName: string;
  phone: string;
  email: string;
  npi: string;
  ptan: string;
  specialty: string;
}

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: '1',
    displayName: 'Emily Chen',
    fullName: 'Dr. Emily Chen',
    phone: '(555) 301-1001',
    email: 'emily.chen@air.com',
    npi: '1234567890',
    ptan: '1AB234',
    specialty: 'Physical Therapy',
  },
  {
    id: '2',
    displayName: 'James Wilson',
    fullName: 'Dr. James Wilson',
    phone: '(555) 301-1002',
    email: 'james.wilson@air.com',
    npi: '2345678901',
    ptan: '2BC345',
    specialty: 'Orthopedics',
  },
  {
    id: '3',
    displayName: 'Maria Garcia',
    fullName: 'Dr. Maria Garcia',
    phone: '(555) 301-1003',
    email: 'maria.garcia@air.com',
    npi: '3456789012',
    ptan: '3CD456',
    specialty: 'Physical Therapy',
  },
  {
    id: '4',
    displayName: 'David Kim',
    fullName: 'Dr. David Kim',
    phone: '(555) 301-1004',
    email: 'david.kim@air.com',
    npi: '4567890123',
    ptan: '4DE567',
    specialty: 'Sports Medicine',
  },
  {
    id: '5',
    displayName: 'Sarah Johnson',
    fullName: 'Dr. Sarah Johnson',
    phone: '(555) 301-1005',
    email: 'sarah.johnson@air.com',
    npi: '5678901234',
    ptan: '5EF678',
    specialty: 'Physical Therapy',
  },
  {
    id: '6',
    displayName: 'Robert Lee',
    fullName: 'Dr. Robert Lee',
    phone: '(555) 301-1006',
    email: 'robert.lee@air.com',
    npi: '6789012345',
    ptan: '6FG789',
    specialty: 'Orthopedics',
  },
  {
    id: '7',
    displayName: 'Amy Foster',
    fullName: 'Dr. Amy Foster',
    phone: '(555) 301-1007',
    email: 'amy.foster@air.com',
    npi: '7890123456',
    ptan: '7GH890',
    specialty: 'Occupational Therapy',
  },
  {
    id: '8',
    displayName: 'Chris Taylor',
    fullName: 'Dr. Chris Taylor',
    phone: '(555) 301-1008',
    email: 'chris.taylor@air.com',
    npi: '8901234567',
    ptan: '8HI901',
    specialty: 'Physical Therapy',
  },
  {
    id: '9',
    displayName: 'Priya Sharma',
    fullName: 'Dr. Priya Sharma',
    phone: '(555) 301-1009',
    email: 'priya.sharma@air.com',
    npi: '9012345678',
    ptan: '9IJ012',
    specialty: 'Physical Therapy',
  },
  {
    id: '10',
    displayName: 'Marcus Webb',
    fullName: 'Dr. Marcus Webb',
    phone: '(555) 301-1010',
    email: 'marcus.webb@air.com',
    npi: '0123456789',
    ptan: '0JK123',
    specialty: 'Sports Medicine',
  },
  {
    id: '11',
    displayName: 'Nina Okonkwo',
    fullName: 'Dr. Nina Okonkwo',
    phone: '(555) 301-1011',
    email: 'nina.okonkwo@air.com',
    npi: '1122334455',
    ptan: '1KL234',
    specialty: 'Physical Therapy',
  },
  {
    id: '12',
    displayName: 'Hannah Brooks',
    fullName: 'Dr. Hannah Brooks',
    phone: '(555) 301-1012',
    email: 'hannah.brooks@air.com',
    npi: '2233445566',
    ptan: '2LM345',
    specialty: 'Occupational Therapy',
  },
];

export function getProviderById(id: string): Provider | undefined {
  return MOCK_PROVIDERS.find((p) => p.id === id);
}

/** Provider whose schedule drives the Home “Visits” list (same roster as their calendar column). */
export const HOME_PROVIDER_ID = '3';

export function getHomeProvider(): Provider {
  const provider = getProviderById(HOME_PROVIDER_ID);
  if (!provider) throw new Error(`HOME_PROVIDER_ID ${HOME_PROVIDER_ID} not found in MOCK_PROVIDERS`);
  return provider;
}
