'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Task, PriorityLevel, TaskStatus, TaskType } from '@/types/crm';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { TaskModal } from './TaskModal';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Plus,
  Search,
  Phone,
  Mail,
  Users,
  CheckSquare,
  Trash2,
  Edit,
  MoreVertical,
} from 'lucide-react';
import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/utils';
import { Dropdown } from '@/components/ui/Dropdown';

export function TaskList() {
  const { tasks, toggleTaskComplete, deleteTask, updateTask } = useCRM();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        activeTab === 'all' ||
        (activeTab === 'pending' && task.status === 'pending') ||
        (activeTab === 'in-progress' && task.status === 'in-progress') ||
        (activeTab === 'completed' && task.status === 'completed');

      const matchesType = typeFilter === 'all' || task.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [tasks, searchQuery, activeTab, typeFilter]);

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const handleToggle = (id: string, title: string) => {
    toggleTaskComplete(id);
    success('Task State Changed', `Updated "${title}"`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      deleteTask(id);
      success('Task Deleted', 'Task removed');
    }
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const priorityVariantMap = {
    high: 'danger' as const,
    medium: 'warning' as const,
    low: 'neutral' as const,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-blue-500" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-indigo-500" />;
      case 'meeting':
        return <Users className="w-3.5 h-3.5 text-amber-500" />;
      case 'followup':
        return <Clock className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <CheckSquare className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: 'all', label: 'All Tasks', count: tasks.length },
              { id: 'pending', label: 'To Do', count: pendingCount },
              { id: 'in-progress', label: 'In Progress', count: inProgressCount },
              { id: 'completed', label: 'Completed', count: completedCount },
            ]}
          />

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleNew}
        >
          Add Task
        </Button>
      </div>

      {/* Task list container */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 bg-white/40 dark:bg-slate-900/20">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`flex items-start sm:items-center justify-between p-4 rounded-xl border transition-all bg-white dark:bg-slate-900/70 shadow-xs ${
                  isCompleted
                    ? 'border-slate-200/50 dark:border-slate-800/50 opacity-60'
                    : 'border-slate-200/90 hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500/60'
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(task.id, task.title)}
                    className="mt-0.5 sm:mt-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 hover:text-indigo-600" />
                    )}
                  </button>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0 hidden sm:flex">
                    {getTypeIcon(task.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 ${
                        isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>

                      <Badge
                        variant={priorityVariantMap[task.priority]}
                        size="sm"
                      >
                        {task.priority.toUpperCase()}
                      </Badge>

                      {task.relatedTo && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {task.relatedTo.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Assigned Rep & Actions */}
                <div className="flex items-center gap-3 shrink-0 pl-3">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Avatar
                      src={task.assignedTo?.avatar}
                      name={task.assignedTo?.name || 'Rep'}
                      size="xs"
                    />
                    <span className="text-[11px] text-slate-500">
                      {task.assignedTo?.name?.split(' ')[0]}
                    </span>
                  </div>

                  <Dropdown
                    trigger={
                      <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        label: isCompleted ? 'Mark Pending' : 'Mark Complete',
                        onClick: () => handleToggle(task.id, task.title),
                      },
                      { label: 'Edit Task', onClick: () => handleEdit(task) },
                      {
                        label: 'Delete Task',
                        danger: true,
                        onClick: () => handleDelete(task.id),
                      },
                    ]}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
