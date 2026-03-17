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
import { ngoRegisterWithCertificate, type NGORegisterRequest } from '@/api/auth'

export default function RegisterNGO() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof NGORegisterRequest, string>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [certificateError, setCertificateError] = useState<string | null>(null)
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

  const setField = <K extends keyof NGORegisterRequest>(key: K, value: NGORegisterRequest[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setFieldErrors((e) => {
      if (!e[key]) return e
      const next = { ...e }
      delete next[key]
      return next
    })
  }

  const validate = (data: NGORegisterRequest) => {
    const e: Partial<Record<keyof NGORegisterRequest, string>> = {}

    const ngo_name = data.ngo_name.trim()
    if (!ngo_name) e.ngo_name = 'NGO name is required'
    else if (ngo_name.length < 3 || ngo_name.length > 100) e.ngo_name = 'NGO name must be 3–100 characters'
    else if (!/^[A-Za-z\s]+$/.test(ngo_name)) e.ngo_name = 'NGO name must contain only letters and spaces'

    const registration_number = data.registration_number.trim()
    if (!registration_number) e.registration_number = 'Registration number is required'
    else if (registration_number.length < 3 || registration_number.length > 50)
      e.registration_number = 'Registration number must be 3–50 characters'
    else if (!/^[A-Za-z0-9/\-.\s]+$/.test(registration_number))
      e.registration_number = 'Registration number contains invalid characters'

    const email = data.email.trim()
    if (!email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'

    const address = data.address.trim()
    if (!address) e.address = 'Address is required'
    else if (address.length < 5 || address.length > 300) e.address = 'Address must be 5–300 characters'
    else if (!/[A-Za-z]/.test(address)) e.address = 'Address must include at least one letter'

    const city = data.city.trim()
    if (!city) e.city = 'City is required'
    else if (city.length < 2 || city.length > 60) e.city = 'City must be 2–60 characters'
    else if (!/^[A-Za-z\s.\-']+$/.test(city)) e.city = 'City contains invalid characters'

    const state = data.state.trim()
    if (!state) e.state = 'State is required'
    else if (state.length < 2 || state.length > 60) e.state = 'State must be 2–60 characters'
    else if (!/^[A-Za-z\s.\-']+$/.test(state)) e.state = 'State contains invalid characters'

    const pincode = String(data.pincode ?? '').replace(/\D/g, '').slice(0, 6)
    if (!pincode) e.pincode = 'Pincode is required'
    else if (pincode.length !== 6) e.pincode = 'Pincode must be exactly 6 digits'

    const mission_statement = data.mission_statement.trim()
    if (!mission_statement) e.mission_statement = 'Mission statement is required'
    else if (mission_statement.length < 10) e.mission_statement = 'Mission statement must be at least 10 characters'

    const bank_name = data.bank_name.trim()
    if (!bank_name) e.bank_name = 'Bank name is required'
    else if (bank_name.length < 3 || bank_name.length > 80) e.bank_name = 'Bank name must be 3–80 characters'

    const account_number = String(data.account_number ?? '').replace(/\s+/g, '')
    if (!account_number) e.account_number = 'Account number is required'
    else if (!/^\d+$/.test(account_number)) e.account_number = 'Account number must contain only digits'
    else if (account_number.length < 9 || account_number.length > 18)
      e.account_number = 'Account number must be 9–18 digits'

    const ifsc = data.ifsc_code.trim().toUpperCase()
    if (!ifsc) e.ifsc_code = 'IFSC code is required'
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) e.ifsc_code = 'IFSC code format is invalid'

    const password = data.password
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(password)) e.password = 'Password must include 1 uppercase letter'
    else if (!/\d/.test(password)) e.password = 'Password must include 1 digit'

    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setCertificateError(null)

    const ve = validate(form)
    if (Object.keys(ve).length) {
      setFieldErrors(ve)
      setError('Please fix the highlighted fields.')
      return
    }
    if (!certificateFile) {
      setCertificateError('Certificate image is required')
      setError('Please upload your NGO certificate.')
      return
    }
    const allowed = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowed.includes(certificateFile.type)) {
      setCertificateError('Only PNG, JPG/JPEG, or WEBP images are allowed')
      setError('Please upload a valid certificate image.')
      return
    }
    const maxBytes = 5 * 1024 * 1024
    if (certificateFile.size > maxBytes) {
      setCertificateError('Image must be 5MB or smaller')
      setError('Please upload a smaller certificate image.')
      return
    }

    setLoading(true)
    try {
      await ngoRegisterWithCertificate(form, certificateFile)
      toast.success('NGO registered successfully. Your account will be active after verification.')
      navigate('/login')
    } catch (err) {
      const anyErr = err as Error & { fieldErrors?: Partial<Record<keyof NGORegisterRequest, string>> }
      const msg = anyErr instanceof Error ? anyErr.message : 'Registration failed'
      setError(msg)
      if (anyErr?.fieldErrors && Object.keys(anyErr.fieldErrors).length) {
        setFieldErrors(anyErr.fieldErrors)
      }
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'rounded-lg border-gray-300 focus-visible:ring-primary h-11'
  const labelClass = 'flex items-center gap-2 text-sm font-semibold text-gray-700'
  const errorTextClass = 'text-xs text-red-600 mt-1'
  const fieldInputClass = (k: keyof NGORegisterRequest) =>
    `${inputClass} ${fieldErrors[k] ? 'border-red-400 focus-visible:ring-red-400' : ''}`

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
                      className={fieldInputClass('ngo_name')}
                      value={form.ngo_name}
                      onChange={(e) => setField('ngo_name', e.target.value)}
                      placeholder="Organization name"
                    />
                    {fieldErrors.ngo_name && <p className={errorTextClass}>{fieldErrors.ngo_name}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <FileCheck className="w-4 h-4 text-primary" />
                        Registration number *
                      </label>
                      <Input
                        required
                        className={fieldInputClass('registration_number')}
                        value={form.registration_number}
                        onChange={(e) => setField('registration_number', e.target.value)}
                        placeholder="e.g. 12345"
                      />
                      {fieldErrors.registration_number && (
                        <p className={errorTextClass}>{fieldErrors.registration_number}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <Building className="w-4 h-4 text-primary" />
                        Type
                      </label>
                      <select
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        value={form.ngo_type}
                        onChange={(e) => setField('ngo_type', e.target.value)}
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
                      className={fieldInputClass('email')}
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      placeholder="contact@yourngo.org"
                    />
                    {fieldErrors.email && <p className={errorTextClass}>{fieldErrors.email}</p>}
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
                      onChange={(streetAddress) => setField('address', streetAddress)}
                      onAddressSelect={(parsed: ParsedAddress) =>
                        setForm((f) => {
                          const next = {
                            ...f,
                            address: parsed.streetAddress,
                            city: parsed.city,
                            state: parsed.state,
                            pincode: parsed.pincode,
                          }
                          setFieldErrors((prev) => {
                            const cleared = { ...prev }
                            delete cleared.address
                            delete cleared.city
                            delete cleared.state
                            delete cleared.pincode
                            return cleared
                          })
                          return next
                        })
                      }
                      placeholder="Start typing (city, pincode) — select to auto-fill"
                      required
                      maxLength={300}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    />
                    {fieldErrors.address && <p className={errorTextClass}>{fieldErrors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <Building className="w-4 h-4 text-primary" />
                        City *
                      </label>
                      <Input
                        required
                        className={fieldInputClass('city')}
                        value={form.city}
                        onChange={(e) => setField('city', e.target.value)}
                        placeholder="Auto-filled from address"
                      />
                      {fieldErrors.city && <p className={errorTextClass}>{fieldErrors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <MapPin className="w-4 h-4 text-primary" />
                        State *
                      </label>
                      <Input
                        required
                        className={fieldInputClass('state')}
                        value={form.state}
                        onChange={(e) => setField('state', e.target.value)}
                        placeholder="Auto-filled"
                      />
                      {fieldErrors.state && <p className={errorTextClass}>{fieldErrors.state}</p>}
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
                        className={fieldInputClass('pincode')}
                        value={form.pincode}
                        onChange={(e) => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="6 digits"
                      />
                      {fieldErrors.pincode && <p className={errorTextClass}>{fieldErrors.pincode}</p>}
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
                      className={`flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 resize-y ${
                        fieldErrors.mission_statement
                          ? 'border-red-400 focus-visible:ring-red-400'
                          : 'border-gray-300 focus-visible:ring-primary'
                      }`}
                      rows={3}
                      value={form.mission_statement}
                      onChange={(e) => setField('mission_statement', e.target.value)}
                      placeholder="Brief description of your organization's mission"
                    />
                    {fieldErrors.mission_statement && (
                      <p className={errorTextClass}>{fieldErrors.mission_statement}</p>
                    )}
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
                        className={fieldInputClass('bank_name')}
                        value={form.bank_name}
                        onChange={(e) => setField('bank_name', e.target.value)}
                        placeholder="e.g. State Bank of India"
                      />
                      {fieldErrors.bank_name && <p className={errorTextClass}>{fieldErrors.bank_name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>
                        <FileCheck className="w-4 h-4 text-primary" />
                        Account number *
                      </label>
                      <Input
                        required
                        className={fieldInputClass('account_number')}
                        value={form.account_number}
                        onChange={(e) => setField('account_number', e.target.value.replace(/\D/g, '').slice(0, 18))}
                        placeholder="Account number"
                      />
                      {fieldErrors.account_number && (
                        <p className={errorTextClass}>{fieldErrors.account_number}</p>
                      )}
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
                      className={`${fieldInputClass('ifsc_code')} uppercase`}
                      value={form.ifsc_code}
                      onChange={(e) => setField('ifsc_code', e.target.value.toUpperCase().slice(0, 11))}
                      placeholder="e.g. SBIN0001234"
                    />
                    {fieldErrors.ifsc_code && <p className={errorTextClass}>{fieldErrors.ifsc_code}</p>}
                  </div>
                </div>

                {/* Certificate */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b border-gray-200 pb-2">
                    <FileCheck className="w-5 h-5 text-primary" />
                    Certificate upload
                  </h3>
                  <div className="space-y-2">
                    <label className={labelClass}>
                      <FileCheck className="w-4 h-4 text-primary" />
                      NGO certificate image *
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      required
                      className={`block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/15 ${
                        certificateError ? 'text-red-700' : 'text-gray-700'
                      }`}
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null
                        setCertificateFile(f)
                        setCertificateError(null)
                      }}
                    />
                    {certificateError && <p className={errorTextClass}>{certificateError}</p>}
                    {certificateFile && !certificateError && (
                      <p className="text-xs text-gray-600">
                        Selected: <span className="font-medium">{certificateFile.name}</span>
                      </p>
                    )}
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
                        className={`${fieldInputClass('password')} pr-11`}
                        value={form.password}
                        onChange={(e) => setField('password', e.target.value)}
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
                    {fieldErrors.password && <p className={errorTextClass}>{fieldErrors.password}</p>}
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
