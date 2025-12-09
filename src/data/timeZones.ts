// src/data/timeZones.ts

export type TimeZoneDef = {
  id: string;
  label: string;
  workHours?: [number, number]; // [startHour, endHour) 例: [9, 18]
  keywords?: string[];
};

export const timeZones: TimeZoneDef[] = [
  {
    id: 'Asia/Tokyo',
    label: '東京 (JST)',
    workHours: [9, 18],
    keywords: ['tokyo', 'jst', '日本', '東京'],
  },
  {
    id: 'Etc/UTC',
    label: 'UTC (協定世界時)',
    keywords: ['utc', '協定世界時'],
  },
  {
    id: 'America/Los_Angeles',
    label: 'ロサンゼルス (PST/PDT)',
    workHours: [9, 18],
    keywords: ['los angeles', 'la', 'pdt', 'pst', 'ロサンゼルス'],
  },
  {
    id: 'America/New_York',
    label: 'ニューヨーク (EST/EDT)',
    workHours: [9, 18],
    keywords: ['new york', 'ny', 'est', 'edt', 'ニューヨーク', 'nyc'],
  },
  {
    id: 'Europe/London',
    label: 'ロンドン (GMT/BST)',
    workHours: [9, 18],
    keywords: ['london', 'gmt', 'bst', 'uk', 'イギリス', 'ロンドン'],
  },
  {
    id: 'Europe/Paris',
    label: 'パリ (CET/CEST)',
    workHours: [9, 18],
    keywords: ['paris', 'パリ', 'cet', 'cest', 'france', 'フランス'],
  },
  {
    id: 'Asia/Singapore',
    label: 'シンガポール (SGT)',
    workHours: [9, 18],
    keywords: ['singapore', 'シンガポール', 'sgt'],
  },
  {
    id: 'Australia/Sydney',
    label: 'シドニー (AEST/AEDT)',
    workHours: [9, 18],
    keywords: ['sydney', 'シドニー', 'aest', 'aedt', 'australia', 'オーストラリア'],
  },
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
