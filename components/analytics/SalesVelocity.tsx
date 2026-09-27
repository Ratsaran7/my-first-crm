'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useCRM } from '@/context/CRMContext';
import { formatCurrency } from '@/lib/utils';
import { Zap, Clock, ShieldCheck, PieChart } from 'lucide-react';

export function SalesVelocity() {
  const { deals, leads } = useCRM();

  const wonDeals = deals.filter((d) => d.stage === 'won');
  const lostDeals = deals.filter((d) => d.stage === 'lost');
  const activeDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');

  const winRate =
    wonDeals.length + lostDeals.length > 0
      ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
      : 80;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <CardTitle>Sales Velocity & Efficiency</CardTitle>
          <CardDescription>Pipeline throughput and conversion cycle health</CardDescription>
        </div>
        <Zap className="w-5 h-5 text-indigo-500" />
      </CardHeader>

      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Avg Deal Cycle
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              28 Days
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold mt-0.5">
              ↓ 4 days faster
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Historical Win Rate
            </span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {winRate}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {wonDeals.length} won / {lostDeals.length} lost
            </span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pipeline Health Indicators
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Lead-to-Opportunity Rate</span>
              <strong className="text-slate-900 dark:text-slate-100">68%</strong>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '68%' }} />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-600 dark:text-slate-300">Proposal Acceptance Rate</span>
              <strong className="text-slate-900 dark:text-slate-100">82%</strong>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '82%' }} />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-600 dark:text-slate-300">Enterprise Expansion Rate</span>
              <strong className="text-slate-900 dark:text-slate-100">45%</strong>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
