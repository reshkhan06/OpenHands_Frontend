import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, UserCircle, Settings, LogOut } from 'lucide-react'
import { clearAuthData, getCurrentUser, getUserRole } from '@/api/auth'
import { getNGOProfile } from '@/api/ngos'

interface UserProfileDropdownProps {
  onProfileClick?: (page: string) => void
}

export default function UserProfileDropdown({ onProfileClick }: UserProfileDropdownProps) {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [user, setUser] = React.useState<any>(() => getCurrentUser())
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  const handleProfileClick = (page: string) => {
    setShowDropdown(false)
    if (onProfileClick) {
      onProfileClick(page)
      return
    }
    // Fallback navigation when used outside dashboards (e.g. in main navbar)
    const role = getUserRole()
    if (role === 'admin') {
      navigate('/admin')
    } else if (role === 'ngo') {
      navigate('/dashboard/ngo')
    } else {
      navigate('/dashboard/donor')
    }
  }

  // For NGO users, prefer ngo_name; fetch it once if missing
  React.useEffect(() => {
    const role = getUserRole()
    if (role !== 'ngo') return
    if (user && user.ngo_name) return

    let cancelled = false
    ;(async () => {
      try {
        const profile = await getNGOProfile()
        if (cancelled) return
        const updated = { ...(user || {}), role: 'ngo', ngo_name: profile.ngo_name, email: profile.email }
        setUser(updated)
        // Persist for future reads
        localStorage.setItem('user', JSON.stringify(updated))
      } catch {
        // Ignore NGO profile load errors in dropdown
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user])

  const fullName =
    user && (user.fname || user.lname)
      ? `${user.fname ?? ''} ${user.lname ?? ''}`.trim()
      : undefined
  const displayName =
    user?.ngo_name ||
    fullName ||
    user?.name ||
    user?.email ||
    'User'
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 10px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '999px',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.9rem',
          }}
        >
          {userInitial}
        </div>
        <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#1e293b', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName}
        </span>
        <ChevronDown
          size={18}
          style={{
            transition: 'transform 0.2s ease',
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            minWidth: '240px',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* User Info Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                }}
              >
                {userInitial}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{displayName}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{user?.email || ''}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: '8px 0' }}>
            <button
              onClick={() => handleProfileClick('profile')}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                color: '#1e293b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.95rem',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(37, 99, 235, 0.05)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'none'
              }}
            >
              <UserCircle size={20} style={{ color: '#2563eb' }} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => handleProfileClick('settings')}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                color: '#1e293b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.95rem',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(37, 99, 235, 0.05)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'none'
              }}
            >
              <Settings size={20} style={{ color: '#7c3aed' }} />
              <span>Settings</span>
            </button>

            <div style={{ margin: '8px 0', height: '1px', background: '#e2e8f0' }}></div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.95rem',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.05)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'none'
              }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
