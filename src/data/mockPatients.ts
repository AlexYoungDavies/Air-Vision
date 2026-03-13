/**
 * Mock patient data for use across the app (lists, schedules, detail views).
 * Picture URLs use a placeholder service; replace with real assets if needed.
 */

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  insurance: {
    provider: string;
    memberId: string;
    groupNumber?: string;
  };
  picture: string;
  case: string;
  homeAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  emergencyContact: EmergencyContact;
  /** Reason for visit (e.g. for "Today's Patients" schedule) */
  reasonForVisit?: string;
  /** Appointment time for schedule display */
  appointmentTime?: string;
  /** Appointment type for list display: Initial Eval, Follow up, or Progress Note */
  appointmentType?: 'Initial Eval' | 'Follow up' | 'Progress Note';
  /** Patient has new labs to review (show labs icon on list item) */
  hasNewLabs?: boolean;
  /** Patient has new imaging to review (show imaging icon on list item) */
  hasNewImaging?: boolean;
  /** Preferred language */
  language?: string;
  /** Date patient first registered */
  patientSince?: string;
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    mrn: 'MRN0018472',
    fullName: 'Sarah Johnson',
    dateOfBirth: '03/15/1985',
    email: 'sarah.johnson@email.com',
    phone: '(555) 201-3401',
    age: 40,
    gender: 'Female',
    insurance: { provider: 'Aetna', memberId: 'AET-8829102', groupNumber: 'GP-4421' },
    picture: 'https://i.pravatar.cc/150?img=1',
    case: 'Annual physical',
    homeAddress: { line1: '124 Oak Lane', city: 'Portland', state: 'OR', zip: '97201' },
    emergencyContact: { name: 'John Johnson', relationship: 'Spouse', phone: '(555) 201-3402' },
    language: 'English',
    patientSince: 'Jan 2020',
  },
  {
    id: '2',
    mrn: 'MRN0018473',
    fullName: 'Michael Chen',
    dateOfBirth: '07/22/1992',
    email: 'michael.chen@email.com',
    phone: '(555) 202-4502',
    age: 33,
    gender: 'Male',
    insurance: { provider: 'Blue Cross', memberId: 'BC-7734521', groupNumber: 'GP-8892' },
    picture: 'https://i.pravatar.cc/150?img=3',
    case: 'Knee sprain',
    homeAddress: { line1: '89 Pine Street', line2: 'Apt 4B', city: 'Seattle', state: 'WA', zip: '98101' },
    emergencyContact: { name: 'Lisa Chen', relationship: 'Spouse', phone: '(555) 202-4503' },
  },
  {
    id: '3',
    mrn: 'MRN0018474',
    fullName: 'Emily Rodriguez',
    dateOfBirth: '11/08/1978',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 203-5603',
    age: 47,
    gender: 'Female',
    insurance: { provider: 'UnitedHealthcare', memberId: 'UHC-9921834', groupNumber: 'GP-1123' },
    picture: 'https://i.pravatar.cc/150?img=5',
    case: 'Hypertension follow-up',
    homeAddress: { line1: '456 Maple Ave', city: 'Denver', state: 'CO', zip: '80202' },
    emergencyContact: { name: 'Carlos Rodriguez', relationship: 'Spouse', phone: '(555) 203-5604' },
  },
  {
    id: '4',
    mrn: 'MRN0018475',
    fullName: 'David Kim',
    dateOfBirth: '02/14/1990',
    email: 'david.kim@email.com',
    phone: '(555) 204-6704',
    age: 35,
    gender: 'Male',
    insurance: { provider: 'Cigna', memberId: 'CIG-5543201', groupNumber: 'GP-7765' },
    picture: 'https://i.pravatar.cc/150?img=12',
    case: 'Consultation',
    homeAddress: { line1: '201 Cedar Blvd', city: 'Austin', state: 'TX', zip: '78701' },
    emergencyContact: { name: 'Grace Kim', relationship: 'Sister', phone: '(555) 204-6705' },
  },
  {
    id: '5',
    mrn: 'MRN0018476',
    fullName: 'Robert Thompson',
    dateOfBirth: '09/30/1982',
    email: 'robert.thompson@email.com',
    phone: '(555) 205-7805',
    age: 43,
    gender: 'Male',
    insurance: { provider: 'Humana', memberId: 'HUM-2219876', groupNumber: 'GP-3344' },
    picture: 'https://i.pravatar.cc/150?img=11',
    case: 'Lab review',
    homeAddress: { line1: '78 Birch Rd', city: 'Nashville', state: 'TN', zip: '37201' },
    emergencyContact: { name: 'Mary Thompson', relationship: 'Spouse', phone: '(555) 205-7806' },
  },
  {
    id: '6',
    mrn: 'MRN0018477',
    fullName: 'Jennifer Martinez',
    dateOfBirth: '05/17/1995',
    email: 'jennifer.martinez@email.com',
    phone: '(555) 206-8906',
    age: 30,
    gender: 'Female',
    insurance: { provider: 'Kaiser Permanente', memberId: 'KP-6654321', groupNumber: 'GP-9988' },
    picture: 'https://i.pravatar.cc/150?img=9',
    case: 'Migraine management',
    homeAddress: { line1: '312 Elm St', city: 'Phoenix', state: 'AZ', zip: '85001' },
    emergencyContact: { name: 'Jose Martinez', relationship: 'Brother', phone: '(555) 206-8907' },
  },
  {
    id: '7',
    mrn: 'MRN0018478',
    fullName: 'James Wilson',
    dateOfBirth: '12/03/1988',
    email: 'james.wilson@email.com',
    phone: '(555) 207-9017',
    age: 37,
    gender: 'Male',
    insurance: { provider: 'Aetna', memberId: 'AET-1122334', groupNumber: 'GP-4421' },
    picture: 'https://i.pravatar.cc/150?img=13',
    case: 'Annual physical',
    homeAddress: { line1: '55 Walnut Dr', city: 'Boston', state: 'MA', zip: '02101' },
    emergencyContact: { name: 'Amy Wilson', relationship: 'Spouse', phone: '(555) 207-9018' },
  },
  {
    id: '8',
    mrn: 'MRN0018479',
    fullName: 'Lisa Anderson',
    dateOfBirth: '08/19/1975',
    email: 'lisa.anderson@email.com',
    phone: '(555) 208-0128',
    age: 50,
    gender: 'Female',
    insurance: { provider: 'Blue Cross', memberId: 'BC-9988776', groupNumber: 'GP-8892' },
    picture: 'https://i.pravatar.cc/150?img=20',
    case: 'Diabetes check',
    homeAddress: { line1: '167 Spruce Ave', city: 'Chicago', state: 'IL', zip: '60601' },
    emergencyContact: { name: 'Tom Anderson', relationship: 'Spouse', phone: '(555) 208-0129' },
  },
  {
    id: '9',
    mrn: 'MRN0018480',
    fullName: 'Maria Garcia',
    dateOfBirth: '04/12/1989',
    email: 'maria.garcia@email.com',
    phone: '(555) 209-1239',
    age: 36,
    gender: 'Female',
    insurance: { provider: 'UnitedHealthcare', memberId: 'UHC-4455667', groupNumber: 'GP-1123' },
    picture: 'https://i.pravatar.cc/150?img=25',
    case: 'Prenatal care',
    homeAddress: { line1: '90 Ash Lane', city: 'Miami', state: 'FL', zip: '33101' },
    emergencyContact: { name: 'Pedro Garcia', relationship: 'Spouse', phone: '(555) 209-1240' },
  },
  {
    id: '10',
    mrn: 'MRN0018481',
    fullName: 'Daniel Brown',
    dateOfBirth: '01/28/1991',
    email: 'daniel.brown@email.com',
    phone: '(555) 210-2340',
    age: 34,
    gender: 'Male',
    insurance: { provider: 'Cigna', memberId: 'CIG-7788990', groupNumber: 'GP-7765' },
    picture: 'https://i.pravatar.cc/150?img=15',
    case: 'Sports physical',
    homeAddress: { line1: '234 Hickory Way', city: 'Atlanta', state: 'GA', zip: '30301' },
    emergencyContact: { name: 'Susan Brown', relationship: 'Mother', phone: '(555) 210-2341' },
  },
  {
    id: '11',
    mrn: 'MRN0018482',
    fullName: 'Amanda Foster',
    dateOfBirth: '06/05/1984',
    email: 'amanda.foster@email.com',
    phone: '(555) 211-3451',
    age: 41,
    gender: 'Female',
    insurance: { provider: 'Humana', memberId: 'HUM-3344556', groupNumber: 'GP-3344' },
    picture: 'https://i.pravatar.cc/150?img=26',
    case: 'Thyroid follow-up',
    homeAddress: { line1: '45 Magnolia St', city: 'Charlotte', state: 'NC', zip: '28201' },
    emergencyContact: { name: 'Kevin Foster', relationship: 'Spouse', phone: '(555) 211-3452' },
  },
  {
    id: '12',
    mrn: 'MRN0018483',
    fullName: 'Chris Taylor',
    dateOfBirth: '10/11/1993',
    email: 'chris.taylor@email.com',
    phone: '(555) 212-4562',
    age: 32,
    gender: 'Male',
    insurance: { provider: 'Kaiser Permanente', memberId: 'KP-6677889', groupNumber: 'GP-9988' },
    picture: 'https://i.pravatar.cc/150?img=14',
    case: 'Allergy testing',
    homeAddress: { line1: '678 Dogwood Rd', city: 'San Diego', state: 'CA', zip: '92101' },
    emergencyContact: { name: 'Rachel Taylor', relationship: 'Sister', phone: '(555) 212-4563' },
  },
  {
    id: '13',
    mrn: 'MRN0018484',
    fullName: 'Nicole White',
    dateOfBirth: '03/28/1979',
    email: 'nicole.white@email.com',
    phone: '(555) 213-5673',
    age: 46,
    gender: 'Female',
    insurance: { provider: 'Aetna', memberId: 'AET-2233445', groupNumber: 'GP-4421' },
    picture: 'https://i.pravatar.cc/150?img=32',
    case: 'Wellness exam',
    homeAddress: { line1: '112 Cherry Lane', city: 'Minneapolis', state: 'MN', zip: '55401' },
    emergencyContact: { name: 'Mark White', relationship: 'Spouse', phone: '(555) 213-5674' },
  },
  {
    id: '14',
    mrn: 'MRN0018485',
    fullName: 'Kevin Lee',
    dateOfBirth: '07/07/1987',
    email: 'kevin.lee@email.com',
    phone: '(555) 214-6784',
    age: 38,
    gender: 'Male',
    insurance: { provider: 'Blue Cross', memberId: 'BC-5566778', groupNumber: 'GP-8892' },
    picture: 'https://i.pravatar.cc/150?img=33',
    case: 'Back pain',
    homeAddress: { line1: '89 Sycamore Ave', city: 'Detroit', state: 'MI', zip: '48201' },
    emergencyContact: { name: 'Michelle Lee', relationship: 'Spouse', phone: '(555) 214-6785' },
  },
  {
    id: '15',
    mrn: 'MRN0018486',
    fullName: 'Rachel Green',
    dateOfBirth: '11/20/1994',
    email: 'rachel.green@email.com',
    phone: '(555) 215-7895',
    age: 31,
    gender: 'Female',
    insurance: { provider: 'UnitedHealthcare', memberId: 'UHC-6677889', groupNumber: 'GP-1123' },
    picture: 'https://i.pravatar.cc/150?img=41',
    case: 'Anxiety management',
    homeAddress: { line1: '201 Poplar St', city: 'Philadelphia', state: 'PA', zip: '19101' },
    emergencyContact: { name: 'Emma Green', relationship: 'Mother', phone: '(555) 215-7896' },
  },
  {
    id: '16',
    mrn: 'MRN0018487',
    fullName: 'Steven Clark',
    dateOfBirth: '02/09/1981',
    email: 'steven.clark@email.com',
    phone: '(555) 216-8906',
    age: 44,
    gender: 'Male',
    insurance: { provider: 'Cigna', memberId: 'CIG-8899001', groupNumber: 'GP-7765' },
    picture: 'https://i.pravatar.cc/150?img=36',
    case: 'Cardiac screening',
    homeAddress: { line1: '156 Willow Way', city: 'Baltimore', state: 'MD', zip: '21201' },
    emergencyContact: { name: 'Linda Clark', relationship: 'Spouse', phone: '(555) 216-8907' },
  },
  {
    id: '17',
    mrn: 'MRN0018488',
    fullName: 'Jessica Hall',
    dateOfBirth: '09/14/1986',
    email: 'jessica.hall@email.com',
    phone: '(555) 217-9017',
    age: 39,
    gender: 'Female',
    insurance: { provider: 'Humana', memberId: 'HUM-4455667', groupNumber: 'GP-3344' },
    picture: 'https://i.pravatar.cc/150?img=43',
    case: 'Skin check',
    homeAddress: { line1: '78 Chestnut Blvd', city: 'Columbus', state: 'OH', zip: '43201' },
    emergencyContact: { name: 'Brian Hall', relationship: 'Spouse', phone: '(555) 217-9018' },
  },
  {
    id: '18',
    mrn: 'MRN0018489',
    fullName: 'Matthew Lewis',
    dateOfBirth: '05/22/1996',
    email: 'matthew.lewis@email.com',
    phone: '(555) 218-0128',
    age: 29,
    gender: 'Male',
    insurance: { provider: 'Kaiser Permanente', memberId: 'KP-7788990', groupNumber: 'GP-9988' },
    picture: 'https://i.pravatar.cc/150?img=52',
    case: 'Asthma follow-up',
    homeAddress: { line1: '334 Oakwood Dr', city: 'Indianapolis', state: 'IN', zip: '46201' },
    emergencyContact: { name: 'Karen Lewis', relationship: 'Mother', phone: '(555) 218-0129' },
  },
  {
    id: '19',
    mrn: 'MRN0018490',
    fullName: 'Lauren King',
    dateOfBirth: '12/30/1983',
    email: 'lauren.king@email.com',
    phone: '(555) 219-1239',
    age: 42,
    gender: 'Female',
    insurance: { provider: 'Aetna', memberId: 'AET-3344556', groupNumber: 'GP-4421' },
    picture: 'https://i.pravatar.cc/150?img=47',
    case: 'Joint pain',
    homeAddress: { line1: '67 Beech St', city: 'Milwaukee', state: 'WI', zip: '53201' },
    emergencyContact: { name: 'Scott King', relationship: 'Spouse', phone: '(555) 219-1240' },
  },
  {
    id: '20',
    mrn: 'MRN0018491',
    fullName: 'Andrew Wright',
    dateOfBirth: '08/08/1990',
    email: 'andrew.wright@email.com',
    phone: '(555) 220-2340',
    age: 35,
    gender: 'Male',
    insurance: { provider: 'Blue Cross', memberId: 'BC-6677889', groupNumber: 'GP-8892' },
    picture: 'https://i.pravatar.cc/150?img=58',
    case: 'Sleep study follow-up',
    homeAddress: { line1: '423 Redwood Ave', city: 'San Francisco', state: 'CA', zip: '94102' },
    emergencyContact: { name: 'Diane Wright', relationship: 'Sister', phone: '(555) 220-2341' },
  },
];

/** Subset of patients with today's schedule for "Today's Patients" view */
export const TODAYS_PATIENTS = ((): Patient[] => {
  const byId = (id: string) => MOCK_PATIENTS.find((p) => p.id === id)!;
  return [
    { ...byId('1'), reasonForVisit: 'Annual physical', appointmentTime: '7:00 AM', appointmentType: 'Initial Eval' },
    { ...byId('2'), reasonForVisit: 'Knee sprain', appointmentTime: '7:30 AM', appointmentType: 'Follow up', hasNewLabs: true },
    { ...byId('3'), reasonForVisit: 'Hypertension follow-up', appointmentTime: '8:00 AM', appointmentType: 'Progress Note', hasNewImaging: true },
    { ...byId('4'), reasonForVisit: 'Consultation', appointmentTime: '9:00 AM', appointmentType: 'Initial Eval', hasNewLabs: true, hasNewImaging: true },
    { ...byId('5'), reasonForVisit: 'Lab review', appointmentTime: '9:30 AM', appointmentType: 'Follow up' },
    { ...byId('7'), reasonForVisit: 'Annual physical', appointmentTime: '11:00 AM', appointmentType: 'Progress Note' },
    { ...byId('8'), reasonForVisit: 'Consultation', appointmentTime: '12:00 PM', appointmentType: 'Initial Eval' },
    { ...byId('9'), reasonForVisit: 'Follow-up', appointmentTime: '12:30 PM', appointmentType: 'Follow up', hasNewLabs: true },
    { ...byId('10'), reasonForVisit: 'Lab review', appointmentTime: '1:00 PM', appointmentType: 'Progress Note' },
    { ...byId('11'), reasonForVisit: 'Consultation', appointmentTime: '2:00 PM', appointmentType: 'Follow up' },
    { ...byId('12'), reasonForVisit: 'Follow-up', appointmentTime: '2:30 PM', appointmentType: 'Progress Note', hasNewLabs: true, hasNewImaging: true },
  ];
})();
