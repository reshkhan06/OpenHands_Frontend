import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface NGOCardProps {
  name: string
  description: string
  donations: number | string
  amount: string
  image?: string
}

export default function NGOCard({
  name,
  description,
  donations,
  amount,
  image = 'https://via.placeholder.com/100',
}: NGOCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-4">
      
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <img
            src={image}
            alt={name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg font-semibold">
              {name}
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Donations
            </p>
            <p className="text-xl font-bold text-slate-900">
              {donations}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Total
            </p>
            <p className="text-xl font-bold text-blue-600">
              {amount}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <i className="bi bi-eye mr-2"></i>
            View
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
            <i className="bi bi-plus-lg mr-2"></i>
            Donate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
