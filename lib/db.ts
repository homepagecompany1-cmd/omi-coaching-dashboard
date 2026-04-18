/**
 * データ取得レイヤ。
 *
 * MVPでは Cloudflare Worker (`omi-coaching-worker`) の HTTP API を叩く。
 * 将来 Cloudflare Pages にデプロイして D1 に直接バインドする場合も、
 * この関数群のシグネチャを保つだけで差し替え可能にする。
 */

import type { DashboardData, HistoryRow } from './types';
import { getMockDashboard, getMockHistory } from './mock-data';

const WORKER = process.env.WORKER_API_URL ?? '';
const SECRET = process.env.WORKER_INTERNAL_SECRET ?? '';

function authHeaders(): HeadersInit {
  const h: Record<string, string> = { 'content-type': 'application/json' };
  if (SECRET) h['x-internal-secret'] = SECRET;
  return h;
}

/**
 * WorkerのURLが未設定、もしくは取得失敗時は mock にフォールバックする。
 */
async function safeFetchJson<T>(path: string): Promise<T | null> {
  if (!WORKER) return null;
  try {
    const res = await fetch(`${WORKER}${path}`, {
      headers: authHeaders(),
      // ダッシュボードは頻繁に最新値を見たいので cache しない
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchDashboard(
  uid: string,
  name: string
): Promise<DashboardData> {
  const data = await safeFetchJson<DashboardData>(
    `/api/scores/${encodeURIComponent(uid)}`
  );
  return data ?? getMockDashboard(name);
}

export async function fetchHistory(uid: string): Promise<HistoryRow[]> {
  const data = await safeFetchJson<HistoryRow[]>(
    `/api/history/${encodeURIComponent(uid)}`
  );
  return data ?? getMockHistory();
}

export interface GenerateTokenResult {
  token: string;
  webhookUrl: string;
  createdAt: string;
}

/**
 * UUIDv4を発行して clients テーブルにINSERTさせる。
 * Workerがまだ `/api/clients` を実装していない場合は、
 * ローカルでUUIDだけ発行して画面上で使う（MVP挙動）。
 */
export async function registerClient(params: {
  uid: string;
  name: string;
  email: string;
}): Promise<GenerateTokenResult> {
  const token = crypto.randomUUID();
  // Worker側の登録API（未実装なら失敗するが、UIは続行する）
  if (WORKER) {
    try {
      await fetch(`${WORKER}/api/clients`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ...params, token }),
      });
    } catch {
      // ignore — MVPではUUIDさえあれば設定フローを進められる
    }
  }
  const base =
    WORKER || 'https://omi-coaching-worker.YOUR_SUBDOMAIN.workers.dev';
  return {
    token,
    webhookUrl: `${base}/webhook/audio?token=${token}`,
    createdAt: new Date().toISOString(),
  };
}
