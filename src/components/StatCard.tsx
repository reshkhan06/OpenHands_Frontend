import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon?: string // Bootstrap icon class name
  trend?: {
    value: number
    isPositive: boolean
  }
  bgColor?: string
  textColor?: string
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  bgColor = 'bg-blue-50',
  textColor = 'text-blue-600',
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <p
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '▲' : '▼'} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          {icon && (
            <div className={`rounded-lg p-3 ${bgColor}`}>
              <i className={`text-2xl ${icon} ${textColor}`}></i>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
