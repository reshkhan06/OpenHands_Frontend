import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  Truck,
  Settings,
  LogOut,
  Menu,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Shield,
  ArrowLeft,
  IndianRupee,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { clearAuthData } from '@/api/auth'
import {
  getAdminDashboard,
  getAdminUsers,
  updateAdminUser,
  getAdminNGOs,
  updateAdminNGO,
  deleteAdminNGO,
  getAdminPickups,
  getAdminPickup,
  getAdminConfig,
  updateAdminConfig,
  type AdminUserRow,
  type AdminNGORow,
  type AdminPickupRow,
  type AdminDashboardStats,
} from '@/api/admin'

const ICON_SIZE_SM = 18

type AdminPage = 'dashboard' | 'users' | 'ngos' | 'pickups' | 'settings'

const ADMIN_BASE = '/admin'

function pathToPage(pathname: string): { page: AdminPage; pickupId: number | null } {
  if (pathname === ADMIN_BASE || pathname === `${ADMIN_BASE}/` || pathname === `${ADMIN_BASE}/dashboard`) return { page: 'dashboard', pickupId: null }
  if (pathname.startsWith(`${ADMIN_BASE}/users`)) return { page: 'users', pickupId: null }
  if (pathname.startsWith(`${ADMIN_BASE}/ngos`)) return { page: 'ngos', pickupId: null }
  const pickupsMatch = pathname.match(new RegExp(`^${ADMIN_BASE.replace(/\/$/, '')}/pickups/(\\d+)$`))
  if (pickupsMatch) return { page: 'pickups', pickupId: parseInt(pickupsMatch[1], 10) }
  if (pathname.startsWith(`${ADMIN_BASE}/pickups`)) return { page: 'pickups', pickupId: null }
  if (pathname.startsWith(`${ADMIN_BASE}/settings`)) return { page: 'settings', pickupId: null }
  return { page: 'dashboard', pickupId: null }
}

export default function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const { page: urlPage, pickupId: urlPickupId } = useMemo(() => pathToPage(location.pathname), [location.pathname])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState<AdminPage>(urlPage)
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [ngos, setNgos] = useState<AdminNGORow[]>([])
  const [pickups, setPickups] = useState<AdminPickupRow[]>([])
  const [pickupDetail, setPickupDetail] = useState<Record<string, unknown> | null>(null)
  const [config, setConfig] = useState<{ deposit_amount_paise: number } | null>(null)
  const [depositInput, setDepositInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pickupDetailLoading, setPickupDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [userRole, setUserRole] = useState<string>('')
  const [userSearch, setUserSearch] = useState('')
  const [userIsActive, setUserIsActive] = useState<boolean | ''>('')
  const [ngoVerified, setNgoVerified] = useState<boolean | ''>('')
  const [pickupStatus, setPickupStatus] = useState<string>('')

  // Sync from URL
  useEffect(() => {
    setActivePage(urlPage)
  }, [urlPage])

  const setPage = (page: AdminPage, pickupId?: number) => {
    if (page === 'dashboard') navigate(`${ADMIN_BASE}/dashboard`)
    else if (page === 'users') navigate(`${ADMIN_BASE}/users`)
    else if (page === 'ngos') navigate(`${ADMIN_BASE}/ngos`)
    else if (page === 'pickups') navigate(pickupId ? `${ADMIN_BASE}/pickups/${pickupId}` : `${ADMIN_BASE}/pickups`)
    else if (page === 'settings') navigate(`${ADMIN_BASE}/settings`)
  }

  useEffect(() => {
    if (activePage === 'dashboard') {
      setLoading(true)
      setError(null)
      getAdminDashboard()
        .then(setStats)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [activePage])

  useEffect(() => {
    if (activePage === 'users') {
      setLoading(true)
      setError(null)
      const params: { role?: string; search?: string; is_active?: boolean } = {}
      if (userRole) params.role = userRole
      if (userSearch.trim()) params.search = userSearch.trim()
      if (userIsActive !== '') params.is_active = userIsActive as boolean
      getAdminUsers(params)
        .then(setUsers)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [activePage, userRole, userSearch, userIsActive])

  useEffect(() => {
    if (activePage === 'ngos') {
      setLoading(true)
      setError(null)
      getAdminNGOs(ngoVerified === '' ? undefined : (ngoVerified as boolean))
        .then(setNgos)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [activePage, ngoVerified])

  useEffect(() => {
    if (activePage === 'pickups') {
      setLoading(true)
      setError(null)
      getAdminPickups(pickupStatus || undefined)
        .then(setPickups)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [activePage, pickupStatus])

  useEffect(() => {
    if (activePage === 'settings') {
      setLoading(true)
      setError(null)
      getAdminConfig()
        .then((c) => {
          setConfig(c)
          setDepositInput(String(c.deposit_amount_paise))
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [activePage])

  // Load pickup detail when URL has pickupId
  const selectedPickupId = urlPickupId ?? (params.pickupId ? parseInt(params.pickupId, 10) : null)
  useEffect(() => {
    if (activePage === 'pickups' && selectedPickupId) {
      setPickupDetailLoading(true)
      setPickupDetail(null)
      getAdminPickup(selectedPickupId)
        .then(setPickupDetail)
        .catch((e) => setError(e.message))
        .finally(() => setPickupDetailLoading(false))
    } else {
      setPickupDetail(null)
    }
  }, [activePage, selectedPickupId])

  // Redirect /admin to /admin/dashboard
  useEffect(() => {
    if (location.pathname === ADMIN_BASE || location.pathname === `${ADMIN_BASE}/`) {
      navigate(`${ADMIN_BASE}/dashboard`, { replace: true })
    }
  }, [location.pathname, navigate])

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  const handleUpdateUser = async (userId: number, updates: { role?: string; is_active?: boolean }) => {
    try {
      await updateAdminUser(userId, updates)
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId
            ? {
                ...u,
                role: updates.role ?? u.role,
                is_active: updates.is_active ?? u.is_active,
              }
            : u
        )
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const handleUpdateNGO = async (ngoId: number, is_verified: boolean) => {
    try {
      await updateAdminNGO(ngoId, { is_verified })
      setNgos((prev) =>
        prev.map((n) => (n.ngo_id === ngoId ? { ...n, is_verified } : n))
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const handleDeleteNGO = async (ngoId: number, ngoName: string) => {
    if (!window.confirm(`Delete NGO "${ngoName}"? This will also remove all related pickups and payments.`)) return
    try {
      await deleteAdminNGO(ngoId)
      setNgos((prev) => prev.filter((n) => n.ngo_id !== ngoId))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  const handleSaveConfig = async () => {
    const val = parseInt(depositInput, 10)
    if (isNaN(val) || val < 0) {
      setError('Deposit amount must be a non-negative number (paise)')
      return
    }
    try {
      const c = await updateAdminConfig({ deposit_amount_paise: val })
      setConfig(c)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const navItems: { id: AdminPage; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'ngos', label: 'NGOs', icon: Building2 },
    { id: 'pickups', label: 'Pickups', icon: Truck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <aside
        style={{
          width: '270px',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-270px)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>OH</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>OpenHands</h4>
            <span style={{ fontSize: '0.7rem', background: 'rgba(99, 102, 241, 0.4)', color: '#a5b4fc', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>Admin</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  margin: '0 0.75rem 0.25rem',
                  border: 'none',
                  borderRadius: '10px',
                  color: activePage === item.id ? 'white' : 'rgba(255,255,255,0.75)',
                  fontSize: '0.95rem',
                  background: activePage === item.id ? 'rgba(99, 102, 241, 0.35)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={ICON_SIZE_SM} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            )
          })}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              margin: '0.75rem 1rem 0',
              border: 'none',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.95rem',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 500,
            }}
          >
            <LogOut size={ICON_SIZE_SM} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, marginLeft: sidebarOpen ? '270px' : '0', transition: 'margin-left 0.3s ease', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '10px', cursor: 'pointer', color: '#475569' }}>
            <Menu size={22} strokeWidth={2} />
          </button>
          <span style={{ color: '#1e293b', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} strokeWidth={2} />
            Admin Panel
          </span>
        </div>

        <div style={{ padding: '1.5rem 2rem', flex: 1, overflowY: 'auto' }}>
          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={18} strokeWidth={2} />
              {error}
            </div>
          )}
          {activePage === 'dashboard' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>Dashboard</h1>
                <p style={{ fontSize: '0.95rem', color: '#64748b' }}>Overview of platform stats</p>
              </div>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  <AdminStatCard title="Total Users" value={String(stats.users_total)} color="#3b82f6" icon={Users} />
                  <AdminStatCard title="Total NGOs" value={String(stats.ngos_total)} color="#10b981" icon={Building2} />
                  <AdminStatCard title="NGOs Pending" value={String(stats.ngos_pending)} color="#f59e0b" icon={Building2} />
                  <AdminStatCard title="Total Pickups" value={String(stats.pickups_total)} color="#8b5cf6" icon={Truck} />
                  <AdminStatCard title="Pickups Requested" value={String(stats.pickups_requested)} color="#ec4899" icon={Truck} />
                  <AdminStatCard title="Active Deposits" value={String(stats.deposits_active)} color="#14b8a6" icon={IndianRupee} />
                </div>
              )}
            </>
          )}
          {activePage === 'users' && (
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '1.5rem 2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={22} strokeWidth={2} style={{ opacity: 0.95 }} />
                  Users
                </h2>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>Manage roles and status</p>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', background: 'linear-gradient(180deg, #f5f3ff 0%, #fff 100%)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#4f46e5', fontSize: '0.875rem' }}>
                  <Filter size={16} style={{ opacity: 0.9 }} />
                  Filter
                </span>
                <input type="text" placeholder="Search name or email" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', minWidth: '180px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} />
                <select value={userRole} onChange={(e) => setUserRole(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                  <option value="">All roles</option>
                  <option value="donor">Donor</option>
                  <option value="admin">Admin</option>
                </select>
                <select value={String(userIsActive)} onChange={(e) => setUserIsActive(e.target.value === '' ? '' : e.target.value === 'true')} style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                  <option value="">All status</option>
                  <option value="true">Active</option>
                  <option value="false">Blocked</option>
                </select>
              </div>
              <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', padding: '2rem' }}>
                    <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                    <span>Loading users...</span>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: '3rem 16px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>No users match the filters.</td>
                        </tr>
                      ) : (
                        users.map((u, idx) => (
                          <tr key={u.user_id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>{u.fname} {u.lname}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.9rem' }}>{u.email}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: '999px', background: u.role === 'admin' ? '#e0e7ff' : '#ccfbf1', color: u.role === 'admin' ? '#3730a3' : '#0f766e', fontSize: '0.8rem', fontWeight: 600 }}>{u.role}</span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '999px', background: u.is_active ? '#d1fae5' : '#fee2e2', color: u.is_active ? '#065f46' : '#b91c1c', fontSize: '0.8rem', fontWeight: 600 }}>
                                {u.is_active ? <CheckCircle size={14} strokeWidth={2} /> : <XCircle size={14} strokeWidth={2} />}
                                {u.is_active ? 'Active' : 'Blocked'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                              <select value={u.role} onChange={(e) => handleUpdateUser(u.user_id, { role: e.target.value })} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', background: '#fff', cursor: 'pointer' }}>
                                <option value="donor">Donor</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button type="button" onClick={() => handleUpdateUser(u.user_id, { is_active: !u.is_active })} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: u.is_active ? '#fef2f2' : '#dcfce7', color: u.is_active ? '#b91c1c' : '#166534' }}>
                                {u.is_active ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                {u.is_active ? 'Block' : 'Unblock'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {activePage === 'ngos' && (
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', padding: '1.5rem 2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={22} strokeWidth={2} style={{ opacity: 0.95 }} />
                  NGOs
                </h2>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>Verify and manage organisations</p>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', background: 'linear-gradient(180deg, #f0fdfa 0%, #fff 100%)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#0f766e', fontSize: '0.875rem' }}>
                  <Filter size={16} style={{ opacity: 0.9 }} />
                  Filter
                </span>
                <select value={String(ngoVerified)} onChange={(e) => setNgoVerified(e.target.value === '' ? '' : e.target.value === 'true')} style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                  <option value="">All</option>
                  <option value="true">Verified only</option>
                  <option value="false">Pending only</option>
                </select>
              </div>
              <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', padding: '2rem' }}>
                    <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                    <span>Loading NGOs...</span>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NGO Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ngos.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: '3rem 16px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>No NGOs match the filters.</td>
                        </tr>
                      ) : (
                        ngos.map((n, idx) => (
                          <tr key={n.ngo_id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>{n.ngo_name}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.9rem' }}>{n.city}, {n.state}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '999px', background: n.is_verified ? '#d1fae5' : '#fef3c7', color: n.is_verified ? '#065f46' : '#92400e', fontSize: '0.8rem', fontWeight: 600 }}>
                                {n.is_verified ? <CheckCircle size={14} strokeWidth={2} /> : null}
                                {n.is_verified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                              <button type="button" onClick={() => handleUpdateNGO(n.ngo_id, true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', boxShadow: '0 1px 3px rgba(16, 185, 129, 0.3)' }}>
                                <CheckCircle size={14} strokeWidth={2} />
                                Approve
                              </button>
                              <button type="button" onClick={() => handleUpdateNGO(n.ngo_id, false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: '#fef2f2', color: '#b91c1c' }}>
                                <XCircle size={14} strokeWidth={2} />
                                Reject
                              </button>
                              <button type="button" onClick={() => handleDeleteNGO(n.ngo_id, n.ngo_name)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: '#fef2f2', color: '#991b1b' }}>
                                <Trash2 size={14} strokeWidth={2} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {activePage === 'pickups' && (
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '1.5rem 2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={22} strokeWidth={2} style={{ opacity: 0.95 }} />
                  Pickups
                </h2>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>View and filter all pickup requests</p>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', background: 'linear-gradient(180deg, #f5f3ff 0%, #fff 100%)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#7c3aed', fontSize: '0.875rem' }}>
                  <Filter size={16} style={{ opacity: 0.9 }} />
                  Filter
                </span>
                <select value={pickupStatus} onChange={(e) => setPickupStatus(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                  <option value="">All statuses</option>
                  <option value="requested">Requested</option>
                  <option value="assigned">Assigned</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {selectedPickupId && (
                  <button type="button" onClick={() => setPage('pickups')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    <ArrowLeft size={16} strokeWidth={2} />
                    Back to list
                  </button>
                )}
              </div>
              {selectedPickupId && (
                <div style={{ margin: '1.5rem 1.5rem 0', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Eye size={18} strokeWidth={2} />
                    Pickup #{selectedPickupId} details
                  </h3>
                  {pickupDetailLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                      <Loader2 size={18} strokeWidth={2} className="animate-spin" />
                      <span>Loading detail...</span>
                    </div>
                  ) : pickupDetail ? (
                    <pre style={{ background: '#fff', padding: '1rem', borderRadius: '8px', overflow: 'auto', fontSize: '0.8rem', margin: 0, border: '1px solid #e2e8f0' }}>{JSON.stringify(pickupDetail, null, 2)}</pre>
                  ) : null}
                </div>
              )}
              <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', padding: '2rem' }}>
                    <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                    <span>Loading pickups...</span>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Donor</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NGO</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickups.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '3rem 16px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>No pickups match the filters.</td>
                        </tr>
                      ) : (
                        pickups.map((p, idx) => (
                          <tr key={p.pickup_id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>{p.pickup_id}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.9rem' }}>{p.donor_id}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.9rem' }}>{p.ngo_id}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.pickup_address}>{p.pickup_address}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: '999px', background: p.current_status === 'completed' ? '#d1fae5' : p.current_status === 'cancelled' ? '#fee2e2' : '#e0e7ff', color: p.current_status === 'completed' ? '#065f46' : p.current_status === 'cancelled' ? '#b91c1c' : '#3730a3', fontSize: '0.8rem', fontWeight: 600 }}>{p.current_status}</span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', background: p.payment_status === 'paid' ? '#d1fae5' : p.payment_status === 'refunded' ? '#dbeafe' : '#fef3c7', color: p.payment_status === 'paid' ? '#065f46' : p.payment_status === 'refunded' ? '#1e40af' : '#92400e', fontSize: '0.8rem', fontWeight: 600 }}>{p.payment_status}</span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <button type="button" onClick={() => setPage('pickups', p.pickup_id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', boxShadow: '0 1px 3px rgba(99, 102, 241, 0.3)' }}>
                                <Eye size={16} strokeWidth={2} />
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {activePage === 'settings' && (
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)', border: '1px solid #e2e8f0', overflow: 'hidden', maxWidth: '480px' }}>
              <div style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', padding: '1.5rem 2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={22} strokeWidth={2} style={{ opacity: 0.95 }} />
                  Settings
                </h2>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>Platform configuration</p>
              </div>
              <div style={{ padding: '1.5rem 2rem' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                    <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Deposit amount (paise)</label>
                    <input type="number" min={0} value={depositInput} onChange={(e) => setDepositInput(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '0.75rem', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <IndianRupee size={14} strokeWidth={2} />
                      Current: {config?.deposit_amount_paise ?? 0} paise (₹{(config?.deposit_amount_paise ?? 0) / 100})
                    </p>
                    <button type="button" onClick={handleSaveConfig} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
                      <CheckCircle size={18} strokeWidth={2} />
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function AdminStatCard({
  title,
  value,
  color,
  icon: Icon,
}: {
  title: string
  value: string
  color: string
  icon?: LucideIcon
}) {
  return (
    <div
      style={{
        background: 'white',
        padding: '1.25rem',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
        border: '1px solid #e2e8f0',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{title}</span>
        {Icon && <Icon size={18} strokeWidth={2} color={color} />}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{value}</div>
    </div>
  )
}
