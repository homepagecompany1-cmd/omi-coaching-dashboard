import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

import { PricingClient } from './pricing-client';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function PricingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin?callbackUrl=/pricing');
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            OMI Coaching
          </p>
          <h1 className="mb-3 text-3xl font-bold text-brand-navy">
            あなた専用の自己実現パートナー
          </h1>
          <p className="text-sm text-slate-600">
            毎日の声から「変わった自分」を記録・評価する、完全パーソナライズのAIコーチング。
          </p>
        </div>

        <div className="rounded-2xl border border-brand-gold/30 bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold">
                スタンダードプラン
              </div>
              <div className="mt-1 text-2xl font-bold text-brand-navy">月額サブスクリプション</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-brand-navy">
                ¥8,400
                <span className="text-base font-normal text-slate-500">/月</span>
              </div>
              <div className="text-xs text-slate-500">税込</div>
            </div>
          </div>

          <ul className="my-6 space-y-3 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="text-brand-gold">✓</span>
              <span>OMIデバイスの音声から、毎日10軸で自己実現スコアを自動評価</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-gold">✓</span>
              <span>煉獄さんなどキャラクターAIコーチによるフィードバック</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-gold">✓</span>
              <span>朝の瞑想ガイド・夜のフィードバック・週次レポート（毎日自動配信）</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-gold">✓</span>
              <span>Notionダッシュボードに評価結果が自動同期</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-gold">✓</span>
              <span>あなたの声データは完全にあなた専用。他の誰とも混ぜません</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-gold">✓</span>
              <span>いつでも解約可能。音声は30日で自動削除</span>
            </li>
          </ul>

          <PricingClient userEmail={session.user.email || ''} />

          <p className="mt-4 text-xs text-slate-500">
            ※ OMIデバイス本体（¥25,000相当）は別途必要です。
            お持ちでない方はお問い合わせください。
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          決済は Stripe が安全に処理します。クレジットカード情報は当社サーバーには保存されません。
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
