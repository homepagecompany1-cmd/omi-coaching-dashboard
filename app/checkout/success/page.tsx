import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function CheckoutSuccessPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-brand-gold/30 bg-white p-10 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/10 text-3xl">
            🔥
          </div>
          <h1 className="mb-3 text-2xl font-bold text-brand-navy">
            ようこそ、OMIコーチングへ
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-slate-600">
            お申し込みありがとうございます。
            <br />
            次は、あなた専用のOMI設定画面で、音声の送信先を設定します。
          </p>
          <Link href="/setup" className="inline-block">
            <Button className="h-12 bg-brand-navy px-8 text-base font-bold text-white hover:bg-brand-navy/90">
              セットアップへ進む →
            </Button>
          </Link>

          <div className="mt-8 border-t border-slate-200 pt-6 text-left text-xs text-slate-500">
            <p className="mb-1 font-semibold">次のステップ</p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>専用の設定URLとQRコードが表示されます</li>
              <li>OMI公式アプリの開発者設定に貼ります</li>
              <li>あとは自動。毎晩Notionに評価が届きます</li>
            </ol>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
