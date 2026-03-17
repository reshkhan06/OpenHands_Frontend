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
  MapPin,
  Package,
  Clock,
  CreditCard,
  RotateCcw,
  Mail,
  MessageSquare,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { clearAuthData } from '@/api/auth'
import {
  getAdminDashboard,
  getAdminUsers,
  updateAdminUser,
  getAdminNGOs,
  getAdminNGODetail,
  updateAdminNGO,
  deleteAdminNGO,
  getAdminPickups,
  getAdminPickup,
  getAdminConfig,
  updateAdminConfig,
  getAdminFeedbacks,
  getAdminUserDetail,
  type AdminUserRow,
  type AdminUserDetail,
  type AdminNGORow,
  type AdminNGODetail,
  type AdminPickupRow,
  type AdminFeedbackRow,
  type AdminDashboardStats,
} from '@/api/admin'

const ICON_SIZE_SM = 18

const PICKUP_STATUS_CONFIG: Record<string, { label: string; icon: LucideIcon; bg: string; text: string }> = {
  requested: { label: 'Requested', icon: Clock, bg: '#fef3c7', text: '#b45309' },
  accepted: { label: 'Accepted', icon: CheckCircle, bg: '#dbeafe', text: '#1e40af' },
  on_the_way: { label: 'On the way', icon: Truck, bg: '#ede9fe', text: '#6d28d9' },
  picked_up: { label: 'Picked up', icon: Package, bg: '#fce7f3', text: '#be185d' },
  completed: { label: 'Completed', icon: CheckCircle, bg: '#d1fae5', text: '#166534' },
  cancelled: { label: 'Cancelled', icon: XCircle, bg: '#f1f5f9', text: '#64748b' },
}

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; icon: LucideIcon; bg: string; text: string }> = {
  paid: { label: 'Paid', icon: CheckCircle, bg: '#d1fae5', text: '#065f46' },
  pending: { label: 'Pending', icon: Clock, bg: '#fef3c7', text: '#92400e' },
  refunded: { label: 'Refunded', icon: RotateCcw, bg: '#dbeafe', text: '#1e40af' },
}

type AdminPage = 'dashboard' | 'users' | 'ngos' | 'pickups' | 'feedbacks' | 'settings'

const ADMIN_BASE = '/admin'

function pathToPage(pathname: string): { page: AdminPage; pickupId: number | null } {
  if (pathname === ADMIN_BASE || pathname === `${ADMIN_BASE}/` || pathname === `${ADMIN_BASE}/dashboard`) return { page: 'dashboard', pickupId: null }
  if (pathname.startsWith(`${ADMIN_BASE}/users`)) return { page: 'users', pickupId: null }
  if (pathname.startsWith(`${ADMIN_BASE}/ngos`)) return { page: 'ngos', pickupId: null }
  const pickupsMatch = pathname.match(new RegExp(`^${ADMIN_BASE.replace(/\/$/, '')}/pickups/(\\d+)$`))
  if (pickupsMatch) return { page: 'pickups', pickupId: parseInt(pickupsMatch[1], 10) }
  if (pathname.startsWith(`${ADMIN_BASE}/pickups`)) return { page: 'pickups', pickupId: null }
  if (pathname.startsWith(`${ADMIN_BASE}/feedbacks`)) return { page: 'feedbacks', pickupId: null }
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
  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(null)
  const [selectedUserLoading, setSelectedUserLoading] = useState(false)
  const [ngos, setNgos] = useState<AdminNGORow[]>([])
  const [selectedNGO, setSelectedNGO] = useState<AdminNGODetail | null>(null)
  const [selectedNGOLoading, setSelectedNGOLoading] = useState(false)
  const [pickups, setPickups] = useState<AdminPickupRow[]>([])
  const [feedbacks, setFeedbacks] = useState<AdminFeedbackRow[]>([])
  const [pickupDetail, setPickupDetail] = useState<Record<string, unknown> | null>(null)
  const [config, setConfig] = useState<{ deposit_amount_paise: number } | null>(null)
  const [depositInput, setDepositInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pickupDetailLoading, setPickupDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [userSearch, setUserSearch] = useState('')
  const [userIsActive, setUserIsActive] = useState<boolean | ''>('')
  const [ngoVerified, setNgoVerified] = useState<boolean | ''>('')
  const [pickupStatus, setPickupStatus] = useState<string>('')
  const [feedbackCategory, setFeedbackCategory] = useState<string>('')
  const [feedbackRating, setFeedbackRating] = useState<string>('')
  const [feedbackFollowUp, setFeedbackFollowUp] = useState<string>('')

  // Sync from URL
  useEffect(() => {
    setActivePage(urlPage)
  }, [urlPage])

  const setPage = (page: AdminPage, id?: number) => {
    if (page === 'dashboard') navigate(`${ADMIN_BASE}/dashboard`)
    else if (page === 'users') navigate(`${ADMIN_BASE}/users`)
    else if (page === 'ngos') navigate(id ? `${ADMIN_BASE}/ngos/${id}` : `${ADMIN_BASE}/ngos`)
    else if (page === 'pickups') navigate(id ? `${ADMIN_BASE}/pickups/${id}` : `${ADMIN_BASE}/pickups`)
    else if (page === 'feedbacks') navigate(`${ADMIN_BASE}/feedbacks`)
    else if (page === 'settings') navigate(`${ADMIN_BASE}/settings`)
  }

  useEffect(() => {
    if (activePage === 'dashboard') {
      setLoading(true)
      setError(null)
      getAdminDashboard()
        .then(setStats)
        .catch((e) => { const m = e instanceof Error ? e.message : String(e); setError(m); toast.error(m); })
        .finally(() => setLoading(false))
    }
  }, [activePage])

  useEffect(() => {
    if (activePage === 'users') {
      setLoading(true)
      setError(null)
      const params: { role?: string; search?: string; is_active?: boolean } = {}
      if (userSearch.trim()) params.search = userSearch.trim()
      if (userIsActive !== '') params.is_active = userIsActive as boolean
      getAdminUsers(params)
        .then(setUsers)
        .catch((e) => { const m = e instanceof Error ? e.message : String(e); setError(m); toast.error(m); })
        .finally(() => setLoading(false))
    }
  }, [activePage, userSearch, userIsActive])

  useEffect(() => {
    if (activePage === 'ngos') {
      setLoading(true)
      setError(null)
      getAdminNGOs(ngoVerified === '' ? undefined : (ngoVerified as boolean))
        .then(setNgos)
        .catch((e) => { const m = e instanceof Error ? e.message : String(e); setError(m); toast.error(m); })
        .finally(() => setLoading(false))
    }
  }, [activePage, ngoVerified])

  useEffect(() => {
    if (activePage === 'pickups') {
      setLoading(true)
      setError(null)
      getAdminPickups(pickupStatus || undefined)
        .then(setPickups)
        .catch((e) => { const m = e instanceof Error ? e.message : String(e); setError(m); toast.error(m); })
        .finally(() => setLoading(false))
    }
  }, [activePage, pickupStatus])

  useEffect(() => {
    if (activePage === 'feedbacks') {
      setLoading(true)
      setError(null)
      getAdminFeedbacks(200)
        .then(setFeedbacks)
        .catch((e) => { const m = e instanceof Error ? e.message : String(e); setError(m); toast.error(m); })
        .finally(() => setLoading(false))
    }
  }, [activePage])

  useEffect(() => {
    if (activePage === 'settings') {
      setLoading(true)
      setError(null)
      getAdminConfig()
        .then((c) => {
          setConfig(c)
          setDepositInput(String(c.deposit_amount_paise))
        })
        .catch((e) => { const m = e instanceof Error ? e.message : String(e); setError(m); toast.error(m); })
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
        .catch((e) => { const m = e instanceof Error ? e.message : String(e); setError(m); toast.error(m); })
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
      const msg = e instanceof Error ? e.message : 'Update failed'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleViewUser = async (userId: number) => {
    setSelectedUser(null)
    setSelectedUserLoading(true)
    try {
      const detail = await getAdminUserDetail(userId)
      setSelectedUser(detail)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load donor details'
      setError(msg)
      toast.error(msg)
    } finally {
      setSelectedUserLoading(false)
    }
  }

  const handleUpdateNGO = async (ngoId: number, is_verified: boolean) => {
    try {
      await updateAdminNGO(ngoId, { is_verified })
      setNgos((prev) =>
        prev.map((n) => (n.ngo_id === ngoId ? { ...n, is_verified } : n))
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleViewNGO = async (ngoId: number) => {
    setPage('ngos', ngoId)
    setSelectedNGO(null)
    setSelectedNGOLoading(true)
    try {
      const detail = await getAdminNGODetail(ngoId)
      setSelectedNGO(detail)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load NGO details'
      setError(msg)
      toast.error(msg)
    } finally {
      setSelectedNGOLoading(false)
    }
  }

  const handleDeleteNGO = async (ngoId: number, ngoName: string) => {
    if (!window.confirm(`Delete NGO "${ngoName}"? This will also remove all related pickups and payments.`)) return
    try {
      await deleteAdminNGO(ngoId)
      setNgos((prev) => prev.filter((n) => n.ngo_id !== ngoId))
      setError(null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Delete failed'
      setError(msg)
      toast.error(msg)
    }
  }

  const handleSaveConfig = async () => {
    const val = parseInt(depositInput, 10)
    if (isNaN(val) || val < 0) {
      const msg = 'Deposit amount must be a non-negative number (paise)'
      setError(msg)
      toast.error(msg)
      return
    }
    try {
      const c = await updateAdminConfig({ deposit_amount_paise: val })
      setConfig(c)
      setError(null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed'
      setError(msg)
      toast.error(msg)
    }
  }

  const navItems: { id: AdminPage; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Donors', icon: Users },
    { id: 'ngos', label: 'NGOs', icon: Building2 },
    { id: 'pickups', label: 'Pickups', icon: Truck },
    { id: 'feedbacks', label: 'Feedback', icon: MessageSquare },
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
                <select value={String(userIsActive)} onChange={(e) => setUserIsActive(e.target.value === '' ? '' : e.target.value === 'true')} style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                  <option value="">All status</option>
                  <option value="true">Active</option>
                  <option value="false">Blocked</option>
                </select>
              </div>
              <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
                {selectedUser ? (
                  <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        Donor details — {selectedUser.fname} {selectedUser.lname}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#64748b',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        Back to list
                      </button>
                    </div>
                    {selectedUserLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                        <Loader2 size={18} strokeWidth={2} className="animate-spin" />
                        <span>Loading donor details...</span>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.9rem', color: '#0f172a' }}>
                        <DetailRow label="Email" value={selectedUser.email} />
                        <DetailRow label="Contact number" value={String(selectedUser.contact_number)} />
                        <DetailRow label="Location" value={selectedUser.location} wide />
                        <DetailRow label="Role" value={selectedUser.role === 'admin' ? 'Admin' : 'Donor'} />
                        <DetailRow label="Status" value={selectedUser.is_active ? 'Active' : 'Blocked'} />
                        <DetailRow label="Verified" value={selectedUser.is_verified ? 'Yes' : 'No'} />
                        <DetailRow label="Joined at" value={selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : '—'} wide />
                      </div>
                    )}
                  </div>
                ) : loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', padding: '2rem' }}>
                    <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                    <span>Loading donors...</span>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Users size={14} strokeWidth={2} /> Name</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Mail size={14} strokeWidth={2} /> Email</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} strokeWidth={2} /> Status</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Settings size={14} strokeWidth={2} /> Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: '3rem 16px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Users size={20} strokeWidth={1.5} style={{ opacity: 0.5 }} /> No users match the filters.</span>
                          </td>
                        </tr>
                      ) : (
                        users.map((u, idx) => (
                          <tr key={u.user_id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbfc', transition: 'background 0.15s ease' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{u.fname} {u.lname}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Mail size={14} style={{ flexShrink: 0, opacity: 0.7 }} />
                              {u.email}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', background: u.is_active ? '#d1fae5' : '#fee2e2', color: u.is_active ? '#065f46' : '#b91c1c', fontSize: '0.8rem', fontWeight: 600 }}>
                                {u.is_active ? <CheckCircle size={14} strokeWidth={2} style={{ flexShrink: 0 }} /> : <XCircle size={14} strokeWidth={2} style={{ flexShrink: 0 }} />}
                                {u.is_active ? 'Active' : 'Blocked'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleViewUser(u.user_id)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: '#e0f2fe', color: '#0369a1' }}
                              >
                                <Eye size={14} />
                                View
                              </button>
                              <button type="button" onClick={() => handleUpdateUser(u.user_id, { is_active: !u.is_active })} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: u.is_active ? '#fef2f2' : '#dcfce7', color: u.is_active ? '#b91c1c' : '#166534', transition: 'transform 0.1s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}>
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
                {selectedNGO ? (
                  <div style={{ maxWidth: 900, margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      NGO details — {selectedNGO.ngo_name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedNGO(null)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      Close
                    </button>
                  </div>
                  {selectedNGOLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                      <Loader2 size={18} strokeWidth={2} className="animate-spin" />
                      <span>Loading NGO details...</span>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.9rem', color: '#0f172a' }}>
                      <DetailRow label="Email" value={selectedNGO.email} />
                      <DetailRow label="Registration number" value={selectedNGO.registration_number} />
                      <DetailRow label="Type" value={selectedNGO.ngo_type} />
                      <DetailRow label="Address" value={`${selectedNGO.address}, ${selectedNGO.city}, ${selectedNGO.state} - ${selectedNGO.pincode}`} wide />
                      <DetailRow label="Mission" value={selectedNGO.mission_statement} wide />
                      <DetailRow label="Bank" value={selectedNGO.bank_name} />
                      <DetailRow label="Account number" value={selectedNGO.account_number} />
                      <DetailRow label="IFSC" value={selectedNGO.ifsc_code} />
                      {selectedNGO.website_url && <DetailRow label="Website" value={selectedNGO.website_url} />}
                      {selectedNGO.certificate_path && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Certificate
                          </span>
                          <a
                            href={selectedNGO.certificate_path}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0f766e', fontWeight: 600, fontSize: '0.9rem' }}
                          >
                            View certificate
                            <ExternalLink size={14} strokeWidth={2} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                ) : loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', padding: '2rem' }}>
                    <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                    <span>Loading NGOs...</span>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Building2 size={14} strokeWidth={2} /> NGO Name</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} strokeWidth={2} /> Location</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} strokeWidth={2} /> Verified</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Settings size={14} strokeWidth={2} /> Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ngos.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: '3rem 16px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Building2 size={20} strokeWidth={1.5} style={{ opacity: 0.5 }} /> No NGOs match the filters.</span>
                          </td>
                        </tr>
                      ) : (
                        ngos.map((n, idx) => (
                          <tr key={n.ngo_id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbfc', transition: 'background 0.15s ease' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', verticalAlign: 'middle', minWidth: '180px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <Building2 size={16} style={{ flexShrink: 0, color: '#0d9488', opacity: 0.9 }} />
                                {n.ngo_name}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.9rem', verticalAlign: 'middle', minWidth: '140px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin size={14} style={{ flexShrink: 0, opacity: 0.7 }} />
                                {(n.city || n.state) ? `${n.city || ''}${n.city && n.state ? ', ' : ''}${n.state || ''}` : '—'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', background: n.is_verified ? '#d1fae5' : '#fef3c7', color: n.is_verified ? '#065f46' : '#92400e', fontSize: '0.8rem', fontWeight: 600 }}>
                                {n.is_verified ? <CheckCircle size={14} strokeWidth={2} style={{ flexShrink: 0 }} /> : <Clock size={14} strokeWidth={2} style={{ flexShrink: 0 }} />}
                                {n.is_verified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleViewNGO(n.ngo_id)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    background: '#e0f2fe',
                                    color: '#0369a1',
                                  }}
                                >
                                  <Eye size={14} strokeWidth={2} />
                                  View
                                </button>
                                <button type="button" onClick={() => handleUpdateNGO(n.ngo_id, true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)', transition: 'transform 0.1s ease, box-shadow 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(16, 185, 129, 0.35)' }}>
                                  <CheckCircle size={14} strokeWidth={2} />
                                  Approve
                                </button>
                                <button type="button" onClick={() => handleUpdateNGO(n.ngo_id, false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: '#fef2f2', color: '#b91c1c', transition: 'transform 0.1s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}>
                                  <XCircle size={14} strokeWidth={2} />
                                  Reject
                                </button>
                                <button type="button" onClick={() => handleDeleteNGO(n.ngo_id, n.ngo_name)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '10px', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: '#fef2f2', color: '#991b1b', transition: 'transform 0.1s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}>
                                  <Trash2 size={14} strokeWidth={2} />
                                  Delete
                                </button>
                              </span>
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
                <select value={pickupStatus} onChange={(e) => setPickupStatus(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer', minWidth: '160px' }}>
                  <option value="">All statuses</option>
                  <option value="requested">Requested</option>
                  <option value="accepted">Accepted</option>
                  <option value="on_the_way">On the way</option>
                  <option value="picked_up">Picked up</option>
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
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Package size={14} strokeWidth={2} /> ID</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Users size={14} strokeWidth={2} /> Donor</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Building2 size={14} strokeWidth={2} /> NGO</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} strokeWidth={2} /> Address</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Clock size={14} strokeWidth={2} /> Status</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CreditCard size={14} strokeWidth={2} /> Payment</span>
                        </th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', width: '120px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Eye size={14} strokeWidth={2} /> Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickups.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '3rem 16px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Truck size={20} strokeWidth={1.5} style={{ opacity: 0.5 }} /> No pickups match the filters.</span>
                          </td>
                        </tr>
                      ) : (
                        pickups.map((p, idx) => {
                          const statusCfg = PICKUP_STATUS_CONFIG[p.current_status] ?? { label: p.current_status.replace(/_/g, ' '), icon: Clock, bg: '#f1f5f9', text: '#64748b' }
                          const payCfg = PAYMENT_STATUS_CONFIG[p.payment_status] ?? { label: p.payment_status, icon: CreditCard, bg: '#f1f5f9', text: '#64748b' }
                          const StatusIcon = statusCfg.icon
                          const PayIcon = payCfg.icon
                          return (
                            <tr key={p.pickup_id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbfc', transition: 'background 0.15s ease' }}>
                              <td style={{ padding: '14px 16px', fontWeight: 700, color: '#6366f1', fontSize: '0.95rem' }}>#{p.pickup_id}</td>
                              <td style={{ padding: '14px 16px', color: '#334155', fontSize: '0.9rem', fontWeight: 500 }}>{p.donor_id}</td>
                              <td style={{ padding: '14px 16px', color: '#334155', fontSize: '0.9rem', fontWeight: 500 }}>{p.ngo_id}</td>
                              <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.85rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.pickup_address}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} style={{ flexShrink: 0, opacity: 0.7 }} /> {p.pickup_address || '—'}</span>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', background: statusCfg.bg, color: statusCfg.text, fontSize: '0.8rem', fontWeight: 600 }}>
                                  <StatusIcon size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
                                  {statusCfg.label}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', background: payCfg.bg, color: payCfg.text, fontSize: '0.8rem', fontWeight: 600 }}>
                                  <PayIcon size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
                                  {payCfg.label}
                                </span>
                              </td>
                              <td style={{ padding: '14px 16px' }}>
                                <button type="button" onClick={() => setPage('pickups', p.pickup_id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', boxShadow: '0 2px 6px rgba(99, 102, 241, 0.35)', transition: 'transform 0.1s ease, box-shadow 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(99, 102, 241, 0.35)' }}>
                                  <Eye size={16} strokeWidth={2} />
                                  View
                                </button>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {activePage === 'feedbacks' && (
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', padding: '1.5rem 2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={22} strokeWidth={2} style={{ opacity: 0.95 }} />
                  Feedback
                </h2>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>Latest feedback submissions</p>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', background: 'linear-gradient(180deg, #e0f2fe 0%, #fff 100%)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#0284c7', fontSize: '0.875rem' }}>
                  <Filter size={16} style={{ opacity: 0.9 }} />
                  Filter
                </span>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer' }}
                >
                  <option value="">All categories</option>
                  <option value="Bug report">Bug report</option>
                  <option value="Feature request">Feature request</option>
                  <option value="User experience">User experience</option>
                  <option value="Performance">Performance</option>
                  <option value="General feedback">General feedback</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer' }}
                >
                  <option value="">All ratings</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={String(r)}>
                      {r} stars
                    </option>
                  ))}
                </select>
                <select
                  value={feedbackFollowUp}
                  onChange={(e) => setFeedbackFollowUp(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', background: '#fff', color: '#475569', fontWeight: 500, cursor: 'pointer' }}
                >
                  <option value="">All follow-up</option>
                  <option value="true">Follow-up requested</option>
                  <option value="false">No follow-up</option>
                </select>
              </div>
              <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', padding: '2rem' }}>
                    <Loader2 size={20} strokeWidth={2} className="animate-spin" />
                    <span>Loading feedback...</span>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ID</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rating</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Follow up</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Submitted</th>
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks
                        .filter((f) => (feedbackCategory ? f.category === feedbackCategory : true))
                        .filter((f) =>
                          feedbackRating ? (typeof f.rating === 'number' ? f.rating === Number(feedbackRating) : Number(f.rating) === Number(feedbackRating)) : true
                        )
                        .filter((f) =>
                          feedbackFollowUp === ''
                            ? true
                            : f.follow_up === (feedbackFollowUp === 'true')
                        ).length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: '3rem 16px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
                            No feedback submissions yet.
                          </td>
                        </tr>
                      ) : (
                        feedbacks
                          .filter((f) => (feedbackCategory ? f.category === feedbackCategory : true))
                          .filter((f) =>
                            feedbackRating ? (typeof f.rating === 'number' ? f.rating === Number(feedbackRating) : Number(f.rating) === Number(feedbackRating)) : true
                          )
                          .filter((f) =>
                            feedbackFollowUp === ''
                              ? true
                              : f.follow_up === (feedbackFollowUp === 'true')
                          )
                          .map((f, idx) => (
                          <tr key={f.feedback_id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbfc' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0284c7' }}>#{f.feedback_id}</td>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>{f.name}</td>
                            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.9rem' }}>{f.email}</td>
                            <td style={{ padding: '14px 16px', color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>{f.category || '—'}</td>
                            <td style={{ padding: '14px 16px', color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>{typeof f.rating === 'number' ? f.rating : Number(f.rating) || 0}/5</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', background: f.follow_up ? '#dbeafe' : '#f1f5f9', color: f.follow_up ? '#1e40af' : '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
                                {f.follow_up ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                              {f.created_at ? new Date(f.created_at).toLocaleString() : '—'}
                            </td>
                            <td style={{ padding: '14px 16px', color: '#334155', fontSize: '0.85rem', maxWidth: '360px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={f.message}>
                              {f.message || '—'}
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

function DetailRow({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div style={{ gridColumn: wide ? '1 / -1' as any : undefined }}>
      <span
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      <div style={{ fontSize: '0.9rem', color: '#0f172a', marginTop: '0.1rem' }}>{value || '—'}</div>
    </div>
  )
}
