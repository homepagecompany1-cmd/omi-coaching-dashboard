import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { fetchHistory } from '@/lib/db';
import { HistoryTable } from '@/components/history-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/api/auth/signin?callbackUrl=/history');
  }

  const rows = await fetchHistory(session.user.id);

  return (
    <div className="flex min-h-dvh flex-col bg-brand-cream/40">
      <SiteHeader />
      <main className="container flex-1 space-y-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
            日次評価レポート
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            これまでの歩みはいつでも振り返れます。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>履歴（最新順）</CardTitle>
          </CardHeader>
          <CardContent>
            <HistoryTable rows={rows} />
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
