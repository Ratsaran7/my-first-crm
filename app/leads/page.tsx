'use client';

import React, { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadDetailDrawer } from '@/components/leads/LeadDetailDrawer';
import { LeadModal } from '@/components/leads/LeadModal';
import { DealModal } from '@/components/pipeline/DealModal';
import { Lead } from '@/types/crm';
import { Users, UserCheck, Flame, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LeadsPage() {
  const { leads } = useCRM();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealLeadContext, setDealLeadContext] = useState<Lead | null>(null);

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsLeadModalOpen(true);
  };

  const handleOpenDealModal = (lead: Lead) => {
    setDealLeadContext(lead);
    setIsDealModalOpen(true);
  };

  const handleNewLead = () => {
    setLeadToEdit(null);
    setIsLeadModalOpen(true);
  };

  const highIntentCount = leads.filter((l) => l.score >= 80).length;
  const qualifiedCount = leads.filter(
    (l) => l.status === 'qualified' || l.status === 'proposal'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Leads & Contacts Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage prospects, track engagement score, and convert into sales opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleNewLead}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Quick metrics summary chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Contacts
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {leads.length} Prospects
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60">
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              High Intent (Score &gt; 80)
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {highIntentCount} Hot Leads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60">
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Qualified & In Proposal
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {qualifiedCount} Active
            </p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <LeadsTable
        onSelectLead={handleSelectLead}
        onEditLead={handleEditLead}
        onNewLead={handleNewLead}
      />

      {/* Detail Slide-over */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(lead) => {
          setIsDrawerOpen(false);
          handleEditLead(lead);
        }}
        onOpenDealModal={(lead) => {
          setIsDrawerOpen(false);
          handleOpenDealModal(lead);
        }}
      />

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        leadToEdit={leadToEdit}
      />

      <DealModal
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
        initialLead={dealLeadContext}
      />
    </div>
  );
}
