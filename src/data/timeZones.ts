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
  {
    id: 'Asia/Seoul',
    label: 'ソウル (KST)',
    workHours: [9, 18],
    keywords: ['seoul', 'kst', '韓国', 'ソウル'],
  },
  {
    id: 'Asia/Shanghai',
    label: '北京 (CST)',
    workHours: [9, 18],
    keywords: ['beijing', '北京', 'china', '中国', 'shanghai', 'cst'],
  },
  {
    id: 'Asia/Hong_Kong',
    label: '香港 (HKT)',
    workHours: [9, 18],
    keywords: ['hong kong', '香港', 'hkt'],
  },
  {
    id: 'Asia/Taipei',
    label: '台北 (CST)',
    workHours: [9, 18],
    keywords: ['taipei', '台北', 'taiwan', '台湾', 'cst'],
  },
  {
    id: 'Asia/Kuala_Lumpur',
    label: 'クアラルンプール (MYT)',
    workHours: [9, 18],
    keywords: ['kuala lumpur', 'myt', 'malaysia', 'マレーシア'],
  },
  {
    id: 'Asia/Bangkok',
    label: 'バンコク (ICT)',
    workHours: [9, 18],
    keywords: ['bangkok', 'タイ', 'ict'],
  },
  {
    id: 'Asia/Jakarta',
    label: 'ジャカルタ (WIB)',
    workHours: [9, 18],
    keywords: ['jakarta', 'インドネシア', 'wib'],
  },
  {
    id: 'Asia/Manila',
    label: 'マニラ (PST)',
    workHours: [9, 18],
    keywords: ['manila', 'philippines', 'フィリピン', 'pst'],
  },
  {
    id: 'Asia/Dubai',
    label: 'ドバイ (GST)',
    workHours: [9, 18],
    keywords: ['dubai', 'uae', 'アラブ首長国連邦', 'gst'],
  },
  {
    id: 'Asia/Kolkata',
    label: 'コルカタ (IST)',
    workHours: [9, 18],
    keywords: ['india', 'インド', 'kolkata', 'ist'],
  },
  {
    id: 'Europe/Berlin',
    label: 'ベルリン (CET/CEST)',
    workHours: [9, 18],
    keywords: ['berlin', 'ドイツ', 'germany', 'cet', 'cest'],
  },
  {
    id: 'Europe/Rome',
    label: 'ローマ (CET/CEST)',
    workHours: [9, 18],
    keywords: ['rome', 'イタリア', 'italy', 'cet', 'cest'],
  },
  {
    id: 'Europe/Madrid',
    label: 'マドリード (CET/CEST)',
    workHours: [9, 18],
    keywords: ['madrid', 'スペイン', 'spain', 'cet', 'cest'],
  },
  {
    id: 'Europe/Moscow',
    label: 'モスクワ (MSK)',
    workHours: [9, 18],
    keywords: ['moscow', 'モスクワ', 'russia', 'ロシア', 'msk'],
  },
  {
    id: 'Europe/Istanbul',
    label: 'イスタンブール (TRT)',
    workHours: [9, 18],
    keywords: ['istanbul', 'トルコ', 'turkey', 'trt'],
  },
  {
    id: 'Europe/Warsaw',
    label: 'ワルシャワ (CET/CEST)',
    workHours: [9, 18],
    keywords: ['warsaw', 'ポーランド', 'poland', 'cet', 'cest'],
  },
  {
    id: 'Europe/Athens',
    label: 'アテネ (EET/EEST)',
    workHours: [9, 18],
    keywords: ['athens', 'ギリシャ', 'greece', 'eet', 'eest'],
  },
  {
    id: 'Europe/Stockholm',
    label: 'ストックホルム (CET/CEST)',
    workHours: [9, 18],
    keywords: ['stockholm', 'スウェーデン', 'sweden', 'cet', 'cest'],
  },
  {
    id: 'America/Toronto',
    label: 'トロント (EST/EDT)',
    workHours: [9, 18],
    keywords: ['toronto', 'カナダ', 'canada', 'est', 'edt'],
  },
  {
    id: 'America/Chicago',
    label: 'シカゴ (CST/CDT)',
    workHours: [9, 18],
    keywords: ['chicago', 'cst', 'cdt', 'usa', 'アメリカ'],
  },
  {
    id: 'America/Denver',
    label: 'デンバー (MST/MDT)',
    workHours: [9, 18],
    keywords: ['denver', 'mst', 'mdt', 'usa', 'アメリカ'],
  },
  {
    id: 'America/Phoenix',
    label: 'フェニックス (MST)',
    workHours: [9, 18],
    keywords: ['phoenix', 'mst', 'usa', 'アリゾナ'],
  },
  {
    id: 'America/Vancouver',
    label: 'バンクーバー (PST/PDT)',
    workHours: [9, 18],
    keywords: ['vancouver', 'canada', 'カナダ', 'pst', 'pdt'],
  },
  {
    id: 'America/Mexico_City',
    label: 'メキシコシティ (CST/CDT)',
    workHours: [9, 18],
    keywords: ['mexico city', 'メキシコ', 'cst', 'cdt'],
  },
  {
    id: 'America/Bogota',
    label: 'ボゴタ (COT)',
    workHours: [9, 18],
    keywords: ['bogota', 'コロンビア', 'cot', 'colombia'],
  },
  {
    id: 'America/Lima',
    label: 'リマ (PET)',
    workHours: [9, 18],
    keywords: ['lima', 'peru', 'ペルー', 'pet'],
  },
  {
    id: 'America/Santiago',
    label: 'サンティアゴ (CLT/CLST)',
    workHours: [9, 18],
    keywords: ['santiago', 'チリ', 'chile', 'clt', 'clst'],
  },
  {
    id: 'America/Sao_Paulo',
    label: 'サンパウロ (BRT)',
    workHours: [9, 18],
    keywords: ['sao paulo', 'ブラジル', 'brazil', 'brt'],
  },
  {
    id: 'America/Argentina/Buenos_Aires',
    label: 'ブエノスアイレス (ART)',
    workHours: [9, 18],
    keywords: ['buenos aires', 'アルゼンチン', 'argentina', 'art'],
  },
  {
    id: 'Africa/Cairo',
    label: 'カイロ (EET)',
    workHours: [9, 18],
    keywords: ['cairo', 'egypt', 'エジプト', 'eet'],
  },
  {
    id: 'Africa/Johannesburg',
    label: 'ヨハネスブルグ (SAST)',
    workHours: [9, 18],
    keywords: ['johannesburg', '南アフリカ', 'south africa', 'sast'],
  },
  {
    id: 'Africa/Nairobi',
    label: 'ナイロビ (EAT)',
    workHours: [9, 18],
    keywords: ['nairobi', 'ケニア', 'kenya', 'eat'],
  },
  {
    id: 'Pacific/Auckland',
    label: 'オークランド (NZST/NZDT)',
    workHours: [9, 18],
    keywords: ['auckland', 'ニュージーランド', 'new zealand', 'nzst', 'nzdt'],
  },
  {
    id: 'Pacific/Honolulu',
    label: 'ホノルル (HST)',
    workHours: [9, 18],
    keywords: ['honolulu', 'ハワイ', 'hawaii', 'hst'],
  },
  {
    id: 'Pacific/Fiji',
    label: 'フィジー (FJT/FJST)',
    workHours: [9, 18],
    keywords: ['fiji', 'フィジー', 'fjt', 'fjst'],
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
