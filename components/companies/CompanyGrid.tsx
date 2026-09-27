'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/context/CRMContext';
import { Company, Lead } from '@/types/crm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Building2,
  MapPin,
  ExternalLink,
  Plus,
  DollarSign,
  Users,
  Briefcase,
} from 'lucide-react';
import { formatCurrency, formatCompactNumber } from '@/lib/utils';
import { CompanyDetailDrawer } from './CompanyDetailDrawer';
import { CompanyModal } from './CompanyModal';
import { LeadDetailDrawer } from '@/components/leads/LeadDetailDrawer';
import { LeadModal } from '@/components/leads/LeadModal';
import { DealModal } from '@/components/pipeline/DealModal';

export function CompanyGrid() {
  const { companies, leads, deals } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Drilldown lead states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadDrawerOpen, setIsLeadDrawerOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  const filteredCompanies = useMemo(() => {
    return companies.filter((comp) => {
      const matchesSearch =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === 'all' || comp.tier === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [companies, searchQuery, tierFilter]);

  const handleSelectCompany = (comp: Company) => {
    setSelectedCompany(comp);
    setIsDrawerOpen(true);
  };

  const handleEditCompany = (comp: Company) => {
    setCompanyToEdit(comp);
    setIsModalOpen(true);
  };

  const handleNewCompany = () => {
    setCompanyToEdit(null);
    setIsModalOpen(true);
  };

  const tierVariantMap: Record<Company['tier'], 'primary' | 'success' | 'purple'> = {
    Starter: 'primary',
    Growth: 'purple',
    Enterprise: 'success',
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies by name, industry, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Tiers</option>
            <option value="Enterprise">Enterprise Tier</option>
            <option value="Growth">Growth Tier</option>
            <option value="Starter">Starter Tier</option>
          </select>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleNewCompany}
        >
          Add Company
        </Button>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            No accounts found matching your search.
          </div>
        ) : (
          filteredCompanies.map((company) => {
            const companyLeads = leads.filter(
              (l) => l.company.toLowerCase() === company.name.toLowerCase()
            );
            const companyDeals = deals.filter(
              (d) =>
                d.companyId === company.id ||
                d.company.toLowerCase() === company.name.toLowerCase()
            );
            const dealsValue = companyDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-indigo-400 hover:shadow-cardHover dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-indigo-500/70 transition-all cursor-pointer space-y-4"
              >
                {/* Header: Logo & Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-sm ${company.logoBg}`}
                    >
                      {company.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {company.domain}
                      </p>
                    </div>
                  </div>

                  <Badge variant={tierVariantMap[company.tier]} size="sm">
                    {company.tier}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{company.industry}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{company.location}</span>
                  </div>
                </div>

                {/* Footer metrics */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 block">Deals</span>
                    <strong className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                      {formatCurrency(dealsValue || company.totalDealsValue)}
                    </strong>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 block">Contacts</span>
                    <strong className="text-xs text-slate-800 dark:text-slate-200 font-bold">
                      {companyLeads.length || company.contactsCount}
                    </strong>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2">
                    <span className="text-[10px] text-slate-400 block">Size</span>
                    <strong className="text-xs text-slate-800 dark:text-slate-200 font-bold">
                      {company.size}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drawer */}
      <CompanyDetailDrawer
        company={selectedCompany}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(comp) => {
          setIsDrawerOpen(false);
          handleEditCompany(comp);
        }}
        onSelectLead={(lead) => {
          setSelectedLead(lead);
          setIsLeadDrawerOpen(true);
        }}
      />

      {/* Modals */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companyToEdit={companyToEdit}
      />

      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isLeadDrawerOpen}
        onClose={() => setIsLeadDrawerOpen(false)}
        onEdit={(lead) => {
          setIsLeadDrawerOpen(false);
          setLeadToEdit(lead);
          setIsLeadModalOpen(true);
        }}
        onOpenDealModal={(lead) => {
          setIsLeadDrawerOpen(false);
          setIsDealModalOpen(true);
        }}
      />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        leadToEdit={leadToEdit}
      />

      <DealModal
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
      />
    </div>
  );
}
