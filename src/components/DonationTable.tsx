import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface DonationItem {
  date: string
  ngo: string
  category: string
  amount: string
  status: 'Delivered' | 'In Transit' | 'Pending'
  icon?: string
}

interface DonationTableProps {
  donations?: DonationItem[]
}

const defaultDonations: DonationItem[] = [
  { date: '15-Jan-2025', ngo: 'Helping Hands', category: 'Food', amount: '₹5,000', status: 'Delivered', icon: 'bi-check-circle' },
  { date: '10-Jan-2025', ngo: 'Education First', category: 'Books', amount: '₹3,500', status: 'Delivered', icon: 'bi-check-circle' },
  { date: '05-Jan-2025', ngo: 'Care Society', category: 'Medical', amount: '₹6,500', status: 'In Transit', icon: 'bi-truck' },
]

const statusConfig = {
  Delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: 'bi-check-circle' },
  'In Transit': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'bi-truck' },
  Pending: { bg: 'bg-slate-100', text: 'text-slate-700', icon: 'bi-hourglass' },
}

export default function DonationTable({ donations = defaultDonations }: DonationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="bi bi-gift-fill text-blue-600"></i>
          My Donations History
        </CardTitle>
        <CardDescription>Track and manage all your donations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">NGO</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-3 py-3 text-slate-600">
                    <i className="bi bi-calendar3 mr-2"></i>
                    {item.date}
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-900">{item.ngo}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-blue-600">{item.amount}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        statusConfig[item.status].bg
                      } ${statusConfig[item.status].text}`}
                    >
                      <i className={`bi ${statusConfig[item.status].icon}`}></i>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-100"
                    >
                      <i className="bi bi-eye mr-2"></i>
                      Track
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
