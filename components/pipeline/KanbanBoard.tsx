'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Deal, DealStage } from '@/types/crm';
import { pipelineStages } from '@/data/mockData';
import { KanbanColumn } from './KanbanColumn';
import { DealModal } from './DealModal';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Filter, DollarSign, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function KanbanBoard() {
  const { deals, updateDealStage, deleteDeal, teamMembers } = useCRM();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRep, setSelectedRep] = useState('all');
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickAddStage, setQuickAddStage] = useState<DealStage>('discovery');

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.contactName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRep =
        selectedRep === 'all' || deal.assignedTo?.id === selectedRep;

      return matchesSearch && matchesRep;
    });
  }, [deals, searchQuery, selectedRep]);

  const handleEditDeal = (deal: Deal) => {
    setDealToEdit(deal);
    setIsModalOpen(true);
  };

  const handleQuickAdd = (stage: DealStage) => {
    setDealToEdit(null);
    setQuickAddStage(stage);
    setIsModalOpen(true);
  };

  const handleMoveStage = (id: string, stage: DealStage) => {
    updateDealStage(id, stage);
    success('Stage Updated', `Deal shifted to ${stage.toUpperCase()}`);
  };

  const handleDeleteDeal = (id: string) => {
    if (confirm('Delete this deal opportunity from pipeline?')) {
      deleteDeal(id);
      success('Deal Deleted', 'Deal removed from pipeline');
    }
  };

  const activePipelineSum = filteredDeals
    .filter((d) => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deals or accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedRep}
            onChange={(e) => setSelectedRep(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Deal Owners</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-900/60 text-xs">
            <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Pipeline:</span>
            <strong className="text-indigo-700 dark:text-indigo-300 font-bold">
              {formatCurrency(activePipelineSum)}
            </strong>
          </div>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => handleQuickAdd('discovery')}
          >
            New Deal
          </Button>
        </div>
      </div>

      {/* Kanban Horizontal Scroll Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
        {pipelineStages.map((stage) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={stageDeals}
              onEditDeal={handleEditDeal}
              onMoveStage={handleMoveStage}
              onDeleteDeal={handleDeleteDeal}
              onQuickAdd={handleQuickAdd}
            />
          );
        })}
      </div>

      {/* Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dealToEdit={dealToEdit}
      />
    </div>
  );
}
