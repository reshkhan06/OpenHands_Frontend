import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Eye, Truck, TrendingUp, Search, Upload, CheckCircle, Star, UserPlus, Package, MapPin } from 'lucide-react'
import HeroCarousel from '@/components/HeroCarousel'

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white min-h-[80vh] flex items-center py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Empowering Communities Through Transparent Giving
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                OpenHands connects compassionate donors with verified NGOs,
                ensuring every contribution creates real and lasting impact.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/donate">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                    Start Donating
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">2,500+</div>
                  <small className="text-white/75">Donations</small>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">75+</div>
                  <small className="text-white/75">NGOs</small>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <small className="text-white/75">Transparency</small>
                </div>
              </div>
            </div>
            <div className="relative">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">ABOUT US</span>
              <h2 className="text-4xl font-bold mt-4 mb-6">
                About <span className="text-primary">OpenHands</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                OpenHands is a revolutionary platform that bridges the gap between generosity and impact.
                We connect donors with thoroughly verified NGOs, ensuring complete transparency and accountability in every donation.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-6 text-center border-0 shadow-sm">
                  <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h6 className="font-bold mb-2">Verified NGOs</h6>
                  <small className="text-gray-500">100% background checked</small>
                </Card>
                <Card className="p-6 text-center border-0 shadow-sm">
                  <Eye className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h6 className="font-bold mb-2">Full Transparency</h6>
                  <small className="text-gray-500">Track every rupee</small>
                </Card>
                <Card className="p-6 text-center border-0 shadow-sm">
                  <Truck className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h6 className="font-bold mb-2">Direct Delivery</h6>
                  <small className="text-gray-500">Door-to-door service</small>
                </Card>
                <Card className="p-6 text-center border-0 shadow-sm">
                  <TrendingUp className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <h6 className="font-bold mb-2">Impact Tracking</h6>
                  <small className="text-gray-500">Real-time updates</small>
                </Card>
              </div>
              <div className="flex gap-4 flex-wrap">
                <Link to="/about">
                  <Button size="lg" className="px-8">Learn More About Us</Button>
                </Link>
                <Link to="/ngos">
                  <Button size="lg" variant="outline" className="px-8">View NGOs</Button>
                </Link>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="About"
                className="w-full rounded-2xl shadow-xl max-h-[480px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section id="how-we-work" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How We Work</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process ensures your donations reach those who need them most,
              with complete transparency at every step.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-sm hover:shadow-lg transition-shadow">
              <Search className="w-16 h-16 text-primary mx-auto mb-4" />
              <h5 className="font-bold mb-3 text-xl">Find NGOs</h5>
              <p className="text-gray-600">
                Browse verified NGOs based on location and cause to find the best match for your donation.
              </p>
            </Card>
            <Card className="p-8 text-center border-0 shadow-sm hover:shadow-lg transition-shadow">
              <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
              <h5 className="font-bold mb-3 text-xl">Submit Donation</h5>
              <p className="text-gray-600">
                Upload details of your donation and schedule a pickup at your convenience.
              </p>
            </Card>
            <Card className="p-8 text-center border-0 shadow-sm hover:shadow-lg transition-shadow">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h5 className="font-bold mb-3 text-xl">Track & Impact</h5>
              <p className="text-gray-600">
                Monitor your donation's journey and see the real impact on communities.
              </p>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Link to="/donate">
              <Button size="lg" className="px-8">Start Your Journey</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Donation Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to make a difference in the lives of those who need your help most.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: UserPlus,
                title: 'Register',
                description: 'Create your account and join our community',
                color: 'text-green-500',
                bgColor: 'bg-green-50'
              },
              {
                icon: Upload,
                title: 'Upload Donation',
                description: 'Share details of what you\'d like to donate',
                color: 'text-primary',
                bgColor: 'bg-blue-50'
              },
              {
                icon: Package,
                title: 'Pickup',
                description: 'We collect your donation at your convenience',
                color: 'text-cyan-500',
                bgColor: 'bg-cyan-50'
              },
              {
                icon: CheckCircle,
                title: 'Delivered',
                description: 'Your donation reaches those in need',
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-50'
              },
            ].map((step, idx) => {
              const Icon = step.icon
              return (
                <Card key={idx} className="p-6 text-center border-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-2">
                  <div className={`w-20 h-20 rounded-full ${step.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-10 h-10 ${step.color}`} />
                  </div>
                  <h6 className="font-bold mb-2 text-lg">{step.title}</h6>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* NGOs Section */}
      <section id="ngos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted NGOs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We partner with verified and trusted organizations making real impact in communities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Helping Hands Foundation',
                location: 'Mumbai, Maharashtra',
                description: 'Focused on providing food, shelter, and education to underprivileged communities with transparency.',
                iconColor: 'text-primary'
              },
              {
                name: 'Green Earth NGO',
                location: 'Delhi, NCR',
                description: 'Dedicated to environmental conservation and sustainable development initiatives globally.',
                iconColor: 'text-green-500'
              },
              {
                name: 'Education for All',
                location: 'Bangalore, Karnataka',
                description: 'Committed to improving access to quality education for children in rural areas.',
                iconColor: 'text-blue-500'
              },
            ].map((ngo, idx) => (
              <Card key={idx} className="p-6 border-0 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`text-4xl ${ngo.iconColor}`}>
                    <Shield className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold mb-1">{ngo.name}</h5>
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {ngo.location}
                    </p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <small className="text-gray-500 ml-1">(5.0)</small>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {ngo.description}
                </p>
                <div className="flex gap-2">
                  <Link to={`/ngo/${idx + 1}`} className="flex-1">
                    <Button size="sm" className="w-full">View Details</Button>
                  </Link>
                  <Button size="sm" variant="outline">Contact</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      <section id="impact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Impact Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See the real difference our donors and volunteers are making in communities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                title: 'Feeding Families',
                description: 'Over 500 families received food packages through our platform this month, ensuring nutritious meals for children.'
              },
              {
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                title: 'Education Support',
                description: 'Books and supplies donated to underprivileged schools, helping 200 children achieve their dreams.'
              },
              {
                image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                title: 'Clothing Drive',
                description: 'Warm clothes distributed to homeless shelters during winter, providing warmth and dignity.'
              },
            ].map((story, idx) => (
              <Card key={idx} className="border-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h5 className="font-bold mb-2 text-xl">{story.title}</h5>
                  <p className="text-gray-600">{story.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya S.',
                role: 'Donor',
                text: 'OpenHands made it so easy to donate my old clothes. I could track everything and see the impact!',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80'
              },
              {
                name: 'Rajesh K.',
                role: 'Volunteer',
                text: 'As a volunteer, I love how organized the pickups are. Real impact every day!',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80'
              },
              {
                name: 'NGO Representative',
                role: 'Partner',
                text: 'Transparent and trustworthy. We\'ve received quality donations consistently.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80'
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 border-0 shadow-sm bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h6 className="font-bold">{testimonial.name}</h6>
                    <small className="text-gray-500">{testimonial.role}</small>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="italic text-gray-600">{testimonial.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
