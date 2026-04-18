import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const runtime = 'edge';

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
  const session = await auth();
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
