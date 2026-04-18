import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SetupClient } from '@/components/setup-client';

export const dynamic = 'force-dynamic';

async function checkSubscription(uid: string): Promise<boolean> {
  const WORKER = process.env.WORKER_API_URL;
  const SECRET = process.env.WORKER_INTERNAL_SECRET;
  // 決済未設定 or Worker不在なら strict check を諦めて通す（開発モード）
  if (!WORKER) return true;

  try {
    const res = await fetch(`${WORKER}/api/subscription/${encodeURIComponent(uid)}`, {
      headers: SECRET ? { 'x-internal-secret': SECRET } : {},
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { active?: boolean };
    return Boolean(data.active);
  } catch {
    return false;
  }
}

export default async function SetupPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // NextAuth経由でサインインへ。終了後この画面に戻る
    redirect('/api/auth/signin?callbackUrl=/setup');
  }

  // Stripe未設定時は活性化チェックをスキップ（Worker側が503返す挙動で判定）
  // Stripe設定済みならサブスク未加入者は /pricing へ
  if (process.env.ENFORCE_SUBSCRIPTION === 'true') {
    const active = await checkSubscription(session.user.id);
    if (!active) {
      redirect('/pricing');
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-brand-cream/40">
      <SiteHeader />
      <main className="container flex-1 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            初回セットアップ
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            OMI公式アプリに、あなた専用のWebhook URLを一度だけ登録します。
            約2分で完了します。
          </p>

          <SetupClient
            userName={session.user.name ?? 'OMIユーザー'}
            userEmail={session.user.email ?? ''}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
