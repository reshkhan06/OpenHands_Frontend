import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { listVerifiedNGOs, type NGOOption } from '@/api/ngos'

export default function NGOs() {
  const [ngos, setNgos] = useState<NGOOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listVerifiedNGOs()
      .then((data) => {
        if (!cancelled) setNgos(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Failed to load NGOs'
          setError(msg)
          toast.error(msg)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="pt-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partner NGOs</h1>
            <p className="text-gray-600">
              Verified organizations you can donate to. Request a pickup and choose an NGO to receive your items.
            </p>
          </div>

          {error && (
            <div className="max-w-xl mx-auto mb-8 p-4 rounded-lg bg-red-50 text-red-700 text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading NGOs...</div>
          ) : ngos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No verified NGOs yet. Check back later or contact us to partner.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ngos.map((ngo) => (
                <Card key={ngo.ngo_id} className="p-6 border-0 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                  <CardContent className="p-0 flex flex-col flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-lg text-gray-900">{ngo.ngo_name}</h5>
                        <div className="flex items-center gap-1.5 text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{ngo.city}, {ngo.state}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      Verified partner. You can request a pickup and select this NGO to receive your donation.
                    </p>
                    <Link to="/dashboard/donor/pickups/new" className="block">
                      <Button className="w-full">Request pickup</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
