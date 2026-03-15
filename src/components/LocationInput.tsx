import { useState, useEffect, useRef, useCallback } from 'react'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'OpenHandsDonation/1.0 (contact@openhands.example.com)'
const MIN_QUERY_LENGTH = 3
const DEBOUNCE_MS = 400

export interface LocationSuggestion {
  display_name: string
  lat: string
  lon: string
  address?: Record<string, string>
}

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  id?: string
  className?: string
  style?: React.CSSProperties
  /** Label text (optional) */
  label?: React.ReactNode
  /** Minimum length before showing suggestions (default 3) */
  minLength?: number
  /** Max length for validation hint */
  maxLength?: number
  disabled?: boolean
}

function fetchSuggestions(query: string): Promise<LocationSuggestion[]> {
  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    addressdetails: '1',
    limit: '6',
  })
  return fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'Accept-Language': 'en', 'User-Agent': USER_AGENT },
  })
    .then((res) => res.json())
    .then((data: LocationSuggestion[]) => data || [])
    .catch(() => [])
}

export default function LocationInput({
  value,
  onChange,
  placeholder = 'Start typing to search for a location or address',
  required,
  id,
  className = '',
  style,
  label,
  minLength = MIN_QUERY_LENGTH,
  maxLength = 500,
  disabled,
}: LocationInputProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(0)

  const syncValueToQuery = useCallback((v: string) => {
    setQuery(v)
    if (!v) setSuggestions([])
  }, [])

  useEffect(() => {
    syncValueToQuery(value)
  }, [value, syncValueToQuery])

  useEffect(() => {
    if (query.length < minLength) {
      setSuggestions([])
      setOpen(false)
      return
    }
    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query).then((results) => {
        setSuggestions(results)
        setOpen(results.length > 0)
        setHighlightIndex(-1)
        setLoading(false)
      })
    }, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, minLength])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (s: LocationSuggestion) => {
    const name = s.display_name || ''
    onChange(name)
    setQuery(name)
    setSuggestions([])
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    onChange(v)
    if (v.length < minLength) setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Escape') setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && highlightIndex >= 0 && suggestions[highlightIndex]) {
      e.preventDefault()
      handleSelect(suggestions[highlightIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setHighlightIndex(-1)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    ...style,
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => query.length >= minLength && suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls="location-suggestions"
        className={className}
        style={inputStyle}
      />
      {loading && query.length >= minLength && (
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#6b7280' }}>
          Searching...
        </span>
      )}
      {open && suggestions.length > 0 && (
        <ul
          id="location-suggestions"
          role="listbox"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            margin: 0,
            marginTop: 4,
            padding: 0,
            listStyle: 'none',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 50,
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.lat}-${s.lon}-${i}`}
              role="option"
              aria-selected={i === highlightIndex}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                borderBottom: i < suggestions.length - 1 ? '1px solid #f3f4f6' : undefined,
                background: i === highlightIndex ? '#eff6ff' : undefined,
                color: i === highlightIndex ? '#1e40af' : '#111827',
              }}
              onMouseEnter={() => setHighlightIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(s)
              }}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
      {maxLength && value.length > maxLength * 0.8 && (
        <span style={{ fontSize: '0.75rem', color: value.length >= maxLength ? '#b91c1c' : '#6b7280', marginTop: 4, display: 'block' }}>
          {value.length}/{maxLength} characters
        </span>
      )}
    </div>
  )
}
