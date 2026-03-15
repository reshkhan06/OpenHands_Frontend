import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Building2,
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in React/Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const OFFICE_COORDS: [number, number] = [15.25, 74.1]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow'

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="hero-gradient text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-white/80 font-medium text-sm uppercase tracking-widest">Contact</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Get in touch</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            We'd love to hear from you. Send a message or reach out—we usually respond within 24 hours.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-20 max-w-6xl">
        <Card className="overflow-hidden shadow-xl border-0 rounded-2xl">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Contact info */}
              <div className="p-8 lg:p-10 bg-gray-50/80">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact information</h2>
                    <p className="text-gray-600 text-sm">Reach us by email, phone, or visit</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <a
                    href="mailto:contact@openhands.org"
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-sm text-gray-600">contact@openhands.org</p>
                      <p className="text-sm text-gray-600">support@openhands.org</p>
                      <span className="text-xs text-gray-500 mt-1 inline-block">We respond within 24 hours</span>
                    </div>
                  </a>

                  <a
                    href="tel:+919876543210"
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-200/80 transition-colors">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-sm text-gray-600">+91 98765 43210</p>
                      <p className="text-sm text-gray-600">+91 87654 32109</p>
                      <span className="text-xs text-gray-500 mt-1 inline-block">Mon–Fri 9AM–6PM IST</span>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100">
                    <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                      <p className="text-sm text-gray-600">Vodlemol, Cacora</p>
                      <p className="text-sm text-gray-600">Curchorem, Goa, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business hours</h3>
                      <p className="text-sm text-gray-600">Mon–Fri: 9AM – 6PM</p>
                      <p className="text-sm text-gray-600">Sat: 10AM – 3PM</p>
                      <span className="text-xs text-gray-500 mt-1 inline-block">IST · Closed Sundays</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="p-8 lg:p-10 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send a message</h2>
                <p className="text-gray-600 mb-6">Fill out the form and we'll get back to you soon.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2 text-primary" />
                        Full name
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2 text-primary" />
                        Email
                      </label>
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2 text-primary" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <select
                      className={inputClass}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    >
                      <option value="">Select subject...</option>
                      <option>General inquiry</option>
                      <option>Partnership</option>
                      <option>NGO registration</option>
                      <option>Technical support</option>
                      <option>More information</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2 text-primary" />
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className={inputClass + ' resize-none'}
                      placeholder="How can we help?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Send message
                  </Button>
                  <p className="text-xs text-gray-500 text-center">We keep your data secure and never share it.</p>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connect With Us */}
        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect with us</h2>
            <p className="text-gray-600">Follow us for updates and impact stories</p>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="#"
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#E4405F] hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#0077B5] hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </section>

        {/* Map */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our location</h2>
              <p className="text-sm text-gray-600">OpenHands office · Curchorem, Goa</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-[420px] bg-gray-100">
            <MapContainer
              center={OFFICE_COORDS}
              zoom={14}
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              scrollWheelZoom={true}
              className="rounded-2xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={OFFICE_COORDS}>
                <Popup>
                  <div className="text-center p-1">
                    <strong className="text-gray-900">OpenHands</strong>
                    <p className="text-sm text-gray-600 mt-1">Vodlemol, Cacora<br />Curchorem, Goa, India</p>
                    <a
                      href="https://www.google.com/maps/search/Curchorem,+Goa"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-sm font-medium hover:underline mt-2 inline-block"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>
      </div>
    </div>
  )
}
