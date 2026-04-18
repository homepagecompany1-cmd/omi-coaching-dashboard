/**
 * POST /api/stripe/create-checkout
 *
 * 認証済みユーザー向け: WorkerのStripe Checkout生成をプロキシする。
 * 成功時は Stripe Checkout URL を返す。
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const runtime = 'edge';



export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const WORKER = process.env.WORKER_API_URL;
  const SECRET = process.env.WORKER_INTERNAL_SECRET;
  if (!WORKER) {
    return NextResponse.json({ error: 'WORKER_API_URL未設定' }, { status: 503 });
  }

  const origin =
    request.headers.get('origin') ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  try {
    const res = await fetch(`${WORKER}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(SECRET ? { 'x-internal-secret': SECRET } : {}),
      },
      body: JSON.stringify({
        uid: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email,
        success_url: `${origin}/checkout/success`,
        cancel_url: `${origin}/pricing`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'checkout failed', detail: String(err) },
      { status: 500 },
    );
  }
}
