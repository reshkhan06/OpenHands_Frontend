import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData } from '@/api/auth'
import {
  getAdminDashboard,
  getAdminUsers,
  updateAdminUser,
  getAdminNGOs,
  updateAdminNGO,
  deleteAdminNGO,
  getAdminPickups,
  getAdminConfig,
  updateAdminConfig,
  type AdminUserRow,
  type AdminNGORow,
  type AdminPickupRow,
  type AdminDashboardStats,
} from '@/api/admin'

type AdminPage = 'dashboard' | 'users' | 'ngos' | 'pickups' | 'settings'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState<AdminPage>('dashboard')
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [ngos, setNgos] = useState<AdminNGORow[]>([])
  const [pickups, setPickups] = useState<AdminPickupRow[]>([])
  const [config, setConfig] = useState<{ deposit_amount_paise: number } | null>(null)
  const [depositInput, setDepositInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

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
      getAdminUsers()
        .then(setUsers)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [activePage])

  useEffect(() => {
    if (activePage === 'ngos') {
      setLoading(true)
      setError(null)
      getAdminNGOs()
        .then(setNgos)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [activePage])

  useEffect(() => {
    if (activePage === 'pickups') {
      setLoading(true)
      setError(null)
      getAdminPickups()
        .then(setPickups)
        .catch((e) => setError(e.message))
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
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [activePage])

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

  const navItems: { id: AdminPage; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'users', label: 'Users', icon: 'bi-people' },
    { id: 'ngos', label: 'NGOs', icon: 'bi-building' },
    { id: 'pickups', label: 'Pickups', icon: 'bi-truck' },
    { id: 'settings', label: 'Settings', icon: 'bi-gear' },
  ]

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <aside
        style={{
          width: '260px',
          background: '#1e293b',
          color: 'white',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-260px)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>OH</div>
          <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600, color: '#4CAF50' }}>OpenHands</h4>
        </div>
        <nav style={{ padding: '20px 0' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                width: '100%',
                border: 'none',
                color: activePage === item.id ? 'white' : '#cbd5e1',
                fontSize: '0.95rem',
                background: activePage === item.id ? '#334155' : 'transparent',
                borderLeft: activePage === item.id ? '4px solid #4CAF50' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', width: '24px' }}></i>
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              width: '100%',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.95rem',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <i className="bi bi-box-arrow-right" style={{ fontSize: '1.2rem', width: '24px' }}></i>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, marginLeft: sidebarOpen ? '260px' : '0', transition: 'margin-left 0.3s ease' }}>
        <div style={{ background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', position: 'sticky', top: 0, zIndex: 100 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1e293b', padding: '8px 12px', borderRadius: '8px' }}>
            <i className="bi bi-list"></i>
          </button>
          <span style={{ color: '#1e293b', fontWeight: 500 }}>Admin</span>
        </div>

        <div style={{ padding: '32px' }}>
          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px' }}>{error}</div>
          )}
          {activePage === 'dashboard' && (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Dashboard</h1>
              {loading ? <p>Loading...</p> : stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  <AdminStatCard title="Total Users" value={String(stats.users_total)} color="#3b82f6" />
                  <AdminStatCard title="Total NGOs" value={String(stats.ngos_total)} color="#10b981" />
                  <AdminStatCard title="NGOs Pending" value={String(stats.ngos_pending)} color="#f59e0b" />
                  <AdminStatCard title="Total Pickups" value={String(stats.pickups_total)} color="#8b5cf6" />
                  <AdminStatCard title="Pickups Requested" value={String(stats.pickups_requested)} color="#ec4899" />
                  <AdminStatCard title="Active Deposits" value={String(stats.deposits_active)} color="#14b8a6" />
                </div>
              )}
            </>
          )}
          {activePage === 'users' && (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Users</h1>
              {loading ? <p>Loading...</p> : (
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Email</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Role</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.user_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px' }}>{u.fname} {u.lname}</td>
                          <td style={{ padding: '16px' }}>{u.email}</td>
                          <td style={{ padding: '16px' }}>{u.role}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', background: u.is_active ? '#dcfce7' : '#fee2e2', color: u.is_active ? '#166534' : '#b91c1c' }}>{u.is_active ? 'Active' : 'Blocked'}</span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <button onClick={() => handleUpdateUser(u.user_id, { is_active: !u.is_active })} style={{ marginRight: '8px', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', background: u.is_active ? '#fee2e2' : '#dcfce7', color: u.is_active ? '#b91c1c' : '#166534' }}>{u.is_active ? 'Block' : 'Unblock'}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {activePage === 'ngos' && (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>NGOs</h1>
              {loading ? <p>Loading...</p> : (
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>NGO Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Location</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Verified</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ngos.map((n) => (
                        <tr key={n.ngo_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px' }}><strong>{n.ngo_name}</strong></td>
                          <td style={{ padding: '16px' }}>{n.city}, {n.state}</td>
                          <td style={{ padding: '16px' }}>{n.is_verified ? 'Yes' : 'No'}</td>
                          <td style={{ padding: '16px' }}>
                            <button onClick={() => handleUpdateNGO(n.ngo_id, true)} style={{ marginRight: '8px', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', background: '#dcfce7', color: '#166534' }}>Approve</button>
                            <button onClick={() => handleUpdateNGO(n.ngo_id, false)} style={{ marginRight: '8px', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', background: '#fee2e2', color: '#b91c1c' }}>Reject</button>
                            <button onClick={() => handleDeleteNGO(n.ngo_id, n.ngo_name)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.85rem', background: '#fef2f2', color: '#991b1b' }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {activePage === 'pickups' && (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Pickups</h1>
              {loading ? <p>Loading...</p> : (
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Donor</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>NGO</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Address</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem' }}>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickups.map((p) => (
                        <tr key={p.pickup_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px' }}>{p.pickup_id}</td>
                          <td style={{ padding: '16px' }}>{p.donor_id}</td>
                          <td style={{ padding: '16px' }}>{p.ngo_id}</td>
                          <td style={{ padding: '16px' }}>{p.pickup_address}</td>
                          <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', background: '#e0e7ff', color: '#3730a3' }}>{p.current_status}</span></td>
                          <td style={{ padding: '16px' }}>{p.payment_status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          {activePage === 'settings' && (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Settings</h1>
              {loading ? <p>Loading...</p> : (
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', padding: '24px', maxWidth: '400px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Deposit amount (paise)</label>
                  <input type="number" min={0} value={depositInput} onChange={(e) => setDepositInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }} />
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>Current: {config?.deposit_amount_paise ?? 0} paise (₹{(config?.deposit_amount_paise ?? 0) / 100})</p>
                  <button onClick={handleSaveConfig} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#4CAF50', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function AdminStatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', borderLeft: `4px solid ${color}` }}>
      <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{title}</span>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{value}</div>
    </div>
  )
}
