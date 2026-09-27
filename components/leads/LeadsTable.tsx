'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/context/CRMContext';
import { Lead, LeadStatus, PriorityLevel } from '@/types/crm';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MoreVertical,
  Plus,
  Mail,
  Phone,
  Flame,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Dropdown } from '@/components/ui/Dropdown';

interface LeadsTableProps {
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onNewLead: () => void;
}

export function LeadsTable({
  onSelectLead,
  onEditLead,
  onNewLead,
}: LeadsTableProps) {
  const { leads, deleteLead } = useCRM();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Lead>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesQuery =
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' || lead.status === statusFilter;
        const matchesPriority =
          priorityFilter === 'all' || lead.priority === priorityFilter;

        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          valA = (valA as string).toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (valA! < valB!) return sortOrder === 'asc' ? -1 : 1;
        if (valA! > valB!) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [leads, searchQuery, statusFilter, priorityFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusVariantMap: Record<LeadStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple'> = {
    new: 'cyan' as any,
    contacted: 'primary',
    qualified: 'purple',
    proposal: 'warning',
    won: 'success',
    lost: 'danger',
  };

  const priorityVariantMap: Record<PriorityLevel, 'danger' | 'warning' | 'neutral'> = {
    high: 'danger',
    medium: 'warning',
    low: 'neutral',
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter leads by name, company, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={onNewLead}
        >
          Add Contact
        </Button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800/80 dark:bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="cursor-pointer py-3.5 px-4 hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Contact / Title</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('company')}
                  className="cursor-pointer py-3.5 px-4 hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Company</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="cursor-pointer py-3.5 px-4 hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Stage</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('score')}
                  className="cursor-pointer py-3.5 px-4 hover:text-indigo-600 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('value')}
                  className="cursor-pointer py-3.5 px-4 hover:text-indigo-600 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Est. Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    {/* Name / Avatar / Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={lead.avatar}
                          name={lead.name}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {lead.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {lead.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {lead.company}
                    </td>

                    {/* Stage */}
                    <td className="py-3.5 px-4">
                      <Badge variant={statusVariantMap[lead.status]} size="sm" dot>
                        {lead.status.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                        <Flame
                          className={`w-3.5 h-3.5 ${
                            lead.score > 80
                              ? 'text-amber-500'
                              : 'text-slate-400'
                          }`}
                        />
                        <span>{lead.score}</span>
                      </div>
                    </td>

                    {/* Est. Value */}
                    <td className="py-3.5 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(lead.value)}
                    </td>

                    {/* Rep */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={lead.assignedTo?.avatar}
                          name={lead.assignedTo?.name || 'Rep'}
                          size="xs"
                        />
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-28">
                          {lead.assignedTo?.name?.split(' ')[0]}
                        </span>
                      </div>
                    </td>

                    {/* Action dropdown */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown
                        trigger={
                          <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        }
                        items={[
                          {
                            label: 'View Details',
                            onClick: () => onSelectLead(lead),
                          },
                          {
                            label: 'Edit Contact',
                            onClick: () => onEditLead(lead),
                          },
                          {
                            label: 'Delete Lead',
                            danger: true,
                            onClick: () => deleteLead(lead.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/40">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {filteredLeads.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {Math.min(currentPage * itemsPerPage, filteredLeads.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {filteredLeads.length}
            </span>{' '}
            leads
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <span className="font-semibold px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
