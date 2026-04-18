/**
 * POST /api/stripe/create-checkout
 *
 * 認証済みユーザー向け: WorkerのStripe Checkout生成をプロキシする。
 * 成功時は Stripe Checkout URL を返す。
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { resolveSafeOrigin } from '@/lib/origin';
import { sessionUserSchema, stripeCheckoutRequestSchema } from '@/lib/validators';

export async function POST(request: Request) {
  const session = await auth();
  const userResult = sessionUserSchema.safeParse(session?.user);
  if (!userResult.success) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const user = userResult.data;

  const WORKER = process.env.WORKER_API_URL;
  const SECRET = process.env.WORKER_INTERNAL_SECRET;
  if (!WORKER || !SECRET) {
    // fail-close: 本番で必須の環境変数が欠けている場合は拒否
    return NextResponse.json(
      { error: 'service not configured' },
      { status: 503 },
    );
  }

  // 任意のリクエストボディも検証（現状は空想定）
  try {
    const maybeBody = await request.json().catch(() => ({}));
    const parsed = stripeCheckoutRequestSchema.safeParse(maybeBody ?? {});
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
  }

  const origin = resolveSafeOrigin(request.headers.get('origin'));

  try {
    const res = await fetch(`${WORKER}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-internal-secret': SECRET,
      },
      body: JSON.stringify({
        uid: user.id,
        email: user.email,
        name: user.name || user.email,
        success_url: `${origin}/checkout/success`,
        cancel_url: `${origin}/pricing`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'checkout failed' }, { status: 500 });
  }
}
