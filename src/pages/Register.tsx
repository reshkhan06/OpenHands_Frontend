import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, Mail, Lock, MapPin, Phone, Eye, EyeOff, Heart, Building2, ArrowLeft, CalendarDays, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'
import Logo from '@/components/Logo'
import DOBPicker from '@/components/DOBPicker'
import GeoapifyAddressInput from '@/components/GeoapifyAddressInput'
import type { ParsedAddress } from '@/components/GeoapifyAddressInput'
import { Input } from '@/components/ui/input'
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
    address: '',
    city: '',
    state: '',
    pincode: '',
    contact: '',
    terms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const location = [formData.address, formData.city, formData.state, formData.pincode].filter(Boolean).join(', ')

    const nameRegex = /^[A-Za-z\\s]+$/
    if (!nameRegex.test(formData.firstName.trim())) {
      const msg = 'First name must contain only letters and spaces.'
      setError(msg)
      toast.error(msg)
      return
    }
    if (!nameRegex.test(formData.lastName.trim())) {
      const msg = 'Last name must contain only letters and spaces.'
      setError(msg)
      toast.error(msg)
      return
    }

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
        location,
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
      address: '',
      city: '',
      state: '',
      pincode: '',
      contact: '',
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
                  <div className="inline-flex items-center gap-2 text-primary/90 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">Join OpenHands</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Create your account</h4>
                  <p className="text-gray-600">Choose how you want to participate</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('donor')}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/80 transition-all text-left group shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Heart className="w-7 h-7" />
                    </div>
                    <h5 className="font-bold text-lg mb-2 text-gray-900">I'm a Donor</h5>
                    <p className="text-sm text-gray-600">
                      Donate items, request pickups, and track your donations. Quick signup, verified impact.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ngo')}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left group shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <h5 className="font-bold text-lg mb-2 text-gray-900">I'm an NGO</h5>
                    <p className="text-sm text-gray-600">
                      Receive donations. Get verified and accept pickup requests from donors.
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
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" aria-hidden />
                  <span>{typeof error === 'string' ? error : 'Registration failed'}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-primary" />
                      First name
                    </label>
                    <Input
                      type="text"
                      className="rounded-lg border-gray-300 focus-visible:ring-primary h-11"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-primary" />
                      Last name
                    </label>
                    <Input
                      type="text"
                      className="rounded-lg border-gray-300 focus-visible:ring-primary h-11"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </label>
                  <Input
                    type="email"
                    className="rounded-lg border-gray-300 focus-visible:ring-primary h-11"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Lock className="w-4 h-4 text-primary" />
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="rounded-lg border-gray-300 focus-visible:ring-primary h-11 pr-11"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Lock className="w-4 h-4 text-primary" />
                      Confirm password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="rounded-lg border-gray-300 focus-visible:ring-primary h-11 pr-11"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-primary" />
                      Gender
                    </label>
                    <select
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-gray-300"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      required
                    >
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      Date of birth
                    </label>
                    <DOBPicker
                      value={formData.dob}
                      onChange={(date) => setFormData({ ...formData, dob: date })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 overflow-visible">
                  <div className="md:col-span-2 overflow-visible space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4 text-primary" />
                      Street address
                    </label>
                    <div className="relative z-[100] overflow-visible">
                      <GeoapifyAddressInput
                        value={formData.address}
                        onChange={(v) => setFormData((prev) => ({ ...prev, address: v }))}
                        onAddressSelect={(parsed: ParsedAddress) => {
                          setFormData((prev) => ({
                            ...prev,
                            address: parsed.streetAddress,
                            city: parsed.city,
                            state: parsed.state,
                            pincode: parsed.pincode,
                          }))
                        }}
                        placeholder="Start typing address (city, pincode) — select to auto-fill"
                        required
                        minLength={2}
                        maxLength={300}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Building2 className="w-4 h-4 text-primary" />
                      City
                    </label>
                    <Input
                      type="text"
                      className="rounded-lg border-gray-300 focus-visible:ring-primary h-11"
                      placeholder="Auto-filled from address"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4 text-primary" />
                      State
                    </label>
                    <Input
                      type="text"
                      className="rounded-lg border-gray-300 focus-visible:ring-primary h-11"
                      placeholder="Auto-filled from address"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4 text-primary" />
                      Pincode
                    </label>
                    <Input
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      className="rounded-lg border-gray-300 focus-visible:ring-primary h-11"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value.replace(/\\D/g, '').slice(0, 6) })
                      }
                      placeholder="6 digits"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Phone className="w-4 h-4 text-primary" />
                      Contact number
                    </label>
                    <Input
                      type="tel"
                      className="rounded-lg border-gray-300 focus-visible:ring-primary h-11"
                      placeholder="10-digit mobile"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    <span>
                      I agree to the{' '}
                      <Link to="/terms" target="_blank" className="text-primary hover:underline font-medium">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" target="_blank" className="text-primary hover:underline font-medium">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>
                <Button type="submit" className="w-full h-11 text-base font-semibold" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating account…' : 'Create donor account'}
                </Button>
              </form>
              <div className="text-center mt-6 space-y-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                    Login here
                  </Link>
                </p>
                <Link to="/" className="text-sm text-gray-500 hover:text-primary hover:underline inline-flex items-center gap-1 justify-center">
                  <ArrowLeft className="w-4 h-4" />
                  Back to home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
