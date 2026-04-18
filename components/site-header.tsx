'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Flame } from 'lucide-react';

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-navy/10 bg-brand-navy text-white">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Flame className="h-5 w-5 text-brand-gold" />
          <span className="gold-text text-lg tracking-tight">
            OMIコーチング
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-md px-3 py-1.5 hover:bg-white/10 sm:block"
              >
                今日
              </Link>
              <Link
                href="/history"
                className="hidden rounded-md px-3 py-1.5 hover:bg-white/10 sm:block"
              >
                履歴
              </Link>
              <Link
                href="/setup"
                className="hidden rounded-md px-3 py-1.5 hover:bg-white/10 sm:block"
              >
                設定
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-brand-navy"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">サインアウト</span>
              </Button>
            </>
          ) : status === 'loading' ? (
            <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
          ) : (
            <Button
              variant="gold"
              size="sm"
              onClick={() => signIn('google', { callbackUrl: '/setup' })}
            >
              <LogIn className="h-4 w-4" />
              Googleでサインイン
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
