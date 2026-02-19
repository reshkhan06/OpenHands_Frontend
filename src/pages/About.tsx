import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Shield, Eye, Truck, TrendingUp, Heart, Building } from 'lucide-react'

export default function About() {
  return (
    <div className="pt-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Mission Section */}
      <section id="mission" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="text-4xl font-bold mt-4 mb-6">Creating Lasting Impact Through Technology</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                OpenHands bridges the gap between generosity and impact. We connect donors with thoroughly verified NGOs,
                ensuring complete transparency and accountability in every donation.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="font-semibold">Verified NGOs</div>
                    <small className="text-gray-500">100% background checked</small>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-semibold">Full Transparency</div>
                    <small className="text-gray-500">Track every rupee</small>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="font-semibold">Direct Pickup</div>
                    <small className="text-gray-500">Door-to-door service</small>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="font-semibold">Impact Tracking</div>
                    <small className="text-gray-500">Real-time updates</small>
                  </div>
                </div>
              </div>
              <Link to="/ngos">
                <Button size="lg">
                  <Building className="w-5 h-5 mr-2" />
                  Explore NGOs
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Mission"
                className="w-full rounded-2xl shadow-xl max-h-[400px] object-cover"
              />
              <Card className="absolute bottom-4 left-4 bg-white p-4 shadow-lg rounded-xl">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  <div>
                    <div className="font-bold">Real Impact</div>
                    <small className="text-gray-500">Every donation counts</small>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Our Story"
                className="w-full rounded-2xl shadow-xl max-h-[500px] object-cover"
              />
              {/* Floating stat card - matches original about.html */}
              <Card className="absolute top-1/2 left-0 -translate-y-1/2 bg-white p-4 shadow-lg rounded-xl max-w-[140px]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">50,000+</div>
                  <small className="text-gray-500">Donations Processed</small>
                </div>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-4xl font-bold mt-4 mb-8">From Vision to Reality</h2>
              <div className="space-y-6">
                {[
                  { year: '2020', title: 'The Beginning', color: 'text-primary', text: 'Founded with a simple mission: restore trust in charitable giving through technology and transparency.' },
                  { year: '2021', title: 'First Impact', color: 'text-green-500', text: 'Processed our first 1,000 donations, establishing partnerships with 50+ verified NGOs.' },
                  { year: '2022', title: 'Scale & Growth', color: 'text-blue-500', text: 'Expanded to serve communities across India, reaching 10,000+ donors and 100,000+ beneficiaries.' },
                  { year: '2023', title: 'Innovation', color: 'text-yellow-500', text: 'Launched advanced tracking features and mobile app, making giving more accessible than ever.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={`w-3 h-3 rounded-full bg-current ${item.color} mt-2 flex-shrink-0`}></div>
                    <div>
                      <h5 className={`font-bold mb-2 ${item.color}`}>{item.year} - {item.title}</h5>
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
