import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Logo from '@/components/Logo'
import GeoapifyAddressInput from '@/components/GeoapifyAddressInput'
import type { ParsedAddress } from '@/components/GeoapifyAddressInput'
import {
  Building2,
  FileCheck,
  Mail,
  MapPin,
  Building,
  FileText,
  Landmark,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { ngoRegister, type NGORegisterRequest } from '@/api/auth'

export default function RegisterNGO() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState<NGORegisterRequest>({
    ngo_name: '',
    registration_number: '',
    ngo_type: 'trust',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    mission_statement: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await ngoRegister(form)
      toast.success('NGO registered successfully. Your account will be active after verification.')
      navigate('/login')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'rounded-lg border-gray-300 focus-visible:ring-primary h-11'
  const labelClass = 'flex items-center gap-2 text-sm font-semibold text-gray-700'

  return (
    <div className="pt-16 hero-gradient min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Change to donor registration
              </Link>
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <Logo size="lg" />
                </div>
                <div className="inline-flex items-center gap-2 text-primary/90 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">NGO registration</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Register your organization</h2>
                <p className="text-gray-600">
                  Receive donations from donors. Create an account for your organization—verification required.
                </p>
              </div>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" aria-hidden />
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization details */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b border-gray-200 pb-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Organization details
                  </h3>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Building2 className="w-4 h-4 text-primary" />
                      NGO name *
                    </label>
                    <Input
                      required
                      className={inputClass}
                      value={form.ngo_name}
                      onChange={(e) => setForm({ ...form, ngo_name: e.target.value })}
                      placeholder="Organization name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <FileCheck className="w-4 h-4 text-primary" />
                        Registration number *
                      </label>
                      <Input
                        required
                        className={inputClass}
                        value={form.registration_number}
                        onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                        placeholder="e.g. 12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <Building className="w-4 h-4 text-primary" />
                        Type
                      </label>
                      <select
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        value={form.ngo_type}
                        onChange={(e) => setForm({ ...form, ngo_type: e.target.value })}
                      >
                        <option value="trust">Trust</option>
                        <option value="society">Society</option>
                        <option value="section8">Section 8</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Mail className="w-4 h-4 text-primary" />
                      Email *
                    </label>
                    <Input
                      required
                      type="email"
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="contact@yourngo.org"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b border-gray-200 pb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Address
                  </h3>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <MapPin className="w-4 h-4 text-primary" />
                      Street address *
                    </label>
                    <GeoapifyAddressInput
                      value={form.address}
                      onChange={(streetAddress) => setForm((f) => ({ ...f, address: streetAddress }))}
                      onAddressSelect={(parsed: ParsedAddress) =>
                        setForm((f) => ({
                          ...f,
                          address: parsed.streetAddress,
                          city: parsed.city,
                          state: parsed.state,
                          pincode: parsed.pincode,
                        }))
                      }
                      placeholder="Start typing (city, pincode) — select to auto-fill"
                      required
                      maxLength={300}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <Building className="w-4 h-4 text-primary" />
                        City *
                      </label>
                      <Input
                        required
                        className={inputClass}
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Auto-filled from address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <MapPin className="w-4 h-4 text-primary" />
                        State *
                      </label>
                      <Input
                        required
                        className={inputClass}
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        placeholder="Auto-filled"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <MapPin className="w-4 h-4 text-primary" />
                        Pincode *
                      </label>
                      <Input
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                        className={inputClass}
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        placeholder="6 digits"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <FileText className="w-4 h-4 text-primary" />
                      Mission statement *
                    </label>
                    <textarea
                      required
                      minLength={10}
                      className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-y"
                      rows={3}
                      value={form.mission_statement}
                      onChange={(e) => setForm({ ...form, mission_statement: e.target.value })}
                      placeholder="Brief description of your organization's mission"
                    />
                  </div>
                </div>

                {/* Banking */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b border-gray-200 pb-2">
                    <Landmark className="w-5 h-5 text-primary" />
                    Banking details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <Landmark className="w-4 h-4 text-primary" />
                        Bank name *
                      </label>
                      <Input
                        required
                        className={inputClass}
                        value={form.bank_name}
                        onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                        placeholder="e.g. State Bank of India"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <FileCheck className="w-4 h-4 text-primary" />
                        Account number *
                      </label>
                      <Input
                        required
                        className={inputClass}
                        value={form.account_number}
                        onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                        placeholder="Account number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Landmark className="w-4 h-4 text-primary" />
                      IFSC code *
                    </label>
                    <Input
                      required
                      maxLength={11}
                      className={`${inputClass} uppercase`}
                      value={form.ifsc_code}
                      onChange={(e) => setForm({ ...form, ifsc_code: e.target.value.toUpperCase().slice(0, 11) })}
                      placeholder="e.g. SBIN0001234"
                    />
                  </div>
                </div>

                {/* Account password */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b border-gray-200 pb-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Account password
                  </h3>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <Lock className="w-4 h-4 text-primary" />
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type={showPassword ? 'text' : 'password'}
                        minLength={8}
                        className={`${inputClass} pr-11`}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Min 8 characters, 1 uppercase, 1 digit"
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
                </div>

                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                  {loading ? 'Registering…' : 'Create NGO account'}
                </Button>
              </form>
              <div className="text-center mt-6 space-y-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Login
                  </Link>
                  {' · '}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Register as donor
                  </Link>
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to role selection
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
