import type { DashboardData, HistoryRow } from './types';

/**
 * MVP用のダミーデータ。Workerのスコア API が未デプロイでもUIが成立する。
 * 実データが入り始めたら `lib/db.ts` から返す側に差し替える。
 */

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysAgoIso(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getMockDashboard(name = 'あなた'): DashboardData {
  return {
    client: {
      uid: 'demo-uid',
      name,
      email: 'demo@example.com',
      character_name: '煉獄杏寿郎',
      character_traits: 'ブレない意志・温かさ・行動力',
      ideal_self: '豊かさと誠実さを両立した自分',
      ideal_keywords: null,
      plan: 'initial',
      monthly_price: 8400,
      notion_db_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    today: {
      date: todayIso(),
      recordingMinutes: 263,
      calmness: 78,
      futureFocus: 65,
      consistency: 72,
    },
    last7: [
      { date: daysAgoIso(6), calmness: 62, futureFocus: 48, consistency: 55, elation: 40 },
      { date: daysAgoIso(5), calmness: 65, futureFocus: 52, consistency: 58, elation: 44 },
      { date: daysAgoIso(4), calmness: 70, futureFocus: 55, consistency: 62, elation: 50 },
      { date: daysAgoIso(3), calmness: 68, futureFocus: 60, consistency: 66, elation: 58 },
      { date: daysAgoIso(2), calmness: 74, futureFocus: 62, consistency: 68, elation: 62 },
      { date: daysAgoIso(1), calmness: 76, futureFocus: 64, consistency: 70, elation: 66 },
      { date: daysAgoIso(0), calmness: 78, futureFocus: 65, consistency: 72, elation: 70 },
    ],
    recentLogs: [
      {
        id: 5,
        time: '07:12',
        is_morning: true,
        summary: '朝の宣言。理想像を3回声に出して確信度を上げる練習。',
        ideal_word_count: 8,
        matched_phrases: ['豊かさ', '誠実', '行動する'],
      },
      {
        id: 4,
        time: '10:45',
        is_morning: false,
        summary: 'クライアントとの商談。価格の提示に迷いなく踏み込めた。',
        ideal_word_count: 5,
        matched_phrases: ['決断', '価値'],
      },
      {
        id: 3,
        time: '13:20',
        is_morning: false,
        summary: 'ランチでの雑談。ネガティブな話題に巻き込まれず軌道修正。',
        ideal_word_count: 3,
        matched_phrases: ['感謝', '未来'],
      },
      {
        id: 2,
        time: '16:05',
        is_morning: false,
        summary: '集中作業。独り言に未来志向のキーワードが頻出。',
        ideal_word_count: 11,
        matched_phrases: ['できる', '整える', '豊かさ'],
      },
      {
        id: 1,
        time: '21:30',
        is_morning: false,
        summary: '家族との会話。温かい語り口。煉獄的な声色が戻っていた。',
        ideal_word_count: 6,
        matched_phrases: ['家族', '温かさ', '誠実'],
      },
    ],
    impressionTags: [
      { word: '豊かさ', weight: 5 },
      { word: '誠実', weight: 4 },
      { word: '行動', weight: 4 },
      { word: '温かさ', weight: 3 },
      { word: '感謝', weight: 3 },
      { word: '決断', weight: 3 },
      { word: '未来', weight: 2 },
      { word: '家族', weight: 2 },
      { word: '価値', weight: 2 },
      { word: '整える', weight: 1 },
      { word: '穏やか', weight: 1 },
      { word: '軸', weight: 1 },
    ],
  };
}

export function getMockHistory(): HistoryRow[] {
  const rows: HistoryRow[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const base = 55 + Math.round(Math.sin(i / 2) * 10) + (14 - i);
    rows.push({
      date,
      goal_achievement: Math.min(100, Math.max(0, base - 3)),
      positive_rate: Math.min(100, Math.max(0, base + 8)),
      consistency_score: Math.min(100, Math.max(0, base + 2)),
      ideal_distance: Math.min(100, Math.max(0, base - 5)),
      elation_score: Math.min(100, Math.max(0, base + 4)),
      notion_synced: i < 10,
      notion_url:
        i < 10
          ? `https://www.notion.so/omi-coaching-${date.replace(/-/g, '')}`
          : null,
      feedback:
        i === 0
          ? '今日はブレない言葉を多く発した。その調子だ。'
          : '理想に近づく言葉を積み重ねている。'
    });
  }
  return rows;
}
