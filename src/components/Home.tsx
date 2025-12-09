// src/components/Home.tsx
import type { FC } from 'hono/jsx';
import type { TimeZoneDef } from '../data/timeZones';

export type TimeRow = {
  zoneId: string;
  label: string;
  localDate: string;
  localTime: string;
  localEndTime: string;
  isWorkingHours: boolean;
  isBase: boolean;
  dayDiff: number;
};

type HomeProps = {
  baseDate: string;
  baseTime: string;
  baseEndTime: string;
  baseZoneId: string;
  allTimeZones: TimeZoneDef[];
  selectedZoneIds: string[];
  rows: TimeRow[];
};

type PercentageSegment = {
  start: number;
  end: number;
};

// 時刻（HH:mm）から時間の数値（0-24）を取得
function timeToHours(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
}

// 時刻（HH:mm）から分単位（0-1440）を取得
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function buildNonSelectedSegments(segments: PercentageSegment[]): PercentageSegment[] {
  const sorted = [...segments].sort((a, b) => a.start - b.start);
  const result: PercentageSegment[] = [];

  let cursor = 0;

  for (const segment of sorted) {
    if (segment.start > cursor) {
      result.push({ start: cursor, end: segment.start });
    }

    cursor = Math.max(cursor, segment.end);
  }

  if (cursor < 100) {
    result.push({ start: cursor, end: 100 });
  }

  return result;
}

export const Home: FC<HomeProps> = ({
  baseDate,
  baseTime,
  baseEndTime,
  baseZoneId,
  allTimeZones,
  selectedZoneIds,
  rows,
}) => {
  const startMinutes = timeToMinutes(baseTime);
  const endMinutes = timeToMinutes(baseEndTime);

  // 24時間ラベル（0, 3, 6, 9, 12, 15, 18, 21）
  const timeLabels = ['0', '3', '6', '9', '12', '15', '18', '21', '24'];

  return (
    <div class="space-y-6">
      {/* 基準時間指定パネル */}
      <section class="rounded-2xl bg-white p-6 shadow-sm">
        <h2 class="mb-6 text-lg font-semibold text-gray-800">基準時間指定</h2>
        <form method="get" class="space-y-6" id="timeForm">
          <div class="grid gap-4 lg:grid-cols-3">
            {/* 基準日 */}
            <div class="lg:col-span-1">
              <label class="mb-2 block text-sm font-medium text-gray-700">基準日</label>
              <input
                type="date"
                name="date"
                id="dateInput"
                value={baseDate}
                class="w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 基準タイムゾーン */}
            <div class="lg:col-span-1">
              <label class="mb-2 block text-sm font-medium text-gray-700">基準タイムゾーン</label>
              <select
                name="baseZone"
                id="baseZoneSelect"
                value={baseZoneId}
                class="w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {allTimeZones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 時刻入力 */}
            <div class="lg:col-span-1">
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700">時刻範囲</label>
                <div class="flex items-center gap-2 text-base font-semibold">
                  <button
                    type="button"
                    id="startTimeDisplay"
                    class="rounded-lg bg-blue-50 px-3 py-1 font-mono text-blue-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {baseTime}
                  </button>
                  <span class="text-gray-400">〜</span>
                  <button
                    type="button"
                    id="endTimeDisplay"
                    class="rounded-lg bg-blue-50 px-3 py-1 font-mono text-blue-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {baseEndTime}
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <label class="flex flex-col gap-1 text-xs font-medium text-gray-600">
                  <span>開始</span>
                  <input
                    type="time"
                    step="60"
                    min="00:00"
                    max="23:59"
                    id="startTimeInput"
                    name="time"
                    value={baseTime}
                    class="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-3 text-2xl font-semibold tracking-tight text-blue-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label class="flex flex-col gap-1 text-xs font-medium text-gray-600">
                  <span>終了</span>
                  <input
                    type="time"
                    step="60"
                    min="00:00"
                    max="23:59"
                    id="endTimeInput"
                    name="endTime"
                    value={baseEndTime}
                    class="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-3 text-2xl font-semibold tracking-tight text-blue-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 時刻範囲スライダー */}
          <div>
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <span>スライダーで範囲を調整（5分単位）</span>
              </div>
              <div class="hidden text-lg font-semibold sm:block">
                <span id="startTimeSummary" class="font-mono text-blue-600">{baseTime}</span>
                <span class="mx-2 text-gray-400">〜</span>
                <span id="endTimeSummary" class="font-mono text-blue-600">{baseEndTime}</span>
              </div>
            </div>

            {/* カスタムスライダーコンテナ */}
            <div
              id="rangeSliderContainer"
              class="relative select-none"
              style="height: 70px; padding: 10px 0;"
            >
              {/* ベースバー（グラデーション＋マスク＋グリッド） */}
              <div
                class="absolute left-0 right-0 rounded border border-gray-300 overflow-hidden"
                style={{
                  top: '15px',
                  height: '32px',
                  position: 'absolute',
                }}
              >
                {/* グラデーションレイヤー */}
                <div
                  class="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right,\
                        #3b5998 0%,\
                        #4a6ba8 12.5%,\
                        #5a7db8 25%,\
                        #a8c8e0 37.5%,\
                        #e8f0f8 50%,\
                        #f0d8b8 62.5%,\
                        #d8b090 75%,\
                        #8090a0 87.5%,\
                        #3b5998 100%\
                      )',
                  }}
                />

                {/* 白マスクレイヤー：JS から maskImage を書き換えて「穴」を開ける */}
                <div
                  id="whiteMask"
                  class="absolute inset-0 bg-white pointer-events-none"
                />

                {/* グリッド線（3時間刻み） */}
                {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                  <div
                    key={hour}
                    class="absolute top-0 bottom-0 w-px bg-gray-300"
                    style={{ left: `${(hour / 24) * 100}%` }}
                  />
                ))}
              </div>

              {/* 選択範囲のドラッグ領域（見た目は透明） */}
              <div
                id="rangeHighlight"
                class="absolute"
                style={{
                  top: '15px',
                  height: '32px',
                  left: `${(startMinutes / 1440) * 100}%`,
                  width: `${((endMinutes - startMinutes) / 1440) * 100}%`,
                  cursor: 'grab',
                }}
              />

              {/* ここに startThumb / endThumb など既存のつまみ要素 */}
              <div
                id="startThumb"
                class="absolute bg-white border border-blue-500 shadow rounded-md"
                style={{
                  top: '15px',
                  height: '32px',
                  width: '10px',
                  left: `${(startMinutes / 1440) * 100}%`,
                  transform: 'translate(-50%, 0)',
                }}
              />
              <div
                id="endThumb"
                class="absolute bg-white border border-blue-500 shadow rounded-md"
                style={{
                  top: '15px',
                  height: '32px',
                  width: '10px',
                  left: `${(endMinutes / 1440) * 100}%`,
                  transform: 'translate(-50%, 0)',
                }}
              />
            </div>


            {/* 時刻ラベル */}
            <div class="flex justify-between text-xs text-gray-500" style="padding: 0 2px;">
              {timeLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </form>
      </section>

      {/* 比較したいタイムゾーンパネル */}
      <section class="rounded-xl bg-white p-4 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-gray-800">比較したいタイムゾーン</h2>
          <button
            id="addTimezoneBtn"
            type="button"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + 他のタイムゾーンを追加
          </button>
        </div>
        
        {/* 選択中のタイムゾーン一覧（チェックボックス） */}
        <div id="timezoneCheckboxes" class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 mb-4">
          {allTimeZones.map((tz) => {
            const checked =
              tz.id === baseZoneId || selectedZoneIds.includes(tz.id);

            return (
              <label
                key={tz.id}
                class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  name="zones"
                  value={tz.id}
                  checked={checked}
                  class="timezone-checkbox"
                />
                <span>{tz.label}</span>
              </label>
            );
          })}
        </div>

        {/* 追加タイムゾーン選択ドロップダウン（初期は非表示） */}
        <div id="addTimezonePanel" class="hidden mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            タイムゾーンを選択
          </label>
          <select
            id="additionalTimezoneSelect"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- 選択してください --</option>
            {allTimeZones.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 結果表示 */}
      <section class="rounded-xl bg-white p-4 shadow-sm">
        <h2 class="mb-4 text-base font-semibold text-gray-800">
          変換結果
        </h2>
        <div id="resultsContainer" class="space-y-4">
          {rows.map((row) => {
            const baseBadge = row.isBase ? (
              <span class="ml-2 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                基準
              </span>
            ) : null;

            const dayDiffLabel =
              row.dayDiff === 0
                ? '同日'
                : row.dayDiff === 1
                ? '翌日'
                : row.dayDiff === -1
                ? '前日'
                : row.dayDiff > 1
                ? `+${row.dayDiff}日`
                : `${row.dayDiff}日`;

            const rowStartMinutes = timeToMinutes(row.localTime);
            const rowEndMinutes = timeToMinutes(row.localEndTime);

            return (
              <div
                key={row.zoneId}
                class="rounded-lg p-4 border border-gray-200 bg-white"
              >
                <div class="flex flex-wrap items-center justify-between gap-3 mb-3 text-sm text-gray-700">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900">
                      {row.label}
                    </span>
                    <span class="text-xs text-gray-500">{row.zoneId}</span>
                    {baseBadge}
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-base font-semibold text-gray-900">
                    <span class="font-mono">{row.localTime}</span>
                    <span class="text-gray-400">〜</span>
                    <span class="font-mono">{row.localEndTime}</span>
                    <span class="text-xs font-medium text-gray-500">{row.localDate}</span>
                    <span class="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700">{dayDiffLabel}</span>
                  </div>
                </div>

                {/* タイムゾーンごとのスライダー（表示のみ） */}
                {(() => {
                  const rowStartMinutes = timeToMinutes(row.localTime);
                  const rowEndMinutes = timeToMinutes(row.localEndTime);
                  const isOverMidnight = rowStartMinutes > rowEndMinutes;

                  const rowStartPercent = (rowStartMinutes / 1440) * 100;
                  const rowEndPercent = (rowEndMinutes / 1440) * 100;

                  const selectedSegments: PercentageSegment[] = isOverMidnight
                    ? [
                        { start: rowStartPercent, end: 100 },
                        { start: 0, end: rowEndPercent },
                      ]
                    : [{ start: rowStartPercent, end: rowEndPercent }];

                  const nonSelectedSegments = buildNonSelectedSegments(
                    selectedSegments,
                  );

                  return (
                    <div class="relative" style="height: 45px;">
                      {/* ベースバー（グラデーション固定） */}
                      <div
                        class="absolute left-0 right-0 rounded border border-gray-300 overflow-hidden"
                        style={{
                          top: '0',
                          height: '32px',
                        }}
                      >
                        {/* グラデーションレイヤー */}
                        <div
                          class="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(to right,\
                                #3b5998 0%,\
                                #4a6ba8 12.5%,\
                                #5a7db8 25%,\
                                #a8c8e0 37.5%,\
                                #e8f0f8 50%,\
                                #f0d8b8 62.5%,\
                                #d8b090 75%,\
                                #8090a0 87.5%,\
                                #3b5998 100%\
                              )',
                          }}
                        />

                        {/* 非選択範囲を白で覆う */}
                        {nonSelectedSegments.map((segment, index) => (
                          <div
                            key={index}
                            class="absolute bg-white"
                            style={{
                              top: '0',
                              height: '32px',
                              left: `${segment.start}%`,
                              width: `${segment.end - segment.start}%`,
                              zIndex: 2,
                            }}
                          />
                        ))}

                        {/* グリッド線（3時間刻み） */}
                        {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                          <div
                            key={hour}
                            class="absolute top-0 bottom-0 w-px bg-gray-300"
                            style={{ left: `${(hour / 24) * 100}%`, zIndex: 3 }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}


                {/* 時刻ラベル */}
                <div class="flex justify-between text-xs text-gray-400 mt-1" style="padding: 0 2px;">
                  {timeLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* カスタムスライダー操作用スクリプト */}
        <script
  dangerouslySetInnerHTML={{
    __html: `
          (function() {
            const container = document.getElementById('rangeSliderContainer');
            const startThumb = document.getElementById('startThumb');
            const endThumb = document.getElementById('endThumb');
            const rangeHighlight = document.getElementById('rangeHighlight');
            const startTimeInput = document.getElementById('startTimeInput');
            const endTimeInput = document.getElementById('endTimeInput');
            const startTimeDisplay = document.getElementById('startTimeDisplay');
            const endTimeDisplay = document.getElementById('endTimeDisplay');
            const startTimeSummary = document.getElementById('startTimeSummary');
            const endTimeSummary = document.getElementById('endTimeSummary');
            const addTimezoneBtn = document.getElementById('addTimezoneBtn');
            const addTimezonePanel = document.getElementById('addTimezonePanel');
            const additionalTimezoneSelect = document.getElementById('additionalTimezoneSelect');
            const timezoneCheckboxes = document.querySelectorAll('.timezone-checkbox');
            const dateInput = document.getElementById('dateInput');
            const baseZoneSelect = document.getElementById('baseZoneSelect');
            const form = document.getElementById('timeForm');
            const whiteMask = document.getElementById('whiteMask');

            const MAX_MINUTES = 1439;

            const savedScroll = sessionStorage.getItem('scrollPosition');
            if (savedScroll !== null) {
              requestAnimationFrame(() => {
                window.scrollTo(0, Number(savedScroll));
                sessionStorage.removeItem('scrollPosition');
              });
            }

            // 必要な要素がなければ何もしない
            if (
              !container ||
              !startThumb ||
              !endThumb ||
              !rangeHighlight ||
              !startTimeInput ||
              !endTimeInput ||
              !startTimeDisplay ||
              !endTimeDisplay ||
              !form ||
              !whiteMask
            ) {
              return;
            }

            // TS 側から埋め込まれる初期値
            let startMinutes = ${startMinutes};
            let endMinutes = ${endMinutes};

            let isDragging = false;
            // 'start' | 'end' | 'range'
            let dragMode = null;
            let rangeDragStartX = 0;
            let rangeStartMinutesAtDragStart = 0;
            let rangeEndMinutesAtDragStart = 0;

            function minutesToTime(minutes) {
              const hours = Math.floor(minutes / 60);
              const mins = minutes % 60;
              return hours.toString().padStart(2, '0') + ':' + mins.toString().padStart(2, '0');
            }

            // 白いマスクに「選択範囲だけ穴を開ける」ための mask-image を設定
            function updateWhiteMask(startPercent, endPercent) {
              // startPercent, endPercent は 0〜100 の範囲
              // 未選択部分（0〜start, end〜100）は黒＝白が見える
              // 選択部分（start〜end）は透明＝穴が開いて下のグラデーションが見える
              const mask =
                'linear-gradient(to right,' +
                'black 0%,' +
                'black ' + startPercent + '%,' +
                'transparent ' + startPercent + '%,' +
                'transparent ' + endPercent + '%,' +
                'black ' + endPercent + '%,' +
                'black 100%)';

              whiteMask.style.webkitMaskImage = mask;
              whiteMask.style.maskImage = mask;
            }

            function updateDisplay() {
              // 自動入れ替え（開始 > 終了ならスワップ）
              if (startMinutes > endMinutes) {
                const tmp = startMinutes;
                startMinutes = endMinutes;
                endMinutes = tmp;
              }

              const startPercent = (startMinutes / 1440) * 100;
              const endPercent = (endMinutes / 1440) * 100;

              // つまみとドラッグ領域の位置・幅を更新
              startThumb.style.left = startPercent + '%';
              endThumb.style.left = endPercent + '%';
              rangeHighlight.style.left = startPercent + '%';
              rangeHighlight.style.width = (endPercent - startPercent) + '%';

              // 白マスクに「穴」を開ける
              updateWhiteMask(startPercent, endPercent);

              const startTime = minutesToTime(startMinutes);
              const endTime = minutesToTime(endMinutes);

              startTimeInput.value = startTime;
              endTimeInput.value = endTime;
              startTimeDisplay.textContent = startTime;
              endTimeDisplay.textContent = endTime;
              if (startTimeSummary) startTimeSummary.textContent = startTime;
              if (endTimeSummary) endTimeSummary.textContent = endTime;
            }

            async function autoSubmit() {
              const formData = new FormData(form);

              const params = new URLSearchParams(formData);
              const newQuery = params.toString();
              const currentQuery = window.location.search.replace(/^\\?/, '');

              // すでに同じクエリで表示中ならリロードしない
              if (newQuery === currentQuery) {
                return;
              }

              const url = '?' + newQuery;
              sessionStorage.setItem('scrollPosition', String(window.scrollY));

              try {
                const response = await fetch(url, {
                  headers: { 'X-Requested-With': 'fetch' },
                });

                if (!response.ok) {
                  throw new Error('Failed to update');
                }

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const newResults = doc.getElementById('resultsContainer');
                const currentResults = document.getElementById('resultsContainer');

                if (newResults && currentResults && currentResults.parentNode) {
                  currentResults.parentNode.replaceChild(newResults, currentResults);
                }

                history.replaceState(null, '', url);
              } catch (error) {
                window.location.search = url;
              }
            }

            function getMinutesFromEvent(e) {
              const rect = container.getBoundingClientRect();
              const clientX =
                e.clientX ||
                (e.touches && e.touches[0] && e.touches[0].clientX);
              if (clientX == null) return 0;

              const x = clientX - rect.left;
              const percent = Math.max(0, Math.min(1, x / rect.width));
              // 5分単位に丸める
              const minutes = Math.round((percent * 1440) / 5) * 5;
              return Math.max(0, Math.min(MAX_MINUTES, minutes));
            }

            function handleStart(e, mode) {
              isDragging = true;
              dragMode = mode; // 'start' | 'end'
              e.preventDefault();
            }

            function handleMove(e) {
              if (!isDragging || !dragMode) return;

              if (dragMode === 'start' || dragMode === 'end') {
                const minutes = getMinutesFromEvent(e);

                if (dragMode === 'start') {
                  startMinutes = minutes;
                } else {
                  endMinutes = minutes;
                }

                updateDisplay();
                e.preventDefault();
                return;
              }

              if (dragMode === 'range') {
                const rect = container.getBoundingClientRect();
                const clientX =
                  e.clientX ||
                  (e.touches && e.touches[0] && e.touches[0].clientX);
                if (clientX == null) return;

                const dx = clientX - rangeDragStartX;

                // スライダー全幅 = 1440分に対応
                let deltaMinutes = (dx / rect.width) * 1440;
                // 5分単位に丸める
                deltaMinutes = Math.round(deltaMinutes / 5) * 5;

                const originalRange =
                  rangeEndMinutesAtDragStart - rangeStartMinutesAtDragStart;

                let newStart = rangeStartMinutesAtDragStart + deltaMinutes;
                let newEnd = rangeEndMinutesAtDragStart + deltaMinutes;

                // 0〜MAX_MINUTES の範囲に収める（間隔は維持）
                if (newStart < 0) {
                  newStart = 0;
                  newEnd = originalRange;
                } else if (newEnd > MAX_MINUTES) {
                  newEnd = MAX_MINUTES;
                  newStart = MAX_MINUTES - originalRange;
                }

                startMinutes = newStart;
                endMinutes = newEnd;

                updateDisplay();
                e.preventDefault();
                return;
              }
            }

            function handleEnd() {
              if (!isDragging) return;
              isDragging = false;
              dragMode = null;

              // ドラッグ終了時に自動送信
              autoSubmit();
            }

            // --- スライダー: つまみドラッグ ---

            // マウス
            startThumb.addEventListener('mousedown', function (e) {
              handleStart(e, 'start');
            });
            endThumb.addEventListener('mousedown', function (e) {
              handleStart(e, 'end');
            });

            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);

            // タッチ
            startThumb.addEventListener(
              'touchstart',
              function (e) {
                handleStart(e, 'start');
              },
              { passive: false }
            );
            endThumb.addEventListener(
              'touchstart',
              function (e) {
                handleStart(e, 'end');
              },
              { passive: false }
            );

            document.addEventListener('touchmove', handleMove, {
              passive: false,
            });
            document.addEventListener('touchend', handleEnd);

            // --- スライダー: 範囲（ハイライト）ドラッグ ---

            rangeHighlight.addEventListener('mousedown', function (e) {
              isDragging = true;
              dragMode = 'range';
              rangeDragStartX = e.clientX;
              rangeStartMinutesAtDragStart = startMinutes;
              rangeEndMinutesAtDragStart = endMinutes;
              e.preventDefault();
            });

            rangeHighlight.addEventListener(
              'touchstart',
              function (e) {
                if (!e.touches || !e.touches[0]) return;
                isDragging = true;
                dragMode = 'range';
                rangeDragStartX = e.touches[0].clientX;
                rangeStartMinutesAtDragStart = startMinutes;
                rangeEndMinutesAtDragStart = endMinutes;
                e.preventDefault();
              },
              { passive: false }
            );

            // --- 時刻入力欄を直接変更したとき ---

            function parseTimeToMinutes(value) {
              const m = /^([0-2]\\d):([0-5]\\d)$/.exec(value || '');
              if (!m) return null;
              const h = parseInt(m[1], 10);
              const mi = parseInt(m[2], 10);
              if (h < 0 || h >= 24) return null;
              return h * 60 + mi;
            }

            startTimeInput.addEventListener('change', function () {
              const minutes = parseTimeToMinutes(startTimeInput.value);
              if (minutes !== null) {
                startMinutes = minutes;
                updateDisplay();
                autoSubmit();
              } else {
                // 不正入力なら表示を戻す
                startTimeInput.value = minutesToTime(startMinutes);
              }
            });

            endTimeInput.addEventListener('change', function () {
              const minutes = parseTimeToMinutes(endTimeInput.value);
              if (minutes !== null) {
                endMinutes = minutes;
                updateDisplay();
                autoSubmit();
              } else {
                endTimeInput.value = minutesToTime(endMinutes);
              }
            });

            if (startTimeDisplay) {
              startTimeDisplay.addEventListener('click', function () {
                if (startTimeInput && startTimeInput.focus) {
                  startTimeInput.focus();
                  if (startTimeInput.select) startTimeInput.select();
                }
              });
            }

            if (endTimeDisplay) {
              endTimeDisplay.addEventListener('click', function () {
                if (endTimeInput && endTimeInput.focus) {
                  endTimeInput.focus();
                  if (endTimeInput.select) endTimeInput.select();
                }
              });
            }

            // --- タイムゾーン追加ボタンのトグル ---

            if (addTimezoneBtn && addTimezonePanel) {
              addTimezoneBtn.addEventListener('click', function () {
                addTimezonePanel.classList.toggle('hidden');
              });
            }

            // --- タイムゾーン追加セレクト ---

            if (additionalTimezoneSelect) {
              additionalTimezoneSelect.addEventListener('change', function (e) {
                const target = e.target;
                if (!target || !target.value) return;

                const value = target.value;
                const selector = '.timezone-checkbox[value="' + value + '"]';
                const checkbox = document.querySelector(selector);

                if (checkbox && !checkbox.checked) {
                  checkbox.checked = true;
                  autoSubmit();
                }

                // 選択をクリア
                target.value = '';
              });
            }

            // --- タイムゾーンのチェックボックス変更で自動送信 ---

            if (timezoneCheckboxes && timezoneCheckboxes.forEach) {
              timezoneCheckboxes.forEach(function (cb) {
                cb.addEventListener('change', function () {
                  autoSubmit();
                });
              });
            }

            // --- 日付・基準タイムゾーンの変更で自動送信 ---

            if (dateInput) {
              dateInput.addEventListener('change', function () {
                autoSubmit();
              });
            }

            if (baseZoneSelect) {
              baseZoneSelect.addEventListener('change', function () {
                const selector = '.timezone-checkbox[value="' + baseZoneSelect.value + '"]';
                const checkbox = document.querySelector(selector);
                if (checkbox) {
                  checkbox.checked = true;
                }
                autoSubmit();
              });
            }

            // 初期表示：UI だけ整える（送信はしない）
            updateDisplay();
          })();
        `,
  }}
/>

    </div>
  );
};