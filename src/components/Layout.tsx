// src/components/Layout.tsx
import type { FC } from 'hono/jsx';

export type LayoutMeta = {
  description?: string;
  canonicalUrl?: string;
  keywords?: string[];
  imageUrl?: string;
  siteName?: string;
  structuredData?: string;
  robots?: string;
  ogType?: string;
};

type LayoutProps = {
  title?: string;
  meta?: LayoutMeta;
  children: any;
};

export const Layout: FC<LayoutProps> = ({ title, meta, children }) => {
  const pageTitle = title ?? '国際時間変換ツール';
  const description =
    meta?.description ??
    '海外とのミーティング時間調整に便利な国際時間変換ツールです。主要都市の営業時間もまとめて確認できます。';
  const canonicalUrl = meta?.canonicalUrl;
  const keywords =
    meta?.keywords ?? ['国際時間', '時差', 'ミーティング調整', 'タイムゾーン', '海外拠点'];
  const imageUrl =
    meta?.imageUrl ??
    'https://dummyimage.com/1200x630/0f172a/ffffff&text=World+Time+Planner';
  const siteName = meta?.siteName ?? 'World Time Planner';
  const robots = meta?.robots ?? 'index,follow,max-snippet:-1,max-image-preview:large';
  const ogType = meta?.ogType ?? 'website';

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="robots" content={robots} />
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
        <meta property="og:site_name" content={siteName} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        {meta?.structuredData ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: meta.structuredData }}
          />
        ) : null}
        {/* Tailwind CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <div className="text-lg font-semibold tracking-tight">
              World Time Planner
            </div>
            <div className="text-xs text-gray-500">
              海外拠点との会議時間をすばやく比較
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>

        <footer className="border-t bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4 text-xs text-gray-500">
            このツールはデモ目的です。サマータイム等の扱いに注意しつつご利用ください。
          </div>
        </footer>
      </body>
    </html>
  );
};
