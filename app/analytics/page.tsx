'use client';

import React from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { RepPerformance } from '@/components/analytics/RepPerformance';
import { SalesVelocity } from '@/components/analytics/SalesVelocity';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StageFunnelChart } from '@/components/dashboard/StageFunnelChart';
import { LeadSourceChart } from '@/components/dashboard/LeadSourceChart';
import { Button } from '@/components/ui/Button';
import { Download, FileText, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const { deals, leads, metrics } = useCRM();
  const { success } = useToast();

  const handleExportCSV = () => {
    // Generate CSV string of deals
    const headers = ['Deal ID', 'Title', 'Company', 'Contact', 'Value', 'Stage', 'Probability', 'Close Date'];
    const rows = deals.map((d) => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.company.replace(/"/g, '""')}"`,
      `"${d.contactName}"`,
      d.value,
      d.stage,
      `${d.probability}%`,
      d.expectedCloseDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NexusCRM_Deals_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Report Exported', 'CSV report downloaded successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Reports & Revenue Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into quarterly revenue pacing, conversion rates, and sales rep quota progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export CSV Report
          </Button>
        </div>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Closed Won Total
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(metrics.totalRevenue)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              In-Flight Pipeline
            </span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {formatCurrency(metrics.pipelineValue)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Average Deal Size
            </span>
            <span className="text-xl font-black text-purple-600 dark:text-purple-400">
              {formatCurrency(metrics.averageDealSize)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RevenueChart />
        <StageFunnelChart />
      </div>

      {/* Rep Leaderboard & Sales Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RepPerformance />
        <SalesVelocity />
      </div>
    </div>
  );
}
