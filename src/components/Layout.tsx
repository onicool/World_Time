// src/components/Layout.tsx
import type { FC } from 'hono/jsx';

type LayoutProps = {
  title?: string;
  children: any;
};

export const Layout: FC<LayoutProps> = ({ title, children }) => {
  const pageTitle = title ?? '国際時間変換ツール';

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <title>{pageTitle}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta
          name="description"
          content="海外とのミーティング時間調整に便利な国際時間変換ツールです。"
        />
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
              国際時間変換ツール
            </div>
            <div className="text-xs text-gray-500">
              Powered by Hono + Cloudflare Workers
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
