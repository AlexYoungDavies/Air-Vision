/**
 * Mock provider data for use across the app (billing, scheduling, filters).
 */

export interface Provider {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  npi: string;
  ptan: string;
}

export const MOCK_PROVIDERS: Provider[] = [
  { id: 'prov-1', fullName: 'Dr. Sarah Mitchell', phone: '(555) 301-1001', email: 'sarah.mitchell@air.com', npi: '1234567890', ptan: '1AB234' },
  { id: 'prov-2', fullName: 'Dr. James Chen', phone: '(555) 301-1002', email: 'james.chen@air.com', npi: '2345678901', ptan: '2BC345' },
  { id: 'prov-3', fullName: 'Dr. Emily Rodriguez', phone: '(555) 301-1003', email: 'emily.rodriguez@air.com', npi: '3456789012', ptan: '3CD456' },
  { id: 'prov-4', fullName: 'Dr. Michael Park', phone: '(555) 301-1004', email: 'michael.park@air.com', npi: '4567890123', ptan: '4DE567' },
  { id: 'prov-5', fullName: 'Dr. Jennifer Walsh', phone: '(555) 301-1005', email: 'jennifer.walsh@air.com', npi: '5678901234', ptan: '5EF678' },
  { id: 'prov-6', fullName: 'Dr. David Kim', phone: '(555) 301-1006', email: 'david.kim@air.com', npi: '6789012345', ptan: '6FG789' },
  { id: 'prov-7', fullName: 'Dr. Maria Garcia', phone: '(555) 301-1007', email: 'maria.garcia@air.com', npi: '7890123456', ptan: '7GH890' },
  { id: 'prov-8', fullName: 'Dr. Robert Taylor', phone: '(555) 301-1008', email: 'robert.taylor@air.com', npi: '8901234567', ptan: '8HI901' },
  { id: 'prov-9', fullName: 'Dr. Lisa Thompson', phone: '(555) 301-1009', email: 'lisa.thompson@air.com', npi: '9012345678', ptan: '9IJ012' },
  { id: 'prov-10', fullName: 'Dr. Christopher Lee', phone: '(555) 301-1010', email: 'christopher.lee@air.com', npi: '0123456789', ptan: '0JK123' },
];
