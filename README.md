# OMIコーチング ダッシュボード

Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui ベースの
OMIコーチングクライアント向けWebダッシュボード。

## ページ構成

| パス | 役割 |
|---|---|
| `/` | ランディング（サービス紹介 + 煉獄さん視点の評価サンプル + Googleサインイン） |
| `/setup` | 初回セットアップ。トークン自動発行 + QRコード + 設定手順 |
| `/dashboard` | 今日の統計4枚 / 7日間グラフ / 15分ログ / 印象タグクラウド |
| `/history` | 日次評価レポート一覧 + CSVエクスポート + Notionリンク |

## 技術スタック

- **Next.js 14** (App Router, Server Components)
- **TypeScript** (strict)
- **Tailwind CSS** + カスタムブランド色（`#1a2e4a` 深紺 / `#d4a574` 金）
- **shadcn/ui 相当** の Button / Card / Badge / Table（ソースはリポジトリに同梱）
- **NextAuth.js** (Google OAuth, JWT セッション)
- **recharts** 7日間スコア推移 LineChart
- **qrcode.react** OMIアプリ貼付用QRコード
- **lucide-react** アイコン
- **`@cloudflare/next-on-pages`** 経由で Cloudflare Pages にデプロイ想定

## セットアップ手順

### 1. 依存インストール

```bash
cd dashboard
npm install
```

### 2. 環境変数

`.env.local.example` を `.env.local` にコピーして値を埋める。

```bash
cp .env.local.example .env.local
```

| 変数 | 取得方法 |
|---|---|
| `NEXTAUTH_URL` | 開発 `http://localhost:3000` / 本番 `https://<ドメイン>` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) でOAuthクライアントID（ウェブ）を作成 |
| `GOOGLE_CLIENT_SECRET` | 同上 |
| `WORKER_API_URL` | `omi-coaching-worker` のデプロイURL（例: `https://omi-coaching-worker.xxx.workers.dev`） |
| `WORKER_INTERNAL_SECRET` | dashboard→Worker 書き込み用の共有シークレット（任意） |

### 3. Google OAuth クライアント作成（手順）

1. [Google Cloud Console](https://console.cloud.google.com/) で新規プロジェクトを作成
2. 「APIとサービス」 → 「OAuth同意画面」で「外部」を選び、アプリ名 `OMIコーチング` を登録
3. 「認証情報」 → 「認証情報を作成」 → 「OAuthクライアントID」 → 「ウェブアプリケーション」
4. 承認済みリダイレクトURIに以下を追加：
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<本番ドメイン>/api/auth/callback/google`
5. 発行されたクライアントIDとシークレットを `.env.local` へ

### 4. ローカル開発

```bash
npm run dev
# → http://localhost:3000
```

### 5. 型チェック + ビルド

```bash
npm run build
```

## Cloudflare Pages にデプロイ

Workerと同じCloudflareアカウント (`homepagecompany1@gmail.com`) にデプロイする前提。

### 方式A: GitHub連携（推奨）

1. 本リポジトリをGitHubにpush
2. Cloudflare Dashboard → Pages → Create → Connect to Git
3. リポジトリを選び、ルートディレクトリを `dashboard/` に指定
4. ビルドコマンド: `npx @cloudflare/next-on-pages`
5. 出力ディレクトリ: `.vercel/output/static`
6. 環境変数を Pages 側にも同じく設定（`NEXTAUTH_URL` は本番ドメイン）

### 方式B: CLIで直デプロイ

```bash
# Cloudflareにログイン（対話）
npx wrangler login

# Pagesプロジェクト作成（初回のみ）
npx wrangler pages project create omi-coaching-dashboard

# ビルド & デプロイ
npm run pages:build
npm run pages:deploy
```

### Node互換性

`wrangler.toml` (Pages用) に以下フラグが必要：

```toml
compatibility_flags = ["nodejs_compat"]
compatibility_date = "2024-09-23"
```

NextAuthの暗号処理がNode APIを利用するため。

## 連携ポイント（Worker側）

ダッシュボードは以下のHTTPエンドポイントをWorkerに期待する。
実装が揃っていないうちは `lib/mock-data.ts` のダミーが返る。

| メソッド | パス | 用途 |
|---|---|---|
| `POST` | `/api/clients` | 新規クライアント登録（uid / name / email / token） |
| `GET` | `/api/scores/:uid` | ダッシュボード用の集計済みJSON |
| `GET` | `/api/history/:uid` | 日次評価の配列 |
| `POST` | `/webhook/audio?token=<tok>` | OMI公式アプリからの音声受信 |

## ディレクトリ構造

```
dashboard/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── history/route.ts
│   │   ├── scores/route.ts
│   │   └── setup/generate-token/route.ts
│   ├── dashboard/page.tsx
│   ├── history/page.tsx
│   ├── setup/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── providers/auth-provider.tsx
│   ├── ui/            # shadcn/ui 相当（button/card/badge/table）
│   ├── hero-sign-in.tsx
│   ├── history-table.tsx
│   ├── impression-cloud.tsx
│   ├── log-card.tsx
│   ├── setup-client.tsx
│   ├── site-footer.tsx
│   ├── site-header.tsx
│   ├── stat-card.tsx
│   └── trend-chart.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── mock-data.ts
│   ├── types.ts
│   └── utils.ts
├── types/
│   └── next-auth.d.ts
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── package.json
└── .env.local.example
```

## 次のステップ

- [ ] Google OAuthクライアントID発行 → `.env.local` 設定
- [ ] `NEXTAUTH_SECRET` 生成（`openssl rand -base64 32`）
- [ ] Worker側に `POST /api/clients` / `GET /api/scores/:uid` / `GET /api/history/:uid` を実装
- [ ] Cloudflare Pages に本番デプロイ
- [ ] 設定動画（1分）を撮影して `/setup` に埋め込み
- [ ] 特商法表記・プライバシーポリシーページ追加（営業部と調整）
