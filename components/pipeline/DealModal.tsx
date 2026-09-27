'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Deal, DealStage, PriorityLevel, Lead } from '@/types/crm';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealToEdit?: Deal | null;
  initialLead?: Lead | null;
}

export function DealModal({
  isOpen,
  onClose,
  dealToEdit,
  initialLead,
}: DealModalProps) {
  const { addDeal, updateDeal, teamMembers, currentRep, companies } = useCRM();
  const { success } = useToast();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [value, setValue] = useState(75000);
  const [stage, setStage] = useState<DealStage>('qualified');
  const [probability, setProbability] = useState(60);
  const [expectedCloseDate, setExpectedCloseDate] = useState('2024-05-15');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [assignedToId, setAssignedToId] = useState(currentRep.id);
  const [tagsInput, setTagsInput] = useState('Expansion, High Value');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (dealToEdit) {
      setTitle(dealToEdit.title);
      setCompany(dealToEdit.company);
      setContactName(dealToEdit.contactName);
      setContactEmail(dealToEdit.contactEmail);
      setValue(dealToEdit.value);
      setStage(dealToEdit.stage);
      setProbability(dealToEdit.probability);
      setExpectedCloseDate(dealToEdit.expectedCloseDate);
      setPriority(dealToEdit.priority);
      setAssignedToId(dealToEdit.assignedTo?.id || currentRep.id);
      setTagsInput(dealToEdit.tags?.join(', ') || '');
      setNotes(dealToEdit.notes || '');
    } else if (initialLead) {
      setTitle(`${initialLead.company} Enterprise Expansion`);
      setCompany(initialLead.company);
      setContactName(initialLead.name);
      setContactEmail(initialLead.email);
      setValue(initialLead.value || 80000);
      setStage('discovery');
      setProbability(30);
      setExpectedCloseDate('2024-05-30');
      setPriority(initialLead.priority || 'medium');
      setAssignedToId(initialLead.assignedTo?.id || currentRep.id);
      setTagsInput(initialLead.tags?.join(', ') || 'Lead Converted');
      setNotes(initialLead.notes || '');
    } else {
      setTitle('');
      setCompany(companies[0]?.name || '');
      setContactName('');
      setContactEmail('');
      setValue(65000);
      setStage('qualified');
      setProbability(50);
      setExpectedCloseDate('2024-05-01');
      setPriority('medium');
      setAssignedToId(currentRep.id);
      setTagsInput('Enterprise License');
      setNotes('');
    }
  }, [dealToEdit, initialLead, currentRep, companies, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignedTo =
      teamMembers.find((m) => m.id === assignedToId) || currentRep;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (dealToEdit) {
      updateDeal(dealToEdit.id, {
        title,
        company,
        contactName,
        contactEmail,
        value: Number(value),
        stage,
        probability: Number(probability),
        expectedCloseDate,
        priority,
        assignedTo,
        tags,
        notes,
      });
      success('Deal Updated', `Updated "${title}"`);
    } else {
      addDeal({
        title,
        company,
        leadId: initialLead?.id,
        contactName,
        contactEmail,
        value: Number(value),
        stage,
        probability: Number(probability),
        expectedCloseDate,
        priority,
        assignedTo,
        tags,
        notes,
      });
      success('Deal Created', `Added "${title}" ($${Number(value).toLocaleString()}) to pipeline`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dealToEdit ? 'Edit Deal' : 'Create Sales Opportunity'}
      description={
        dealToEdit
          ? 'Modify deal stage, value, and expected closing milestones.'
          : 'Track a new high-value business opportunity in the pipeline.'
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Deal Title"
          placeholder="e.g. Acme Corp Enterprise Annual License"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            placeholder="e.g. CloudScale Tech"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Input
            label="Deal Amount ($)"
            type="number"
            placeholder="75000"
            required
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Primary Contact Name"
            placeholder="e.g. Sarah Jenkins"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <Input
            label="Primary Contact Email"
            type="email"
            placeholder="sarah@company.com"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Pipeline Stage"
            value={stage}
            onChange={(e) => setStage(e.target.value as DealStage)}
            options={[
              { value: 'discovery', label: 'Discovery (25%)' },
              { value: 'qualified', label: 'Qualified (50%)' },
              { value: 'proposal', label: 'Proposal Sent (75%)' },
              { value: 'negotiation', label: 'In Negotiation (90%)' },
              { value: 'won', label: 'Closed Won (100%)' },
              { value: 'lost', label: 'Closed Lost (0%)' },
            ]}
          />
          <Input
            label="Win Probability (%)"
            type="number"
            min={0}
            max={100}
            value={probability}
            onChange={(e) => setProbability(Number(e.target.value))}
          />
          <Input
            label="Target Close Date"
            type="date"
            required
            value={expectedCloseDate}
            onChange={(e) => setExpectedCloseDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
            options={[
              { value: 'low', label: 'Low Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'high', label: 'High Priority' },
            ]}
          />
          <Select
            label="Deal Owner"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            options={teamMembers.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
          />
          <Input
            label="Tags"
            placeholder="Expansion, Q4"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Deal Notes & Requirements
          </label>
          <textarea
            rows={3}
            placeholder="Contract terms, stakeholder notes, competitive differentiators..."
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
            {dealToEdit ? 'Save Changes' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
