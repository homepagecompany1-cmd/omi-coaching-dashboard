'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowRight } from 'lucide-react';

export function HeroSignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 既にサインイン済みなら setup へ飛ばす動線をボタンで提供
  useEffect(() => {
    // 自動遷移はしない。選択肢として「ダッシュボードへ」ボタンを見せる方が親切
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="h-12 w-60 animate-pulse rounded-lg bg-white/10" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex flex-wrap gap-3">
        <Button
          variant="gold"
          size="lg"
          onClick={() => router.push('/dashboard')}
        >
          ダッシュボードへ <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-white/40 bg-transparent text-white hover:bg-white hover:text-brand-navy"
          onClick={() => router.push('/setup')}
        >
          設定を見直す
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="gold"
      size="lg"
      onClick={() => signIn('google', { callbackUrl: '/pricing' })}
    >
      <LogIn className="h-5 w-5" />
      Googleで始める（1分）
    </Button>
  );
}
