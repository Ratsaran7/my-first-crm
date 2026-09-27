'use client';

import React from 'react';
import { Deal, DealStage } from '@/types/crm';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import {
  MoreVertical,
  Calendar,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  onMoveStage: (id: string, stage: DealStage) => void;
  onDelete: (id: string) => void;
}

export function DealCard({
  deal,
  onEdit,
  onMoveStage,
  onDelete,
}: DealCardProps) {
  const priorityVariantMap = {
    high: 'danger' as const,
    medium: 'warning' as const,
    low: 'neutral' as const,
  };

  const stageOptions: { label: string; stage: DealStage }[] = [
    { label: 'Move to Discovery', stage: 'discovery' },
    { label: 'Move to Qualified', stage: 'qualified' },
    { label: 'Move to Proposal Sent', stage: 'proposal' },
    { label: 'Move to In Negotiation', stage: 'negotiation' },
    { label: 'Mark as Closed Won 🎉', stage: 'won' },
    { label: 'Mark as Closed Lost', stage: 'lost' },
  ];

  return (
    <div
      onClick={() => onEdit(deal)}
      className="group relative flex flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-indigo-400 hover:shadow-cardHover dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-500/70 transition-all cursor-pointer select-none space-y-3"
    >
      {/* Top row: Company & Menu */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
            {deal.company}
          </span>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
            {deal.title}
          </h4>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={
              <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            }
            items={[
              { label: 'Edit Deal', onClick: () => onEdit(deal) },
              ...stageOptions
                .filter((s) => s.stage !== deal.stage)
                .map((s) => ({
                  label: s.label,
                  onClick: () => onMoveStage(deal.id, s.stage),
                })),
              {
                label: 'Delete Deal',
                danger: true,
                onClick: () => onDelete(deal.id),
              },
            ]}
          />
        </div>
      </div>

      {/* Value & Probability */}
      <div className="flex items-center justify-between">
        <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          {formatCurrency(deal.value)}
        </span>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {deal.probability}% win prob.
        </span>
      </div>

      {/* Probability Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            deal.stage === 'won'
              ? 'bg-emerald-500'
              : deal.stage === 'lost'
              ? 'bg-rose-500'
              : 'bg-indigo-500'
          }`}
          style={{ width: `${deal.probability}%` }}
        />
      </div>

      {/* Tags */}
      {deal.tags && deal.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {deal.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
          {deal.tags.length > 2 && (
            <span className="text-[10px] text-slate-400">
              +{deal.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer: Date & Rep */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(deal.expectedCloseDate)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant={priorityVariantMap[deal.priority]} size="sm">
            {deal.priority}
          </Badge>
          <Avatar
            src={deal.assignedTo?.avatar}
            name={deal.assignedTo?.name || 'Rep'}
            size="xs"
          />
        </div>
      </div>
    </div>
  );
}
