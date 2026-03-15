import { apiRequest } from './client';

export interface ConfirmPaymentBody {
  pickup_id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function confirmPayment(body: ConfirmPaymentBody): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>('/payments/confirm', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getPaymentForPickup(pickupId: number): Promise<{
  pickup_id: number;
  payment: Record<string, unknown> | null;
  payment_status: string;
}> {
  return apiRequest(`/payments/pickup/${pickupId}`);
}
