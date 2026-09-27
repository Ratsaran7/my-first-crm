'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Lead, LeadSource, LeadStatus, PriorityLevel } from '@/types/crm';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
}

export function LeadModal({ isOpen, onClose, leadToEdit }: LeadModalProps) {
  const { addLead, updateLead, teamMembers, currentRep } = useCRM();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [score, setScore] = useState(70);
  const [source, setSource] = useState<LeadSource>('Referral');
  const [value, setValue] = useState(50000);
  const [assignedToId, setAssignedToId] = useState(currentRep.id);
  const [tagsInput, setTagsInput] = useState('Enterprise, Q3');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (leadToEdit) {
      setName(leadToEdit.name);
      setEmail(leadToEdit.email);
      setPhone(leadToEdit.phone || '');
      setCompany(leadToEdit.company);
      setTitle(leadToEdit.title);
      setStatus(leadToEdit.status);
      setPriority(leadToEdit.priority);
      setScore(leadToEdit.score);
      setSource(leadToEdit.source);
      setValue(leadToEdit.value);
      setAssignedToId(leadToEdit.assignedTo?.id || currentRep.id);
      setTagsInput(leadToEdit.tags?.join(', ') || '');
      setNotes(leadToEdit.notes || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setTitle('');
      setStatus('new');
      setPriority('medium');
      setScore(75);
      setSource('LinkedIn');
      setValue(60000);
      setAssignedToId(currentRep.id);
      setTagsInput('Enterprise, High Intent');
      setNotes('');
    }
  }, [leadToEdit, currentRep, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignedTo =
      teamMembers.find((m) => m.id === assignedToId) || currentRep;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (leadToEdit) {
      updateLead(leadToEdit.id, {
        name,
        email,
        phone,
        company,
        title,
        status,
        priority,
        score: Number(score),
        source,
        value: Number(value),
        assignedTo,
        tags,
        notes,
      });
      success('Lead Updated', `Updated details for ${name}`);
    } else {
      addLead({
        name,
        email,
        phone,
        company,
        title,
        status,
        priority,
        score: Number(score),
        source,
        value: Number(value),
        assignedTo,
        tags,
        notes,
        city: 'San Francisco',
        country: 'USA',
      });
      success('Lead Created', `Added ${name} to pipeline`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={leadToEdit ? 'Edit Contact & Lead' : 'Add New Lead'}
      description={
        leadToEdit
          ? 'Modify contact details and sales stage information.'
          : 'Create a new prospect to begin tracking communication and deal opportunities.'
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rachel Adams"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="rachel@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company"
            placeholder="e.g. Zenith Health"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Input
            label="Job Title"
            placeholder="e.g. VP of Engineering"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Phone Number"
            placeholder="+1 (555) 019-2834"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Est. Value ($)"
            type="number"
            placeholder="50000"
            required
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <Input
            label="Lead Score (0-100)"
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            options={[
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'proposal', label: 'Proposal Sent' },
              { value: 'won', label: 'Closed Won' },
              { value: 'lost', label: 'Closed Lost' },
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
          <Select
            label="Acquisition Source"
            value={source}
            onChange={(e) => setSource(e.target.value as LeadSource)}
            options={[
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Organic', label: 'Organic Search' },
              { value: 'Outbound', label: 'Outbound' },
              { value: 'Google Ads', label: 'Google Ads' },
              { value: 'Event', label: 'Event / Conference' },
              { value: 'Website', label: 'Website Inbound' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Rep"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            options={teamMembers.map((m) => ({
              value: m.id,
              label: `${m.name} (${m.role || 'Sales'})`,
            }))}
          />
          <Input
            label="Tags (comma separated)"
            placeholder="Enterprise, SOC2, High Intent"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Initial Notes / Discovery Context
          </label>
          <textarea
            rows={3}
            placeholder="Key requirements, budget timeline, tech stack notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {leadToEdit ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
