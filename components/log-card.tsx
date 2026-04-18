import { Badge } from '@/components/ui/badge';
import { Moon, Sun } from 'lucide-react';

interface Log {
  id: number;
  time: string;
  is_morning: boolean;
  summary: string;
  ideal_word_count: number;
  matched_phrases: string[];
}

export function LogCard({ log }: { log: Log }) {
  return (
    <div className="rounded-lg border border-brand-navy/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 font-semibold text-brand-navy">
          {log.is_morning ? (
            <Sun className="h-3.5 w-3.5 text-brand-gold-dark" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-brand-navy-light" />
          )}
          {log.time}
        </span>
        <Badge variant="outline">
          理想語 {log.ideal_word_count}
        </Badge>
      </div>
      <p className="text-sm text-brand-navy-dark">{log.summary}</p>
      {log.matched_phrases.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {log.matched_phrases.map((p) => (
            <Badge key={p} variant="secondary" className="text-[10px]">
              {p}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
