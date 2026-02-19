import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface PreferencesData {
  emailNotifications: boolean
  smsUpdates: boolean
  newsletter: boolean
}

interface PreferencesFormProps {
  onSave?: (data: PreferencesData) => void
}

export default function PreferencesForm({ onSave }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<PreferencesData>({
    emailNotifications: true,
    smsUpdates: false,
    newsletter: true,
  })

  const handleToggle = (key: keyof PreferencesData) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    onSave?.(preferences)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="bi bi-gear text-blue-600"></i>
          Notification Preferences
        </CardTitle>
        <CardDescription>Control how you receive updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Notifications */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
          <div className="space-y-1">
            <Label className="font-medium text-slate-700 cursor-pointer">
              Email Notifications
            </Label>
            <p className="text-sm text-slate-500">Receive email updates about donations and campaigns</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* SMS Updates */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
          <div className="space-y-1">
            <Label className="font-medium text-slate-700 cursor-pointer">
              SMS Updates
            </Label>
            <p className="text-sm text-slate-500">Get text messages for urgent updates</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.smsUpdates}
              onChange={() => handleToggle('smsUpdates')}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
          <div className="space-y-1">
            <Label className="font-medium text-slate-700 cursor-pointer">
              Weekly Newsletter
            </Label>
            <p className="text-sm text-slate-500">Subscribe to our weekly donation summary</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.newsletter}
              onChange={() => handleToggle('newsletter')}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-200">
          <Button
            onClick={handleSave}
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <i className="bi bi-check"></i>
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
