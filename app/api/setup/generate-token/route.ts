import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { registerClient } from '@/lib/db';

/**
 * POST /api/setup/generate-token
 * 初回セットアップ時にWorkerトークンを発行する。
 *
 * - UUIDv4を生成
 * - Workerの /api/clients にPOSTして clients テーブルへINSERT
 *   （Worker未実装ならMVPとしてローカルでUUIDだけ返す）
 * - Omi公式アプリに貼るWebhook URLを返す
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const result = await registerClient({
    uid: session.user.id,
    name: session.user.name ?? 'OMIユーザー',
    email: session.user.email,
  });

  return NextResponse.json(result);
}
