import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Shield, Eye, Truck, TrendingUp, Heart, Building2, Target, Award, Users, ArrowRight } from 'lucide-react'

const PILLARS = [
  { icon: Shield, title: 'Verified NGOs', sub: '100% background checked', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Eye, title: 'Full transparency', sub: 'Track every rupee', color: 'text-primary', bg: 'bg-blue-50' },
  { icon: Truck, title: 'Direct pickup', sub: 'Door-to-door service', color: 'text-sky-600', bg: 'bg-sky-50' },
  { icon: TrendingUp, title: 'Impact tracking', sub: 'Real-time updates', color: 'text-amber-600', bg: 'bg-amber-50' },
]

const TIMELINE = [
  { year: '2020', title: 'The beginning', text: 'Founded with one goal: restore trust in charitable giving through technology and transparency.' },
  { year: '2021', title: 'First impact', text: 'Processed our first 1,000 donations and partnered with 50+ verified NGOs.' },
  { year: '2022', title: 'Scale & growth', text: 'Expanded across India—10,000+ donors and 100,000+ beneficiaries reached.' },
  { year: '2023', title: 'Innovation', text: 'Launched advanced tracking and mobile experience to make giving easier for everyone.' },
]

export default function About() {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-white/80 font-medium text-sm uppercase tracking-widest">About us</span>
          <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-6 max-w-4xl mx-auto leading-tight">
            Where generosity meets accountability
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            OpenHands connects donors with verified NGOs so every contribution creates real, traceable impact.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">Our mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Creating lasting impact through technology
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                We bridge the gap between generosity and impact. Every NGO is verified, every donation is tracked, and every rupee is accounted for—so you can give with confidence.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {PILLARS.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-md transition-all"
                    >
                      <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <small className="text-gray-500 text-sm">{item.sub}</small>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Link to="/ngos">
                <Button size="lg" className="px-8">
                  <Building2 className="w-5 h-5 mr-2" />
                  Explore NGOs
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl -z-10" />
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Community impact"
                className="w-full rounded-2xl shadow-xl object-cover max-h-[480px]"
              />
              <Card className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-[200px] bg-white border-0 shadow-xl rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Real impact</div>
                    <p className="text-sm text-gray-500">Every donation counts</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">50,000+</div>
              <div className="text-sm text-gray-600 mt-1">Donations processed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">75+</div>
              <div className="text-sm text-gray-600 mt-1">Verified NGOs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-gray-600 mt-1">Donors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">100K+</div>
              <div className="text-sm text-gray-600 mt-1">Beneficiaries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50/80 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">Our story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">From vision to reality</h2>
              </div>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 md:left-1/2 md:-translate-x-px" />
              <div className="space-y-0">
                {TIMELINE.map((item, idx) => (
                  <div
                    key={idx}
                    className={`relative flex gap-8 md:gap-12 items-start pb-12 last:pb-0 ${
                      idx % 2 === 1 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold z-10 md:mx-auto">
                      {item.year.slice(2)}
                    </div>
                    <div className={`flex-1 min-w-0 pt-0.5 ${idx % 2 === 1 ? 'md:text-right' : ''}`}>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why OpenHands */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Why OpenHands</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Trusted by donors and NGOs</h2>
            <p className="text-lg text-gray-600">
              We combine verification, transparency, and technology so your generosity reaches those who need it most.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Verified partners</h3>
              <p className="text-gray-600 text-sm">Every NGO is vetted so your donations go to legitimate, impact-driven organizations.</p>
            </Card>
            <Card className="p-8 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Full visibility</h3>
              <p className="text-gray-600 text-sm">Track your donation from pickup to delivery and see the impact it creates.</p>
            </Card>
            <Card className="p-8 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Community first</h3>
              <p className="text-gray-600 text-sm">Built for donors, NGOs, and beneficiaries—everyone benefits from one platform.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to make an impact?</h2>
          <p className="text-lg text-white/90 max-w-xl mx-auto mb-8">
            Join thousands of donors who give with confidence. Start by exploring NGOs or making your first donation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button size="lg" className="bg-white text-primary hover:bg-white/95 px-8 py-6 text-base font-semibold">
                Donate now
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
            <Link to="/ngos">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/15 hover:text-white px-8 py-6 text-base font-semibold">
                Explore NGOs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
