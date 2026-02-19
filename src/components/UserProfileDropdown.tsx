import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData, getCurrentUser } from '@/api/auth'

interface UserProfileDropdownProps {
  onProfileClick?: (page: string) => void
}

export default function UserProfileDropdown({ onProfileClick }: UserProfileDropdownProps) {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  const handleProfileClick = (page: string) => {
    setShowDropdown(false)
    if (onProfileClick) {
      onProfileClick(page)
    }
  }

  const userName = user?.name || user?.email || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
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
        <div style={{ display: 'block' }}>
          <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#1e293b', display: 'block' }}>{userName}</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>View profile</span>
        </div>
        <i
          className="bi bi-chevron-down"
          style={{
            fontSize: '0.8rem',
            transition: 'transform 0.2s ease',
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        ></i>
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
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{userName}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{user?.email || 'user@example.com'}</p>
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
              <i className="bi bi-person-circle" style={{ fontSize: '1.1rem', color: '#2563eb' }}></i>
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
              <i className="bi bi-gear" style={{ fontSize: '1.1rem', color: '#7c3aed' }}></i>
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
              <i className="bi bi-box-arrow-right" style={{ fontSize: '1.1rem' }}></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
