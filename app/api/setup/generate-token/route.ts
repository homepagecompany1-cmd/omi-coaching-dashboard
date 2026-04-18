import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { registerClient } from '@/lib/db';
import { sessionUserSchema } from '@/lib/validators';

/**
 * POST /api/setup/generate-token
 * 初回セットアップ時にWorkerトークンを発行する。
 *
 * - UUIDv4を生成
 * - Workerの /api/clients にPOSTして clients テーブルへINSERT
 * - Omi公式アプリに貼るWebhook URLを返す
 */
export async function POST() {
  const session = await auth();
  const userResult = sessionUserSchema.safeParse(session?.user);
  if (!userResult.success) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const user = userResult.data;

  const result = await registerClient({
    uid: user.id,
    name: user.name ?? 'OMIユーザー',
    email: user.email,
  });

  return NextResponse.json(result);
}
