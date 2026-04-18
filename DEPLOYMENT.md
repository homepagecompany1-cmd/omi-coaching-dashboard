# OMI Coaching Dashboard デプロイ手順

## 📋 前提

以下がすべて完了していること:
- ✅ Cloudflare Worker `omi-coaching-worker` デプロイ済み
- ✅ D1 / R2 / Cron 稼働中
- ✅ ダッシュボード `npm run build` 成功

## 🎯 デプロイ経路の選択肢

| 方法 | 工数 | 費用 | 推奨度 |
|------|------|------|--------|
| **A: Vercel 直接デプロイ** | 5分 | 無料 | ⭐⭐⭐ 最推奨 |
| B: Cloudflare Pages（GitHub連携） | 15分 | 無料 | ⭐⭐ |
| C: Cloudflare Pages（ローカルビルド） | 30分+ | 無料 | ⭐（外付けSSDで不具合あり） |

---

## 🚀 A: Vercel デプロイ（推奨）

### 手順

```bash
# 1. Vercel CLIインストール（初回のみ）
npm install -g vercel

# 2. Vercelアカウント連携（ブラウザが開く）
vercel login

# 3. プロジェクト作成＆デプロイ
cd dashboard
vercel --prod

# 初回は対話で:
#   ? Set up and deploy? Y
#   ? Which scope? (自分のアカウント選択)
#   ? Link to existing project? N
#   ? What's your project's name? omi-coaching-dashboard
#   ? In which directory is your code located? ./
# → 自動ビルド＆デプロイ
```

### 環境変数の登録

Vercelダッシュボード（https://vercel.com/dashboard）→ プロジェクト選択 → Settings → Environment Variables で以下を追加:

```
NEXTAUTH_URL=https://<あなたのVercelドメイン>.vercel.app
NEXTAUTH_SECRET=（openssl rand -base64 32）
GOOGLE_CLIENT_ID=<Google Cloud Consoleで取得>
GOOGLE_CLIENT_SECRET=<Google Cloud Consoleで取得>
WORKER_API_URL=https://omi-coaching-worker.homepagecompany1.workers.dev
WORKER_INTERNAL_SECRET=<wrangler secret put WORKER_INTERNAL_SECRET で設定した値>
```

登録後、**再デプロイ**:
```bash
vercel --prod
```

### 独自ドメイン設定

1. Vercel → Project → Settings → Domains
2. `akiyoshi.com` 等を追加
3. 指示に従ってDNS設定（A レコード or CNAME）

---

## 🌩 B: Cloudflare Pages（GitHub連携）

既存のGitHubリポジトリがある場合はこちらが便利。

### 手順

1. GitHubリポジトリをpush（dashboard/配下を含む）
2. Cloudflare Dashboard → Workers & Pages → Create Application → Pages → Connect to Git
3. リポジトリ選択
4. 設定:
   - Framework preset: **Next.js**
   - Build command: `npx @cloudflare/next-on-pages`
   - Build output directory: `.vercel/output/static`
   - Root directory: `dashboard`
5. 環境変数をAで示したものと同じ内容で追加
6. **Compatibility flags**: `nodejs_compat` を追加（重要）
7. デプロイ

### デプロイURL

`https://omi-coaching-dashboard.pages.dev` のように発行される。
独自ドメイン追加も可能（Settings → Custom domains）。

---

## ⚠️ C: ローカルビルドでCF Pagesデプロイ（非推奨）

**既知の問題**: 外付けSSD上でビルドすると、`@cloudflare/next-on-pages` 内部の `JSON.parse` がバイナリファイルを読み込んでエラーになる。

### 対処法（それでもやる場合）

```bash
# 1. dashboardを内蔵SSDへ一時コピー
cp -r dashboard ~/tmp/dashboard
cd ~/tmp/dashboard

# 2. ビルド
rm -rf .next .vercel
npm install
npx @cloudflare/next-on-pages@latest

# 3. デプロイ
npx wrangler pages deploy .vercel/output/static --project-name omi-coaching-dashboard
```

---

## 🔐 Google OAuth 設定（デプロイ先に応じて必要）

### 手順

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. プロジェクト作成（既存でもOK）
3. 左メニュー → APIs & Services → OAuth consent screen
   - User Type: **External**
   - アプリ名: `OMI Coaching`
   - サポートメール: あなたのGmail
   - 承認済みドメイン: `vercel.app` or カスタムドメイン
4. Credentials → Create Credentials → OAuth Client ID
   - Application type: **Web application**
   - Name: `omi-coaching-dashboard`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://<本番ドメイン>`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://<本番ドメイン>/api/auth/callback/google`
5. 表示された `Client ID` / `Client Secret` を `.env.local` またはVercel環境変数に貼る

### 100ユーザー上限について

未確認アプリ（External・Testing）は100ユーザーまで。
超える場合は「公開」操作→Googleの無料審査（1-2週間）。

---

## 🧪 デプロイ後の動作確認

### チェックリスト

- [ ] トップページ `/` がロードされる
- [ ] 「Googleでサインイン」ボタンが動く
- [ ] サインイン後 `/setup` に遷移しQRコードが表示される
- [ ] QRコード/URLに埋め込まれたトークンで Worker の `/api/clients` が呼ばれ、D1に登録される
- [ ] `/dashboard` が表示される（初回はデータが空）
- [ ] Worker ログ (`wrangler tail`) でリクエストが届いているのを確認

---

## 📞 トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| `NEXTAUTH_URL mismatch` | 環境変数が本番URLと一致していない | Vercel/CFのEnv Varsを本番URLに修正 |
| `redirect_uri_mismatch` | Google Consoleのリダイレクト設定漏れ | Authorized redirect URIsに本番URL追加 |
| ダッシュボードがモックデータのまま | `WORKER_API_URL` 未設定 or Worker応答エラー | `curl` でWorkerの `/health` が通るか確認 |
| 401 unauthorized | `WORKER_INTERNAL_SECRET` 不一致 | `wrangler secret list` で確認、Env Varsに同じ値を設定 |
| 常に「Client not found」 | uid が clients テーブルに存在しない | 初回サインインフローで `/api/clients` POSTが成功しているか確認 |
