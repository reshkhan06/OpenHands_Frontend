import { apiRequest } from './client';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface NGOOption {
  ngo_id: number;
  ngo_name: string;
  city: string;
  state: string;
}

export type NGOType = 'trust' | 'society' | 'section8';

export interface NGOProfile {
  ngo_id: number;
  ngo_name: string;
  registration_number: string;
  ngo_type: NGOType;
  email: string;
  website_url: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mission_statement: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  is_verified: boolean;
  created_at: string | null;
}

export async function listVerifiedNGOs(): Promise<NGOOption[]> {
  const res = await fetch(`${API_BASE}/ngo/list`);
  if (!res.ok) throw new Error('Failed to fetch NGOs');
  return res.json();
}

export function getNGOProfile(): Promise<NGOProfile> {
  return apiRequest<NGOProfile>('/ngo/me');
}
