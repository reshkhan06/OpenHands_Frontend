import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, Mail, Lock, MapPin, Phone, Eye, EyeOff, Heart, UserCircle, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import DOBPicker from '@/components/DOBPicker'
import GeoapifyAddressInput from '@/components/GeoapifyAddressInput'
import type { ParsedAddress } from '@/components/GeoapifyAddressInput'
import { signup } from '@/api/auth'

type SignupRole = 'donor' | 'ngo' | null

export default function Register() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<SignupRole>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    location: '',
    contact: '',
    preferredCause: '',
    terms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match.'
      setError(msg)
      toast.error(msg)
      return
    }
    if (formData.password.length < 6) {
      const msg = 'Password must be at least 6 characters long.'
      setError(msg)
      toast.error(msg)
      return
    }
    if (!formData.terms) {
      const msg = 'You must agree to the Terms & Conditions'
      setError(msg)
      toast.error(msg)
      return
    }

    setIsLoading(true)

    try {
      const response = await signup({
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
        password: formData.password,
        contact_number: formData.contact,
        location: formData.location,
        gender: formData.gender || 'Other',
        role: 'donor',
        dob: formData.dob || undefined,
      })

      localStorage.setItem('registeredEmail', response.email)
      toast.success('Registration successful! Please check your email for verification.')
      navigate('/login')
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Registration failed'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const goBackToRoleSelection = () => {
    setSelectedRole(null)
    setError(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dob: '',
      gender: '',
      location: '',
      contact: '',
      preferredCause: '',
      terms: false,
    })
  }

  // Step 1: Role selection
  if (selectedRole === null) {
    return (
      <div className="pt-16 hero-gradient min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="mb-4 flex justify-center">
                    <Logo size="lg" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Create Account</h4>
                  <p className="text-gray-600">Please select your role to continue</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('donor')}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Heart className="w-7 h-7" />
                    </div>
                    <h5 className="font-bold text-lg mb-2">Donor</h5>
                    <p className="text-sm text-gray-600">
                      Donate items. Request pickups, pay refundable deposit, and track your donations.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ngo')}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <UserCircle className="w-7 h-7" />
                    </div>
                    <h5 className="font-bold text-lg mb-2">NGO</h5>
                    <p className="text-sm text-gray-600">
                      Receive donations. Get your organization verified and accept pickup requests from donors.
                    </p>
                  </button>
                </div>
                <div className="text-center mt-6">
                  <p className="text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                      Login here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // If NGO selected, go to NGO registration page
  if (selectedRole === 'ngo') {
    navigate('/register/ngo')
    return null
  }

  // Step 2: Donor signup form
  return (
    <div className="pt-16 hero-gradient min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <button
                type="button"
                onClick={goBackToRoleSelection}
                className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Change role
              </button>
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <Logo size="lg" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Donor Registration</h4>
                <p className="text-gray-600">Donate items and request pickups. Verify your email to get started.</p>
              </div>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {typeof error === 'string' ? error : 'Registration failed'}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Gender</label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <DOBPicker
                      value={formData.dob}
                      onChange={(date) => setFormData({ ...formData, dob: date })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 overflow-visible">
                  <div className="md:col-span-2 overflow-visible">
                    <label className="block text-sm font-semibold mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location
                    </label>
                    <div className="relative z-[100] overflow-visible">
                      <GeoapifyAddressInput
                        value={formData.location}
                        onChange={(v) => setFormData((prev) => ({ ...prev, location: v }))}
                        onAddressSelect={(parsed: ParsedAddress) => {
                          const full = [parsed.streetAddress, parsed.city, parsed.state, parsed.pincode].filter(Boolean).join(', ')
                          setFormData((prev) => ({ ...prev, location: full }))
                        }}
                        placeholder="Start typing address (city, pincode) — select to auto-fill"
                        required
                        minLength={2}
                        maxLength={300}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter contact number"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Heart className="w-4 h-4 inline mr-2" />
                      Preferred Cause (optional)
                    </label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.preferredCause}
                      onChange={(e) => setFormData({ ...formData, preferredCause: e.target.value })}
                    >
                      <option value="">Select a cause</option>
                      <option value="education">Education</option>
                      <option value="health">Health & Medical</option>
                      <option value="food">Food Security</option>
                      <option value="environment">Environment</option>
                      <option value="children">Children</option>
                      <option value="women">Women Empowerment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    className="mt-1 w-4 h-4"
                    required
                  />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-primary hover:underline">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" target="_blank" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register as Donor'}
                </Button>
              </form>
              <div className="text-center mt-6 space-y-2">
                <p className="text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Login here
                  </Link>
                </p>
                <Link to="/" className="text-sm text-gray-600 hover:underline">
                  Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
