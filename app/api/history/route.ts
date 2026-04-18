import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { fetchHistory } from '@/lib/db';
import { sessionUserSchema } from '@/lib/validators';

export async function GET() {
  const session = await auth();
  const userResult = sessionUserSchema.safeParse(session?.user);
  if (!userResult.success) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const rows = await fetchHistory(userResult.data.id);
  return NextResponse.json(rows, {
    headers: { 'cache-control': 'no-store' },
  });
}
