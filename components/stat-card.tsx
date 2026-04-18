import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

export function StatCard({
  icon,
  label,
  value,
  suffix,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">
            {label}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-navy text-brand-gold-light">
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold text-brand-navy">
          {value}
          {suffix && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {suffix}
            </span>
          )}
        </p>
        {hint && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}
