import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle, Heart, Upload } from 'lucide-react'

export default function Donate() {
  const [formData, setFormData] = useState({
    donationType: '',
    quantity: '',
    description: '',
    pickupLocation: '',
    pickupDate: '',
    contact: '',
    email: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Donation submitted! Our team will contact you within 24 hours to confirm pickup.')
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

      {/* Donation Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-primary text-white text-center py-6">
                <h2 className="text-3xl font-bold mb-2">Start Your Donation Journey</h2>
                <p className="text-lg">
                  Fill out the form below and our volunteer team will pick up your donation
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Donation Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.donationType}
                        onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                        required
                      >
                        <option value="">Select donation type</option>
                        <option>🍎 Food & Groceries</option>
                        <option>👕 Clothes & Textiles</option>
                        <option>📚 Books & Educational Materials</option>
                        <option>🏥 Medical Supplies</option>
                        <option>🏠 Household Items</option>
                        <option>💰 Monetary Donation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Quantity/Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., 5 kg, 10 items, ₹500"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Item Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Please describe your donation in detail"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                    <small className="text-gray-500">Detailed descriptions help us better serve the recipients</small>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Pickup Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Full address with landmarks"
                        value={formData.pickupLocation}
                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Preferred Pickup Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Upload Photos (Optional)</label>
                    <input
                      type="file"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      multiple
                      accept="image/*"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="termsCheck"
                      className="mt-1 w-4 h-4"
                      required
                    />
                    <label htmlFor="termsCheck" className="text-sm">
                      I agree to the{' '}
                      <a href="/terms" target="_blank" className="text-primary hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" target="_blank" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="text-center">
                    <Button type="submit" size="lg" className="px-8">
                      <Heart className="w-5 h-5 mr-2" />
                      Submit Donation
                    </Button>
                    <p className="mt-4 text-gray-600">
                      Our team will contact you within 24 hours to confirm pickup
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
