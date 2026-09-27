'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useCRM } from '@/context/CRMContext';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeTime } from '@/lib/utils';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react';

export function RecentActivity() {
  const { activities } = useCRM();

  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-blue-500" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-500" />;
      case 'meeting':
        return <Calendar className="w-3.5 h-3.5 text-amber-500" />;
      case 'deal_created':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-500" />;
      case 'stage_changed':
        return <TrendingUp className="w-3.5 h-3.5 text-purple-500" />;
      case 'lead_converted':
        return <Award className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Live stream of rep notes, calls & deal changes</CardDescription>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto max-h-96 space-y-3 pt-2">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No recent activity recorded.
          </p>
        ) : (
          activities.slice(0, 6).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0 mt-0.5">
                {getIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {activity.title}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatRelativeTime(activity.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Avatar
                    src={activity.createdBy.avatar}
                    name={activity.createdBy.name}
                    size="xs"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {activity.createdBy.name}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
