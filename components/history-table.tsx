'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import type { HistoryRow } from '@/lib/types';
import { formatDateJa } from '@/lib/utils';

function toCsv(rows: HistoryRow[]): string {
  const header = [
    '日付',
    '目標達成',
    'ポジティブ率',
    '一貫性',
    '理想距離',
    '高揚',
    'Notion同期',
    'フィードバック',
  ].join(',');
  const body = rows
    .map((r) =>
      [
        r.date,
        r.goal_achievement,
        r.positive_rate,
        r.consistency_score,
        r.ideal_distance,
        r.elation_score,
        r.notion_synced ? 'yes' : 'no',
        `"${(r.feedback ?? '').replace(/"/g, '""')}"`,
      ].join(',')
    )
    .join('\n');
  return `${header}\n${body}`;
}

function downloadCsv(rows: HistoryRow[]) {
  const csv = toCsv(rows);
  // UTF-8 BOM を付けてExcel互換にする
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `omi-coaching-history-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function HistoryTable({ rows }: { rows: HistoryRow[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="gold"
          size="sm"
          onClick={() => downloadCsv(rows)}
          disabled={rows.length === 0}
        >
          <Download className="h-4 w-4" />
          CSVエクスポート
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日付</TableHead>
            <TableHead className="text-right">目標</TableHead>
            <TableHead className="text-right">穏やか</TableHead>
            <TableHead className="text-right">一貫性</TableHead>
            <TableHead className="text-right">理想距離</TableHead>
            <TableHead className="text-right">高揚</TableHead>
            <TableHead>Notion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                まだ履歴がありません。明日の朝の宣言から始めましょう。
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => (
              <TableRow key={r.date}>
                <TableCell className="font-medium text-brand-navy">
                  {formatDateJa(r.date)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {r.goal_achievement}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {r.positive_rate}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {r.consistency_score}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {r.ideal_distance}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {r.elation_score}
                </TableCell>
                <TableCell>
                  {r.notion_synced && r.notion_url ? (
                    <a
                      href={r.notion_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-navy hover:text-brand-gold-dark"
                    >
                      <ExternalLink className="h-4 w-4" />
                      開く
                    </a>
                  ) : (
                    <Badge variant="outline">未同期</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
