import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OMIコーチング | あなた専用の自己実現パートナー',
  description:
    'OMIデバイスで一日中の会話を自動記録→AIコーチが評価→毎晩Notionにフィードバック。煉獄さんのような視点で「なりたい自分」に近づく。月額8,400円。',
  keywords: ['OMI', 'AIコーチング', '自己実現', '煉獄', 'Claude', 'Cloudflare'],
  openGraph: {
    title: 'OMIコーチング | あなた専用の自己実現パートナー',
    description: '会話を録音して、毎晩Notionに評価が届く新しいコーチング。',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a2e4a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body className="min-h-dvh font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
