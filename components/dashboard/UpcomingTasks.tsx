'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Check, Plus, Calendar, Mail, Phone, Clock } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { TaskModal } from '@/components/tasks/TaskModal';

export function UpcomingTasks() {
  const { tasks, toggleTaskComplete } = useCRM();
  const { success } = useToast();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 5);

  const handleToggle = (id: string, title: string) => {
    toggleTaskComplete(id);
    success('Task Updated', `Completed: ${title}`);
  };

  const priorityVariantMap = {
    high: 'danger' as const,
    medium: 'warning' as const,
    low: 'neutral' as const,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-3 h-3 text-blue-500" />;
      case 'email':
        return <Mail className="w-3 h-3 text-indigo-500" />;
      case 'meeting':
        return <Calendar className="w-3 h-3 text-amber-500" />;
      default:
        return <Clock className="w-3 h-3 text-slate-500" />;
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div>
            <CardTitle>Action Items & Follow-ups</CardTitle>
            <CardDescription>Priority tasks requiring sales attention</CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsTaskModalOpen(true)}
          >
            Add Task
          </Button>
        </CardHeader>

        <div className="flex-1 overflow-y-auto space-y-2.5 pt-2 max-h-96">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              🎉 All pending tasks are cleared!
            </div>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:bg-slate-900 transition-colors group"
              >
                <button
                  onClick={() => handleToggle(task.id, task.title)}
                  className="mt-0.5 w-4 h-4 rounded border border-slate-300 dark:border-slate-600 hover:border-indigo-600 dark:hover:border-indigo-400 flex items-center justify-center transition-colors shrink-0 bg-white dark:bg-slate-800"
                >
                  <Check className="w-3 h-3 text-transparent group-hover:text-slate-400" />
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {getTypeIcon(task.type)}
                      <span>{formatDate(task.dueDate)}</span>
                    </div>

                    <Badge
                      variant={priorityVariantMap[task.priority]}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>

                    {task.relatedTo && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium truncate max-w-36">
                        {task.relatedTo.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </>
  );
}
