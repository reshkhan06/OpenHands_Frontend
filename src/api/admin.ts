import { apiRequest } from './client';

export interface AdminDashboardStats {
  users_total: number;
  ngos_total: number;
  ngos_pending: number;
  pickups_total: number;
  pickups_requested: number;
  deposits_active: number;
}

export interface AdminUserRow {
  user_id: number;
  fname: string;
  lname: string;
  email: string;
  contact_number: number;
  location: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string | null;
}

export interface AdminNGORow {
  ngo_id: number;
  ngo_name: string;
  email: string;
  city: string;
  state: string;
  is_verified: boolean;
  created_at: string | null;
}

export interface AdminPickupRow {
  pickup_id: number;
  donor_id: number;
  ngo_id: number;
  pickup_address: string;
  current_status: string;
  payment_status: string;
  created_at: string | null;
}

export function getAdminDashboard(): Promise<AdminDashboardStats> {
  return apiRequest<AdminDashboardStats>('/admin/dashboard');
}

export function getAdminUsers(params?: { role?: string; search?: string; is_active?: boolean }): Promise<AdminUserRow[]> {
  const sp = new URLSearchParams();
  if (params?.role) sp.set('role', params.role);
  if (params?.search) sp.set('search', params.search);
  if (params?.is_active !== undefined) sp.set('is_active', String(params.is_active));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return apiRequest<AdminUserRow[]>(`/admin/users${q}`);
}

export function updateAdminUser(userId: number, body: { role?: string; is_active?: boolean }): Promise<{ user_id: number; role: string; is_active: boolean }> {
  return apiRequest(`/admin/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function getAdminNGOs(is_verified?: boolean): Promise<AdminNGORow[]> {
  const q = is_verified !== undefined ? `?is_verified=${is_verified}` : '';
  return apiRequest<AdminNGORow[]>(`/admin/ngos${q}`);
}

export function updateAdminNGO(ngoId: number, body: { is_verified?: boolean }): Promise<{ ngo_id: number; is_verified: boolean }> {
  return apiRequest(`/admin/ngos/${ngoId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteAdminNGO(ngoId: number): Promise<{ message: string; ngo_id: number }> {
  return apiRequest(`/admin/ngos/${ngoId}`, {
    method: 'DELETE',
  });
}

export function getAdminPickups(status?: string): Promise<AdminPickupRow[]> {
  const q = status ? `?status=${status}` : '';
  return apiRequest<AdminPickupRow[]>(`/admin/pickups${q}`);
}

export function getAdminPickup(pickupId: number): Promise<Record<string, unknown>> {
  return apiRequest(`/admin/pickups/${pickupId}`);
}

export function getAdminConfig(): Promise<{ deposit_amount_paise: number }> {
  return apiRequest('/admin/config');
}

export function updateAdminConfig(body: { deposit_amount_paise?: number }): Promise<{ deposit_amount_paise: number }> {
  return apiRequest('/admin/config', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}
