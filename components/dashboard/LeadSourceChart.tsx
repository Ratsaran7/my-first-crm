'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { leadSourcesData } from '@/data/mockData';

export function LeadSourceChart() {
  const [mounted, setMounted] = useState(false);

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2.5 shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-slate-900 dark:text-slate-100">{data.name}</p>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            {data.count} leads ({data.value}%)
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
          <CardTitle>Lead Sources</CardTitle>
          <CardDescription>Acquisition channels driving pipeline</CardDescription>
        </div>
      </CardHeader>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between pt-2">
        <div className="w-full sm:w-1/2 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={leadSourcesData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {leadSourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full sm:w-1/2 space-y-2 px-2 pb-2">
          {leadSourcesData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {item.name}
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
