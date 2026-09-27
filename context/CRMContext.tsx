'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Lead,
  Deal,
  Company,
  Task,
  Activity,
  DealStage,
  DashboardMetrics,
  UserRef,
} from '@/types/crm';
import { teamMembers as mockTeamMembers } from '@/data/mockData';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface CRMContextType {
  leads: Lead[];
  deals: Deal[];
  companies: Company[];
  tasks: Task[];
  activities: Activity[];
  teamMembers: UserRef[];
  currentRep: UserRef;
  setCurrentRep: (rep: UserRef) => void;
  metrics: DashboardMetrics;
  isLoading: boolean;

  // Leads
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContactDate'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Deals
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  updateDealStage: (id: string, stage: DealStage) => void;
  deleteDeal: (id: string) => void;

  // Companies
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'contactsCount' | 'totalDealsValue' | 'activeDealsCount'>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;

  // Activities
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Activity;

  // Reset demo
  resetDemoData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teamMembers] = useState<UserRef[]>(mockTeamMembers);
  const [currentRep, setCurrentRep] = useState<UserRef>(mockTeamMembers[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from storage on mount
  useEffect(() => {
    setLeads(storage.getLeads());
    setDeals(storage.getDeals());
    setCompanies(storage.getCompanies());
    setTasks(storage.getTasks());
    setActivities(storage.getActivities());
    setIsLoading(false);
  }, []);

  // Sync to storage on change
  useEffect(() => {
    if (!isLoading) {
      storage.setLeads(leads);
    }
  }, [leads, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.setDeals(deals);
    }
  }, [deals, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.setCompanies(companies);
    }
  }, [companies, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.setTasks(tasks);
    }
  }, [tasks, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      storage.setActivities(activities);
    }
  }, [activities, isLoading]);

  // Lead actions
  const addLead = useCallback(
    (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastContactDate'>): Lead => {
      const now = new Date().toISOString();
      const newLead: Lead = {
        ...leadData,
        id: generateId('lead'),
        createdAt: now,
        lastContactDate: now,
      };

      setLeads((prev) => [newLead, ...prev]);

      // Add corresponding activity
      const newActivity: Activity = {
        id: generateId('act'),
        type: 'note',
        title: `New lead added: ${newLead.name}`,
        description: `Lead added for ${newLead.company} ($${newLead.value.toLocaleString()})`,
        relatedTo: {
          type: 'lead',
          id: newLead.id,
          name: newLead.name,
        },
        createdBy: currentRep,
        createdAt: now,
      };
      setActivities((prev) => [newActivity, ...prev]);

      return newLead;
    },
    [currentRep]
  );

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  // Deal actions
  const addDeal = useCallback(
    (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal => {
      const now = new Date().toISOString();
      const newDeal: Deal = {
        ...dealData,
        id: generateId('deal'),
        createdAt: now,
        updatedAt: now,
      };

      setDeals((prev) => [newDeal, ...prev]);

      // Activity
      const newActivity: Activity = {
        id: generateId('act'),
        type: 'deal_created',
        title: `Deal Created: ${newDeal.title}`,
        description: `Pipeline value $${newDeal.value.toLocaleString()} in stage ${newDeal.stage.toUpperCase()}`,
        relatedTo: {
          type: 'deal',
          id: newDeal.id,
          name: newDeal.title,
        },
        createdBy: currentRep,
        createdAt: now,
      };
      setActivities((prev) => [newActivity, ...prev]);

      return newDeal;
    },
    [currentRep]
  );

  const updateDeal = useCallback((id: string, updates: Partial<Deal>) => {
    const now = new Date().toISOString();
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id ? { ...deal, ...updates, updatedAt: now } : deal
      )
    );
  }, []);

  const updateDealStage = useCallback(
    (id: string, stage: DealStage) => {
      const targetDeal = deals.find((d) => d.id === id);
      if (!targetDeal) return;

      const now = new Date().toISOString();
      let probability = targetDeal.probability;

      if (stage === 'discovery') probability = 25;
      else if (stage === 'qualified') probability = 50;
      else if (stage === 'proposal') probability = 75;
      else if (stage === 'negotiation') probability = 90;
      else if (stage === 'won') {
        probability = 100;
        // Celebrate with confetti on Won stage!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas not ready
        }
      } else if (stage === 'lost') probability = 0;

      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === id
            ? { ...deal, stage, probability, updatedAt: now }
            : deal
        )
      );

      // Activity
      const isWon = stage === 'won';
      const actType = isWon ? 'lead_converted' : 'stage_changed';
      const newActivity: Activity = {
        id: generateId('act'),
        type: actType,
        title: isWon
          ? `Deal Won! 🎉 ${targetDeal.title}`
          : `Stage changed to ${stage.toUpperCase()}`,
        description: `Deal "${targetDeal.title}" moved to ${stage.toUpperCase()} ($${targetDeal.value.toLocaleString()})`,
        relatedTo: {
          type: 'deal',
          id: targetDeal.id,
          name: targetDeal.title,
        },
        createdBy: currentRep,
        createdAt: now,
      };
      setActivities((prev) => [newActivity, ...prev]);
    },
    [deals, currentRep]
  );

  const deleteDeal = useCallback((id: string) => {
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
  }, []);

  // Company actions
  const addCompany = useCallback(
    (
      companyData: Omit<
        Company,
        | 'id'
        | 'createdAt'
        | 'contactsCount'
        | 'totalDealsValue'
        | 'activeDealsCount'
      >
    ): Company => {
      const now = new Date().toISOString();
      const newCompany: Company = {
        ...companyData,
        id: generateId('comp'),
        contactsCount: 0,
        totalDealsValue: 0,
        activeDealsCount: 0,
        createdAt: now,
      };

      setCompanies((prev) => [newCompany, ...prev]);
      return newCompany;
    },
    []
  );

  const updateCompany = useCallback((id: string, updates: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCompany = useCallback((id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Task actions
  const addTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: generateId('task'),
        createdAt: now,
      };

      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDone = t.status === 'completed';
          return {
            ...t,
            status: isDone ? 'pending' : 'completed',
            completedAt: isDone ? undefined : now,
          };
        }
        return t;
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Activity action
  const addActivity = useCallback(
    (actData: Omit<Activity, 'id' | 'createdAt'>): Activity => {
      const now = new Date().toISOString();
      const newActivity: Activity = {
        ...actData,
        id: generateId('act'),
        createdAt: now,
      };

      setActivities((prev) => [newActivity, ...prev]);
      return newActivity;
    },
    []
  );

  // Reset to initial demo dataset
  const resetDemoData = useCallback(() => {
    storage.resetAll();
    setLeads(storage.getLeads());
    setDeals(storage.getDeals());
    setCompanies(storage.getCompanies());
    setTasks(storage.getTasks());
    setActivities(storage.getActivities());
  }, []);

  // Metrics computation
  const metrics: DashboardMetrics = useMemo(() => {
    const wonDeals = deals.filter((d) => d.stage === 'won');
    const lostDeals = deals.filter((d) => d.stage === 'lost');
    const closedCount = wonDeals.length + lostDeals.length;

    const totalRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const activePipelineDeals = deals.filter(
      (d) => d.stage !== 'won' && d.stage !== 'lost'
    );
    const pipelineValue = activePipelineDeals.reduce(
      (sum, d) => sum + d.value,
      0
    );
    const winRate =
      closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : 75;
    const activeLeadsCount = leads.filter(
      (l) => l.status !== 'won' && l.status !== 'lost'
    ).length;
    const averageDealSize =
      deals.length > 0
        ? Math.round(
            deals.reduce((sum, d) => sum + d.value, 0) / deals.length
          )
        : 85000;

    return {
      totalRevenue,
      revenueGrowth: 18.4,
      pipelineValue,
      pipelineDealsCount: activePipelineDeals.length,
      winRate,
      winRateGrowth: 4.2,
      activeLeadsCount,
      leadsGrowth: 12.5,
      averageDealSize,
    };
  }, [deals, leads]);

  return (
    <CRMContext.Provider
      value={{
        leads,
        deals,
        companies,
        tasks,
        activities,
        teamMembers,
        currentRep,
        setCurrentRep,
        metrics,
        isLoading,
        addLead,
        updateLead,
        deleteLead,
        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,
        addCompany,
        updateCompany,
        deleteCompany,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        addActivity,
        resetDemoData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}
