'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { revenueMonthlyData } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="h-88 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </Card>
    );
  }

  const isDark = theme === 'dark';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">{label} 2024</p>
          <div className="space-y-1">
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-between gap-4">
              <span>Closed Revenue:</span>
              <span>{formatCurrency(payload[0]?.value)}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-between gap-4">
              <span>Quota Target:</span>
              <span>{formatCurrency(payload[1]?.value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <CardTitle>Revenue Velocity</CardTitle>
          <CardDescription>Monthly closed revenue performance against team target</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Target</span>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 w-full h-72 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueMonthlyData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12 }}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke={isDark ? '#475569' : '#cbd5e1'}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#targetGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
