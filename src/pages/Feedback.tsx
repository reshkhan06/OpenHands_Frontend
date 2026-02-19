import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, Mail, MessageSquare, FileText, Star, Send } from 'lucide-react'

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
    rating: '5',
    followUp: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for your feedback! We appreciate your input.')
    setFormData({ name: '', email: '', category: '', message: '', rating: '5', followUp: true })
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">Share Your Feedback</h2>
            <p className="text-gray-600">Help us improve! Your feedback is valuable and helps us serve you better.</p>
          </div>

          <Card className="border-0 shadow-xl mb-12">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <User className="w-4 h-4 inline mr-2 text-primary" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2 text-primary" />
                    Feedback Category
                  </label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select a category...</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>User Experience</option>
                    <option>Performance Issue</option>
                    <option>General Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <FileText className="w-4 h-4 inline mr-2 text-primary" />
                    Your Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Share your feedback, suggestions, or concerns..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    <Star className="w-4 h-4 inline mr-2 text-yellow-500" />
                    How would you rate your experience?
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={rating.toString()}
                          checked={formData.rating === rating.toString()}
                          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                          className="w-4 h-4"
                        />
                        <div className="flex items-center gap-1">
                          <Star className={`w-5 h-5 ${parseInt(formData.rating) >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          <span className="text-sm">{rating} - {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="followUp"
                    checked={formData.followUp}
                    onChange={(e) => setFormData({ ...formData, followUp: e.target.checked })}
                    className="mt-1 w-4 h-4"
                  />
                  <label htmlFor="followUp" className="text-sm">
                    <Mail className="w-4 h-4 inline mr-2" />
                    I'd like to be contacted about my feedback
                  </label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="w-5 h-5 mr-2" />
                  Submit Feedback
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">ℹ️</span> Your feedback is completely anonymous and helps us create a better experience for everyone.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">What Users Say About Feedback</h2>
            <p className="text-gray-600">Your input helps us create a better platform for everyone</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', role: 'Verified Donor', text: 'OpenHands listened to my feedback and implemented exactly what I suggested. Amazing!' },
              { name: 'Rajesh Kumar', role: 'Active Volunteer', text: 'The most responsive team I\'ve dealt with. They truly value every piece of feedback.' },
              { name: 'Aisha Patel', role: 'NGO Partner', text: 'Thanks for creating a platform where my voice matters. Great feedback system!' },
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h6 className="font-bold">{testimonial.name}</h6>
                      <small className="text-gray-500">{testimonial.role}</small>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
