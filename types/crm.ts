export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type DealStage = 'discovery' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type LeadSource = 'Organic' | 'Referral' | 'LinkedIn' | 'Outbound' | 'Google Ads' | 'Event' | 'Website';
export type TaskType = 'call' | 'email' | 'meeting' | 'followup' | 'task';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'deal_created' | 'stage_changed' | 'lead_converted';

export interface UserRef {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  avatar?: string;
  status: LeadStatus;
  priority: PriorityLevel;
  score: number; // 0 to 100
  source: LeadSource;
  value: number; // estimated deal value
  assignedTo: UserRef;
  tags: string[];
  notes?: string;
  city?: string;
  country?: string;
  createdAt: string;
  lastContactDate: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  leadId?: string;
  contactName: string;
  contactEmail: string;
  value: number;
  stage: DealStage;
  probability: number; // 0 - 100%
  expectedCloseDate: string;
  assignedTo: UserRef;
  priority: PriorityLevel;
  tags: string[];
  notes?: string;
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  tier: 'Starter' | 'Growth' | 'Enterprise';
  location: string;
  annualRevenue: number;
  phone: string;
  website: string;
  logoBg: string; // Tailwind color class for company badge
  contactsCount: number;
  totalDealsValue: number;
  activeDealsCount: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: PriorityLevel;
  status: TaskStatus;
  type: TaskType;
  relatedTo?: {
    type: 'lead' | 'deal' | 'company';
    id: string;
    name: string;
  };
  assignedTo: UserRef;
  createdAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  relatedTo: {
    type: 'lead' | 'deal' | 'company';
    id: string;
    name: string;
  };
  createdBy: UserRef;
  createdAt: string;
}

export interface PipelineStageConfig {
  id: DealStage;
  label: string;
  color: string;
  bgLight: string;
  bgDark: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  pipelineValue: number;
  pipelineDealsCount: number;
  winRate: number;
  winRateGrowth: number;
  activeLeadsCount: number;
  leadsGrowth: number;
  averageDealSize: number;
}
