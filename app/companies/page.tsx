'use client';

import React from 'react';
import { CompanyGrid } from '@/components/companies/CompanyGrid';

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Companies & Enterprise Accounts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore key client accounts, company size tiers, linked contacts, and total contract values.
        </p>
      </div>

      <CompanyGrid />
    </div>
  );
}
