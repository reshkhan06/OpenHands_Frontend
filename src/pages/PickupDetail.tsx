import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Truck,
  MapPin,
  Clock,
  Package,
  Calendar,
  CheckCircle,
  CreditCard,
  AlertCircle,
  RefreshCw,
  X,
  Info,
  History,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { getPickup, updatePickupStatus, type PickupDetail as PickupDetailType } from '@/api/pickups'
import type { PickupStatus } from '@/api/pickups'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getUserRole } from '@/api/auth'

const NEXT_STATUS: Record<string, PickupStatus | null> = {
  requested: 'accepted',
  accepted: 'on_the_way',
  on_the_way: 'picked_up',
  picked_up: 'completed',
  completed: null,
  cancelled: null,
}

const STATUS_FLOW: PickupStatus[] = ['requested', 'accepted', 'on_the_way', 'picked_up', 'completed']

function PickupDetailPage() {
  const { pickupId } = useParams<{ pickupId: string }>()
  const [pickup, setPickup] = useState<PickupDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const role = getUserRole()
  const isDonor = role === 'donor' || role === 'user'
  const isNgo = role === 'ngo' || role === 'ngo_representative'

  const setErrorFrom = (e: unknown) => {
    const msg =
      e instanceof Error
        ? e.message
        : typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message: unknown }).message)
          : 'Something went wrong'
    setError(msg)
    toast.error(msg)
  }

  const refresh = () => {
    if (!pickupId) return
    setError(null)
    getPickup(Number(pickupId)).then(setPickup).catch(setErrorFrom)
  }

  useEffect(() => {
    if (!pickupId) return
    getPickup(Number(pickupId))
      .then(setPickup)
      .catch(setErrorFrom)
      .finally(() => setLoading(false))
  }, [pickupId])

  const handleStatusUpdate = async (nextStatus: PickupStatus) => {
    if (!pickupId) return
    setError(null)
    setUpdating(true)
    try {
      await updatePickupStatus(Number(pickupId), nextStatus)
      refresh()
    } catch (e) {
      setErrorFrom(e)
    } finally {
      setUpdating(false)
    }
  }

  if (!pickupId) return null

  const errorBanner = error ? (
    <div
      role="alert"
      style={{
        marginBottom: '20px',
        padding: '16px 20px',
        borderRadius: '14px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#b91c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={22} style={{ flexShrink: 0 }} />
        {error}
      </span>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={refresh}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            border: 'none',
            background: '#b91c1c',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          <RefreshCw size={16} />
          Retry
        </button>
        <button
          type="button"
          onClick={() => setError(null)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid #b91c1c',
            background: 'transparent',
            color: '#b91c1c',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          <X size={16} />
          Dismiss
        </button>
      </div>
    </div>
  ) : null

  if (loading && !pickup) {
    return (
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          {isDonor && (
            <Link to="/dashboard/donor" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              <ArrowLeft size={18} /> Back to dashboard
            </Link>
          )}
          {isNgo && (
            <Link to="/dashboard/ngo/pickups" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              <ArrowLeft size={18} /> Pickups
            </Link>
          )}
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Pickup #{pickupId}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '3rem', color: '#64748b' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: '#059669' }} />
          <p style={{ margin: 0, fontWeight: 500 }}>Loading pickup details...</p>
        </div>
      </div>
    )
  }

  if (!pickup) {
    return (
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          {isDonor && (
            <Link to="/dashboard/donor" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              <ArrowLeft size={18} /> My Donations
            </Link>
          )}
          {isNgo && (
            <Link to="/dashboard/ngo/pickups" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              <ArrowLeft size={18} /> Pickups
            </Link>
          )}
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Pickup #{pickupId}</span>
        </div>
        {errorBanner}
        <div style={{ padding: '20px', borderRadius: '14px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #e2e8f0' }}>
          <AlertCircle size={24} style={{ flexShrink: 0, color: '#94a3b8' }} />
          {error ? 'Fix the issue above and click Retry, or go back to the list.' : 'Pickup not found.'}
        </div>
      </div>
    )
  }

  const prettyStatus = pickup.current_status.replace(/_/g, ' ')
  const isCompleted = pickup.current_status === 'completed'
  const isCancelled = pickup.current_status === 'cancelled'
  const paymentBadgeColor =
    pickup.payment_status === 'paid'
      ? { bg: '#dcfce7', text: '#166534' }
      : pickup.payment_status === 'refunded'
      ? { bg: '#e0f2fe', text: '#0369a1' }
      : { bg: '#fef3c7', text: '#b45309' }

  return (
    <div style={{ padding: '24px', maxWidth: '920px', margin: '0 auto' }}>
      {errorBanner}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {isDonor && (
            <Link
              to="/dashboard/donor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#059669',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={20} /> My Donations
            </Link>
          )}
          {isNgo && (
            <Link
              to="/dashboard/ngo/pickups"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#2563eb',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={20} /> Manage Pickups
            </Link>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: isDonor ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: isDonor ? '0 4px 14px rgba(5, 150, 105, 0.35)' : '0 4px 14px rgba(37, 99, 235, 0.35)',
              }}
            >
              <Truck size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Pickup #{pickup.pickup_id}
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Track your donation</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: isCompleted ? '#dcfce7' : isCancelled ? '#fee2e2' : '#e0f2fe',
              color: isCompleted ? '#166534' : isCancelled ? '#b91c1c' : '#0f172a',
              textTransform: 'capitalize',
            }}
          >
            {isCompleted && <CheckCircle size={16} />}
            {prettyStatus}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: paymentBadgeColor.bg,
              color: paymentBadgeColor.text,
              textTransform: 'capitalize',
            }}
          >
            <CreditCard size={16} />
            {pickup.payment_status} deposit
          </span>
        </div>
      </div>

      {isCompleted && pickup.payment_status === 'refunded' && (
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 18px',
            borderRadius: '14px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <Info size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            This payment has been refunded (demo version). In production, the deposit would be refunded to your account after the NGO completes the pickup.
          </span>
        </div>
      )}

      {/* Supply chain steps */}
      <div
        style={{
          marginBottom: '24px',
          padding: '20px 24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {STATUS_FLOW.map((status, index) => {
          const reachedIndex = STATUS_FLOW.indexOf(pickup.current_status as PickupStatus)
          const isReached = reachedIndex >= index
          const isCurrent = pickup.current_status === status
          const stepLabels: Record<string, string> = {
            requested: 'Requested',
            accepted: 'Accepted',
            on_the_way: 'On the way',
            picked_up: 'Picked up',
            completed: 'Completed',
          }
          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: isReached ? '0' : '2px solid rgba(148, 163, 184, 0.5)',
                  background: isReached
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'rgba(51, 65, 85, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isReached ? 'white' : '#94a3b8',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(34, 197, 94, 0.35)' : undefined,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {isReached ? <CheckCircle size={16} strokeWidth={2.5} /> : <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{index + 1}</span>}
              </div>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: '0.8rem',
                  color: isCurrent ? '#f1f5f9' : isReached ? '#cbd5e1' : '#64748b',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap',
                  fontWeight: isCurrent ? 600 : 500,
                }}
              >
                {stepLabels[status] ?? status.replace(/_/g, ' ')}
              </span>
              {index < STATUS_FLOW.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    marginLeft: 8,
                    marginRight: 4,
                    borderRadius: 999,
                    background: reachedIndex > index ? 'linear-gradient(90deg, #22c55e, #16a34a)' : '#334155',
                    minWidth: 12,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1.1fr)',
          gap: '20px',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
            padding: '24px',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} style={{ color: '#059669' }} />
            Pickup details
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MapPin size={18} style={{ flexShrink: 0, color: '#64748b', marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Address</div>
                <span>{pickup.pickup_address}</span>
              </div>
            </div>
            {pickup.scheduled_time && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Clock size={18} style={{ flexShrink: 0, color: '#64748b', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Scheduled time</div>
                  <span>{new Date(pickup.scheduled_time).toLocaleString()}</span>
                </div>
              </div>
            )}
            {pickup.items_description && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Package size={18} style={{ flexShrink: 0, color: '#64748b', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Items</div>
                  <span>{pickup.items_description}</span>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Calendar size={18} style={{ flexShrink: 0, color: '#64748b', marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', marginBottom: '2px' }}>Created</div>
                <span>{pickup.created_at ? new Date(pickup.created_at).toLocaleString() : '—'}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
            padding: '24px',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={20} style={{ color: isNgo ? '#2563eb' : '#059669' }} />
            {isNgo ? 'Update status' : 'Status'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} style={{ color: '#059669' }} />
            Current: <strong style={{ textTransform: 'capitalize', color: '#0f172a' }}>{prettyStatus}</strong>
          </p>
          {isNgo && NEXT_STATUS[pickup.current_status] && pickup.payment_status === 'paid' && (
            <button
              onClick={() => handleStatusUpdate(NEXT_STATUS[pickup.current_status]!)}
              disabled={updating}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: 'white',
                fontWeight: 600,
                cursor: updating ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              }}
            >
              {updating ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
              {updating ? 'Updating...' : `Mark as ${NEXT_STATUS[pickup.current_status]!.replace(/_/g, ' ')}`}
            </button>
          )}
          {isNgo && pickup.current_status === 'requested' && pickup.payment_status !== 'paid' && (
            <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} />
              Waiting for donor to pay deposit before you can accept.
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={20} style={{ color: '#059669' }} />
          Status timeline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pickup.status_history.map((h, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                padding: '14px 16px 14px 20px',
                background: '#f8fffe',
                borderRadius: '12px',
                borderLeft: '4px solid #059669',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <CheckCircle size={18} style={{ flexShrink: 0, color: '#059669', marginTop: '2px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#0f172a' }}>{h.status.replace(/_/g, ' ')}</span>
                <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                  {h.changed_at ? new Date(h.changed_at).toLocaleString() : ''}
                </span>
                {h.note && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#475569' }}>{h.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PickupDetail() {
  return (
    <ProtectedRoute>
      <PickupDetailPage />
    </ProtectedRoute>
  )
}
