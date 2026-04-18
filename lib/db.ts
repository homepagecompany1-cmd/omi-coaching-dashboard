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
 * Worker に clients 登録を依頼し、webhook_token を受け取る。
 * Worker が未構成の場合はエラーを投げる（fail-close）。
 */
export async function registerClient(params: {
  uid: string;
  name: string;
  email: string;
}): Promise<GenerateTokenResult> {
  if (!WORKER || !SECRET) {
    throw new Error('WORKER_API_URL / WORKER_INTERNAL_SECRET が未設定です');
  }

  const res = await fetch(`${WORKER}/api/clients`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`client registration failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    client?: { uid?: string; webhook_token?: string };
  };
  const token = data.client?.webhook_token;
  if (!token) {
    throw new Error('Worker did not return webhook_token');
  }

  const uidEnc = encodeURIComponent(params.uid);
  const tokenEnc = encodeURIComponent(token);
  return {
    token,
    webhookUrl: `${WORKER}/webhook/memory?uid=${uidEnc}&token=${tokenEnc}`,
    createdAt: new Date().toISOString(),
  };
}
