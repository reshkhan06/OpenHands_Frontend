import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Truck, UserCircle, LogOut, Menu, Clock, CheckCircle, Calendar, ArrowRight, MapPin, Eye, ClipboardList, Filter } from 'lucide-react'
import { clearAuthData } from '@/api/auth'
import { getNGOProfile, type NGOProfile } from '@/api/ngos'
import { listPickups, type PickupListItem } from '@/api/pickups'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'pickups', label: 'Pickups', icon: Truck },
  { id: 'profile', label: 'Profile', icon: UserCircle },
] as const

type TabId = (typeof TABS)[number]['id']

export default function NGODashboard() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [profile, setProfile] = useState<NGOProfile | null>(null)
  const [pickups, setPickups] = useState<PickupListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Open specific tab when navigating from Manage Pickups (e.g. state: { tab: 'pickups' })
  useEffect(() => {
    const tab = (location.state as { tab?: TabId } | null)?.tab
    if (tab && TABS.some((t) => t.id === tab)) setActiveTab(tab)
  }, [location.state])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [profileRes, pickupsRes] = await Promise.all([
          getNGOProfile(),
          listPickups(),
        ])
        if (!cancelled) {
          setProfile(profileRes)
          setPickups(Array.isArray(pickupsRes) ? pickupsRes : [])
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  const ngoName = profile?.ngo_name ?? 'NGO'
  const requestedCount = pickups.filter((p) => p.current_status === 'requested').length
  const completedCount = pickups.filter((p) => p.current_status === 'completed').length
  const recentPickups = [...pickups].sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0
    const db = b.created_at ? new Date(b.created_at).getTime() : 0
    return db - da
  }).slice(0, 5)

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
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  color: activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                  borderRadius: '10px',
                  marginBottom: '0.25rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  textAlign: 'left',
                  width: '100%',
                  fontSize: '1rem',
                }}
              >
                {tab.icon && <tab.icon size={18} strokeWidth={2} style={{ flexShrink: 0 }} />}
                <span>{tab.label}</span>
              </button>
            ))}
            <Link
              to="/dashboard/ngo/pickups"
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
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>NGO Dashboard</h4>
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
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{ngoName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{profile?.email ?? '—'}</div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '10px',
                border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0',
                background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.9)' : '#fff',
                color: activeTab === tab.id ? '#fff' : '#64748b',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {tab.icon && <tab.icon size={18} />}
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ padding: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading...</p>
        ) : (
          <>
            {activeTab === 'overview' && (
              <NGODashboardOverview
                profile={profile}
                pickups={pickups}
                recentPickups={recentPickups}
                requestedCount={requestedCount}
                completedCount={completedCount}
              />
            )}
            {activeTab === 'pickups' && (
              <NGODashboardPickups pickups={pickups} />
            )}
            {activeTab === 'profile' && profile && (
              <NGODashboardProfile profile={profile} />
            )}
          </>
        )}
      </main>
    </div>
  )
}

function NGODashboardOverview({
  profile,
  pickups,
  recentPickups,
  requestedCount,
  completedCount,
}: {
  profile: NGOProfile | null
  pickups: PickupListItem[]
  recentPickups: PickupListItem[]
  requestedCount: number
  completedCount: number
}) {
  const ngoName = profile?.ngo_name ?? 'NGO'
  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
          Welcome back, {ngoName} 👋
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>Here's your impact overview and latest pickups</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <NGOStatCard value={String(pickups.length)} label="Total Pickups" icon={<Truck size={24} />} color="primary" />
        <NGOStatCard value={String(requestedCount)} label="Pending (Requested)" icon={<Clock size={24} />} color="warning" />
        <NGOStatCard value={String(completedCount)} label="Completed" icon={<CheckCircle size={24} />} color="success" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            border: '1px solid #f1f5f9',
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)',
            }}
          >
            <h5 style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} style={{ color: '#059669' }} />
              Recent Pickups
            </h5>
            {recentPickups.length > 0 && (
              <Link
                to="/dashboard/ngo/pickups"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#059669',
                  textDecoration: 'none',
                }}
              >
                View all
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
          <div style={{ padding: '1rem 1.25rem' }}>
            {recentPickups.length === 0 ? (
              <div
                style={{
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  color: '#64748b',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px dashed #e2e8f0',
                }}
              >
                <Truck size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '0.95rem' }}>No pickups yet.</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>New pickup requests will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {recentPickups.map((p) => {
                  const statusConfig =
                    p.current_status === 'completed'
                      ? { bg: '#d1fae5', text: '#166534' }
                      : p.current_status === 'requested'
                        ? { bg: '#fef3c7', text: '#b45309' }
                        : { bg: '#dbeafe', text: '#1e40af' }
                  return (
                    <Link
                      key={p.pickup_id}
                      to={`/dashboard/ngo/pickups/${p.pickup_id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto auto',
                          gap: '1rem',
                          padding: '1rem 1.25rem',
                          borderRadius: '12px',
                          background: '#fafafa',
                          alignItems: 'center',
                          border: '1px solid #f1f5f9',
                          transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0fdf4'
                          e.currentTarget.style.borderColor = '#bbf7d0'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fafafa'
                          e.currentTarget.style.borderColor = '#f1f5f9'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                              color: '#059669',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Truck size={20} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Pickup #{p.pickup_id}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.pickup_address}
                            </div>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.35rem 0.65rem',
                            borderRadius: '8px',
                            background: statusConfig.bg,
                            color: statusConfig.text,
                          }}
                        >
                          {p.current_status.replace(/_/g, ' ')}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
                          <Calendar size={14} style={{ flexShrink: 0 }} />
                          {p.created_at ? new Date(p.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const PICKUP_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  requested: { bg: '#fef3c7', text: '#b45309' },
  accepted: { bg: '#dbeafe', text: '#1e40af' },
  on_the_way: { bg: '#ede9fe', text: '#6d28d9' },
  picked_up: { bg: '#fce7f3', text: '#be185d' },
  completed: { bg: '#d1fae5', text: '#166534' },
  cancelled: { bg: '#f1f5f9', text: '#64748b' },
}

function NGODashboardPickups({ pickups }: { pickups: PickupListItem[] }) {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [paymentFilter, setPaymentFilter] = useState<string>('')
  const statusOptions = [...new Set(pickups.map((p) => p.current_status))].sort()
  const paymentOptions = [...new Set(pickups.map((p) => p.payment_status))].sort()
  const filteredPickups = pickups.filter((p) => {
    if (statusFilter && p.current_status !== statusFilter) return false
    if (paymentFilter && p.payment_status !== paymentFilter) return false
    return true
  })

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardList size={24} style={{ color: '#059669' }} />
          All Pickups
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Overview of all pickup requests assigned to your NGO</p>
      </div>
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {pickups.length > 0 && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              background: 'linear-gradient(180deg, #f8fffe 0%, #fff 100%)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#0f766e', fontSize: '0.875rem' }}>
              <Filter size={16} style={{ opacity: 0.9 }} />
              Filter
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                background: '#fff',
                color: '#475569',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <option value="">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                background: '#fff',
                color: '#475569',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <option value="">All payments</option>
              {paymentOptions.map((p) => (
                <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>
              ))}
            </select>
            {(statusFilter || paymentFilter) && (
              <button
                type="button"
                onClick={() => { setStatusFilter(''); setPaymentFilter(''); }}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: '#64748b',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
        {pickups.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#64748b',
              background: 'linear-gradient(180deg, #f0fdf4 0%, #fff 100%)',
            }}
          >
            <Truck size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#475569' }}>No pickups yet</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem' }}>Pickup requests will appear here when assigned to your NGO.</p>
          </div>
        ) : filteredPickups.length === 0 ? (
          <div
            style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              color: '#64748b',
              background: 'linear-gradient(180deg, #f0fdf4 0%, #fff 100%)',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>No pickups match the selected filters</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem' }}>Try changing or clearing the filters above.</p>
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
                  const statusStyle = PICKUP_STATUS_STYLES[p.current_status] ?? { bg: '#f1f5f9', text: '#64748b' }
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
                          {p.payment_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px', color: '#64748b', fontSize: '0.875rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} style={{ flexShrink: 0, color: '#94a3b8' }} />
                          {p.created_at ? new Date(p.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
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
                          View
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
    </>
  )
}

function NGODashboardProfile({ profile }: { profile: NGOProfile }) {
  const rows: { label: string; value: string | null }[] = [
    { label: 'NGO Name', value: profile.ngo_name },
    { label: 'Email', value: profile.email },
    { label: 'Registration number', value: profile.registration_number },
    { label: 'Type', value: profile.ngo_type },
    { label: 'Address', value: profile.address },
    { label: 'City', value: profile.city },
    { label: 'State', value: profile.state },
    { label: 'Pincode', value: profile.pincode },
    { label: 'Website', value: profile.website_url ?? '—' },
    { label: 'Mission', value: profile.mission_statement },
    { label: 'Bank', value: profile.bank_name },
    { label: 'Account number', value: profile.account_number },
    { label: 'IFSC', value: profile.ifsc_code },
    { label: 'Verified', value: profile.is_verified ? 'Yes' : 'No' },
    { label: 'Joined', value: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '—' },
  ]
  return (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Profile</h1>
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          {rows.map((r) => (
            <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1rem', alignItems: 'start' }}>
              <span style={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>{r.label}</span>
              <span style={{ color: '#1e293b', fontSize: '0.875rem' }}>{r.value ?? '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function NGOStatCard({ value, label, icon, color }: { value: string; label: string; icon: React.ReactNode; color: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    success: { bg: '#d1fae5', text: '#10b981' },
    primary: { bg: '#dbeafe', text: '#2563eb' },
    purple: { bg: '#ede9fe', text: '#8b5cf6' },
    warning: { bg: '#fef3c7', text: '#f59e0b' },
  }
  const c = colorMap[color] ?? colorMap.primary
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: c.text }} />
      <div
        style={{
          width: '48px',
          height: '48px',
          flexShrink: 0,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          background: c.bg,
          color: c.text,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem', lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  )
}
