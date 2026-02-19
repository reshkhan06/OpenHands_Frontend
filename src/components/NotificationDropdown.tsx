import { useState } from 'react'

interface Notification {
  id: number
  icon: string
  color: string
  title: string
  message: string
  time: string
  read: boolean
}

export default function NotificationDropdown() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      icon: 'bi-check-circle',
      color: '#10b981',
      title: 'Donation confirmed',
      message: 'Helping Hands NGO',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      icon: 'bi-heart',
      color: '#ef4444',
      title: 'Thank you message',
      message: 'from Education First',
      time: '4 hours ago',
      read: false,
    },
    {
      id: 3,
      icon: 'bi-star',
      color: '#f59e0b',
      title: 'New campaigns',
      message: 'available in your area',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      icon: 'bi-hand-thumbs-up',
      color: '#2563eb',
      title: 'Keep up the impact!',
      message: "You're amazing",
      time: '2 days ago',
      read: true,
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          border: 'none',
          background: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          fontSize: '1.1rem',
        }}
      >
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              border: '2px solid white',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'white',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            minWidth: '360px',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h6 style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>Notifications</h6>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#64748b',
                }}
              >
                <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px', opacity: 0.5 }}></i>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    background: !notification.read ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                    transition: 'background 0.2s ease',
                    display: 'flex',
                    gap: '12px',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(37, 99, 235, 0.1)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.background = !notification.read
                      ? 'rgba(37, 99, 235, 0.05)'
                      : 'transparent'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `rgba(${
                        notification.color === '#10b981'
                          ? '16, 185, 129'
                          : notification.color === '#ef4444'
                            ? '239, 68, 68'
                            : notification.color === '#f59e0b'
                              ? '245, 158, 11'
                              : '37, 99, 235'
                      }, 0.1)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: notification.color,
                      fontSize: '1.1rem',
                    }}
                  >
                    <i className={`bi ${notification.icon}`}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h6 style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                      {notification.title}
                    </h6>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>{notification.message}</p>
                    <small style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{notification.time}</small>
                  </div>
                  {!notification.read && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#2563eb',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    ></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <a
                href="#"
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'inline-block',
                }}
              >
                View All Notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
