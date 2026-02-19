import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileFormProps {
  onSave?: (data: ProfileData) => void
}

export interface ProfileData {
  name: string
  email: string
  phone: string
}

export default function ProfileForm({ onSave }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
  })

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
    // Reset to original values
    setFormData({
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="bi bi-person-badge text-blue-600"></i>
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
              <i className="bi bi-pencil"></i>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              >
                <i className="bi bi-check"></i>
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 gap-2"
              >
                <i className="bi bi-x"></i>
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
