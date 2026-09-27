'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useCRM } from '@/context/CRMContext';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency } from '@/lib/utils';
import { Trophy, Award, Target } from 'lucide-react';

export function RepPerformance() {
  const { teamMembers, deals } = useCRM();

  const repsWithStats = teamMembers.map((member) => {
    const memberDeals = deals.filter((d) => d.assignedTo?.id === member.id);
    const wonDeals = memberDeals.filter((d) => d.stage === 'won');
    const totalWonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const quota = 150000;
    const progress = Math.min(100, Math.round((totalWonRevenue / quota) * 100));

    return {
      ...member,
      dealsCount: memberDeals.length,
      wonDealsCount: wonDeals.length,
      revenueWon: totalWonRevenue,
      quota,
      progress,
    };
  }).sort((a, b) => b.revenueWon - a.revenueWon);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <CardTitle>Sales Rep Leaderboard</CardTitle>
          <CardDescription>Individual quota attainment & closed revenue</CardDescription>
        </div>
        <Trophy className="w-5 h-5 text-amber-500" />
      </CardHeader>

      <div className="space-y-4 pt-2">
        {repsWithStats.map((rep, index) => {
          return (
            <div
              key={rep.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar src={rep.avatar} name={rep.name} size="md" />
                    {index === 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                        1
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {rep.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {rep.role} • {rep.wonDealsCount} deals won
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 block">
                    {formatCurrency(rep.revenueWon)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    of {formatCurrency(rep.quota)} target
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Quota Progress</span>
                  <span>{rep.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      rep.progress >= 90
                        ? 'bg-emerald-500'
                        : rep.progress >= 50
                        ? 'bg-indigo-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${rep.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
