/**
 * D1スキーマに対応する型定義。
 * `技術部/omi-coaching-worker/schema.sql` と同期して維持する。
 */

export interface Client {
  uid: string;
  name: string;
  email: string;
  character_name: string;
  character_traits: string;
  ideal_self: string;
  ideal_keywords: string | null;
  plan: 'initial' | 'growth' | 'stable' | string;
  monthly_price: number;
  notion_db_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyEvaluation {
  uid: string;
  date: string;
  // 第一部：日々の体感変化
  goal_achievement: number;
  positive_rate: number;
  consistency_score: number;
  ideal_distance: number;
  feedback: string;
  tomorrow_action: string;
  // 第二部：高揚体験
  morning_declaration_count: number;
  daily_ideal_word_count: number;
  total_change_moment_count: number;
  image_count: number;
  vividness_score: number;
  elation_score: number;
  ideal_action: string;
  todays_question: string;
  // メタ
  notion_synced: number;
  email_sent: number;
  created_at: string;
}

export interface DailyAxes {
  uid: string;
  date: string;
  self_emission: number;
  image_vividness: number;
  conviction: number;
  pre_celebration: number;
  focus_consistency: number;
  behavior_change: number;
  ideal_distance: number;
  elation_frequency: number;
  habit_formation: number;
  ideal_evolution: number;
  voice_insight: string;
  streak: number;
}

export interface DailyVoiceSummary {
  uid: string;
  date: string;
  sample_count: number;
  avg_confidence: number;
  avg_tension: number;
  avg_activeness: number;
  avg_emotion_range: number;
  total_elation_peaks: number;
  total_duration_sec: number;
}

export interface TranscriptLog {
  id: number;
  uid: string;
  memory_id: string;
  created_at: string;
  is_morning: number;
  transcript_summary: string;
  ideal_word_count: number;
  matched_phrases: string; // JSON
}

export interface ImpressionTag {
  word: string;
  weight: number; // 1..5
}

export interface DashboardData {
  client: Client | null;
  today: {
    date: string;
    recordingMinutes: number;
    calmness: number; // positive_rate
    futureFocus: number; // pre_celebration
    consistency: number; // consistency_score
  };
  last7: Array<{
    date: string;
    calmness: number;
    futureFocus: number;
    consistency: number;
    elation: number;
  }>;
  recentLogs: Array<{
    id: number;
    time: string;
    is_morning: boolean;
    summary: string;
    ideal_word_count: number;
    matched_phrases: string[];
  }>;
  impressionTags: ImpressionTag[];
}

export interface HistoryRow {
  date: string;
  goal_achievement: number;
  positive_rate: number;
  consistency_score: number;
  ideal_distance: number;
  elation_score: number;
  notion_synced: boolean;
  notion_url: string | null;
  feedback: string;
}
