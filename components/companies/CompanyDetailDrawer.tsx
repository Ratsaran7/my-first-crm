'use client';

import React from 'react';
import { useCRM } from '@/context/CRMContext';
import { useToast } from '@/components/ui/Toast';
import { Company, Lead } from '@/types/crm';
import { Drawer } from '@/components/ui/Drawer';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Globe,
  Phone,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency, formatCompactNumber } from '@/lib/utils';

interface CompanyDetailDrawerProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (company: Company) => void;
  onSelectLead: (lead: Lead) => void;
}

export function CompanyDetailDrawer({
  company,
  isOpen,
  onClose,
  onEdit,
  onSelectLead,
}: CompanyDetailDrawerProps) {
  const { deleteCompany, leads, deals } = useCRM();
  const { success } = useToast();

  if (!company) return null;

  const companyLeads = leads.filter(
    (l) => l.company.toLowerCase() === company.name.toLowerCase()
  );

  const companyDeals = deals.filter(
    (d) =>
      d.companyId === company.id ||
      d.company.toLowerCase() === company.name.toLowerCase()
  );

  const totalDealsSum = companyDeals.reduce((sum, d) => sum + d.value, 0);

  const handleDelete = () => {
    if (confirm(`Delete ${company.name} and remove from directory?`)) {
      deleteCompany(company.id);
      success('Company Deleted', `${company.name} was removed`);
      onClose();
    }
  };

  const tierVariantMap: Record<Company['tier'], 'primary' | 'success' | 'purple'> = {
    Starter: 'primary',
    Growth: 'purple',
    Enterprise: 'success',
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={company.name}
      subtitle={`${company.industry} • ${company.location}`}
      width="xl"
    >
      <div className="space-y-6">
        {/* Company Header Card */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md ${company.logoBg}`}
            >
              {company.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {company.name}
                </h3>
                <Badge variant={tierVariantMap[company.tier]}>
                  {company.tier} Tier
                </Badge>
              </div>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5"
              >
                <span>{company.domain}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<Edit className="w-3.5 h-3.5" />}
            onClick={() => onEdit(company)}
          >
            Edit
          </Button>
        </div>

        {/* Company Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Deals Value
            </span>
            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(totalDealsSum || company.totalDealsValue)}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Company Size
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              {company.size}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Annual Revenue
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              ${formatCompactNumber(company.annualRevenue)}
            </span>
          </div>
        </div>

        {/* Info detail rows */}
        <div className="rounded-xl border border-slate-200/80 p-4 space-y-3 bg-white dark:bg-slate-900/60 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Account Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{company.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{company.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Industry: <strong>{company.industry}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{company.domain}</span>
            </div>
          </div>
        </div>

        {/* Contacts Associated */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Associated Contacts ({companyLeads.length})
            </h4>
          </div>

          {companyLeads.length === 0 ? (
            <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No contacts recorded under this company.
            </div>
          ) : (
            <div className="space-y-2">
              {companyLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={lead.avatar} name={lead.name} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {lead.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lead.title}
                      </p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">
                    {lead.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deals Associated */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pipeline Deals ({companyDeals.length})
          </h4>

          {companyDeals.length === 0 ? (
            <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No active pipeline deals for this account.
            </div>
          ) : (
            <div className="space-y-2">
              {companyDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {deal.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Stage: <strong className="capitalize">{deal.stage}</strong> • {deal.probability}% Probability
                    </p>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(deal.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Button
            size="sm"
            variant="danger"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
