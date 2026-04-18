import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { fetchDashboard } from '@/lib/db';
import { StatCard } from '@/components/stat-card';
import { TrendChart } from '@/components/trend-chart';
import { ImpressionCloud } from '@/components/impression-cloud';
import { LogCard } from '@/components/log-card';
import {
  Clock,
  Heart,
  Sparkles,
  Waves,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}分`;
  return `${h}時間${m}分`;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin?callbackUrl=/dashboard');
  }

  const data = await fetchDashboard(
    session.user.id,
    session.user.name ?? 'あなた'
  );

  return (
    <div className="flex min-h-dvh flex-col bg-brand-cream/40">
      <SiteHeader />
      <main className="container flex-1 space-y-6 py-8">
        {/* ヘッダー */}
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">
              {new Date(data.today.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </p>
            <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
              今日の<span className="gold-text">あなた</span>
            </h1>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Flame className="h-3 w-3 text-brand-ember" />
            {data.client?.character_name ?? '煉獄杏寿郎'} が見守り中
          </Badge>
        </div>

        {/* 統計カード4枚 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="録音時間"
            value={formatMinutes(data.today.recordingMinutes)}
            hint="今日の総録音"
          />
          <StatCard
            icon={<Heart className="h-5 w-5" />}
            label="穏やかさ"
            value={`${data.today.calmness}`}
            suffix="/100"
            hint="ポジティブ率"
          />
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="未来志向"
            value={`${data.today.futureFocus}`}
            suffix="/100"
            hint="予祝・前向き度"
          />
          <StatCard
            icon={<Waves className="h-5 w-5" />}
            label="一貫性"
            value={`${data.today.consistency}`}
            suffix="/100"
            hint="フォーカス一貫性"
          />
        </div>

        {/* グラフ + ワードクラウド */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>過去7日のスコア推移</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={data.last7} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>印象タグ</CardTitle>
            </CardHeader>
            <CardContent>
              <ImpressionCloud tags={data.impressionTags} />
            </CardContent>
          </Card>
        </div>

        {/* 最新の15分ログ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-gold-dark" />
              最新の15分単位ログ
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.recentLogs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
