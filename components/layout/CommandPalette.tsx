'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/context/CRMContext';
import {
  Search,
  User,
  DollarSign,
  Building2,
  CheckSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { leads, deals, companies, tasks } = useCRM();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Handled in parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    const matchedLeads = leads
      .filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((l) => ({
        id: l.id,
        type: 'Lead',
        title: l.name,
        subtitle: `${l.title} @ ${l.company}`,
        meta: formatCurrency(l.value),
        icon: User,
        action: () => {
          router.push('/leads');
          onClose();
        },
      }));

    const matchedDeals = deals
      .filter((d) => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q))
      .slice(0, 3)
      .map((d) => ({
        id: d.id,
        type: 'Deal',
        title: d.title,
        subtitle: `${d.company} • ${d.stage.toUpperCase()}`,
        meta: formatCurrency(d.value),
        icon: DollarSign,
        action: () => {
          router.push('/pipeline');
          onClose();
        },
      }));

    const matchedCompanies = companies
      .filter((c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        type: 'Company',
        title: c.name,
        subtitle: `${c.industry} • ${c.location}`,
        meta: c.tier,
        icon: Building2,
        action: () => {
          router.push('/companies');
          onClose();
        },
      }));

    const matchedTasks = tasks
      .filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        type: 'Task',
        title: t.title,
        subtitle: `Priority: ${t.priority.toUpperCase()}`,
        meta: t.status,
        icon: CheckSquare,
        action: () => {
          router.push('/tasks');
          onClose();
        },
      }));

    return [...matchedLeads, ...matchedDeals, ...matchedCompanies, ...matchedTasks];
  }, [query, leads, deals, companies, tasks, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6 animate-fade-in">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 animate-slide-down">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search leads, deals, companies, tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-indigo-500/70" />
              <p>Type to search anything across your CRM.</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">Leads</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">Deals</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">Companies</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px]">Tasks</span>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No matching records found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredResults.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={item.action}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-3">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {item.meta}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with shortcuts</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
