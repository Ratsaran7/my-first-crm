'use client';

import React, { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Lead, LeadStatus } from '@/types/crm';
import { Drawer } from '@/components/ui/Drawer';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ActivityLogger } from './ActivityLogger';
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Plus,
  Flame,
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils';
import { Tabs } from '@/components/ui/Tabs';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onOpenDealModal: (lead: Lead) => void;
}

export function LeadDetailDrawer({
  lead,
  isOpen,
  onClose,
  onEdit,
  onOpenDealModal,
}: LeadDetailDrawerProps) {
  const { updateLead, deleteLead, activities, deals } = useCRM();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('timeline');

  if (!lead) return null;

  const leadActivities = activities.filter(
    (a) => a.relatedTo?.type === 'lead' && a.relatedTo?.id === lead.id
  );

  const associatedDeals = deals.filter(
    (d) => d.leadId === lead.id || d.company === lead.company
  );

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateLead(lead.id, { status: newStatus });
    success('Status Updated', `Lead status marked as ${newStatus.toUpperCase()}`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove ${lead.name}?`)) {
      deleteLead(lead.id);
      success('Lead Deleted', `${lead.name} removed from CRM`);
      onClose();
    }
  };

  const statusVariantMap: Record<LeadStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple'> = {
    new: 'cyan' as any,
    contacted: 'primary',
    qualified: 'purple',
    proposal: 'warning',
    won: 'success',
    lost: 'danger',
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={lead.name}
      subtitle={`${lead.title} @ ${lead.company}`}
      width="xl"
    >
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <Avatar src={lead.avatar} name={lead.name} size="lg" status="online" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {lead.name}
                </h3>
                <Badge variant={statusVariantMap[lead.status]} dot>
                  {lead.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lead.title} at <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.company}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => onEdit(lead)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => onOpenDealModal(lead)}
            >
              Add Deal
            </Button>
          </div>
        </div>

        {/* Key Metrics Quick Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Est. Value
            </span>
            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(lead.value)}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Lead Score
            </span>
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {lead.score}/100
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Priority
            </span>
            <span className="text-base font-bold capitalize text-slate-900 dark:text-slate-100">
              {lead.priority}
            </span>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="rounded-xl border border-slate-200/80 p-4 space-y-3 bg-white dark:bg-slate-900/60 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Contact & Origin Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <a
                href={`mailto:${lead.email}`}
                className="hover:text-indigo-600 hover:underline truncate"
              >
                {lead.email}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{lead.phone || 'No phone provided'}</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {lead.company} {lead.city ? `(${lead.city}, ${lead.country})` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Source: <strong className="text-slate-900 dark:text-slate-100">{lead.source}</strong></span>
            </div>
          </div>

          {lead.tags && lead.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {lead.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Status Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">
            Pipeline Stage:
          </span>
          {(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as LeadStatus[]).map(
            (s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize shrink-0 transition-colors ${
                  lead.status === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>

        {/* Tabs for Timeline / Notes / Deals */}
        <div>
          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: 'timeline', label: 'Activity Feed', count: leadActivities.length },
              { id: 'log', label: 'Log Activity' },
              { id: 'deals', label: 'Deals', count: associatedDeals.length },
            ]}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'log' && (
          <div className="animate-fade-in">
            <ActivityLogger
              relatedTo={{
                type: 'lead',
                id: lead.id,
                name: lead.name,
              }}
              onLogged={() => setActiveTab('timeline')}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4 animate-fade-in">
            {leadActivities.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                No activity logged yet for this lead.
                <button
                  onClick={() => setActiveTab('log')}
                  className="block mx-auto mt-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  + Log a call, note, or meeting
                </button>
              </div>
            ) : (
              leadActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <Avatar name={act.createdBy.name} src={act.createdBy.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(act.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="space-y-3 animate-fade-in">
            {associatedDeals.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                No active deals linked to this lead yet.
                <button
                  onClick={() => onOpenDealModal(lead)}
                  className="block mx-auto mt-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  + Create deal for this lead
                </button>
              </div>
            ) : (
              associatedDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {deal.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Stage: <strong className="capitalize">{deal.stage}</strong> • {deal.probability}% Probability
                    </p>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(deal.value)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Danger zone / delete */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Created on {formatDateTime(lead.createdAt)}
          </span>
          <Button
            size="sm"
            variant="danger"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={handleDelete}
          >
            Delete Lead
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
