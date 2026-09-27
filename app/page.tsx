'use client';

import React, { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StageFunnelChart } from '@/components/dashboard/StageFunnelChart';
import { LeadSourceChart } from '@/components/dashboard/LeadSourceChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { Button } from '@/components/ui/Button';
import { LeadModal } from '@/components/leads/LeadModal';
import { DealModal } from '@/components/pipeline/DealModal';
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Plus,
  Zap,
  ArrowUpRight,
  Briefcase,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { metrics, currentRep } = useCRM();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-indigo-950/90 to-slate-950 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Q1 2024 Sales Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentRep.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl">
            You have <strong className="text-white">{metrics.pipelineDealsCount} active deals</strong> in the pipeline valued at <strong className="text-emerald-400">{formatCurrency(metrics.pipelineValue)}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            size="md"
            variant="secondary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsLeadModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/10"
          >
            Add Lead
          </Button>
          <Button
            size="md"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsDealModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30"
          >
            Create Deal
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Active Pipeline"
          value={formatCurrency(metrics.pipelineValue)}
          change={metrics.revenueGrowth}
          icon={<DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/60"
        />

        <StatCard
          title="Closed Won Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          change={24.8}
          icon={<Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />

        <StatCard
          title="Win Rate"
          value={`${metrics.winRate}%`}
          change={metrics.winRateGrowth}
          icon={<TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
        />

        <StatCard
          title="Active Leads"
          value={metrics.activeLeadsCount.toString()}
          change={metrics.leadsGrowth}
          icon={<Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
          iconBg="bg-cyan-50 dark:bg-cyan-950/60"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <LeadSourceChart />
        </div>
      </div>

      {/* Second Charts & Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <StageFunnelChart />
        </div>
        <div className="lg:col-span-1">
          <UpcomingTasks />
        </div>
      </div>

      {/* Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/70 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Quick Navigation
            </h3>
            <div className="space-y-2">
              <Link
                href="/pipeline"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span>Interactive Kanban Pipeline</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                href="/leads"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>Contacts & Lead Scoring</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </Link>

              <Link
                href="/analytics"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200 group"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Sales Rep Leaderboard</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
      <DealModal
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
      />
    </div>
  );
}
