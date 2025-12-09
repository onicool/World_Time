// src/app.tsx
import { Hono } from 'hono';
import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from './components/Layout';
import { Home, type TimeRow } from './components/Home';
import {
  timeZones,
  defaultBaseZoneId,
  defaultTargetZoneIds,
  type TimeZoneDef,
} from './data/timeZones';
import { format, parseISO, addMinutes } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// Hono の Context に title を追加
type Variables = {
  title: string;
};

const app = new Hono<{ Variables: Variables }>();

// 共通レイアウト
app.use(
  '*',
  jsxRenderer(({ children }, c) => {
    const title = c.get('title') || 'タイトル未設定';
    return <Layout title={title}>{children}</Layout>;
  })
);

// ヘルスチェック
app.get('/health', (c) => c.text('OK'));

// メインページ
app.get('/', (c) => {
  const requestUrl = new URL(c.req.url);

  // クエリから取得（なければ現在日時を基準にデフォルト値）
  const now = new Date();
  const defaultDate = format(now, 'yyyy-MM-dd');
  const defaultTime = format(now, 'HH:mm');
  
  // デフォルトの終了時刻は開始時刻の8時間後
  const defaultEndDate = addMinutes(now, 8 * 60);
  const defaultEndTime = format(defaultEndDate, 'HH:mm');

  const baseDate = requestUrl.searchParams.get('date') || defaultDate;
  const baseTime = requestUrl.searchParams.get('time') || defaultTime;
  const baseEndTime = requestUrl.searchParams.get('endTime') || defaultEndTime;
  const baseZoneId = requestUrl.searchParams.get('baseZone') || defaultBaseZoneId;

  const searchQuery =
    requestUrl.searchParams.get('q') ||
    requestUrl.searchParams.get('query') ||
    requestUrl.searchParams.get('keyword');

  // 複数選択された zones
  const selectedZoneIdsFromQuery = requestUrl.searchParams.getAll('zones');
  const suggestedZoneIds =
    searchQuery && searchQuery.trim().length > 0
      ? suggestZoneIdsFromQuery(searchQuery, timeZones)
      : [];
  const selectedZoneIds =
    selectedZoneIdsFromQuery.length > 0
      ? selectedZoneIdsFromQuery
      : suggestedZoneIds.length > 0
      ? suggestedZoneIds
      : defaultTargetZoneIds;

  // 基準開始日時を UTC に変換
  const baseLocalStartString = `${baseDate}T${baseTime}:00`;
  const baseUtcStart = fromZonedTime(baseLocalStartString, baseZoneId);

  // 基準終了日時を UTC に変換
  const baseLocalEndString = `${baseDate}T${baseEndTime}:00`;
  const baseUtcEnd = fromZonedTime(baseLocalEndString, baseZoneId);

  // 表示対象のタイムゾーン一覧（基準タイムゾーンを含めてユニーク化）
  const uniqueZoneIds = Array.from(
    new Set<string>([baseZoneId, ...selectedZoneIds])
  );

  const rows: TimeRow[] = uniqueZoneIds
    .map((zoneId) => {
      const def = findTimeZoneDef(zoneId, timeZones);
      const label = def?.label ?? zoneId;

      // 開始時刻
      const zonedStart = toZonedTime(baseUtcStart, zoneId);
      const localDate = format(zonedStart, 'yyyy-MM-dd');
      const localTime = format(zonedStart, 'HH:mm');

      // 終了時刻
      const zonedEnd = toZonedTime(baseUtcEnd, zoneId);
      const localEndTime = format(zonedEnd, 'HH:mm');

      // 基準日の Date オブジェクト（日付のみ)と比較して dayDiff を算出
      const baseDateObj = parseISO(baseDate);
      const targetDateObj = parseISO(localDate);

      const millisPerDay = 24 * 60 * 60 * 1000;
      const dayDiff = Math.round(
        (targetDateObj.getTime() - baseDateObj.getTime()) / millisPerDay
      );

      // 勤務時間帯かどうか（開始時刻で判定）
      const hour = Number(format(zonedStart, 'H'));
      const [start, end] = def?.workHours ?? [9, 18];
      const isWorkingHours = hour >= start && hour < end;

      const isBase = zoneId === baseZoneId;

      const row: TimeRow = {
        zoneId,
        label,
        localDate,
        localTime,
        localEndTime,
        isWorkingHours,
        isBase,
        dayDiff,
      };

      return row;
    })
    // 見やすさのため、基準タイムゾーンを先頭に、その後アルファベット順にソート
    .sort((a, b) => {
      if (a.isBase && !b.isBase) return -1;
      if (!a.isBase && b.isBase) return 1;
      return a.zoneId.localeCompare(b.zoneId);
    });

  // title を context にセット
  c.set('title', '国際時間変換ツール');

  return c.render(
    <Home
      baseDate={baseDate}
      baseTime={baseTime}
      baseEndTime={baseEndTime}
      baseZoneId={baseZoneId}
      allTimeZones={timeZones}
      selectedZoneIds={selectedZoneIds}
      rows={rows}
    />
  );
});

// タイムゾーン定義の検索（なければ undefined）
function findTimeZoneDef(
  id: string,
  all: TimeZoneDef[]
): TimeZoneDef | undefined {
  return all.find((tz) => tz.id === id);
}

// 検索ワードから候補のタイムゾーンを推定
function suggestZoneIdsFromQuery(query: string, all: TimeZoneDef[]): string[] {
  const normalized = query.toLowerCase();

  const matchedIds = all
    .filter((tz) =>
      (tz.keywords ?? []).some((keyword) =>
        normalized.includes(keyword.toLowerCase())
      )
    )
    .map((tz) => tz.id);

  return Array.from(new Set(matchedIds));
}

export default app;