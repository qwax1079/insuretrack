import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface User {
  id: number;
  email: string;
  name: string;
  company?: string;
}

export interface Lead {
  id: number;
  name: string;
  age: number;
  phone: string;
  category: 'Cold' | 'Warm' | 'Hot';
  status: 'New' | 'Follow Up' | 'Meeting' | 'Closing' | 'Closed';
  follow_up_date: string;
  notes: string;
  created_at: string;
}

export interface Commission {
  id: number;
  lead_id: number;
  lead_name?: string;
  premium: number;
  commission_rate: number;
  commission_amount: number;
  date: string;
}

export interface Template {
  id: number;
  title: string;
  category: string;
  content: string;
}

export interface Stats {
  monthlyCommission: number;
  monthlyTarget: number;
  leadStats: { status: string; count: number }[];
}
