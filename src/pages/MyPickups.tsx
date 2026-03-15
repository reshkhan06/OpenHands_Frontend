import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listPickups, type PickupListItem } from '@/api/pickups'
import ProtectedRoute from '@/components/ProtectedRoute'

export function MyPickupsPage() {
  const [pickups, setPickups] = useState<PickupListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listPickups()
      .then(setPickups)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    requested: '#f59e0b',
    accepted: '#3b82f6',
    on_the_way: '#8b5cf6',
    picked_up: '#ec4899',
    completed: '#10b981',
    cancelled: '#6b7280',
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link to="/dashboard/donor" style={{ color: '#059669', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '4px', display: 'inline-block' }}>← Dashboard</Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Pickups</h1>
        </div>
        <Link to="/dashboard/donor/pickups/new" style={{ padding: '10px 20px', borderRadius: '8px', background: '#059669', color: 'white', fontWeight: 600, textDecoration: 'none' }}>New Pickup</Link>
      </div>
      {error && <div style={{ padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pickups.length === 0 ? <p style={{ color: '#6b7280' }}>No pickups yet.</p> : pickups.map((p) => (
            <Link key={p.pickup_id} to={`/dashboard/donor/pickups/${p.pickup_id}`} style={{ display: 'block', padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: 600 }}>#{p.pickup_id} – {p.pickup_address.slice(0, 40)}{p.pickup_address.length > 40 ? '...' : ''}</span>
                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: statusColor[p.current_status] || '#e5e7eb', color: '#fff' }}>{p.current_status}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#6b7280' }}>Payment: {p.payment_status}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MyPickups() {
  return (
    <ProtectedRoute requiredRole="donor">
      <MyPickupsPage />
    </ProtectedRoute>
  )
}
