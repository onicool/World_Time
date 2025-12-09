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
  availableTimeZones: TimeZoneDef[];
  selectedZoneIds: string[];
  rows: TimeRow[];
};

// 時刻（HH:mm）から分単位（0-1440）を取得
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export const Home: FC<HomeProps> = ({
  baseDate,
  baseTime,
  baseEndTime,
  baseZoneId,
  allTimeZones,
  availableTimeZones,
  selectedZoneIds,
  rows,
}) => {
  const startMinutes = timeToMinutes(baseTime);
  const endMinutes = timeToMinutes(baseEndTime);

  // 24時間ラベル（0, 3, 6, 9, 12, 15, 18, 21）
  const timeLabels = ['0', '3', '6', '9', '12', '15', '18', '21', '24'];

  const selectedTimeZones = allTimeZones.filter(
    (tz) => tz.id === baseZoneId || selectedZoneIds.includes(tz.id)
  );

  return (
    <div class="space-y-6">
      {/* 基準時間指定パネル */}
      <section class="rounded-2xl bg-white p-6 shadow-sm">
        <h2 class="mb-6 text-lg font-semibold text-gray-800">基準日時</h2>
        <form method="get" class="space-y-6" id="timeForm">
          <div class="grid gap-4 lg:grid-cols-3">
            {/* 基準タイムゾーン */}
            <div class="lg:col-span-1">
              <label class="mb-2 block text-sm font-medium text-gray-700">基準タイムゾーン</label>
              <select
                name="baseZone"
                id="baseZoneSelect"
                value={baseZoneId}
                class="w-full h-12 rounded-lg border border-gray-300 px-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {allTimeZones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 基準日 */}
            <div class="lg:col-span-1">
              <label class="mb-2 block text-sm font-medium text-gray-700">基準日</label>
              <input
                type="date"
                name="date"
                id="dateInput"
                value={baseDate}
                class="w-full h-12 rounded-lg border border-gray-300 px-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 時刻入力 */}
            <div class="lg:col-span-1">
              <label class="mb-2 block text-sm font-medium text-gray-700">時刻範囲</label>
              <div class="flex flex-wrap items-center gap-3">
                <label class="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span class="whitespace-nowrap">開始</span>
                  <input
                    type="time"
                    step="60"
                    min="00:00"
                    max="23:59"
                    id="startTimeInput"
                    name="time"
                    value={baseTime}
                    class="h-12 w-24 rounded-lg border border-blue-200 bg-blue-50 px-3 text-base font-semibold tracking-tight text-blue-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <span class="text-gray-400">〜</span>
                <label class="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span class="whitespace-nowrap">終了</span>
                  <input
                    type="time"
                    step="60"
                    min="00:00"
                    max="23:59"
                    id="endTimeInput"
                    name="endTime"
                    value={baseEndTime}
                    class="h-12 w-24 rounded-lg border border-blue-200 bg-blue-50 px-3 text-base font-semibold tracking-tight text-blue-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 時刻範囲スライダー */}
          <div>
            <div class="mb-3 flex items-center gap-2 text-sm text-gray-700">
              <span>スライダーで範囲を調整（1分単位）</span>
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
        <h2 class="mb-4 text-base font-semibold text-gray-800">比較したいタイムゾーン</h2>

        {/* 選択中のタイムゾーン一覧（チェックボックス） */}
        <div id="timezoneCheckboxes" class="flex flex-wrap gap-2 mb-4">
          {selectedTimeZones.map((tz) => {
            const isBase = tz.id === baseZoneId;
            const checked = isBase || selectedZoneIds.includes(tz.id);

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
                  disabled={isBase}
                  aria-disabled={isBase}
                  class="timezone-checkbox disabled:cursor-not-allowed"
                />
                <span>{tz.label}</span>
                {isBase ? (
                  <span class="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    基準として選択中
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>

        {/* 追加タイムゾーン選択ドロップダウン */}
        <div class="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            タイムゾーンを選択
          </label>
          <select
            id="additionalTimezoneSelect"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- 選択してください --</option>
            {availableTimeZones.map((tz) => (
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
                data-row-id={row.zoneId}
                data-start-minutes={rowStartMinutes}
                data-end-minutes={rowEndMinutes}
                data-day-diff={row.dayDiff}
                data-local-date={row.localDate}
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
                    <span class="font-mono row-start-time">{row.localTime}</span>
                    <span class="text-gray-400">〜</span>
                    <span class="font-mono row-end-time">{row.localEndTime}</span>
                    <span class="text-xs font-medium text-gray-500 row-date">{row.localDate}</span>
                    <span class="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 row-day-diff">{dayDiffLabel}</span>
                  </div>
                </div>

                {/* タイムゾーンごとのスライダー */}
                {row.isBase ? (
                  <div
                    id="baseResultSliderContainer"
                    class="relative select-none"
                    style="height: 60px; padding: 6px 0;"
                  >
                    <div
                      class="absolute left-0 right-0 rounded border border-gray-300 overflow-hidden"
                      style={{
                        top: '8px',
                        height: '32px',
                      }}
                    >
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

                      <div
                        id="resultWhiteMask"
                        class="absolute inset-0 bg-white pointer-events-none result-mask"
                      />

                      {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                        <div
                          key={hour}
                          class="absolute top-0 bottom-0 w-px bg-gray-300"
                          style={{ left: `${(hour / 24) * 100}%` }}
                        />
                      ))}
                    </div>

                    <div
                      id="baseResultRangeHighlight"
                      class="absolute"
                      style={{
                        top: '8px',
                        height: '32px',
                        left: `${(startMinutes / 1440) * 100}%`,
                        width: `${((endMinutes - startMinutes) / 1440) * 100}%`,
                        cursor: 'grab',
                      }}
                    />

                    <div
                      id="baseResultStartThumb"
                      class="absolute bg-white border border-blue-500 shadow rounded-md"
                      style={{
                        top: '8px',
                        height: '32px',
                        width: '10px',
                        left: `${(startMinutes / 1440) * 100}%`,
                        transform: 'translate(-50%, 0)',
                      }}
                    />
                    <div
                      id="baseResultEndThumb"
                      class="absolute bg-white border border-blue-500 shadow rounded-md"
                      style={{
                        top: '8px',
                        height: '32px',
                        width: '10px',
                        left: `${(endMinutes / 1440) * 100}%`,
                        transform: 'translate(-50%, 0)',
                      }}
                    />
                  </div>
                ) : (
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

                      <div class="absolute inset-0 bg-white pointer-events-none result-mask" />

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
                )}


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
            let additionalTimezoneSelect = document.getElementById('additionalTimezoneSelect');
            let timezoneContainer = document.getElementById('timezoneCheckboxes');
            let timezoneCheckboxes = Array.from(
              document.querySelectorAll('.timezone-checkbox')
            );
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

            const sliderInstances = [];

            if (container && startThumb && endThumb && rangeHighlight) {
              sliderInstances.push({
                id: 'primary',
                container,
                startThumb,
                endThumb,
                rangeHighlight,
                mask: whiteMask,
              });
            }

            const essentialElementsPresent =
              form && startTimeInput && endTimeInput && sliderInstances.length > 0;

            // 必要な要素がなければ何もしない
            if (!essentialElementsPresent) {
              return;
            }

            // TS 側から埋め込まれる初期値
            let startMinutes = ${startMinutes};
            let endMinutes = ${endMinutes};

            let baseStartReference = startMinutes;
            let baseEndReference = endMinutes;

            let isDragging = false;
            // 'start' | 'end' | 'range'
            let dragMode = null;
            let activeSlider = null;
            let rangeDragStartX = 0;
            let rangeStartMinutesAtDragStart = 0;
            let rangeEndMinutesAtDragStart = 0;

            function getResultRowStates() {
              const rows = Array.from(
                document.querySelectorAll('[data-row-id]')
              );

              return rows.map((row) => {
                const baseStart = Number(row.dataset.startMinutes || '0');
                const baseEnd = Number(row.dataset.endMinutes || '0');
                const baseDayDiff = Number(row.dataset.dayDiff || '0');
                const baseLocalDate = row.dataset.localDate || '';

                const endDayDiff =
                  baseEnd < baseStart ? baseDayDiff + 1 : baseDayDiff;

                return {
                  element: row,
                  mask: row.querySelector('.result-mask'),
                  startTimeEl: row.querySelector('.row-start-time'),
                  endTimeEl: row.querySelector('.row-end-time'),
                  dateEl: row.querySelector('.row-date'),
                  dayDiffEl: row.querySelector('.row-day-diff'),
                  startOffset: baseStart - baseStartReference,
                  endOffset:
                    baseEnd - baseEndReference +
                    (endDayDiff - baseDayDiff) * 1440,
                  baseDayDiff,
                  baseLocalDate,
                };
              });
            }

            let resultRowStates = getResultRowStates();

            function minutesToTime(minutes) {
              const hours = Math.floor(minutes / 60);
              const mins = minutes % 60;
              return hours.toString().padStart(2, '0') + ':' + mins.toString().padStart(2, '0');
            }

            // 白いマスクに「選択範囲だけ穴を開ける」ための mask-image を設定
            function updateWhiteMask(maskElement, startPercent, endPercent) {
              if (!maskElement) return;

              const start = Math.max(0, Math.min(100, startPercent));
              const end = Math.max(0, Math.min(100, endPercent));

              let mask;

              if (start <= end) {
                mask =
                  'linear-gradient(to right,' +
                  'black 0%,' +
                  'black ' + start + '%,' +
                  'transparent ' + start + '%,' +
                  'transparent ' + end + '%,' +
                  'black ' + end + '%,' +
                  'black 100%)';
              } else {
                mask =
                  'linear-gradient(to right,' +
                  'transparent 0%,' +
                  'transparent ' + end + '%,' +
                  'black ' + end + '%,' +
                  'black ' + start + '%,' +
                  'transparent ' + start + '%,' +
                  'transparent 100%)';
              }

              maskElement.style.webkitMaskImage = mask;
              maskElement.style.maskImage = mask;
            }

            function normalizeMinutes(totalMinutes) {
              const minutes = ((totalMinutes % 1440) + 1440) % 1440;
              const dayOffset = Math.floor(totalMinutes / 1440);

              return { minutes, dayOffset };
            }

            function formatDate(date) {
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');

              return yyyy + '-' + mm + '-' + dd;
            }

            function formatDayDiffLabel(dayDiff) {
              if (dayDiff === 0) return '同日';
              if (dayDiff === 1) return '翌日';
              if (dayDiff === -1) return '前日';
              return dayDiff > 1 ? '+' + dayDiff + '日' : dayDiff + '日';
            }

            function updateResultRows() {
              resultRowStates.forEach((rowState) => {
                const startTotal = startMinutes + rowState.startOffset;
                const endTotal = endMinutes + rowState.endOffset;

                const startInfo = normalizeMinutes(startTotal);
                const endInfo = normalizeMinutes(endTotal);

                const startPercent = (startInfo.minutes / 1440) * 100;
                const endPercent = (endInfo.minutes / 1440) * 100;

                if (rowState.mask) {
                  updateWhiteMask(rowState.mask, startPercent, endPercent);
                }

                const startTimeLabel = minutesToTime(startInfo.minutes);
                const endTimeLabel = minutesToTime(endInfo.minutes);

                if (rowState.startTimeEl) {
                  rowState.startTimeEl.textContent = startTimeLabel;
                }

                if (rowState.endTimeEl) {
                  rowState.endTimeEl.textContent = endTimeLabel;
                }

                const currentDayDiff = rowState.baseDayDiff + startInfo.dayOffset;

                if (rowState.dayDiffEl) {
                  rowState.dayDiffEl.textContent = formatDayDiffLabel(
                    currentDayDiff
                  );
                }

                if (rowState.dateEl && rowState.baseLocalDate) {
                  const date = new Date(rowState.baseLocalDate + 'T00:00:00');
                  if (!Number.isNaN(date.getTime())) {
                    date.setDate(date.getDate() + startInfo.dayOffset);
                    rowState.dateEl.textContent = formatDate(date);
                  }
                }
              });
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

              sliderInstances.forEach(function(slider) {
                // つまみとドラッグ領域の位置・幅を更新
                slider.startThumb.style.left = startPercent + '%';
                slider.endThumb.style.left = endPercent + '%';
                slider.rangeHighlight.style.left = startPercent + '%';
                slider.rangeHighlight.style.width = (endPercent - startPercent) + '%';

                // 白マスクに「穴」を開ける
                updateWhiteMask(slider.mask, startPercent, endPercent);
              });

              const startTime = minutesToTime(startMinutes);
              const endTime = minutesToTime(endMinutes);

              startTimeInput.value = startTime;
              endTimeInput.value = endTime;

              updateResultRows();
            }

            async function autoSubmit() {
              const formData = new FormData(form);

              if (timezoneCheckboxes && timezoneCheckboxes.forEach) {
                timezoneCheckboxes.forEach(function (cb) {
                  if (cb.checked) {
                    formData.append(cb.name || 'zones', cb.value);
                  }
                });
              }

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
                  refreshTimezoneControls(doc);
                  refreshBaseSlider();
                  baseStartReference = startMinutes;
                  baseEndReference = endMinutes;
                  resultRowStates = getResultRowStates();
                  updateDisplay();
                }

                history.replaceState(null, '', url);
              } catch (error) {
                window.location.search = url;
              }
            }

            function getMinutesFromEvent(slider, e) {
              const rect = slider.container.getBoundingClientRect();
              const clientX =
                e.clientX ||
                (e.touches && e.touches[0] && e.touches[0].clientX);
              if (clientX == null) return 0;

              const x = clientX - rect.left;
              const percent = Math.max(0, Math.min(1, x / rect.width));
              // 1分単位に丸める
              const minutes = Math.round(percent * 1440);
              return Math.max(0, Math.min(MAX_MINUTES, minutes));
            }

            function handleStart(e, mode, slider) {
              isDragging = true;
              dragMode = mode; // 'start' | 'end'
              activeSlider = slider;
              e.preventDefault();
            }

            function handleMove(e) {
              if (!isDragging || !dragMode || !activeSlider) return;

              if (dragMode === 'start' || dragMode === 'end') {
                const minutes = getMinutesFromEvent(activeSlider, e);

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
                const rect = activeSlider.container.getBoundingClientRect();
                const clientX =
                  e.clientX ||
                  (e.touches && e.touches[0] && e.touches[0].clientX);
                if (clientX == null) return;

                const dx = clientX - rangeDragStartX;

                // スライダー全幅 = 1440分に対応
                let deltaMinutes = (dx / rect.width) * 1440;
                // 1分単位に丸める
                deltaMinutes = Math.round(deltaMinutes);

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
              activeSlider = null;

              // ドラッグ終了時に自動送信
              autoSubmit();
            }

            function startRangeDrag(slider, clientX) {
              if (clientX == null) return;
              isDragging = true;
              dragMode = 'range';
              activeSlider = slider;
              rangeDragStartX = clientX;
              rangeStartMinutesAtDragStart = startMinutes;
              rangeEndMinutesAtDragStart = endMinutes;
            }

            function attachSliderEvents(slider) {
              // --- スライダー: つまみドラッグ ---
              slider.startThumb.addEventListener('mousedown', function (e) {
                handleStart(e, 'start', slider);
              });
              slider.endThumb.addEventListener('mousedown', function (e) {
                handleStart(e, 'end', slider);
              });

              slider.startThumb.addEventListener(
                'touchstart',
                function (e) {
                  handleStart(e, 'start', slider);
                },
                { passive: false }
              );
              slider.endThumb.addEventListener(
                'touchstart',
                function (e) {
                  handleStart(e, 'end', slider);
                },
                { passive: false }
              );

              // --- スライダー: 範囲（ハイライト）ドラッグ ---
              slider.rangeHighlight.addEventListener('mousedown', function (e) {
                startRangeDrag(slider, e.clientX);
                e.preventDefault();
              });

              slider.rangeHighlight.addEventListener(
                'touchstart',
                function (e) {
                  if (!e.touches || !e.touches[0]) return;
                  startRangeDrag(slider, e.touches[0].clientX);
                  e.preventDefault();
                },
                { passive: false }
              );
            }

            function refreshBaseSlider() {
              for (let i = sliderInstances.length - 1; i >= 0; i--) {
                if (sliderInstances[i].id === 'base') {
                  sliderInstances.splice(i, 1);
                }
              }

              const baseContainer = document.getElementById('baseResultSliderContainer');
              const baseStartThumb = document.getElementById('baseResultStartThumb');
              const baseEndThumb = document.getElementById('baseResultEndThumb');
              const baseRangeHighlight = document.getElementById('baseResultRangeHighlight');
              const baseMask = document.getElementById('resultWhiteMask');

              if (
                baseContainer &&
                baseStartThumb &&
                baseEndThumb &&
                baseRangeHighlight
              ) {
                const baseSlider = {
                  id: 'base',
                  container: baseContainer,
                  startThumb: baseStartThumb,
                  endThumb: baseEndThumb,
                  rangeHighlight: baseRangeHighlight,
                  mask: baseMask,
                };

                attachSliderEvents(baseSlider);
                sliderInstances.push(baseSlider);
              }
            }

            sliderInstances.forEach(attachSliderEvents);
            refreshBaseSlider();

            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleMove, {
              passive: false,
            });
            document.addEventListener('touchend', handleEnd);

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

            // --- タイムゾーン追加セレクト ---

            function attachAdditionalTimezoneListener() {
              if (!additionalTimezoneSelect) return;

              additionalTimezoneSelect.onchange = async function (e) {
                const target = e.target;
                if (
                  !target ||
                  !(target instanceof HTMLSelectElement) ||
                  !target.value
                ) {
                  return;
                }

                const value = target.value;
                const selector = '.timezone-checkbox[value="' + value + '"]';
                let checkbox = document.querySelector(selector);

                if (!checkbox && timezoneContainer) {
                  const selectedOption =
                    target.options &&
                    typeof target.selectedIndex === 'number' &&
                    target.selectedIndex >= 0
                      ? target.options[target.selectedIndex]
                      : null;

                  const labelText =
                    (selectedOption && selectedOption.textContent) || value;

                  const label = document.createElement('label');
                  label.className =
                    'flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs hover:bg-gray-100';

                  const input = document.createElement('input');
                  input.type = 'checkbox';
                  input.name = 'zones';
                  input.value = value;
                  input.checked = true;
                  input.className = 'timezone-checkbox';

                  const span = document.createElement('span');
                  span.textContent = labelText;

                  label.appendChild(input);
                  label.appendChild(span);

                  timezoneContainer.appendChild(label);

                  input.addEventListener('change', function () {
                    autoSubmit();
                  });

                  timezoneCheckboxes.push(input);
                  checkbox = input;
                }

                if (checkbox instanceof HTMLInputElement) {
                  if (!checkbox.checked) {
                    checkbox.checked = true;
                  }
                }

                // 選択をクリア
                target.value = '';

                await autoSubmit();
              };
            }

            // --- タイムゾーンのチェックボックス変更で自動送信 ---

            function attachTimezoneCheckboxListeners() {
              if (timezoneCheckboxes && timezoneCheckboxes.forEach) {
                timezoneCheckboxes.forEach(function (cb) {
                  cb.onchange = function () {
                    autoSubmit();
                  };
                });
              }
            }

            attachAdditionalTimezoneListener();
            attachTimezoneCheckboxListeners();

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

            function refreshTimezoneControls(doc) {
              const newContainer = doc.getElementById('timezoneCheckboxes');
              const currentContainer = document.getElementById('timezoneCheckboxes');

              if (newContainer && currentContainer && currentContainer.parentNode) {
                currentContainer.parentNode.replaceChild(newContainer, currentContainer);
                timezoneContainer = newContainer;
              }

              const newAdditionalSelect = doc.getElementById('additionalTimezoneSelect');
              const currentAdditionalSelect = document.getElementById('additionalTimezoneSelect');

              if (
                newAdditionalSelect &&
                currentAdditionalSelect &&
                currentAdditionalSelect.parentNode
              ) {
                currentAdditionalSelect.parentNode.replaceChild(
                  newAdditionalSelect,
                  currentAdditionalSelect
                );
                additionalTimezoneSelect = newAdditionalSelect;
              }

              timezoneCheckboxes = Array.from(
                document.querySelectorAll('.timezone-checkbox')
              );

              attachAdditionalTimezoneListener();
              attachTimezoneCheckboxListeners();
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