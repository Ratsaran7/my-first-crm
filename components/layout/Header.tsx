'use client';

import React, { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Search,
  Menu,
  Sun,
  Moon,
  Plus,
  UserPlus,
  DollarSign,
  Building2,
  CheckSquare,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { LeadModal } from '@/components/leads/LeadModal';
import { DealModal } from '@/components/pipeline/DealModal';
import { TaskModal } from '@/components/tasks/TaskModal';
import { CompanyModal } from '@/components/companies/CompanyModal';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
}

export function Header({
  onOpenMobileSidebar,
  onOpenCommandPalette,
}: HeaderProps) {
  const { currentRep, teamMembers, setCurrentRep } = useCRM();
  const { theme, toggleTheme } = useTheme();

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const quickActionItems = [
    {
      label: 'Add Lead',
      icon: <UserPlus className="w-4 h-4 text-indigo-500" />,
      onClick: () => setIsLeadModalOpen(true),
    },
    {
      label: 'Create Deal',
      icon: <DollarSign className="w-4 h-4 text-emerald-500" />,
      onClick: () => setIsDealModalOpen(true),
    },
    {
      label: 'Add Task',
      icon: <CheckSquare className="w-4 h-4 text-amber-500" />,
      onClick: () => setIsTaskModalOpen(true),
    },
    {
      label: 'New Company',
      icon: <Building2 className="w-4 h-4 text-cyan-500" />,
      onClick: () => setIsCompanyModalOpen(true),
    },
  ];

  const repSwitcherItems = teamMembers.map((member) => ({
    label: `${member.name} (${member.role || 'Sales'})`,
    onClick: () => setCurrentRep(member),
  }));

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 lg:hidden focus:outline-none"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Quick Search Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5 text-xs text-slate-400 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-700 transition-colors w-48 sm:w-64 md:w-80 justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Search leads, deals, tasks...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Theme, Rep Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Dropdown */}
          <Dropdown
            trigger={
              <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                <span className="hidden sm:inline">New Record</span>
                <span className="sm:hidden">New</span>
                <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
              </Button>
            }
            items={quickActionItems}
          />

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors focus:outline-none"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* User Rep Switcher */}
          <div className="pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <Dropdown
              trigger={
                <div className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                  <Avatar
                    src={currentRep.avatar}
                    name={currentRep.name}
                    size="sm"
                    status="online"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {currentRep.name}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {currentRep.role || 'Sales Rep'}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
                </div>
              }
              items={repSwitcherItems}
            />
          </div>
        </div>
      </header>

      {/* Global Quick Action Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
      <DealModal
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </>
  );
}
