import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, Mail, MessageSquare, Tag, Star, Send, Info, CheckSquare, Quote } from 'lucide-react'

const RATING_LABELS: Record<string, string> = {
  '1': 'Poor',
  '2': 'Fair',
  '3': 'Good',
  '4': 'Very good',
  '5': 'Excellent',
}

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
    toast.success('Thank you for your feedback! We appreciate your input.')
    setFormData({ name: '', email: '', category: '', message: '', rating: '5', followUp: true })
  }

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow'

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="hero-gradient text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-white/80 font-medium text-sm uppercase tracking-widest">Feedback</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Share your feedback</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Your input helps us improve OpenHands for everyone. Tell us what’s working and what we can do better.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-20 max-w-3xl pb-20">
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
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
                  <Tag className="w-4 h-4 inline mr-2 text-primary" />
                  Category
                </label>
                <select
                  className={inputClass}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category...</option>
                  <option>Bug report</option>
                  <option>Feature request</option>
                  <option>User experience</option>
                  <option>Performance</option>
                  <option>General feedback</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2 text-primary" />
                  Your message
                </label>
                <textarea
                  rows={5}
                  className={inputClass + ' resize-none'}
                  placeholder="Share your feedback, suggestions, or concerns..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Star className="w-4 h-4 inline mr-2 text-amber-500" />
                  How would you rate your experience?
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating.toString()}
                        checked={formData.rating === rating.toString()}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        className="sr-only"
                      />
                      <span className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors ${
                        formData.rating === rating.toString()
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/40 hover:bg-primary/5'
                      }`}>
                        <Star
                          className={`w-5 h-5 ${
                            parseInt(formData.rating) >= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {rating} — {RATING_LABELS[rating.toString()]}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-gray-50/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.followUp}
                  onChange={(e) => setFormData({ ...formData, followUp: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  <CheckSquare className="w-4 h-4 inline mr-2 text-primary align-middle" />
                  I’d like to be contacted about my feedback
                </span>
              </label>

              <Button type="submit" className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Submit feedback
              </Button>
            </form>

            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Your feedback is anonymous and helps us build a better experience for everyone. We read every submission.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Quote className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">What others say</h2>
              <p className="text-sm text-gray-600">Your voice helps shape the platform</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                role: 'Verified donor',
                text: 'OpenHands listened to my feedback and implemented exactly what I suggested. Amazing!',
              },
              {
                name: 'Rajesh Kumar',
                role: 'Active volunteer',
                text: "The most responsive team I've dealt with. They truly value every piece of feedback.",
              },
              {
                name: 'Aisha Patel',
                role: 'NGO partner',
                text: 'Thanks for creating a platform where my voice matters. Great feedback system!',
              },
            ].map((t, idx) => (
              <Card key={idx} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
