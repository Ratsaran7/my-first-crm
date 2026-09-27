'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Task, TaskStatus, TaskType, PriorityLevel } from '@/types/crm';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export function TaskModal({ isOpen, onClose, taskToEdit }: TaskModalProps) {
  const { addTask, updateTask, teamMembers, currentRep, leads, deals } = useCRM();
  const { success } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [type, setType] = useState<TaskType>('followup');
  const [assignedToId, setAssignedToId] = useState(currentRep.id);
  const [relatedId, setRelatedId] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : '');
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setType(taskToEdit.type);
      setAssignedToId(taskToEdit.assignedTo?.id || currentRep.id);
      setRelatedId(taskToEdit.relatedTo?.id || '');
    } else {
      setTitle('');
      setDescription('');
      // default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().substring(0, 10));
      setPriority('medium');
      setStatus('pending');
      setType('followup');
      setAssignedToId(currentRep.id);
      setRelatedId(leads[0]?.id || '');
    }
  }, [taskToEdit, currentRep, leads, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignedTo =
      teamMembers.find((m) => m.id === assignedToId) || currentRep;

    // Find related entity
    let relatedTo: Task['relatedTo'] = undefined;
    const foundLead = leads.find((l) => l.id === relatedId);
    if (foundLead) {
      relatedTo = { type: 'lead', id: foundLead.id, name: foundLead.name };
    } else {
      const foundDeal = deals.find((d) => d.id === relatedId);
      if (foundDeal) {
        relatedTo = { type: 'deal', id: foundDeal.id, name: foundDeal.title };
      }
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        status,
        type,
        assignedTo,
        relatedTo,
      });
      success('Task Updated', `Saved changes to task`);
    } else {
      addTask({
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        priority,
        status,
        type,
        assignedTo,
        relatedTo,
      });
      success('Task Created', `Added new task`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Schedule Action or Task'}
      description={
        taskToEdit
          ? 'Update task status, due date, and details.'
          : 'Create a reminder, call, email, or sync meeting.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g. Follow up on proposal with Elena"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Action Type"
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
            options={[
              { value: 'followup', label: 'Follow-up' },
              { value: 'call', label: 'Call' },
              { value: 'email', label: 'Email' },
              { value: 'meeting', label: 'Meeting' },
              { value: 'task', label: 'General Task' },
            ]}
          />
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
          <Input
            label="Due Date"
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Rep"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            options={teamMembers.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
          />
          <Select
            label="Related Contact or Deal"
            value={relatedId}
            onChange={(e) => setRelatedId(e.target.value)}
          >
            <option value="">None</option>
            <optgroup label="Leads">
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  Lead: {l.name} ({l.company})
                </option>
              ))}
            </optgroup>
            <optgroup label="Deals">
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  Deal: {d.title}
                </option>
              ))}
            </optgroup>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Description & Checklist
          </label>
          <textarea
            rows={3}
            placeholder="Agenda, questions to ask, key deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
