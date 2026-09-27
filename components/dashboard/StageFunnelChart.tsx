'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useCRM } from '@/context/CRMContext';
import { pipelineStages } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export function StageFunnelChart() {
  const [mounted, setMounted] = useState(false);
  const { deals } = useCRM();
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

  const chartData = pipelineStages
    .filter((s) => s.id !== 'lost')
    .map((stage) => {
      const stageDeals = deals.filter((d) => d.stage === stage.id);
      const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
      return {
        stage: stage.label,
        value: totalValue,
        count: stageDeals.length,
        color: stage.color,
      };
    });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">{data.stage}</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
            Pipeline: {formatCurrency(data.value)}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            {data.count} {data.count === 1 ? 'deal' : 'deals'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <CardTitle>Pipeline Funnel</CardTitle>
          <CardDescription>Deal volume and total value across active sales stages</CardDescription>
        </div>
      </CardHeader>

      <div className="flex-1 w-full h-72 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12 }}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
