import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData } from '@/api/auth'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* SIDEBAR */}
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
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#4CAF50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            OH
          </div>
          <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600, color: '#4CAF50' }}>OpenHands</h4>
        </div>

        <nav style={{ padding: '20px 0' }}>
          {[
            { label: 'Dashboard', icon: 'bi-speedometer2' },
            { label: 'Users', icon: 'bi-people' },
            { label: 'NGOs', icon: 'bi-building' },
            { label: 'Donations', icon: 'bi-box-seam' },
            { label: 'Payments', icon: 'bi-credit-card' },
            { label: 'Pickups', icon: 'bi-truck' },
            { label: 'Volunteers', icon: 'bi-person-badge' },
            { label: 'Reports', icon: 'bi-graph-up' },
            { label: 'Settings', icon: 'bi-gear' },
          ].map((item, idx) => (
            <a
              key={idx}
              onClick={idx === 0 ? undefined : handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                color: idx === 0 ? 'white' : '#cbd5e1',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem',
                background: idx === 0 ? '#334155' : 'transparent',
                borderLeft: idx === 0 ? '4px solid #4CAF50' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', width: '24px' }}></i>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? '260px' : '0', transition: 'margin-left 0.3s ease' }}>
        {/* TOPBAR */}
        <div
          style={{
            background: 'white',
            padding: '16px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#1e293b',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background 0.3s ease',
            }}
          >
            <i className="bi bi-list"></i>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#1e293b', fontWeight: 500 }}>Admin User</span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #4CAF50',
                background: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              A
            </div>
          </div>
        </div>

        {/* PAGE HEADER */}
        <div style={{ padding: '32px 32px 20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Admin Dashboard</h1>
          <nav style={{ background: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
            <ol style={{ display: 'flex', gap: '0.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
              <li>
                <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  Home
                </a>
              </li>
              <li>/</li>
              <li style={{ color: '#64748b' }}>Dashboard</li>
            </ol>
          </nav>
        </div>

        {/* STATS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            padding: '0 32px 32px',
          }}
        >
          <AdminStatCard title="Total Donations" value="₹ 23,40,000" icon="bi-currency-rupee" color="#10b981" trend="+12.5%" />
          <AdminStatCard title="Verified NGOs" value="152" icon="bi-building-check" color="#3b82f6" trend="+8 new" />
          <AdminStatCard title="Pending Requests" value="24" icon="bi-clock-history" color="#f59e0b" trend="Awaiting approval" />
          <AdminStatCard title="Active Volunteers" value="1,260" icon="bi-people-fill" color="#ef4444" trend="+45" />
        </div>

        {/* CONTENT SECTIONS */}
        <div style={{ padding: '0 32px 32px' }}>
          <div style={{ marginBottom: '24px' }}>
            {/* Recent Donation Requests */}
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>Recent Donation Requests</h2>
                <button
                  style={{
                    background: 'transparent',
                    border: '1px solid #3b82f6',
                    color: '#3b82f6',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  View All
                </button>
              </div>

              <div style={{ padding: '24px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Donor</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>NGO</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Items</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Pickup Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px' }}>Jason Fernandes</td>
                      <td style={{ padding: '16px' }}>Seva Foundation</td>
                      <td style={{ padding: '16px' }}>Books, Clothes</td>
                      <td style={{ padding: '16px' }}>Feb 18, 2026</td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            color: '#f59e0b',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          Pending
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button style={actionButtonStyle}>
                          <i className="bi bi-eye"></i>
                        </button>
                        <button style={actionButtonStyle}>
                          <i className="bi bi-check"></i>
                        </button>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px' }}>Pratham Naik</td>
                      <td style={{ padding: '16px' }}>Hope Trust</td>
                      <td style={{ padding: '16px' }}>Food Items</td>
                      <td style={{ padding: '16px' }}>Feb 17, 2026</td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          Verified
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button style={actionButtonStyle}>
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* NGO Verification Queue */}
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
            >
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>NGO Verification Queue</h2>
                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  6 Pending
                </span>
              </div>

              <div style={{ padding: '24px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>NGO Name</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Location</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Registration No.</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Submitted</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px' }}>
                        <strong>Green Earth Foundation</strong>
                      </td>
                      <td style={{ padding: '16px' }}>Panjim, Goa</td>
                      <td style={{ padding: '16px' }}>REG/2026/001234</td>
                      <td style={{ padding: '16px' }}>Feb 15, 2026</td>
                      <td style={{ padding: '16px' }}>
                        <button style={{ ...actionButtonStyle, marginRight: '8px' }}>Review</button>
                        <button style={{ ...approveButtonStyle, marginRight: '8px' }}>Approve</button>
                        <button style={rejectButtonStyle}>Reject</button>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px' }}>
                        <strong>Community Care Initiative</strong>
                      </td>
                      <td style={{ padding: '16px' }}>Mumbai, Maharashtra</td>
                      <td style={{ padding: '16px' }}>REG/2026/001235</td>
                      <td style={{ padding: '16px' }}>Feb 14, 2026</td>
                      <td style={{ padding: '16px' }}>
                        <button style={{ ...actionButtonStyle, marginRight: '8px' }}>Review</button>
                        <button style={{ ...approveButtonStyle, marginRight: '8px' }}>Approve</button>
                        <button style={rejectButtonStyle}>Reject</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function AdminStatCard({ title, value, icon, color, trend }: any) {
  return (
    <div
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        transition: 'all 0.3s ease',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            background: `rgba(${color === '#10b981' ? '16, 185, 129' : color === '#3b82f6' ? '59, 130, 246' : color === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.1)`,
            color: color,
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', color }}>
        {trend.includes('+') ? <i className="bi bi-arrow-up"></i> : null}
        <span>{trend}</span>
      </div>
    </div>
  )
}

const actionButtonStyle = {
  background: 'rgba(59, 130, 246, 0.1)',
  color: '#3b82f6',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.3s ease',
  marginRight: '8px',
}

const approveButtonStyle = {
  background: 'rgba(16, 185, 129, 0.1)',
  color: '#10b981',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.3s ease',
}

const rejectButtonStyle = {
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#ef4444',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.3s ease',
}
