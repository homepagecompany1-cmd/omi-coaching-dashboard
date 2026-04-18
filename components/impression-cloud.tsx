import { cn } from '@/lib/utils';
import type { ImpressionTag } from '@/lib/types';

/**
 * 簡易ワードクラウド：weightに応じてフォントサイズと色の濃さを変える。
 */
export function ImpressionCloud({ tags }: { tags: ImpressionTag[] }) {
  // weightの降順で並べて視覚リズムを作る
  const sorted = [...tags].sort((a, b) => b.weight - a.weight);

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
      {sorted.map((t) => (
        <span
          key={t.word}
          className={cn(
            'inline-block font-bold leading-none transition-colors',
            t.weight >= 5 && 'text-3xl text-brand-navy',
            t.weight === 4 && 'text-2xl text-brand-navy',
            t.weight === 3 && 'text-xl text-brand-gold-dark',
            t.weight === 2 && 'text-base text-brand-navy/70',
            t.weight <= 1 && 'text-sm text-muted-foreground'
          )}
        >
          #{t.word}
        </span>
      ))}
      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground">
          まだタグが集まっていません。明日の会話を楽しみに。
        </p>
      )}
    </div>
  );
}
