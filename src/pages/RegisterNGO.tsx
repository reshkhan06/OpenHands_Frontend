import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Logo from '@/components/Logo'
import GeoapifyAddressInput from '@/components/GeoapifyAddressInput'
import type { ParsedAddress } from '@/components/GeoapifyAddressInput'
import { ngoRegister, type NGORegisterRequest } from '@/api/auth'

export default function RegisterNGO() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  return (
    <div className="pt-16 min-h-screen py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Register as NGO</h2>
            <p className="text-gray-600 text-center mb-6">Receive donations from donors. Create an account for your organization.</p>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">NGO Name *</label>
                <input required className="w-full px-4 py-2 border rounded-lg" value={form.ngo_name} onChange={(e) => setForm({ ...form, ngo_name: e.target.value })} placeholder="Organization name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Registration Number *</label>
                  <input required className="w-full px-4 py-2 border rounded-lg" value={form.registration_number} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <select className="w-full px-4 py-2 border rounded-lg" value={form.ngo_type} onChange={(e) => setForm({ ...form, ngo_type: e.target.value })}>
                    <option value="trust">Trust</option>
                    <option value="society">Society</option>
                    <option value="section8">Section 8</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input required type="email" className="w-full px-4 py-2 border rounded-lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <GeoapifyAddressInput
                  label={<span className="block text-sm font-semibold mb-1">Street address *</span>}
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
                  placeholder="Start typing street address (city, pincode) — select to auto-fill below"
                  required
                  maxLength={300}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">City *</label>
                  <input required className="w-full px-4 py-2 border rounded-lg" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Auto-filled from address" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">State *</label>
                  <input required className="w-full px-4 py-2 border rounded-lg" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Auto-filled from address" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Pincode *</label>
                  <input required maxLength={6} pattern="[0-9]{6}" className="w-full px-4 py-2 border rounded-lg" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="Auto-filled" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mission Statement *</label>
                <textarea required minLength={10} className="w-full px-4 py-2 border rounded-lg" rows={3} value={form.mission_statement} onChange={(e) => setForm({ ...form, mission_statement: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Bank Name *</label>
                  <input required className="w-full px-4 py-2 border rounded-lg" value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Account Number *</label>
                  <input required className="w-full px-4 py-2 border rounded-lg" value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">IFSC Code *</label>
                <input required maxLength={11} className="w-full px-4 py-2 border rounded-lg uppercase" value={form.ifsc_code} onChange={(e) => setForm({ ...form, ifsc_code: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Password *</label>
                <input required type="password" minLength={8} className="w-full px-4 py-2 border rounded-lg" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 chars, 1 uppercase, 1 digit" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Registering...' : 'Register NGO'}</Button>
            </form>
            <p className="text-center mt-4 text-sm">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
              {' · '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Register as Donor</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
