import { Calendar } from 'lucide-react'

interface DOBPickerProps {
  value: string
  onChange: (date: string) => void
  required?: boolean
}

export default function DOBPicker({ value, onChange, required = false }: DOBPickerProps) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  // Parse current value to extract day, month, year
  const [year, month, day] = value ? value.split('-').map(Number) : [0, 0, 0]

  const handleDayChange = (newDay: number) => {
    const newMonth = month || new Date().getMonth() + 1
    const newYear = year || new Date().getFullYear()
    const formattedDate = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`
    onChange(formattedDate)
  }

  const handleMonthChange = (newMonth: number) => {
    const newDay = day || 1
    const newYear = year || new Date().getFullYear()
    const formattedDate = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`
    onChange(formattedDate)
  }

  const handleYearChange = (newYear: number) => {
    const newDay = day || 1
    const newMonth = month || new Date().getMonth() + 1
    const formattedDate = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`
    onChange(formattedDate)
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        <Calendar className="w-4 h-4 inline mr-2" />
        Date of Birth
      </label>
      <div className="grid grid-cols-3 gap-3">
        {/* Day Dropdown */}
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={day || ''}
          onChange={(e) => handleDayChange(Number(e.target.value))}
          required={required}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {String(d).padStart(2, '0')}
            </option>
          ))}
        </select>

        {/* Month Dropdown */}
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={month || ''}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          required={required}
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m.num} value={m.num}>
              {m.name}
            </option>
          ))}
        </select>

        {/* Year Dropdown */}
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={year || ''}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          required={required}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {value && (
        <p className="text-xs text-gray-600 mt-2">
          Selected: {new Date(value).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      )}
    </div>
  )
}
