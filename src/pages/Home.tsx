import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Eye, Truck, TrendingUp, Search, Upload, CheckCircle, Star, UserPlus, Package, MapPin, ArrowRight, Heart, Sparkles, Gift, Building2, BadgeCheck } from 'lucide-react'
import HeroCarousel from '@/components/HeroCarousel'

const stats = [
  { value: '2,500+', label: 'Donations', icon: Gift },
  { value: '75+', label: 'Verified NGOs', icon: Building2 },
  { value: '100%', label: 'Transparency', icon: BadgeCheck },
]

export default function Home() {
  return (
    <div className="pt-16">
{/* Hero Section — premium */}
<section className="relative py-28 lg:py-32 bg-gradient-to-b from-slate-50/80 via-white to-white overflow-hidden">
  {/* Subtle premium background */}
  <div className="absolute inset-0 home-hero-mesh opacity-40 pointer-events-none" aria-hidden />
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden />
  <div className="container mx-auto px-4 relative z-10">
    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

      {/* Left Content — staggered */}
      <div className="home-stagger space-y-0">
        <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4" />
          Transparent Giving
        </span>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mt-5 mb-6 leading-[1.1] tracking-tight">
          Give with{' '}
          <span className="text-gradient-premium">confidence</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl ">
          Connect with verified NGOs, donate items, schedule pickups, and
          track where your generosity goes. OpenHands makes giving simple,
          transparent, and impactful.
        </p>
        

        <div className="flex gap-4 flex-wrap mb-12 mt-6">
          <Link to="/donate">
            <Button size="lg" className="px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
              Start Donating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="px-8 border-2 hover:bg-primary/5 transition-all duration-300">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Stats strip — premium */}
        <div className="flex flex-wrap gap-8 sm:gap-12 pt-8 border-t border-slate-200/80">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="home-stat flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xl text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right — Hero visual */}
      <div className="relative home-stagger">
        <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 -z-10" />
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 ring-1 ring-slate-200/50 premium-card-hover">
          <HeroCarousel />
        </div>
      </div>

    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-24 lg:py-28 bg-white section-reveal section-premium">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em]">About OpenHands</span>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
                Where generosity meets{' '}
                <span className="text-gradient-premium">accountability</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                We bridge the gap between donors and impact. Every NGO is verified, every donation is tracked, and every rupee is accounted for—so you can give with complete confidence.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Shield, title: 'Verified NGOs', sub: 'Background checked', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                  { icon: Eye, title: 'Full Transparency', sub: 'Track every rupee', color: 'bg-primary', bg: 'bg-blue-50', text: 'text-primary' },
                  { icon: Truck, title: 'Direct Pickup', sub: 'Door-to-door', color: 'bg-sky-500', bg: 'bg-sky-50', text: 'text-sky-600' },
                  { icon: TrendingUp, title: 'Impact Tracking', sub: 'Real-time updates', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white/80 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 group">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${item.text}`} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <small className="text-gray-500">{item.sub}</small>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-4 flex-wrap">
                <Link to="/about">
                  <Button size="lg" className="px-8">Our Story</Button>
                </Link>
                <Link to="/ngos">
                  <Button size="lg" variant="outline" className="px-8">Explore NGOs</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-8 -right-4 w-full h-full rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 -z-10" />
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Community impact"
                className="w-full rounded-3xl shadow-2xl shadow-slate-200/50 ring-1 ring-slate-200/50 object-cover max-h-[520px]"
              />
              <Card className="absolute -bottom-6 left-6 right-6 sm:right-auto sm:w-72 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-5 border-0 ring-1 ring-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Real impact</div>
                    <p className="text-sm text-gray-500">Every donation reaches those in need</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section id="how-we-work" className="py-24 lg:py-28 bg-gradient-to-b from-slate-50/90 to-white section-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em]">How it works</span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-3 mb-4">Three steps to make a difference</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From choosing an NGO to seeing your impact—simple, transparent, and rewarding.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Find NGOs', desc: 'Browse verified NGOs by location and cause. Read reviews and see their impact.', num: '01' },
              { icon: Upload, title: 'Submit Donation', desc: 'Add your items, pick a date, and we’ll arrange a pickup at your doorstep.', num: '02' },
              { icon: CheckCircle, title: 'Track & Impact', desc: 'Follow your donation’s journey and see how it helps communities.', num: '03' },
            ].map((step, idx) => {
              const Icon = step.icon
              return (
                <Card key={idx} className="relative p-8 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-100/80 hover:shadow-xl hover:shadow-slate-200/60 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors font-heading">{step.num}</div>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-primary group-hover:text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20 -translate-y-1/2" />
                  )}
                </Card>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Link to="/donate">
              <Button size="lg" className="px-10 py-6 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">Start your journey</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Process */}
      <section id="process" className="py-24 lg:py-28 bg-white section-reveal section-premium">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em]">The journey</span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-3 mb-4">From you to those in need</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Register, donate, pickup, deliver—every step is clear and traceable.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: UserPlus, title: 'Register', desc: 'Create your account in minutes', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
              { icon: Upload, title: 'Upload', desc: 'List what you’d like to give', bg: 'bg-blue-50', iconColor: 'text-primary' },
              { icon: Package, title: 'Pickup', desc: 'We collect at your convenience', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
              { icon: CheckCircle, title: 'Delivered', desc: 'Donations reach those in need', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
            ].map((step, idx) => {
              const Icon = step.icon
              return (
                <Card key={idx} className="relative p-6 text-center border border-slate-100 hover:border-primary/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className={`w-20 h-20 rounded-2xl ${step.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-10 h-10 ${step.iconColor}`} />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* NGOs Section */}
      <section id="ngos" className="py-24 lg:py-28 bg-gradient-to-b from-slate-50/90 to-white section-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em]">Partners</span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-3 mb-4">Trusted NGOs</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Verified organizations creating real change in communities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Helping Hands Foundation', location: 'Mumbai, Maharashtra', description: 'Food, shelter, and education for underprivileged communities with full transparency.', iconColor: 'text-primary' },
              { name: 'Green Earth NGO', location: 'Delhi, NCR', description: 'Environmental conservation and sustainable development initiatives.', iconColor: 'text-emerald-600' },
              { name: 'Education for All', location: 'Bangalore, Karnataka', description: 'Quality education access for children in rural areas.', iconColor: 'text-sky-600' },
            ].map((ngo, idx) => (
              <Card key={idx} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-100/80 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors ${ngo.iconColor}`}>
                    <Shield className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-lg mb-1">{ngo.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {ngo.location}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">5.0</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-5">{ngo.description}</p>
                <div className="flex gap-2">
                  <Link to="/ngos" className="flex-1">
                    <Button size="sm" className="w-full">View details</Button>
                  </Link>
                  <Button size="sm" variant="outline">Contact</Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/ngos">
              <Button variant="outline" size="lg" className="px-8">View all NGOs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section id="impact" className="py-24 lg:py-28 bg-white section-reveal section-premium">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em]">Impact</span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-3 mb-4">Stories from the ground</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real outcomes from donations made through OpenHands.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', title: 'Feeding families', description: '500+ families received food packages this month, ensuring nutritious meals for children.' },
              { image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', title: 'Education support', description: 'Books and supplies reached underprivileged schools, helping 200+ children learn.' },
              { image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', title: 'Clothing drive', description: 'Warm clothes distributed to shelters during winter—dignity and warmth together.' },
            ].map((story, idx) => (
              <Card key={idx} className="border-0 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-200/50">
                <div className="relative overflow-hidden">
                  <img src={story.image} alt={story.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-2">{story.title}</h3>
                  <p className="text-slate-600">{story.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 lg:py-28 bg-gradient-to-b from-slate-50/90 to-white section-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-[0.2em]">Testimonials</span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-3 mb-4">What people say about us</h2>
          </div>
          <div className="max-w-4xl mx-auto mb-12 p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/30">
            <p className="text-xl text-slate-700 leading-relaxed text-center mb-6">
              "OpenHands made donating so simple. I could track my clothes from my doorstep to the community—finally, giving that feels real."
            </p>
            <div className="flex items-center justify-center gap-4">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Priya" className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30" />
              <div className="text-left">
                <div className="font-heading font-bold text-slate-900">Priya S.</div>
                <div className="text-sm text-slate-500">Donor, Mumbai</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya S.', role: 'Donor', text: 'OpenHands made it so easy to donate my old clothes. I could track everything and see the impact!', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
              { name: 'Rajesh K.', role: 'Volunteer', text: 'Pickups are well organized. I see real impact every single day.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
              { name: 'Meera N.', role: 'NGO Partner', text: 'Transparent and trustworthy. We receive quality donations consistently.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
            ].map((t, idx) => (
              <Card key={idx} className="p-8 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-100/80 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20" />
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip — premium */}
      <section className="py-28 lg:py-32 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(255,255,255,0.12),transparent)] pointer-events-none" />
        <div className="absolute inset-0 home-hero-pattern opacity-30 pointer-events-none" aria-hidden />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
            Ready to make an impact?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Join thousands of donors who give with confidence. Your first donation is just a few clicks away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button size="lg" className="bg-white text-primary hover:bg-white/95 px-10 py-6 text-base font-semibold shadow-2xl shadow-black/20 hover:shadow-primary/20 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300">
                Donate now
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white px-10 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                Create account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
