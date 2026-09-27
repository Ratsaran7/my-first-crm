import { Lead, Deal, Company, Task, Activity } from '@/types/crm';
import {
  initialLeads,
  initialDeals,
  initialCompanies,
  initialTasks,
  initialActivities,
} from '@/data/mockData';

const STORAGE_KEYS = {
  LEADS: 'nexus_crm_leads',
  DEALS: 'nexus_crm_deals',
  COMPANIES: 'nexus_crm_companies',
  TASKS: 'nexus_crm_tasks',
  ACTIVITIES: 'nexus_crm_activities',
  THEME: 'nexus_crm_theme',
};

export const storage = {
  getLeads(): Lead[] {
    if (typeof window === 'undefined') return initialLeads;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      return data ? JSON.parse(data) : initialLeads;
    } catch (e) {
      console.error('Error reading leads from storage', e);
      return initialLeads;
    }
  },

  setLeads(leads: Lead[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    } catch (e) {
      console.error('Error saving leads to storage', e);
    }
  },

  getDeals(): Deal[] {
    if (typeof window === 'undefined') return initialDeals;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEALS);
      return data ? JSON.parse(data) : initialDeals;
    } catch (e) {
      console.error('Error reading deals from storage', e);
      return initialDeals;
    }
  },

  setDeals(deals: Deal[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
    } catch (e) {
      console.error('Error saving deals to storage', e);
    }
  },

  getCompanies(): Company[] {
    if (typeof window === 'undefined') return initialCompanies;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      return data ? JSON.parse(data) : initialCompanies;
    } catch (e) {
      console.error('Error reading companies from storage', e);
      return initialCompanies;
    }
  },

  setCompanies(companies: Company[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    } catch (e) {
      console.error('Error saving companies to storage', e);
    }
  },

  getTasks(): Task[] {
    if (typeof window === 'undefined') return initialTasks;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : initialTasks;
    } catch (e) {
      console.error('Error reading tasks from storage', e);
      return initialTasks;
    }
  },

  setTasks(tasks: Task[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to storage', e);
    }
  },

  getActivities(): Activity[] {
    if (typeof window === 'undefined') return initialActivities;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : initialActivities;
    } catch (e) {
      console.error('Error reading activities from storage', e);
      return initialActivities;
    }
  },

  setActivities(activities: Activity[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Error saving activities to storage', e);
    }
  },

  resetAll() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(initialLeads));
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(initialDeals));
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(initialCompanies));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
    } catch (e) {
      console.error('Error resetting demo data', e);
    }
  },
};
