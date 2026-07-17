/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EventDetail {
  title: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  mapsUrl: string;
}

export interface LoveStoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface DigitalGiftItem {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface InvitationData {
  title: string;
  groomName: string;
  groomFullName: string;
  groomParents: string;
  groomInstagram: string;
  groomOrder: string; // e.g., "Putra pertama dari"
  groomPhoto: string;

  brideName: string;
  brideFullName: string;
  brideParents: string;
  brideInstagram: string;
  brideOrder: string; // e.g., "Putri kedua dari"
  bridePhoto: string;

  mainEventDate: string; // YYYY-MM-DD for countdown
  events: EventDetail[];
  loveStories: LoveStoryItem[];
  gallery: string[];
  gifts: DigitalGiftItem[];
  giftAddress: string;
  giftRecipientName: string;
  
  quoteText: string;
  quoteSource: string;
  
  musicUrl: string;
  themeId: string;
}

export interface GuestWish {
  id: string;
  name: string;
  status: 'Hadir' | 'Tidak Hadir' | 'Ragu-ragu';
  guestCount: number;
  message: string;
  timestamp: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string; // tailwind classes
  secondary: string;
  background: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  buttonColor: string;
  buttonText: string;
  fontHeading: string; // font family class
  fontBody: string;
  containerClass: string;
  primaryColor?: string;
}
