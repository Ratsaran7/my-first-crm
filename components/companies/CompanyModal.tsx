'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Company } from '@/types/crm';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyToEdit?: Company | null;
}

export function CompanyModal({
  isOpen,
  onClose,
  companyToEdit,
}: CompanyModalProps) {
  const { addCompany, updateCompany } = useCRM();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('Cloud Infrastructure');
  const [size, setSize] = useState<Company['size']>('51-200');
  const [tier, setTier] = useState<Company['tier']>('Growth');
  const [location, setLocation] = useState('San Francisco, CA');
  const [annualRevenue, setAnnualRevenue] = useState(25000000);
  const [phone, setPhone] = useState('+1 (415) 555-0199');
  const [website, setWebsite] = useState('https://');

  useEffect(() => {
    if (companyToEdit) {
      setName(companyToEdit.name);
      setDomain(companyToEdit.domain);
      setIndustry(companyToEdit.industry);
      setSize(companyToEdit.size);
      setTier(companyToEdit.tier);
      setLocation(companyToEdit.location);
      setAnnualRevenue(companyToEdit.annualRevenue);
      setPhone(companyToEdit.phone);
      setWebsite(companyToEdit.website);
    } else {
      setName('');
      setDomain('');
      setIndustry('Artificial Intelligence');
      setSize('51-200');
      setTier('Growth');
      setLocation('Austin, TX');
      setAnnualRevenue(20000000);
      setPhone('+1 (512) 555-0144');
      setWebsite('https://');
    }
  }, [companyToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const logoBgs = [
      'bg-indigo-600',
      'bg-purple-600',
      'bg-blue-600',
      'bg-emerald-600',
      'bg-amber-600',
      'bg-rose-600',
      'bg-cyan-600',
    ];
    const logoBg =
      companyToEdit?.logoBg ||
      logoBgs[Math.floor(Math.random() * logoBgs.length)];

    if (companyToEdit) {
      updateCompany(companyToEdit.id, {
        name,
        domain: domain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        industry,
        size,
        tier,
        location,
        annualRevenue: Number(annualRevenue),
        phone,
        website: website || `https://${domain}`,
      });
      success('Company Updated', `Updated account for ${name}`);
    } else {
      addCompany({
        name,
        domain: domain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
        industry,
        size,
        tier,
        location,
        annualRevenue: Number(annualRevenue),
        phone,
        website: website || `https://${domain}`,
        logoBg,
      });
      success('Company Added', `Added ${name} to accounts directory`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={companyToEdit ? 'Edit Company Account' : 'Add Company Account'}
      description={
        companyToEdit
          ? 'Modify organization information, account tier, and metrics.'
          : 'Register a client organization or enterprise prospect.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            placeholder="e.g. Apex Dynamics"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Primary Domain"
            placeholder="e.g. apexdynamics.io"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Industry"
            placeholder="e.g. Cybersecurity"
            required
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <Select
            label="Company Size"
            value={size}
            onChange={(e) => setSize(e.target.value as Company['size'])}
            options={[
              { value: '1-10', label: '1 - 10 employees' },
              { value: '11-50', label: '11 - 50 employees' },
              { value: '51-200', label: '51 - 200 employees' },
              { value: '201-500', label: '201 - 500 employees' },
              { value: '500+', label: '500+ Enterprise' },
            ]}
          />
          <Select
            label="Account Tier"
            value={tier}
            onChange={(e) => setTier(e.target.value as Company['tier'])}
            options={[
              { value: 'Starter', label: 'Starter Tier' },
              { value: 'Growth', label: 'Growth Tier' },
              { value: 'Enterprise', label: 'Enterprise Tier' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Headquarters Location"
            placeholder="e.g. San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Est. Annual Revenue ($)"
            type="number"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone"
            placeholder="+1 (555) 019-2834"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Website URL"
            placeholder="https://apexdynamics.io"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {companyToEdit ? 'Save Changes' : 'Create Company'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
