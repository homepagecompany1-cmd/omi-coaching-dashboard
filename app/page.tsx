import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroSignIn } from '@/components/hero-sign-in';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Mic, Moon, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="brand-gradient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,165,116,0.25),transparent_60%)]" />
        <div className="container relative grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <Badge variant="gold" className="mb-4 w-fit">
              <Flame className="mr-1 h-3 w-3" /> 日本初 OMI × AIコーチング
            </Badge>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              <span className="gold-text">なりたい自分</span>の声が、
              <br />
              毎晩あなたに届く。
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              首からぶら下げた <span className="font-semibold">OMIデバイス</span>{' '}
              が、一日の会話をそっと記録。
              AIコーチ
              <span className="font-semibold text-brand-gold-light">
                （煉獄さん視点）
              </span>
              が、あなたの「理想の自分」との距離を毎晩Notionに届けます。
            </p>
            <div className="mt-8">
              <HeroSignIn />
              <p className="mt-3 text-xs text-white/60">
                月額 8,400円（税込） ・ いつでも解約可 ・ Googleアカウントで1分登録
              </p>
            </div>
          </div>

          {/* 煉獄さん評価サンプル */}
          <div className="flex items-center">
            <Card className="w-full border-brand-gold/40 bg-white/95 shadow-2xl">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-brand-ember" />
                  <CardTitle className="text-brand-navy">
                    煉獄さん視点の夜レポート
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">
                  2026-04-17 / 録音 4時間23分
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="穏やかさ" value={78} />
                  <Metric label="未来志向" value={65} />
                  <Metric label="一貫性" value={72} />
                  <Metric label="理想距離" value={68} />
                </div>
                <blockquote className="rounded-md border-l-4 border-brand-ember bg-brand-cream px-4 py-3 text-brand-navy-dark">
                  「うむ、今日のお前は<strong>ブレない言葉</strong>を多く発した。
                  朝の宣言が効いている。
                  <br />
                  <strong>明日は "豊かさ" を5回、声に出して迎えよ。</strong>」
                </blockquote>
                <div className="flex flex-wrap gap-1.5">
                  {['豊かさ', '誠実', '行動', '温かさ', '感謝'].map((w) => (
                    <Badge key={w} variant="secondary">
                      #{w}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-16">
        <h2 className="text-center text-2xl font-bold text-brand-navy sm:text-3xl">
          仕組みはシンプル。設定は1回だけ。
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <StepCard
            icon={<Mic className="h-6 w-6" />}
            step="STEP 1"
            title="OMIを首にかける"
            body="OMI公式アプリから専用URLを登録。あとは一日中、自然に話すだけ。15分ごとに自動で音声が送られます。"
          />
          <StepCard
            icon={<Sparkles className="h-6 w-6" />}
            step="STEP 2"
            title="AIが理想像と照らす"
            body="あなたの声色と言葉を分析し、「理想の自分」との距離・高揚の瞬間・ブレない語りを検出します。"
          />
          <StepCard
            icon={<Moon className="h-6 w-6" />}
            step="STEP 3"
            title="毎晩Notionに届く"
            body="煉獄さん視点のフィードバックと、明日の一問が届きます。朝はそれを持って瞑想→出発。"
          />
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="bg-brand-cream/60 py-16">
        <div className="container">
          <h2 className="text-center text-2xl font-bold text-brand-navy sm:text-3xl">
            月額8,400円に含まれるもの
          </h2>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-3 text-sm sm:grid-cols-2">
            {[
              '一日中の会話を自動録音 → 文字起こし',
              '10評価軸で毎日スコアリング',
              '煉獄さん視点の夜フィードバック',
              '朝の瞑想プロンプト生成',
              '週次レポート（成長ハイライト）',
              '専用Notionダッシュボード連携',
              'コミュニティ（オンライン）参加権',
              '初回Zoomオンボーディング30分',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-brand-gold-dark" />
                <span className="text-brand-navy-dark">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-brand-navy/5 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-navy">
        {value}
        <span className="ml-0.5 text-xs font-normal text-muted-foreground">
          /100
        </span>
      </p>
    </div>
  );
}

function StepCard({
  icon,
  step,
  title,
  body,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg gold-gradient text-brand-navy-dark">
          {icon}
        </div>
        <p className="text-xs font-semibold tracking-wider text-brand-gold-dark">
          {step}
        </p>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
