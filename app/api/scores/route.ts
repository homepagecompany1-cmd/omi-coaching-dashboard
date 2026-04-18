import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchDashboard } from '@/lib/db';

/**
 * GET /api/scores
 * ログイン中ユーザーのダッシュボードデータを返す。
 * 内部では Cloudflare Worker の /api/scores/:uid をプロキシ。
 * Workerが死んでいれば mock にフォールバックするので UI は壊れない。
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const data = await fetchDashboard(
    session.user.id,
    session.user.name ?? 'あなた'
  );
  return NextResponse.json(data, {
    headers: { 'cache-control': 'no-store' },
  });
}
