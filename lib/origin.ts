/**
 * 信頼できる origin を解決する。
 *
 * Stripe Checkout の success_url / cancel_url に、リクエストヘッダーの
 * `origin` をそのまま差し込むとオープンリダイレクト攻撃の踏み台になり得るので、
 * 以下のいずれかに該当する場合のみ採用する:
 *
 *   1. NEXTAUTH_URL と完全一致
 *   2. ALLOWED_ORIGINS (カンマ区切り) に含まれる
 *   3. 上記が未設定なら localhost 系のみ許可（開発用）
 */
export function resolveSafeOrigin(origin: string | null): string {
  const fallback = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  if (!origin) return fallback;

  const allowed = new Set<string>();
  if (process.env.NEXTAUTH_URL) allowed.add(process.env.NEXTAUTH_URL);
  if (process.env.ALLOWED_ORIGINS) {
    for (const o of process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())) {
      if (o) allowed.add(o);
    }
  }

  if (allowed.has(origin)) return origin;

  try {
    const url = new URL(origin);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      // 許可リストが空のときは開発用に localhost を通す
      if (allowed.size === 0) return origin;
    }
  } catch {
    // origin が URL として解釈できない → fallback
  }

  return fallback;
}
