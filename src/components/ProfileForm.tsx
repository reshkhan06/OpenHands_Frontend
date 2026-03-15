import { useState, useEffect } from 'react'
import { UserCircle, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileFormProps {
  onSave?: (data: ProfileData) => void
  initialData?: ProfileData | null
}

export interface ProfileData {
  name: string
  email: string
  phone: string
  location?: string
}

export default function ProfileForm({ onSave, initialData }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileData>({
    name: initialData?.name ?? 'John Doe',
    email: initialData?.email ?? 'john.doe@email.com',
    phone: initialData?.phone ?? '+91 98765 43210',
  })

  // Sync when initialData loads or changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: (initialData.name ?? '').trim() || '—',
        email: initialData.email ?? '—',
        phone: initialData.phone != null ? String(initialData.phone) : '—',
      })
    }
  }, [initialData?.name, initialData?.email, initialData?.phone])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    onSave?.(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (initialData) {
      setFormData({
        name: initialData.name ?? '—',
        email: initialData.email ?? '—',
        phone: initialData.phone ?? '—',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="text-blue-600" size={22} />
          Personal Information
        </CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium text-slate-700">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`h-10 ${
              isEditing
                ? 'border-blue-600 focus:ring-blue-500'
                : 'bg-slate-50 disabled:opacity-75'
            }`}
            placeholder="Enter your full name"
          />
          <p className="text-xs text-slate-500">Your display name across the platform</p>
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email" className="font-medium text-slate-700">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`h-10 ${
              isEditing
                ? 'border-blue-600 focus:ring-blue-500'
                : 'bg-slate-50 disabled:opacity-75'
            }`}
            placeholder="Enter your email address"
          />
          <p className="text-xs text-slate-500">Used for notifications and account recovery</p>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="font-medium text-slate-700">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={`h-10 ${
              isEditing
                ? 'border-blue-600 focus:ring-blue-500'
                : 'bg-slate-50 disabled:opacity-75'
            }`}
            placeholder="Enter your phone number"
          />
          <p className="text-xs text-slate-500">Include country code for international numbers</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full gap-2"
            >
              <Pencil size={18} />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              >
                <Check size={18} />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 gap-2"
              >
                <X size={18} />
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
