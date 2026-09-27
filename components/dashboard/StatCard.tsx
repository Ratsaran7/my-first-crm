import React from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changePeriod?: string;
  icon: React.ReactNode;
  iconBg?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  changePeriod = 'vs last month',
  icon,
  iconBg = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
  description,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card hoverEffect className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </h3>
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl shrink-0 shadow-2xs', iconBg)}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {change !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-bold',
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {isPositive ? `+${change}%` : `${change}%`}
          </span>
        )}

        <span className="text-slate-500 dark:text-slate-400">
          {description || changePeriod}
        </span>
      </div>
    </Card>
  );
}
