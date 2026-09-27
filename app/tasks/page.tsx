'use client';

import React from 'react';
import { TaskList } from '@/components/tasks/TaskList';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Tasks & Action Items
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Prioritize customer calls, proposal follow-ups, contract reviews, and scheduled meetings.
        </p>
      </div>

      <TaskList />
    </div>
  );
}
