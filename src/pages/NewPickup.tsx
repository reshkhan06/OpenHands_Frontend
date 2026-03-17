import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createPickup, createPickupWithImage, type PickupCreateBody } from '@/api/pickups'
import { confirmPayment } from '@/api/payments'
import { listVerifiedNGOs } from '@/api/ngos'
import ProtectedRoute from '@/components/ProtectedRoute'
import LocationInput from '@/components/LocationInput'
import { Clock } from 'lucide-react'

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
  const [items, setItems] = useState<{ name: string; quantity: string; expiration: string }[]>([
    { name: '', quantity: '', expiration: '' },
  ])
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<PaymentStep>(null)
  const navigate = useNavigate()

  useEffect(() => {
    listVerifiedNGOs()
      .then(setNgos)
      .catch(() => {
        const msg = 'Failed to load NGOs'
        setError(msg)
        toast.error(msg)
      })
  }, [])

  const isDummyPayment = (status: string, keyId: string | null) =>
    status === 'paid' || !keyId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPaymentStep(null)
    setImageError(null)
    setLoading(true)
    try {
      const trimmedType = donationType.trim()
      const filledRows = items.filter((r) => {
        const hasNameOrQty = r.name.trim().length > 0 || r.quantity.trim().length > 0
        const hasExp = r.expiration.trim().length > 0
        return donationType === 'Food'
          ? hasNameOrQty || hasExp
          : hasNameOrQty
      })
      if (!trimmedType || !scheduledDate || !scheduledTime || filledRows.length === 0) {
        const msg =
          'Please fill donation type, at least one item row (name, quantity & expiration), and both scheduled date and time.'
        setError(msg)
        toast.error(msg)
        return
      }

      const scheduled = new Date(`${scheduledDate}T${scheduledTime}`)
      const now = new Date()
      if (scheduled.getTime() < now.getTime()) {
        const msg = 'Scheduled time must be in the future.'
        setError(msg)
        toast.error(msg)
        return
      }

      const descriptionParts: string[] = []
      descriptionParts.push(`Type: ${trimmedType}`)
      const itemLines = filledRows.map((r, idx) => {
        const name = r.name.trim() || `Item ${idx + 1}`
        const qty = r.quantity.trim() || '-'
        const exp = r.expiration.trim() || '-'
        return donationType === 'Food'
          ? `${name}: Qty=${qty}; Exp=${exp}`
          : `${name}: Qty=${qty}`
      })
      descriptionParts.push(`Items: ${itemLines.join(' | ')}`)

      const payload: PickupCreateBody = {
        ...form,
        scheduled_time: scheduled.toISOString(),
        items_description: descriptionParts.length ? descriptionParts.join(' | ') : undefined,
      }

      let res
      if (imageFile) {
        const allowed = ['image/png', 'image/jpeg', 'image/webp']
        if (!allowed.includes(imageFile.type)) {
          const msg = 'Only PNG, JPG/JPEG, or WEBP images are allowed'
          setImageError(msg)
          throw new Error(msg)
        }
        if (imageFile.size > 5 * 1024 * 1024) {
          const msg = 'Image must be 5MB or smaller'
          setImageError(msg)
          throw new Error(msg)
        }
        res = await createPickupWithImage(payload, imageFile)
      } else {
        res = await createPickup(payload)
      }
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
              const msg = err instanceof Error ? err.message : 'Payment verification failed'
              setError(msg)
              toast.error(msg)
            }
          },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else if (keyId && !window.Razorpay) {
        const msg = 'Payment gateway could not be loaded. Please refresh the page and try again.'
        setError(msg)
        toast.error(msg)
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
      const msg = err instanceof Error ? err.message : 'Failed to create pickup'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

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
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Donation type *</span>
          <select
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          >
            <option value="">Select donation type</option>
            <option value="Food">Food</option>
            <option value="Clothes">Clothes</option>
            <option value="Books">Books</option>
          </select>
        </label>
        <div>
          <span style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
            Items ({donationType === 'Food' ? 'name, quantity & expiration' : 'name & quantity'}) *
          </span>
          <div
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th
                    style={{
                      padding: '8px 10px',
                      textAlign: 'left',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: '8px 10px',
                      textAlign: 'left',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Quantity
                  </th>
                  {donationType === 'Food' && (
                    <th
                      style={{
                        padding: '8px 10px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      Expiration
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px 8px', borderTop: '1px solid #f3f4f6' }}>
                      <input
                        value={row.name}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, name: e.target.value } : r
                            )
                          )
                        }
                        placeholder="e.g. Rice, Jackets"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                        }}
                      />
                    </td>
                    <td style={{ padding: '6px 8px', borderTop: '1px solid #f3f4f6' }}>
                      <input
                        value={row.quantity}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, quantity: e.target.value } : r
                            )
                          )
                        }
                        placeholder="e.g. 5 kg, 10 items"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                        }}
                      />
                    </td>
                    {donationType === 'Food' && (
                      <td style={{ padding: '6px 8px', borderTop: '1px solid #f3f4f6' }}>
                        <input
                          type="date"
                          value={row.expiration}
                          onChange={(e) =>
                            setItems((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, expiration: e.target.value } : r
                              )
                            )
                          }
                          min={new Date().toISOString().slice(0, 10)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, { name: '', quantity: '', expiration: '' }])}
            style={{
              marginTop: '8px',
              fontSize: '0.85rem',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px dashed #9ca3af',
              background: '#f9fafb',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            + Add item row
          </button>
          <p style={{ marginTop: '6px', fontSize: '0.8rem', color: '#6b7280' }}>
            Add one or more rows with quantity and expiration details for your donation items.
          </p>
        </div>
        <label>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Scheduled date *</span>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            required
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </label>
        <label>
          <span style={{ marginBottom: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} style={{ color: '#6b7280' }} />
            <span>Scheduled time *</span>
          </span>
          <input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Donation image (optional)</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              setImageFile(f)
              setImageError(null)
            }}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
          {imageError && <div style={{ marginTop: '8px', color: '#b91c1c', fontSize: '0.85rem' }}>{imageError}</div>}
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={imagePreview}
                alt="Donation preview"
                style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 12, border: '1px solid #e5e7eb' }}
              />
            </div>
          )}
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
