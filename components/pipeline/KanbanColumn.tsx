'use client';

import React from 'react';
import { Deal, DealStage, PipelineStageConfig } from '@/types/crm';
import { DealCard } from './DealCard';
import { formatCurrency } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  stage: PipelineStageConfig;
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onMoveStage: (id: string, stage: DealStage) => void;
  onDeleteDeal: (id: string) => void;
  onQuickAdd: (stage: DealStage) => void;
}

export function KanbanColumn({
  stage,
  deals,
  onEditDeal,
  onMoveStage,
  onDeleteDeal,
  onQuickAdd,
}: KanbanColumnProps) {
  const columnTotal = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col w-80 shrink-0 rounded-2xl bg-slate-100/70 p-3.5 border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {stage.label}
          </h3>
          <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {deals.length}
          </span>
        </div>

        <button
          onClick={() => onQuickAdd(stage.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title={`Add deal to ${stage.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Stage Total Sum */}
      <div className="py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Total Stage Value</span>
        <span className="text-slate-900 dark:text-slate-100 font-bold">
          {formatCurrency(columnTotal)}
        </span>
      </div>

      {/* Cards list */}
      <div className="flex-1 overflow-y-auto space-y-3 pt-1 min-h-[400px]">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            <span>No deals in this stage</span>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onEdit={onEditDeal}
              onMoveStage={onMoveStage}
              onDelete={onDeleteDeal}
            />
          ))
        )}
      </div>
    </div>
  );
}
