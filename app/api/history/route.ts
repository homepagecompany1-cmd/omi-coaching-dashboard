import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const runtime = 'edge';

import { fetchHistory } from '@/lib/db';


export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const rows = await fetchHistory(session.user.id);
  return NextResponse.json(rows, {
    headers: { 'cache-control': 'no-store' },
  });
}
