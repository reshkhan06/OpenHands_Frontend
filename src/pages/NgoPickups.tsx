import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Truck, UserCircle, LogOut, Menu, RotateCw, Filter, ClipboardList, Eye, Calendar, MapPin } from 'lucide-react'
import { listPickups, type PickupListItem } from '@/api/pickups'
import { getNGOProfile, type NGOProfile } from '@/api/ngos'
import { clearAuthData } from '@/api/auth'
import ProtectedRoute from '@/components/ProtectedRoute'

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  requested: { bg: '#fef3c7', text: '#b45309' },
  accepted: { bg: '#dbeafe', text: '#1e40af' },
  on_the_way: { bg: '#ede9fe', text: '#6d28d9' },
  picked_up: { bg: '#fce7f3', text: '#be185d' },
  completed: { bg: '#d1fae5', text: '#166534' },
  cancelled: { bg: '#f1f5f9', text: '#64748b' },
}

function NgoPickupsPage() {
  const [pickups, setPickups] = useState<PickupListItem[]>([])
  const [profile, setProfile] = useState<NGOProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const navigate = useNavigate()

  const load = () => {
    setError(null)
    Promise.all([getNGOProfile(), listPickups()])
      .then(([p, list]) => {
        setProfile(p)
        setPickups(Array.isArray(list) ? list : [])
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    load()
  }, [])

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  const filteredPickups = statusFilter
    ? pickups.filter((p) => p.current_status === statusFilter)
    : pickups

  const ngoName = profile?.ngo_name ?? 'NGO'
  const statusOptions = [...new Set(pickups.map((p) => p.current_status))].sort()

  return (
    <div
      className="app-shell"
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#f0fdf4',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* SIDEBAR - same styling as donor navbar */}
      <aside
        className="sidebar"
        style={{
          width: '270px',
          background: 'linear-gradient(180deg, #064e3b 0%, #022c22 100%)',
          color: '#fff',
          padding: '1.5rem 1rem',
          flexShrink: 0,
          position: sidebarOpen ? 'static' : 'fixed',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          left: sidebarOpen ? 0 : '-270px',
          transition: 'left 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.5rem', flexShrink: 0 }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            OH
          </div>
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>OpenHands</h4>
          <span
            style={{
              fontSize: '0.7rem',
              background: 'rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              fontWeight: 600,
            }}
          >
            NGO
          </span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Link
              to="/dashboard/ngo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '10px',
                marginBottom: '0.25rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                textDecoration: 'none',
              }}
            >
              <LayoutDashboard size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span>Overview</span>
            </Link>
            <Link
              to="/dashboard/ngo"
              state={{ tab: 'pickups' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '10px',
                marginBottom: '0.25rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                textDecoration: 'none',
              }}
            >
              <Truck size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span>Pickups</span>
            </Link>
            <Link
              to="/dashboard/ngo"
              state={{ tab: 'profile' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '10px',
                marginBottom: '0.25rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                textDecoration: 'none',
              }}
            >
              <UserCircle size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span>Profile</span>
            </Link>
            <Link
              to="/dashboard/ngo/pickups"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'white',
                background: 'rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                marginBottom: '0.25rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                textDecoration: 'none',
              }}
            >
              <Truck size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span>Manage Pickups</span>
            </Link>
          </div>
          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '1rem 0', flexShrink: 0 }} />
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '10px',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              flexShrink: 0,
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <LogOut size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT - only this area scrolls */}
      <main style={{ flex: 1, minHeight: 0, padding: '1.5rem 2rem', overflowY: 'auto' }}>
        {/* TOPBAR - same as donor */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'white',
              border: 'none',
              padding: '0.5rem 0.75rem',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              fontSize: '1.25rem',
            }}
          >
            <Menu size={22} strokeWidth={2} />
          </button>
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Manage Pickups</h4>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.375rem 0.75rem 0.375rem 0.375rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {ngoName.slice(0, 2).toUpperCase()}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{ngoName}</span>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={22} />
              Pickup requests
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 500 }}>
                <Filter size={16} />
                <span>Filter</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontSize: '0.875rem',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <option value="" style={{ background: '#0f766e', color: '#fff' }}>All statuses</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s} style={{ background: '#0f766e', color: '#fff' }}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <button
                onClick={() => { setLoading(true); load(); }}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <RotateCw size={18} />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <RotateCw size={36} style={{ color: '#059669' }} />
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>Loading pickups...</p>
            </div>
          ) : filteredPickups.length === 0 ? (
            <div
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#64748b',
                background: 'linear-gradient(180deg, #f0fdf4 0%, #fff 100%)',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <Truck size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#475569' }}>
                {statusFilter ? 'No pickups with this status' : 'No pickup requests yet'}
              </p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem' }}>
                {statusFilter ? 'Try another filter or refresh the list.' : 'Pickup requests assigned to your NGO will appear here.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(180deg, #ccfbf1 0%, #99f6e4 100%)' }}>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: '#0f766e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: '#0f766e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: '#0f766e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: '#0f766e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: '#0f766e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: '#0f766e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPickups.map((p, idx) => {
                    const statusStyle = STATUS_STYLES[p.current_status] ?? { bg: '#f1f5f9', text: '#64748b' }
                    const paymentStyle =
                      p.payment_status === 'paid'
                        ? { bg: '#d1fae5', text: '#166534' }
                        : p.payment_status === 'refunded'
                          ? { bg: '#e0e7ff', text: '#4338ca' }
                          : p.payment_status === 'refund_pending'
                            ? { bg: '#fef9c3', text: '#a16207' }
                            : { bg: '#fef3c7', text: '#b45309' }
                    const rowBg = idx % 2 === 0 ? '#fff' : '#f8fffe'
                    return (
                      <tr key={p.pickup_id} style={{ borderBottom: '1px solid #e2e8f0', background: rowBg }}>
                        <td style={{ padding: '16px 18px', fontWeight: 700, color: '#064e3b', fontSize: '0.9rem' }}>#{p.pickup_id}</td>
                        <td style={{ padding: '16px 18px', color: '#475569', maxWidth: '280px', fontSize: '0.875rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                            <MapPin size={14} style={{ flexShrink: 0, color: '#64748b' }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.pickup_address}</span>
                          </span>
                        </td>
                        <td style={{ padding: '16px 18px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '5px 12px',
                              borderRadius: '10px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: statusStyle.bg,
                              color: statusStyle.text,
                            }}
                          >
                            {p.current_status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '16px 18px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: paymentStyle.bg,
                              color: paymentStyle.text,
                            }}
                          >
                            {p.payment_status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 18px', color: '#64748b', fontSize: '0.875rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} style={{ flexShrink: 0, color: '#94a3b8' }} />
                            {p.created_at ? new Date(p.created_at).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 18px' }}>
                          <Link
                            to={`/dashboard/ngo/pickups/${p.pickup_id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '8px 14px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #059669, #047857)',
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              textDecoration: 'none',
                              boxShadow: '0 2px 4px rgba(5, 150, 105, 0.3)',
                            }}
                          >
                            <Eye size={16} />
                            View / Update
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function NgoPickups() {
  return (
    <ProtectedRoute requiredRole="ngo">
      <NgoPickupsPage />
    </ProtectedRoute>
  )
}
