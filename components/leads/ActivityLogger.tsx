'use client';

import React, { useState } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { ActivityType } from '@/types/crm';
import { Phone, Mail, Calendar, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ActivityLoggerProps {
  relatedTo: {
    type: 'lead' | 'deal' | 'company';
    id: string;
    name: string;
  };
  onLogged?: () => void;
}

export function ActivityLogger({ relatedTo, onLogged }: ActivityLoggerProps) {
  const { addActivity, currentRep } = useCRM();
  const { success } = useToast();
  const [activeType, setActiveType] = useState<ActivityType>('note');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activityOptions = [
    { type: 'note' as ActivityType, label: 'Note', icon: FileText, placeholder: 'Write an internal note...' },
    { type: 'call' as ActivityType, label: 'Call', icon: Phone, placeholder: 'Summary of call with client...' },
    { type: 'email' as ActivityType, label: 'Email', icon: Mail, placeholder: 'Key points discussed in email thread...' },
    { type: 'meeting' as ActivityType, label: 'Meeting', icon: Calendar, placeholder: 'Meeting minutes & next steps...' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    const defaultTitles = {
      note: `Note on ${relatedTo.name}`,
      call: `Phone call with ${relatedTo.name}`,
      email: `Email logged for ${relatedTo.name}`,
      meeting: `Sync meeting with ${relatedTo.name}`,
      stage_changed: `Stage change on ${relatedTo.name}`,
      deal_created: `Deal created for ${relatedTo.name}`,
      lead_converted: `Lead converted: ${relatedTo.name}`,
    };

    addActivity({
      type: activeType,
      title: title.trim() || defaultTitles[activeType] || 'Activity Logged',
      description: description.trim(),
      relatedTo,
      createdBy: currentRep,
    });

    success('Activity Logged', `Logged ${activeType} for ${relatedTo.name}`);
    setTitle('');
    setDescription('');
    setIsSubmitting(false);
    onLogged?.();
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/50">
      {/* Activity type tabs */}
      <div className="flex items-center gap-1 mb-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
        {activityOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = activeType === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => setActiveType(opt.type)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Activity headline (optional)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />

        <textarea
          rows={3}
          required
          placeholder={
            activityOptions.find((o) => o.type === activeType)?.placeholder
          }
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            Logged as <span className="font-semibold text-slate-600 dark:text-slate-300">{currentRep.name}</span>
          </span>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-3 h-3" />}
          >
            Log Activity
          </Button>
        </div>
      </form>
    </div>
  );
}
