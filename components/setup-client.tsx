'use client';

import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Copy,
  Loader2,
  PlayCircle,
  RefreshCw,
  ArrowRight,
  Smartphone,
  Timer,
  Webhook,
} from 'lucide-react';

interface TokenResult {
  token: string;
  webhookUrl: string;
  createdAt: string;
}

export function SetupClient({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [data, setData] = useState<TokenResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/setup/generate-token', { method: 'POST' });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = (await res.json()) as TokenResult;
      setData(json);
      try {
        localStorage.setItem('omi.setup', JSON.stringify(json));
      } catch {
        // ignore storage errors
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'トークン発行に失敗しました'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // 既に発行済みがあれば再利用、無ければ自動発行
    try {
      const cached = localStorage.getItem('omi.setup');
      if (cached) {
        setData(JSON.parse(cached) as TokenResult);
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }
    void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function copyUrl() {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック: 選択範囲でコピー
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <Card className="border-brand-gold/40 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="gold" className="mb-1">
                {userName} さん専用
              </Badge>
              <CardTitle>あなた専用のWebhook URL</CardTitle>
              <CardDescription>
                OMI公式アプリの「Realtime audio bytes」に、このURLを貼り付けます。
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={generate}
              disabled={loading}
              title="再発行"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading && !data ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> トークンを発行中...
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">
              エラー: {error}
              <Button variant="outline" size="sm" className="ml-3" onClick={generate}>
                再試行
              </Button>
            </p>
          ) : data ? (
            <>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="rounded-lg border border-brand-navy/20 bg-white p-3">
                  <QRCodeCanvas
                    value={data.webhookUrl}
                    size={180}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#1a2e4a"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-brand-gold-dark">
                      <Webhook className="mr-1 inline h-3 w-3" /> WEBHOOK URL
                    </p>
                    <code className="mt-1 block break-all rounded-md bg-brand-navy-dark p-3 font-mono text-xs text-brand-gold-light">
                      {data.webhookUrl}
                    </code>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="gold" size="sm" onClick={copyUrl}>
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" /> コピー完了
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> URLをコピー
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`mailto:${userEmail}?subject=${encodeURIComponent('OMIコーチング 設定URL')}&body=${encodeURIComponent(data.webhookUrl)}`}
                      >
                        自分にメール送信
                      </a>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    トークン: <code>{data.token.slice(0, 8)}...</code>
                    ／発行 {new Date(data.createdAt).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      {/* 設定手順 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-brand-gold-dark" />
            OMI公式アプリ側の設定手順
          </CardTitle>
          <CardDescription>
            所要時間：約2分。一度だけの作業です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <Step n={1} title="OMI公式アプリを開く">
              App Store / Google Play からインストール済みのOMI公式アプリを起動します。
            </Step>
            <Step n={2} title="開発者モードを有効化">
              設定 → Developer Mode をオンにします。
            </Step>
            <Step n={3} title="Realtime audio bytes を開く">
              Developer Settings → Realtime audio bytes を選択。
            </Step>
            <Step n={4} title="このページのURLをペースト">
              上でコピーした Webhook URL を貼り付けます。
            </Step>
            <Step n={5} title="間隔を 900秒（15分）に設定">
              <div className="flex items-center gap-1 text-brand-navy-dark">
                <Timer className="h-3.5 w-3.5" /> 15分ごとに自動送信されます。
              </div>
            </Step>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="default" size="lg">
              <PlayCircle className="h-5 w-5" /> 設定動画を見る（1分）
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">
                完了、ダッシュボードへ <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* 動画プレースホルダ */}
          <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg border border-dashed border-brand-navy/30 bg-brand-navy/5">
            <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
              <PlayCircle className="h-10 w-10 text-brand-gold-dark/60" />
              <p className="mt-2 text-xs">
                設定動画（1分）をここに埋め込み予定
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full gold-gradient text-sm font-bold text-brand-navy-dark">
        {n}
      </span>
      <div>
        <p className="font-semibold text-brand-navy">{title}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}
