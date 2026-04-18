import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { fetchDashboard } from '@/lib/db';
import { sessionUserSchema } from '@/lib/validators';

/**
 * GET /api/scores
 * ログイン中ユーザーのダッシュボードデータを返す。
 * 内部では Cloudflare Worker の /api/scores/:uid をプロキシ。
 * Workerが死んでいれば mock にフォールバックするので UI は壊れない。
 */


export async function GET() {
  const session = await auth();
  const userResult = sessionUserSchema.safeParse(session?.user);
  if (!userResult.success) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const user = userResult.data;
  const data = await fetchDashboard(user.id, user.name ?? 'あなた');
  return NextResponse.json(data, {
    headers: { 'cache-control': 'no-store' },
  });
}
