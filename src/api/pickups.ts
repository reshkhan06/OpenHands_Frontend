import { apiRequest } from './client';

export type PickupStatus =
  | 'requested'
  | 'accepted'
  | 'on_the_way'
  | 'picked_up'
  | 'completed'
  | 'cancelled';

export interface PickupCreateBody {
  ngo_id: number;
  pickup_address: string;
  scheduled_time?: string;
  items_description?: string;
}

export interface PickupListItem {
  pickup_id: number;
  donor_id: number;
  ngo_id: number;
  ngo_name?: string;
  pickup_address: string;
  current_status: string;
  payment_status: string;
  created_at: string | null;
  items_description?: string | null;
}

export interface StatusHistoryEntry {
  status: string;
  changed_at: string | null;
  changed_by_user_id: number | null;
  changed_by_ngo_id: number | null;
  note: string | null;
}

export interface PickupDetail {
  pickup_id: number;
  donor_id: number;
  ngo_id: number;
  pickup_address: string;
  scheduled_time: string | null;
  items_description: string | null;
  current_status: string;
  payment_status: string;
  status_history: StatusHistoryEntry[];
  created_at: string | null;
  updated_at: string | null;
}

export interface CreatePickupResponse {
  pickup: PickupDetail;
  payment: {
    order_id: string | null;
    amount: number;
    currency: string;
    key_id: string | null;
    status?: string;
  };
}

export function createPickup(body: PickupCreateBody): Promise<CreatePickupResponse> {
  return apiRequest<CreatePickupResponse>('/pickups', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function listPickups(status?: string): Promise<PickupListItem[]> {
  const q = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest<PickupListItem[]>(`/pickups${q}`);
}

export function getPickup(pickupId: number): Promise<PickupDetail> {
  return apiRequest<PickupDetail>(`/pickups/${pickupId}`);
}

export function updatePickupStatus(
  pickupId: number,
  status: PickupStatus,
  note?: string
): Promise<PickupDetail> {
  return apiRequest<PickupDetail>(`/pickups/${pickupId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
}
