'use client';

import React from 'react';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Deals & Sales Pipeline
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage deal flow across sales stages, track win probabilities, and forecast revenue.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}
