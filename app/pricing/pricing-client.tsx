'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PricingClient({ userEmail }: { userEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.hint || data.error || '決済セッション生成に失敗しました');
        setLoading(false);
        return;
      }

      // Stripe Checkoutへリダイレクト
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('決済URLが返ってきませんでした');
        setLoading(false);
      }
    } catch (err) {
      setError(`通信エラー: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        onClick={subscribe}
        disabled={loading}
        className="h-12 w-full bg-brand-navy text-base font-bold text-white hover:bg-brand-navy/90"
      >
        {loading ? '準備中...' : 'この内容で申し込む'}
      </Button>
      {userEmail && (
        <p className="mt-2 text-center text-xs text-slate-500">
          {userEmail} で登録します
        </p>
      )}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-semibold">エラーが発生しました</p>
          <p className="mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}
