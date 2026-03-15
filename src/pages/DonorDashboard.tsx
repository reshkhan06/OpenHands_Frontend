import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Gift,
  HeartPulse,
  User,
  Settings,
  LogOut,
  Menu,
  History,
  Zap,
  PlusCircle,
  Search,
  CheckCircle,
  Building2,
  Tags,
  Megaphone,
  Lock,
  Key,
  Database,
} from 'lucide-react'
import { clearAuthData, fetchUserProfile, changePassword, type UserProfile } from '@/api/auth'
import { listPickups, type PickupListItem } from '@/api/pickups'
import UserProfileDropdown from '@/components/UserProfileDropdown'
import ProfileForm from '@/components/ProfileForm'
import DonationTable, { type DonationItem } from '@/components/DonationTable'
import { MyPickupsPage } from '@/pages/MyPickups'
import { NewPickupPage } from '@/pages/NewPickup'
import PickupDetail from '@/pages/PickupDetail'

const ICON_SIZE = 20
const ICON_SIZE_SM = 18

type DonorDashboardProps = {
  initialPage?: string
}

export default function DonorDashboard({ initialPage = 'dashboard' }: DonorDashboardProps) {
  const [activePage, setActivePage] = useState(initialPage)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [pickups, setPickups] = useState<PickupListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const navigate = useNavigate()
  const { pickupId } = useParams<{ pickupId?: string }>()
  const location = useLocation()
  const isPickupDetailPage = Boolean(pickupId && location.pathname.startsWith('/dashboard/donor/pickups/') && location.pathname === `/dashboard/donor/pickups/${pickupId}`)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (passwordForm.new.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters.' })
      return
    }
    setPasswordLoading(true)
    try {
      await changePassword(passwordForm.current, passwordForm.new)
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' })
      setPasswordForm({ current: '', new: '', confirm: '' })
      setShowPasswordForm(false)
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to change password.' })
    } finally {
      setPasswordLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [profile, pickupList] = await Promise.all([fetchUserProfile(), listPickups()])
        if (cancelled) return
        setUserProfile(profile)
        setPickups(Array.isArray(pickupList) ? pickupList : [])
        setProfileData({
          name: `${profile.fname} ${profile.lname}`.trim(),
          email: profile.email,
          phone: String(profile.contact_number ?? ''),
        })
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = () => {
    clearAuthData()
    navigate('/')
  }

  const showPage = (pageId: string) => {
    setActivePage(pageId)
  }

  const donorNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donations', label: 'My Donations', icon: Gift },
    { id: 'impact', label: 'My Impact', icon: HeartPulse },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const donorName =
    userProfile && (userProfile.fname || userProfile.lname)
      ? `${userProfile.fname} ${userProfile.lname}`.trim()
      : 'Donor'

  const completedDonations = pickups.filter((p) => p.current_status === 'completed').length
  const activeDonations = pickups.filter(
    (p) => p.current_status !== 'completed' && p.current_status !== 'cancelled'
  ).length
  const totalDonations = pickups.length

  const ngosSupported = new Set(pickups.map((p) => p.ngo_id)).size
  const causeAreasCount = (() => {
    const types = new Set<string>()
    pickups.forEach((p) => {
      const desc = p.items_description || ''
      const match = desc.match(/Type:\s*([^|]+)/)
      if (match) types.add(match[1].trim())
    })
    return types.size
  })()

  const mapPickupToDonationItem = (p: PickupListItem): DonationItem => {
    const status: DonationItem['status'] =
      p.current_status === 'completed'
        ? 'Delivered'
        : p.current_status === 'requested' || p.current_status === 'accepted'
        ? 'Pending'
        : 'In Transit'

    const categoryMatch = (p.items_description || '').match(/Type:\s*([^|]+)/)
    const category = categoryMatch ? categoryMatch[1].trim() : 'Items'

    const amountLabel =
      p.payment_status === 'refunded'
        ? 'Refunded'
        : p.payment_status === 'paid'
        ? 'Paid'
        : p.payment_status === 'refund_pending'
        ? 'Refund pending'
        : 'Pending'

    return {
      date: p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—',
      ngo: p.ngo_name ?? 'NGO',
      category,
      amount: amountLabel,
      status,
      pickupId: p.pickup_id,
    }
  }

  const recentDonations: DonationItem[] = [...pickups]
    .sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0
      const db = b.created_at ? new Date(b.created_at).getTime() : 0
      return db - da
    })
    .slice(0, 3)
    .map(mapPickupToDonationItem)

  const allDonations: DonationItem[] = pickups.map(mapPickupToDonationItem)

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
      {/* SIDEBAR - Donor theme (emerald/green); fixed height, does not scroll */}
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
            Donor
          </span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {donorNavItems.map((item) => (
              <a
                key={item.id}
                onClick={() => ('path' in item && item.path ? navigate(item.path) : showPage(item.id))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                color: activePage === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                background: activePage === item.id ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                  borderRadius: '10px',
                  marginBottom: '0.25rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
              {item.icon && <item.icon size={ICON_SIZE_SM} strokeWidth={2} />}
              <span>{item.label}</span>
              </a>
            ))}
          </div>
          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '1rem 0', flexShrink: 0 }} />
          <a
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
            }}
          >
            <LogOut size={ICON_SIZE_SM} strokeWidth={2} />
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT - only this area scrolls */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserProfileDropdown onProfileClick={showPage} />
          </div>
        </div>

        {isPickupDetailPage ? (
          <PickupDetail />
        ) : (
        <>
        {/* DONOR DASHBOARD HOME */}
        {activePage === 'dashboard' && (
          <div>
            {error && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.95), rgba(4, 120, 87, 0.9))',
                borderRadius: '20px',
                padding: '2.5rem',
                marginBottom: '2rem',
                color: 'white',
                boxShadow: '0 20px 40px rgba(5, 150, 105, 0.25)',
              }}
            >
              <h1 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Welcome, {donorName}! 💚</h1>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Your contributions are creating real change. Track your giving and impact here.
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
                  <Gift size={ICON_SIZE} strokeWidth={2} />
                  <span>{totalDonations} Pickups</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <DonorStatCard
                icon={<Gift size={24} strokeWidth={2} />}
                color="#0d9488"
                label="Total Pickups"
                value={String(totalDonations)}
                trend="All time"
              />
              <DonorStatCard
                icon={<CheckCircle size={24} strokeWidth={2} />}
                color="#059669"
                label="Completed"
                value={String(completedDonations)}
                trend="Finished pickups"
              />
              <DonorStatCard
                icon={<History size={24} strokeWidth={2} />}
                color="#ea580c"
                label="Active"
                value={String(activeDonations)}
                trend="In progress"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                  <History size={20} style={{ marginRight: '0.5rem', color: '#059669' }} />
                  Recent Donations
                </h5>
                {recentDonations.length === 0 ? (
                  <p style={{ color: '#64748b' }}>No pickups yet.</p>
                ) : (
                  recentDonations.map((d, idx) => (
                    <DonorDonationRow
                      key={idx}
                      ngo={d.ngo}
                      date={d.date}
                      amount={d.amount}
                      status={d.status}
                    />
                  ))
                )}
              </div>
              <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                  <Zap size={20} style={{ marginRight: '0.5rem', color: '#059669' }} />
                  Quick Actions
                </h5>
                <button
                  onClick={() => navigate('/donate')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #059669, #047857)',
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
                  <PlusCircle size={20} />
                  Make a Donation
                </button>
                <button
                  onClick={() => navigate('/ngos')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#059669',
                    border: '2px solid #059669',
                    borderRadius: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <Search size={20} />
                  Explore NGOs
                </button>
              </div>
            </div>
          </div>
        )}

        {activePage === 'pickups' && <MyPickupsPage />}

        {activePage === 'pickup-new' && <NewPickupPage />}

        {activePage === 'donations' && <DonationTable donations={allDonations} />}

        {activePage === 'impact' && (
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
              border: '1px solid rgba(5, 150, 105, 0.1)',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                padding: '2rem 2rem 1.5rem',
                borderBottom: '1px solid rgba(5, 150, 105, 0.15)',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HeartPulse size={24} strokeWidth={2} />
                Your Impact Summary
              </h2>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem', color: '#047857' }}>
                Your giving in numbers
              </p>
            </div>
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
              <div
                style={{
                  padding: '1.5rem',
                  background: '#f0fdf4',
                  borderRadius: '16px',
                  border: '1px solid #bbf7d0',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle size={26} strokeWidth={2} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065f46', lineHeight: 1.2 }}>{completedDonations}</div>
                <div style={{ fontSize: '0.875rem', color: '#047857', fontWeight: 600, marginTop: '0.25rem' }}>Completed pickups</div>
              </div>
              <div
                style={{
                  padding: '1.5rem',
                  background: '#f0fdf4',
                  borderRadius: '16px',
                  border: '1px solid #bbf7d0',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Building2 size={26} strokeWidth={2} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065f46', lineHeight: 1.2 }}>{ngosSupported}</div>
                <div style={{ fontSize: '0.875rem', color: '#047857', fontWeight: 600, marginTop: '0.25rem' }}>NGOs supported</div>
              </div>
              <div
                style={{
                  padding: '1.5rem',
                  background: '#f0fdf4',
                  borderRadius: '16px',
                  border: '1px solid #bbf7d0',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Tags size={26} strokeWidth={2} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065f46', lineHeight: 1.2 }}>{causeAreasCount}</div>
                <div style={{ fontSize: '0.875rem', color: '#047857', fontWeight: 600, marginTop: '0.25rem' }}>Cause areas</div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'campaigns' && (
          <div style={{ background: 'white', borderRadius: '18px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
              <Megaphone size={20} style={{ marginRight: '0.5rem', color: '#059669' }} />
              Campaigns You Support
            </h5>
            <p style={{ color: '#64748b' }}>View and contribute to campaigns from your supported NGOs.</p>
          </div>
        )}

        {activePage === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '600px' }}>
            <ProfileForm
              initialData={{
                name: profileData.name || donorName,
                email: profileData.email || userProfile?.email || '',
                phone: profileData.phone || String(userProfile?.contact_number ?? ''),
              }}
              onSave={(data) => setProfileData(data)}
            />
          </div>
        )}

        {activePage === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                <Lock size={20} style={{ marginRight: '0.5rem', color: '#059669' }} />
                Security
              </h5>
              {!showPasswordForm ? (
                <button
                  type="button"
                  onClick={() => { setShowPasswordForm(true); setPasswordMessage(null); }}
                  style={{ width: '100%', padding: '0.6rem 1rem', background: 'transparent', color: '#059669', border: '1px solid #059669', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Key size={18} strokeWidth={2} />
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {passwordMessage && (
                    <div style={{ padding: '0.75rem', borderRadius: '8px', background: passwordMessage.type === 'success' ? '#dcfce7' : '#fef2f2', color: passwordMessage.type === 'success' ? '#166534' : '#b91c1c', fontSize: '0.875rem' }}>
                      {passwordMessage.text}
                    </div>
                  )}
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                    Current password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                    required
                    placeholder="Enter current password"
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                    New password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))}
                    required
                    minLength={8}
                    placeholder="At least 8 characters, 1 uppercase, 1 digit"
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                    required
                    placeholder="Confirm new password"
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      style={{ flex: 1, padding: '0.6rem 1rem', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: passwordLoading ? 'not-allowed' : 'pointer' }}
                    >
                      {passwordLoading ? 'Updating...' : 'Update password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowPasswordForm(false); setPasswordMessage(null); setPasswordForm({ current: '', new: '', confirm: '' }); }}
                      style={{ padding: '0.6rem 1rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div style={{ background: 'white', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h5 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                <Database size={20} style={{ marginRight: '0.5rem', color: '#059669' }} />
                Data & Privacy
              </h5>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>Manage your donor data and preferences.</p>
            </div>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  )
}

function DonorStatCard({ icon, color, label, value, trend }: { icon: React.ReactNode; color: string; label: string; value: string; trend: string }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          flexShrink: 0,
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${color}20`,
          color: color,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem', margin: 0 }}>{label}</p>
        <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>{value}</h3>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669', marginTop: '0.5rem', display: 'block' }}>{trend}</span>
      </div>
    </div>
  )
}

function DonorDonationRow({ ngo, date, amount, status }: { ngo: string; date: string; amount: string; status: string }) {
  return (
    <div
      style={{
        background: '#f8fafc',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '1rem',
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
          background: 'linear-gradient(135deg, #059669, #047857)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
        }}
      >
        <Building2 size={24} strokeWidth={2} />
      </div>
      <div>
        <h6 style={{ margin: 0, fontWeight: 600 }}>{ngo}</h6>
        <small style={{ color: '#64748b' }}>{date}</small>
      </div>
      <div style={{ fontWeight: 'bold', color: '#059669', fontSize: '1.1rem' }}>{amount}</div>
      <span
        style={{
          background: status === 'In Transit' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          color: status === 'In Transit' ? '#f59e0b' : '#059669',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    </div>
  )
}
