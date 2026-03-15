import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Truck, UserCircle, LogOut, Menu } from 'lucide-react'
import { clearAuthData } from '@/api/auth'
import { getNGOProfile, type NGOProfile } from '@/api/ngos'

interface NgoLayoutProps {
  title: string
  children: React.ReactNode
  /** When true, "Manage Pickups" nav item is highlighted (e.g. on pickups list or detail page) */
  activeManagePickups?: boolean
}

export default function NgoLayout({ title, children, activeManagePickups = false }: NgoLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profile, setProfile] = useState<NGOProfile | null>(null)
  const navigate = useNavigate()
  const ngoName = profile?.ngo_name ?? 'NGO'

  useEffect(() => {
    getNGOProfile().then(setProfile).catch(() => setProfile(null))
  }, [])

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  const navLinkStyle = (active: boolean) => ({
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
    background: active ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
    borderRadius: '10px',
    marginBottom: '0.25rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    textDecoration: 'none' as const,
  })

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
            <Link to="/dashboard/ngo" style={navLinkStyle(false)}>
              <LayoutDashboard size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span>Overview</span>
            </Link>
            <Link to="/dashboard/ngo" state={{ tab: 'pickups' }} style={navLinkStyle(false)}>
              <Truck size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span>Pickups</span>
            </Link>
            <Link to="/dashboard/ngo" state={{ tab: 'profile' }} style={navLinkStyle(false)}>
              <UserCircle size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span>Profile</span>
            </Link>
            <Link to="/dashboard/ngo/pickups" style={navLinkStyle(activeManagePickups)}>
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

      <main style={{ flex: 1, minHeight: 0, padding: '1.5rem 2rem', overflowY: 'auto' }}>
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
          <h4 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{title}</h4>
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
        {children}
      </main>
    </div>
  )
}
