// src/data/timeZones.ts

export type TimeZoneDef = {
  id: string;
  label: string;
  workHours?: [number, number]; // [startHour, endHour) 例: [9, 18]
};

export const timeZones: TimeZoneDef[] = [
  { id: 'Asia/Tokyo', label: '東京 (JST)', workHours: [9, 18] },
  { id: 'America/Los_Angeles', label: 'ロサンゼルス (PST/PDT)', workHours: [9, 18] },
  { id: 'America/New_York', label: 'ニューヨーク (EST/EDT)', workHours: [9, 18] },
  { id: 'Europe/London', label: 'ロンドン (GMT/BST)', workHours: [9, 18] },
  { id: 'Europe/Paris', label: 'パリ (CET/CEST)', workHours: [9, 18] },
  { id: 'Asia/Singapore', label: 'シンガポール (SGT)', workHours: [9, 18] },
  { id: 'Australia/Sydney', label: 'シドニー (AEST/AEDT)', workHours: [9, 18] },
];

export const defaultBaseZoneId = 'Asia/Tokyo';

export const defaultTargetZoneIds: string[] = [
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Singapore',
  'Australia/Sydney',
];
