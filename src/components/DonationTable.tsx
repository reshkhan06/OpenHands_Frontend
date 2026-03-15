import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gift, CheckCircle, Truck, Hourglass, Eye, Filter } from 'lucide-react'

export interface DonationItem {
  date: string
  ngo: string
  category: string
  amount: string
  status: 'Delivered' | 'In Transit' | 'Pending'
  icon?: string
  /** Pickup ID for "Track" link to donor pickup detail */
  pickupId?: number
}

interface DonationTableProps {
  donations?: DonationItem[]
}

const statusConfig = {
  Delivered: { bg: '#d1fae5', text: '#065f46', icon: CheckCircle },
  'In Transit': { bg: '#fef3c7', text: '#92400e', icon: Truck },
  Pending: { bg: '#e2e8f0', text: '#475569', icon: Hourglass },
}

const depositConfig: Record<string, { bg: string; text: string }> = {
  Refunded: { bg: '#dbeafe', text: '#1e40af' },
  Paid: { bg: '#d1fae5', text: '#065f46' },
  'Refund pending': { bg: '#e0e7ff', text: '#3730a3' },
  Pending: { bg: '#fef3c7', text: '#92400e' },
}

function getDepositStyle(amount: string) {
  return depositConfig[amount] ?? { bg: '#f1f5f9', text: '#475569' }
}

const STATUS_OPTIONS: DonationItem['status'][] = ['Delivered', 'In Transit', 'Pending']
const DEPOSIT_OPTIONS = ['Paid', 'Refunded', 'Refund pending', 'Pending']

export default function DonationTable({ donations = [] }: DonationTableProps) {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [depositFilter, setDepositFilter] = useState<string>('')
  const filteredDonations = donations.filter((item) => {
    if (statusFilter && item.status !== statusFilter) return false
    if (depositFilter && item.amount !== depositFilter) return false
    return true
  })

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
          padding: '1.5rem 2rem',
          borderBottom: 'none',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gift size={22} strokeWidth={2} style={{ opacity: 0.95 }} />
          My Donations History
        </h2>
        <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
          Track and manage all your pickups
        </p>
      </div>
      {donations.length > 0 && (
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #f0fdfa 0%, #fff 100%)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#0f766e', fontSize: '0.875rem' }}>
            <Filter size={16} style={{ opacity: 0.9 }} />
            Filter
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              background: '#fff',
              color: '#475569',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={depositFilter}
            onChange={(e) => setDepositFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              background: '#fff',
              color: '#475569',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <option value="">All deposits</option>
            {DEPOSIT_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {(statusFilter || depositFilter) && (
            <button
              type="button"
              onClick={() => { setStatusFilter(''); setDepositFilter(''); }}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#64748b',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
      <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NGO</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deposit</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem 16px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
                  {donations.length === 0
                    ? 'No pickups yet. Request a pickup to get started.'
                    : 'No donations match the selected filters. Try changing or clearing the filters above.'}
                </td>
              </tr>
            ) : (
              filteredDonations.map((item, idx) => {
                const status = statusConfig[item.status] ?? statusConfig.Pending
                const deposit = getDepositStyle(item.amount)
                const StatusIcon = status.icon
                return (
                  <tr
                    key={item.pickupId ?? idx}
                    style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                  >
                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.9rem' }}>
                      {item.date}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>{item.ngo}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '5px 12px',
                          borderRadius: '999px',
                          background: '#ccfbf1',
                          color: '#0f766e',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: deposit.bg,
                          color: deposit.text,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {item.amount}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '999px',
                          background: status.bg,
                          color: status.text,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {StatusIcon ? <StatusIcon size={14} strokeWidth={2} /> : null}
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {item.pickupId != null ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/donor/pickups/${item.pickupId}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(13, 148, 136, 0.3)',
                          }}
                        >
                          <Eye size={16} strokeWidth={2} />
                          Track
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
