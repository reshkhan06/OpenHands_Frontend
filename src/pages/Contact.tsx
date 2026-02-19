import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
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
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="pt-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-xl">
            <div className="hero-gradient text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
              <p className="opacity-90">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 text-center border-0 shadow-sm">
                      <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h5 className="font-bold mb-2">Email Us</h5>
                      <p className="text-sm text-gray-600">contact@openhands.org</p>
                      <p className="text-sm text-gray-600">support@openhands.org</p>
                      <small className="text-gray-500">We respond within 24 hours</small>
                    </Card>
                    <Card className="p-6 text-center border-0 shadow-sm">
                      <Phone className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h5 className="font-bold mb-2">Call Us</h5>
                      <p className="text-sm text-gray-600">+91 98765 43210</p>
                      <p className="text-sm text-gray-600">+91 87654 32109</p>
                      <small className="text-gray-500">Mon-Fri 9AM-6PM IST</small>
                    </Card>
                    <Card className="p-6 text-center border-0 shadow-sm">
                      <MapPin className="w-12 h-12 text-red-500 mx-auto mb-3" />
                      <h5 className="font-bold mb-2">Visit Us</h5>
                      <p className="text-sm text-gray-600">Vodlemol, Cacora</p>
                      <p className="text-sm text-gray-600">📍Curchorem, Goa</p>
                      <small className="text-gray-500">India</small>
                    </Card>
                    <Card className="p-6 text-center border-0 shadow-sm">
                      <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <h5 className="font-bold mb-2">Business Hours</h5>
                      <p className="text-sm text-gray-600">Monday - Friday: 9AM - 6PM</p>
                      <p className="text-sm text-gray-600">Saturday: 10AM - 3PM</p>
                      <small className="text-gray-500">IST (Indian Standard Time)</small>
                      <small className="text-gray-500 block mt-1">Closed on weekends</small>
                    </Card>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          <Mail className="w-4 h-4 inline mr-2 text-primary" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          <Mail className="w-4 h-4 inline mr-2 text-primary" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Phone className="w-4 h-4 inline mr-2 text-primary" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Subject</label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      >
                        <option value="">Select a subject...</option>
                        <option>General Inquiry</option>
                        <option>Partnership Opportunity</option>
                        <option>NGO Registration</option>
                        <option>Technical Support</option>
                        <option>More Information</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Message</label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <p className="text-sm text-gray-500 text-center">
                      Your information is secure and will never be shared
                    </p>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connect With Us */}
          <section className="py-12 bg-gray-100 rounded-2xl mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Connect With Us</h2>
              <p className="text-gray-600">Follow us on social media for updates and stories</p>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="#" className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center text-primary hover:bg-primary hover:text-white transition" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition" style={{ color: '#1DA1F2' }} aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition" style={{ color: '#E4405F' }} aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition" style={{ color: '#0077B5' }} aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition" aria-label="YouTube">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </section>

          {/* Our Location */}
          <section className="py-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Location</h2>
            <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] relative">
              <MapContainer
                center={[15.25, 74.1]}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[15.25, 74.1]}>
                  <Popup>
                    <div className="text-center">
                      <strong>OpenHands</strong>
                      <br />
                      Vodlemol, Cacora
                      <br />
                      Curchorem, Goa, India
                      <br />
                      <a
                        href="https://www.google.com/maps/search/Curchorem,+Goa"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
