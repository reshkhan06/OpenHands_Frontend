import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPickup, type PickupCreateBody } from '@/api/pickups'
import { confirmPayment } from '@/api/payments'
import { listVerifiedNGOs } from '@/api/ngos'
import ProtectedRoute from '@/components/ProtectedRoute'
import LocationInput from '@/components/LocationInput'

declare global {
  interface Window {
    Razorpay: any
  }
}

type PaymentStep = null | {
  pickupId: number
  amount: number
  currency: string
  status: string
  keyId: string | null
  orderId: string | null
}

export function NewPickupPage() {
  const [ngos, setNgos] = useState<{ ngo_id: number; ngo_name: string; city: string; state: string }[]>([])
  const [form, setForm] = useState<PickupCreateBody>({ ngo_id: 0, pickup_address: '', items_description: '' })
  const [donationType, setDonationType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<PaymentStep>(null)
  const navigate = useNavigate()

  useEffect(() => {
    listVerifiedNGOs().then(setNgos).catch(() => setError('Failed to load NGOs'))
  }, [])

  const isDummyPayment = (status: string, keyId: string | null) =>
    status === 'paid' || !keyId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPaymentStep(null)
    setLoading(true)
    try {
      const descriptionParts: string[] = []
      if (donationType) descriptionParts.push(`Type: ${donationType}`)
      if (quantity) descriptionParts.push(`Quantity: ${quantity}`)
      if (form.items_description) descriptionParts.push(`Details: ${form.items_description}`)

      const res = await createPickup({
        ...form,
        items_description: descriptionParts.length ? descriptionParts.join(' | ') : undefined,
        scheduled_time: form.scheduled_time || undefined,
      })
      const { pickup, payment } = res
      const keyId = payment.key_id ?? null
      const status = payment.status ?? 'pending'

      if (isDummyPayment(status, keyId)) {
        setPaymentStep({
          pickupId: pickup.pickup_id,
          amount: payment.amount ?? 0,
          currency: payment.currency ?? 'INR',
          status,
          keyId: null,
          orderId: payment.order_id ?? null,
        })
      } else if (keyId && payment.order_id && payment.amount > 0 && typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: keyId,
          amount: payment.amount,
          currency: payment.currency,
          order_id: payment.order_id,
          name: 'OpenHands Donation',
          description: 'Refundable pickup deposit',
          handler: async function (data: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
            try {
              await confirmPayment({
                pickup_id: pickup.pickup_id,
                razorpay_order_id: data.razorpay_order_id,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_signature: data.razorpay_signature,
              })
              navigate(`/dashboard/donor/pickups/${pickup.pickup_id}`)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Payment verification failed')
            }
          },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else if (keyId && !window.Razorpay) {
        setError('Payment gateway could not be loaded. Please refresh the page and try again.')
      } else {
        setPaymentStep({
          pickupId: pickup.pickup_id,
          amount: payment.amount ?? 0,
          currency: payment.currency ?? 'INR',
          status: status,
          keyId: keyId,
          orderId: payment.order_id ?? null,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pickup')
    } finally {
      setLoading(false)
    }
  }

  const goToPickup = (pickupId: number) => {
    setPaymentStep(null)
    navigate(`/dashboard/donor/pickups/${pickupId}`)
  }

  if (paymentStep) {
    const amountRupees = paymentStep.amount / 100
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Pay refundable deposit</h1>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '24px' }}>
          This amount is refunded after the NGO completes the pickup.
        </p>
        <div
          style={{
            background: 'linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '28px 24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#166534' }}>Refundable deposit</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#065f46' }}>
              ₹{amountRupees.toLocaleString('en-IN')}
            </span>
          </div>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '999px',
              background: '#d1fae5',
              color: '#047857',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            Demo mode
          </div>
          <p style={{ fontSize: '0.9rem', color: '#065f46', margin: '0 0 20px' }}>
            In demo mode the deposit is already marked as paid. No real payment is required.
          </p>
          <button
            type="button"
            onClick={() => goToPickup(paymentStep.pickupId)}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.35)',
            }}
          >
            Continue to pickup
          </button>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
          <a
            href="/dashboard/donor/pickups/new"
            onClick={(e) => { e.preventDefault(); setPaymentStep(null) }}
            style={{ color: '#059669', textDecoration: 'none' }}
          >
            ← Back to form
          </a>
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Request Pickup</h1>
      {error && <div style={{ padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>NGO</span>
          <select
            required
            value={form.ngo_id || ''}
            onChange={(e) => setForm({ ...form, ngo_id: Number(e.target.value) })}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          >
            <option value="">Select NGO</option>
            {ngos.map((n) => (
              <option key={n.ngo_id} value={n.ngo_id}>{n.ngo_name} – {n.city}, {n.state}</option>
            ))}
          </select>
        </label>
        <LocationInput
          label={<span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Pickup address</span>}
          value={form.pickup_address}
          onChange={(v) => setForm({ ...form, pickup_address: v })}
          placeholder="Start typing for full address (street, city, pincode)"
          required
          maxLength={500}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        />
        <label>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Donation type</span>
          <select
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          >
            <option value="">Select donation type</option>
            <option value="Food">Food</option>
            <option value="Clothes">Clothes</option>
            <option value="Books">Books</option>
          </select>
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Quantity / Amount (optional)</span>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 5 kg, 10 items, ₹500"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Items description (optional)</span>
          <textarea
            value={form.items_description || ''}
            onChange={(e) => setForm({ ...form, items_description: e.target.value })}
            rows={3}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Scheduled time (optional)</span>
          <input
            type="datetime-local"
            value={form.scheduled_time || ''}
            onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </label>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>A refundable deposit (e.g. ₹100) may be required. You will pay after submitting this form and the amount will be refunded after the NGO completes the pickup.</p>
        <button type="submit" disabled={loading} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Creating...' : 'Request Pickup'}
        </button>
      </form>
    </div>
  )
}

export default function NewPickup() {
  return (
    <ProtectedRoute requiredRole="donor">
      <NewPickupPage />
    </ProtectedRoute>
  )
}
