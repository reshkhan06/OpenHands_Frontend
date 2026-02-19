import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData } from '@/api/auth'

export default function NGODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: '270px',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          padding: '1.5rem 1rem',
          flexShrink: 0,
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 100,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-270px)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            OH
          </div>
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            OpenHands
          </h4>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[
            { label: 'Dashboard', icon: 'bi-speedometer2' },
            { label: 'Campaigns', icon: 'bi-megaphone' },
            { label: 'Donations', icon: 'bi-gift' },
            { label: 'Volunteers', icon: 'bi-people' },
            { label: 'Analytics', icon: 'bi-bar-chart' },
            { label: 'Profile', icon: 'bi-person-circle' },
          ].map((item, idx) => (
            <a
              key={idx}
              style={{
                color: idx === 0 ? '#fff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                background: idx === 0 ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'transparent',
                boxShadow: idx === 0 ? '0 4px 15px rgba(37, 99, 235, 0.4)' : 'none',
              }}
              onClick={idx === 0 ? undefined : handleLogout}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.25rem', width: '24px', textAlign: 'center' }}></i>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '270px' : '0',
          padding: '1.5rem 2rem',
          minHeight: '100vh',
          overflowY: 'auto',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* TOPBAR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '1rem 1.5rem',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
              }}
            >
              <i className="bi bi-list"></i>
            </button>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>NGO Dashboard</h4>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Search..."
              style={{
                maxWidth: '400px',
                padding: '0.625rem 1rem 0.625rem 2.5rem',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                background: '#f8fafc',
                fontSize: '0.875rem',
              }}
            />
            <button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                background: '#f1f5f9',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <i className="bi bi-bell" style={{ fontSize: '1.1rem' }}></i>
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.375rem 0.75rem 0.375rem 0.375rem',
                background: '#f8fafc',
                borderRadius: '12px',
                cursor: 'pointer',
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
                  fontWeight: 600,
                }}
              >
                NG
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>Care Society</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NGO Account</div>
              </div>
            </div>
          </div>
        </div>

        {/* WELCOME SECTION */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>Welcome back, Care Society! 👋</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Here's your impact overview and latest activities</p>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
            }}
          >
            <i className="bi bi-plus-circle"></i>
            New Campaign
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              background: '#fff',
              color: '#1e293b',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <i className="bi bi-download"></i>
            Download Report
          </button>
        </div>

        {/* STATS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <NGOStatCard
            value="₹45,000"
            label="Total Donations"
            icon="bi-gift-fill"
            trend="+12%"
            color="success"
          />
          <NGOStatCard
            value="8"
            label="Active Campaigns"
            icon="bi-megaphone-fill"
            trend="+2 this month"
            color="primary"
          />
          <NGOStatCard
            value="156"
            label="Total Volunteers"
            icon="bi-people-fill"
            trend="+23 new"
            color="purple"
          />
          <NGOStatCard
            value="2,450"
            label="Lives Impacted"
            icon="bi-heart-fill"
            trend="+340 this month"
            color="warning"
          />
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* RECENT DONATIONS */}
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <h5 style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1.125rem' }}>Recent Donations</h5>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {[
                { donor: 'Arjun Singh', campaign: 'Medical Aid', amount: '₹2,500', date: 'Feb 18, 2026', status: 'Completed' },
                { donor: 'Priya Patel', campaign: 'Education Fund', amount: '₹5,000', date: 'Feb 17, 2026', status: 'Completed' },
                { donor: 'Rahul Kumar', campaign: 'Food Program', amount: '₹3,000', date: 'Feb 16, 2026', status: 'Pending' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1rem',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      color: '#2563eb',
                      fontSize: '0.875rem',
                    }}
                  >
                    {item.donor.split(' ')[0][0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{item.donor}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.campaign}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.95rem' }}>{item.amount}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CAMPAIGN PROGRESS */}
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              padding: '1.5rem',
            }}
          >
            <h5 style={{ margin: 0, marginBottom: '1.5rem', fontWeight: 700, color: '#1e293b', fontSize: '1.125rem' }}>Campaign Progress</h5>
            {[
              { name: 'Medical Aid', progress: 75, target: '₹15,000' },
              { name: 'Education Fund', progress: 60, target: '₹20,000' },
              { name: 'Food Program', progress: 45, target: '₹10,000' },
            ].map((campaign, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{campaign.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{campaign.progress}%</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #2563eb, #7c3aed)`,
                      width: `${campaign.progress}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Target: {campaign.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function NGOStatCard({ value, label, icon, trend, color }: any) {
  const colorMap: any = {
    success: { bg: '#d1fae5', text: '#10b981' },
    primary: { bg: '#dbeafe', text: '#2563eb' },
    purple: { bg: '#ede9fe', text: '#8b5cf6' },
    warning: { bg: '#fef3c7', text: '#f59e0b' },
  }

  const selectedColor = colorMap[color]

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: selectedColor.text,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            background: selectedColor.bg,
            color: selectedColor.text,
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            background: selectedColor.bg,
            color: selectedColor.text,
          }}
        >
          <i className="bi bi-arrow-up"></i>
          {trend}
        </div>
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
    </div>
  )
}
