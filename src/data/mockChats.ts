/**
 * Mock chat data for the Messages tab (active chats and message threads).
 */

export type ChatParticipantType = 'provider' | 'patient' | 'admin';

export type ChatType = 'provider-provider' | 'provider-patient' | 'provider-admin';

export interface Chat {
  id: string;
  /** Display title in the list (e.g. "Dr. Sarah Chen", "Care team", "Front desk") */
  title: string;
  /** Short label for chat type (e.g. "Provider", "Patient", "Admin") */
  participantLabel: string;
  type: ChatType;
  /** Last message preview for list item */
  preview: string;
  /** When the last message was sent (for sorting/display) */
  lastAt: string;
  /** True if the chat has unread messages */
  unread?: boolean;
  /** Patient id when chat is with or about a patient (for header details + profile link) */
  patientId?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole?: ChatParticipantType;
  content: string;
  time: string;
  /** True if sent by the current user (the provider viewing the app) */
  isFromCurrentUser: boolean;
}

/** All active chats for the Messages tab left panel */
export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat-1',
    title: 'Dr. Sarah Chen',
    participantLabel: 'Provider',
    type: 'provider-provider',
    preview: 'Thanks, I’ll take the 2pm slot.',
    lastAt: '2024-08-08T10:45:00',
  },
  {
    id: 'chat-2',
    title: 'Michael Chen',
    participantLabel: 'Patient',
    type: 'provider-patient',
    preview: 'That works, thank you!',
    lastAt: '2024-08-08T09:35:00',
    unread: true,
    patientId: '2',
  },
  {
    id: 'chat-3',
    title: 'Front desk',
    participantLabel: 'Admin',
    type: 'provider-admin',
    preview: 'Schedule change for tomorrow — can you confirm?',
    lastAt: '2024-08-08T08:15:00',
  },
  {
    id: 'chat-4',
    title: 'Dr. James Wilson',
    participantLabel: 'Provider',
    type: 'provider-provider',
    preview: 'Will do. Talk then.',
    lastAt: '2024-08-07T16:45:00',
    unread: true,
    patientId: '1',
  },
  {
    id: 'chat-5',
    title: 'Emily Rodriguez',
    participantLabel: 'Patient',
    type: 'provider-patient',
    preview: 'Portal message: refill request for lisinopril',
    lastAt: '2024-08-07T14:00:00',
    patientId: '3',
  },
  {
    id: 'chat-6',
    title: 'Billing / Admin',
    participantLabel: 'Admin',
    type: 'provider-admin',
    preview: 'Prior auth approved for PT — 12 visits.',
    lastAt: '2024-08-07T11:45:00',
  },
  {
    id: 'chat-7',
    title: 'Dr. Lisa Park',
    participantLabel: 'Provider',
    type: 'provider-provider',
    preview: 'Quick question about the referral to cardiology.',
    lastAt: '2024-08-06T17:20:00',
  },
];

/** Mock message threads per chat. Key = chat id. */
export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'chat-1': [
    { id: 'm1', senderName: 'Dr. Sarah Chen', senderRole: 'provider', content: 'Do you have any openings for a same-day referral this week?', time: '10:32 AM', isFromCurrentUser: false },
    { id: 'm2', senderName: 'You', senderRole: 'provider', content: 'I have 2pm on Thursday if that works.', time: '10:38 AM', isFromCurrentUser: true },
    { id: 'm3', senderName: 'Dr. Sarah Chen', senderRole: 'provider', content: 'Thanks, I’ll take the 2pm slot.', time: '10:45 AM', isFromCurrentUser: false },
  ],
  'chat-2': [
    { id: 'm1', senderName: 'Michael Chen', senderRole: 'patient', content: 'Hi, I have a conflict with my appointment tomorrow. Is it okay if I reschedule to next week?', time: '9:18 AM', isFromCurrentUser: false },
    { id: 'm2', senderName: 'You', senderRole: 'provider', content: 'Sure. We have Tue 9am or Wed 2pm. Which works better?', time: '9:20 AM', isFromCurrentUser: true },
    { id: 'm3', senderName: 'Michael Chen', senderRole: 'patient', content: 'Tuesday 9am would be great.', time: '9:24 AM', isFromCurrentUser: false },
    { id: 'm4', senderName: 'You', senderRole: 'provider', content: 'Done — you’re on for Tuesday 9am. You’ll get a confirmation shortly.', time: '9:26 AM', isFromCurrentUser: true },
    { id: 'm5', senderName: 'Michael Chen', senderRole: 'patient', content: 'Actually, could we do Wednesday instead? Something came up for Tuesday.', time: '9:28 AM', isFromCurrentUser: false },
    { id: 'm6', senderName: 'You', senderRole: 'provider', content: 'No problem. I’ve moved you to Wednesday 2pm.', time: '9:30 AM', isFromCurrentUser: true },
    { id: 'm7', senderName: 'Michael Chen', senderRole: 'patient', content: 'That works, thank you!', time: '9:35 AM', isFromCurrentUser: false },
  ],
  'chat-3': [
    { id: 'm1', senderName: 'Front desk', senderRole: 'admin', content: 'Schedule change for tomorrow — can you confirm you’re still in for 8–12?', time: '8:10 AM', isFromCurrentUser: false },
    { id: 'm2', senderName: 'You', senderRole: 'provider', content: 'Yes, confirmed. Thanks for the heads up.', time: '8:15 AM', isFromCurrentUser: true },
  ],
  'chat-4': [
    { id: 'm1', senderName: 'Dr. James Wilson', senderRole: 'provider', content: 'Re: Sarah Johnson follow-up — labs are back. Everything looks good, no changes needed.', time: '4:28 PM', isFromCurrentUser: false },
    { id: 'm2', senderName: 'You', senderRole: 'provider', content: 'Got it, I’ll note it in the chart. Thanks.', time: '4:30 PM', isFromCurrentUser: true },
    { id: 'm3', senderName: 'Dr. James Wilson', senderRole: 'provider', content: 'One more thing — did you want me to send the imaging report to her PCP as well?', time: '4:32 PM', isFromCurrentUser: false },
    { id: 'm4', senderName: 'You', senderRole: 'provider', content: 'Yes please, that would be helpful.', time: '4:35 PM', isFromCurrentUser: true },
    { id: 'm5', senderName: 'Dr. James Wilson', senderRole: 'provider', content: 'Will do. Talk then.', time: '4:45 PM', isFromCurrentUser: false },
  ],
  'chat-5': [
    { id: 'm1', senderName: 'Emily Rodriguez', senderRole: 'patient', content: 'Portal message: refill request for lisinopril. Can I get a 90-day supply?', time: '1:58 PM', isFromCurrentUser: false },
    { id: 'm2', senderName: 'You', senderRole: 'provider', content: 'Approved. Sent to pharmacy. You should be set.', time: '2:00 PM', isFromCurrentUser: true },
    { id: 'm3', senderName: 'Emily Rodriguez', senderRole: 'patient', content: 'Thank you! One more question — should I keep taking it in the morning or is evening okay?', time: '2:05 PM', isFromCurrentUser: false },
    { id: 'm4', senderName: 'You', senderRole: 'provider', content: 'Either is fine; just pick one time and stick with it for consistency.', time: '2:08 PM', isFromCurrentUser: true },
  ],
  'chat-6': [
    { id: 'm1', senderName: 'Billing / Admin', senderRole: 'admin', content: 'Prior auth approved for PT — 12 visits. Patient can start next week.', time: '11:42 AM', isFromCurrentUser: false },
    { id: 'm2', senderName: 'You', senderRole: 'provider', content: 'Thanks for the update.', time: '11:45 AM', isFromCurrentUser: true },
  ],
  'chat-7': [
    { id: 'm1', senderName: 'Dr. Lisa Park', senderRole: 'provider', content: 'Quick question about the referral to cardiology — did you want stress test ordered as well?', time: '5:18 PM', isFromCurrentUser: false },
    { id: 'm2', senderName: 'You', senderRole: 'provider', content: 'Yes, please add stress test. Thanks.', time: '5:20 PM', isFromCurrentUser: true },
  ],
};

export function getChatById(id: string): Chat | undefined {
  return MOCK_CHATS.find((c) => c.id === id);
}

export function getMessagesForChat(chatId: string): ChatMessage[] {
  return MOCK_CHAT_MESSAGES[chatId] ?? [];
}
