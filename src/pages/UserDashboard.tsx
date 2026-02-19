import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData } from '@/api/auth'
import NotificationDropdown from '@/components/NotificationDropdown'
import UserProfileDropdown from '@/components/UserProfileDropdown'
import ProfileForm from '@/components/ProfileForm'
import PreferencesForm from '@/components/PreferencesForm'
import DonationTable from '@/components/DonationTable'
import NGOCard from '@/components/NGOCard'

export default function UserDashboard() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsUpdates: false,
    newsletter: true,
  })
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  const showPage = (pageId: string) => {
    setActivePage(pageId)
  }

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: "'Inter', sans-serif" }}>
      {/* SIDEBAR */}
      <aside
        className="sidebar"
        style={{
          width: '270px',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          padding: '1.5rem 1rem',
          flexShrink: 0,
          position: sidebarOpen ? 'static' : 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 100,
          left: sidebarOpen ? 0 : '-270px',
          transition: 'left 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#4CAF50',
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
        </div>

        <nav style={{ marginTop: '1rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
            { id: 'donations', label: 'My Donations', icon: 'bi-gift' },
            { id: 'ngos', label: 'My NGOs', icon: 'bi-building' },
            { id: 'profile', label: 'Profile', icon: 'bi-person' },
            { id: 'settings', label: 'Settings', icon: 'bi-gear' },
          ].map((item) => (
            <a
              key={item.id}
              onClick={() => showPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: activePage === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                borderRadius: '10px',
                marginBottom: '0.25rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                background: activePage === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </a>
          ))}

          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '1.5rem 0' }} />

          <a
            onClick={handleLogout}
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
              cursor: 'pointer',
            }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '1.5rem 2rem', minHeight: '100vh', overflowY: 'auto' }}>
        {/* TOPBAR */}
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
            <i className="bi bi-list"></i>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <NotificationDropdown />
            <UserProfileDropdown onProfileClick={showPage} />
          </div>
        </div>

        {/* DASHBOARD PAGE */}
        {activePage === 'dashboard' && (
          <div>
            {/* WELCOME HERO */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(124, 58, 237, 0.9))',
                borderRadius: '20px',
                padding: '2.5rem',
                marginBottom: '2rem',
                color: 'white',
                boxShadow: '0 20px 40px rgba(37, 99, 235, 0.25)',
              }}
            >
              <h1 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back, John! 👋</h1>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Your generosity is making a real difference. Here's what's happening with your donations.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '0.75rem 1.25rem',
                    color: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  <i className="bi bi-gift-fill"></i>
                  <span>8 Donations</span>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '0.75rem 1.25rem',
                    color: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  <i className="bi bi-people-fill"></i>
                  <span>245 Impact</span>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <StatCard
                icon="bi-gift-fill"
                color="#2563eb"
                label="Total Donations"
                value="₹15,000"
                trend="+5% this month"
              />
              <StatCard
                icon="bi-buildings-fill"
                color="#10b981"
                label="NGOs Supported"
                value="8"
                trend="Active NGOs"
              />
              <StatCard
                icon="bi-heart-fill"
                color="#7c3aed"
                label="Impact Created"
                value="245"
                trend="Lives touched"
              />
              <StatCard
                icon="bi-calendar-heart-fill"
                color="#f59e0b"
                label="Member Since"
                value="30 days"
                trend="Keep going!"
              />
            </div>

            {/* RECENT DONATIONS & QUICK ACTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem' }}>
                <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                  <i className="bi bi-clock-history" style={{ marginRight: '0.5rem', color: '#2563eb' }}></i>
                  Recent Donations
                </h5>
                <DonationCard
                  ngo="Helping Hands NGO"
                  date="Jan 15, 2025"
                  category="Food"
                  amount="₹5,000"
                  status="Delivered"
                  bgColor="#10b981"
                />
                <DonationCard
                  ngo="Education First"
                  date="Jan 10, 2025"
                  category="Books"
                  amount="₹3,500"
                  status="Delivered"
                  bgColor="#2563eb"
                />
                <DonationCard
                  ngo="Care Society"
                  date="Jan 5, 2025"
                  category="Medical"
                  amount="₹6,500"
                  status="In Transit"
                  bgColor="#ef4444"
                />
              </div>

              <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem' }}>
                <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                  <i className="bi bi-lightning-charge-fill" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
                  Quick Actions
                </h5>
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  New Donation
                </button>
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#2563eb',
                    border: '2px solid #2563eb',
                    borderRadius: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <i className="bi bi-search"></i>
                  Find NGOs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DONATIONS PAGE */}
        {activePage === 'donations' && (
          <DonationTable />
        )}

        {/* NGOs PAGE */}
        {activePage === 'ngos' && (
          <div className="space-y-4">
            <div>
              <h5 className="mb-6 text-xl font-bold">
                <i className="bi bi-buildings-fill mr-2 text-blue-600"></i>
                My Supported NGOs
              </h5>
            </div>
<div className="mt-8 px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <NGOCard 
      name="Helping Hands" 
      description="Providing food security to underprivileged communities" 
      donations="5" 
      amount="₹5,000" 
    />
    <NGOCard 
      name="Education First" 
      description="Empowering youth through quality education" 
      donations="3" 
      amount="₹3,500" 
    />
    <NGOCard 
      name="Care Society" 
      description="Providing medical support to those in need" 
      donations="2" 
      amount="₹3,000" 
    />
  </div>
</div>

          </div>
        )}

        {/* PROFILE PAGE */}
        {activePage === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <ProfileForm onSave={(data) => setProfileData(data)} />
            <PreferencesForm onSave={(data) => setPreferences(data)} />
          </div>
        )}

        {/* SETTINGS PAGE */}
        {activePage === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem' }}>
              <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                <i className="bi bi-lock-fill" style={{ marginRight: '0.5rem', color: '#2563eb' }}></i>
                Security
              </h5>
              <button style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-key" style={{ marginRight: '0.5rem' }}></i>
                Change Password
              </button>
              <button style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-shield-fill" style={{ marginRight: '0.5rem' }}></i>
                Two-Factor Authentication
              </button>
              <button style={{ width: '100%', padding: '0.5rem', background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-box-arrow-right" style={{ marginRight: '0.5rem' }}></i>
                Login Activity
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem' }}>
              <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                <i className="bi bi-database" style={{ marginRight: '0.5rem', color: '#2563eb' }}></i>
                Data & Privacy
              </h5>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>Manage your data and privacy settings</p>
              <button style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-download" style={{ marginRight: '0.5rem' }}></i>
                Download My Data
              </button>
              <button style={{ width: '100%', padding: '0.5rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                <i className="bi bi-trash" style={{ marginRight: '0.5rem' }}></i>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ icon, color, label, value, trend }: any) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginBottom: '1rem',
          background: `linear-gradient(135deg, rgba(${color === '#2563eb' ? '37, 99, 235' : color === '#10b981' ? '16, 185, 129' : color === '#7c3aed' ? '124, 58, 237' : '245, 158, 11'}, 0.1), rgba(${color === '#2563eb' ? '37, 99, 235' : color === '#10b981' ? '16, 185, 129' : color === '#7c3aed' ? '124, 58, 237' : '245, 158, 11'}, 0.05))`,
          color: color,
        }}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>{label}</p>
      <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>{value}</h3>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
        <i className="bi bi-arrow-up"></i>
        {trend}
      </span>
    </div>
  )
}

function DonationCard({ ngo, date, category, amount, status, bgColor }: any) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '1rem',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
        }}
      >
        <i className="bi bi-building"></i>
      </div>
      <div>
        <h6 style={{ margin: 0, fontWeight: 600 }}>{ngo}</h6>
        <small style={{ color: '#64748b' }}>
          <i className="bi bi-calendar3" style={{ marginRight: '0.5rem' }}></i>
          {date}
        </small>
      </div>
      <span
        style={{
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        {category}
      </span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.1rem' }}>{amount}</div>
        <span
          style={{
            background: status === 'In Transit' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: status === 'In Transit' ? '#f59e0b' : '#10b981',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <i className={`bi bi-${status === 'In Transit' ? 'truck' : 'check-circle'}`}></i>
          {status}
        </span>
      </div>
    </div>
  )
}


