'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCRM } from '@/context/CRMContext';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Building2,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { leads, deals, tasks, resetDemoData } = useCRM();
  const { success } = useToast();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const activeLeadsCount = leads.filter((l) => l.status !== 'won' && l.status !== 'lost').length;

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Leads & Contacts',
      href: '/leads',
      icon: Users,
      badge: activeLeadsCount > 0 ? activeLeadsCount : undefined,
    },
    {
      name: 'Deals Pipeline',
      href: '/pipeline',
      icon: Kanban,
      badge: deals.length > 0 ? deals.length : undefined,
    },
    {
      name: 'Companies',
      href: '/companies',
      icon: Building2,
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    },
    {
      name: 'Analytics & Reports',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleResetData = () => {
    if (confirm('Reset all CRM records to initial demo dataset?')) {
      resetDemoData();
      success('CRM Data Reset', 'Initial sample records restored successfully.');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Nexus<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
                </span>
                <span className="rounded bg-indigo-100 dark:bg-indigo-950/80 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:text-indigo-300">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Portfolio Edition</p>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Platform
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 group',
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-700 shadow-xs dark:bg-indigo-950/50 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold',
                      item.badgeColor ||
                        (isActive
                          ? 'bg-indigo-200/70 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner & Reset Card */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div className="rounded-xl p-3 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 dark:border-indigo-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Interactive Demo</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Create, edit, drag deals, or log activities freely.
            </p>
            <button
              onClick={handleResetData}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300/80 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
