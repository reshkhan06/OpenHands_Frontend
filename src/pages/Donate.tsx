import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle, Heart } from 'lucide-react'
import { isAuthenticated, getUserRole } from '@/api/auth'

export default function Donate() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated() && getUserRole() === 'donor') {
      navigate('/dashboard/donor/pickups/new')
    }
  }, [navigate])

  const handleStartDonation = () => {
    localStorage.setItem('postLoginRedirect', '/dashboard/donor/pickups/new')
    navigate('/login')
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white min-h-[60vh] flex items-center py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Make a Donation</h1>
              <p className="text-xl text-white/90 mb-6">
                Your generosity can change lives. Every donation, no matter the size, creates lasting impact in communities that need it most.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>100% Transparent Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>Verified NGO Partners</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
                alt="Team Working"
                className="w-full rounded-2xl shadow-xl max-h-[350px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-primary text-white text-center py-6">
                <h2 className="text-3xl font-bold mb-2">Start Your Donation Journey</h2>
                <p className="text-lg">Login as a donor to request a pickup and choose your NGO.</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6 text-center">
                  <p className="text-gray-700 text-lg">
                    We use your donor dashboard to manage pickups, let you select a verified NGO, and handle the refundable deposit securely.
                  </p>
                  <Button size="lg" className="px-8" onClick={handleStartDonation}>
                    <Heart className="w-5 h-5 mr-2" />
                    Login to donate
                  </Button>
                  <p className="mt-4 text-gray-600 text-sm">
                    After login, you'll be redirected to request a pickup and choose your NGO.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
