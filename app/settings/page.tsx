'use client';

import React, { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import {
  RotateCcw,
  Sparkles,
  Shield,
  Users,
  Moon,
  Sun,
  Bell,
  CheckCircle2,
  Database,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const { teamMembers, currentRep, resetDemoData, leads, deals, companies } = useCRM();
  const { theme, setTheme } = useTheme();
  const { success } = useToast();

  const [companyName, setCompanyName] = useState('Nexus Dynamics HQ');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST)');
  const [leadThreshold, setLeadThreshold] = useState(80);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Saved', 'CRM configuration updated successfully.');
  };

  const handleResetData = () => {
    if (
      confirm(
        'Are you sure you want to reset all CRM data? This will restore the initial 20+ realistic demo leads, deals, and activities.'
      )
    ) {
      resetDemoData();
      success('Data Reset', 'All records have been reset to the default demo state.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Settings & Workspace Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure CRM workspace preferences, manage team members, and control demo mode data.
        </p>
      </div>

      {/* Demo Controls & Data Management */}
      <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Portfolio Demo Data Controls</CardTitle>
              <CardDescription>
                NexusCRM stores state directly in browser localStorage.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Active Leads</span>
              <strong className="text-lg font-bold text-slate-900 dark:text-slate-100">{leads.length}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Pipeline Deals</span>
              <strong className="text-lg font-bold text-slate-900 dark:text-slate-100">{deals.length}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Accounts</span>
              <strong className="text-lg font-bold text-slate-900 dark:text-slate-100">{companies.length}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test creating leads, moving pipeline stages, or logging calls. You can restore the original sample state at any time.
            </p>

            <Button
              size="sm"
              variant="outline"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetData}
              className="shrink-0"
            >
              Reset to Demo State
            </Button>
          </div>
        </div>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Details</CardTitle>
          <CardDescription>Organization branding and regional preferences</CardDescription>
        </CardHeader>

        <form onSubmit={handleSaveGeneral} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Select
              label="Primary Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'USD ($)', label: 'USD - United States Dollar ($)' },
                { value: 'EUR (€)', label: 'EUR - Euro (€)' },
                { value: 'GBP (£)', label: 'GBP - British Pound (£)' },
                { value: 'JPY (¥)', label: 'JPY - Japanese Yen (¥)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Default Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: 'America/Los_Angeles (PST)', label: 'Pacific Time (US & Canada)' },
                { value: 'America/New_York (EST)', label: 'Eastern Time (US & Canada)' },
                { value: 'Europe/London (GMT)', label: 'London / GMT' },
                { value: 'Asia/Tokyo (JST)', label: 'Tokyo (JST)' },
              ]}
            />
            <Input
              label="High Intent Lead Score Threshold"
              type="number"
              min={50}
              max={95}
              value={leadThreshold}
              onChange={(e) => setLeadThreshold(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Save Workspace
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Interface Appearance</CardTitle>
          <CardDescription>Choose between Dark and Light mode themes</CardDescription>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-slate-900 text-white'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-slate-900 text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Mode (Recommended)</span>
              </div>
              {theme === 'dark' && (
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Modern high-contrast dark aesthetic tailored for developer portfolios.
            </p>
          </div>

          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === 'light'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-slate-50 text-slate-900'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-slate-50 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </div>
              {theme === 'light' && (
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Clean, crisp daytime layout with bright contrast.
            </p>
          </div>
        </div>
      </Card>

      {/* Sales Team Directory */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <div>
              <CardTitle>Sales Team Members</CardTitle>
              <CardDescription>Active sales reps and account executives</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 pt-1">
          {teamMembers.map((member) => (
            <div key={member.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={member.avatar} name={member.name} size="md" status="online" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {member.name} {member.id === currentRep.id && '(You)'}
                  </p>
                  <p className="text-[11px] text-slate-400">{member.email}</p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {member.role || 'Sales Rep'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
