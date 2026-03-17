import { useState, useEffect, useRef, useCallback } from 'react'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 400
const LIMIT = 8

/** Nominatim Search API result (addressdetails=1) */
export interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  place_id: number
  address?: {
    road?: string
    house_number?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}

/** Parsed address from a selected suggestion (street only + city, state, pincode) */
export interface ParsedAddress {
  streetAddress: string
  city: string
  state: string
  pincode: string
}

function fetchSuggestions(query: string): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    addressdetails: '1',
    limit: String(LIMIT),
  })
  // Browsers disallow setting `User-Agent` header; keep headers minimal or proxy via backend.
  return fetch(`${NOMINATIM_URL}?${params}`, { method: 'GET', headers: { 'Accept-Language': 'en' } })
    .then((res) => (res.ok ? res.json() : []))
    .then((data: NominatimResult[] | { error?: string }) => {
      if (Array.isArray(data)) return data
      return []
    })
    .catch(() => [])
}

function getStreetFromAddress(addr: NominatimResult['address']): string {
  if (!addr) return ''
  const road = [addr.road, addr.house_number].filter(Boolean).join(' ').trim()
  return road || ''
}

/** Parse a selected Nominatim result into street, city, state, pincode */
export function parseGeoapifyFeature(result: NominatimResult): ParsedAddress {
  const addr = result.address || {}
  const streetAddress =
    getStreetFromAddress(addr) ||
    result.display_name.split(',')[0]?.trim() ||
    result.display_name
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.suburb ||
    addr.neighbourhood ||
    ''
  return {
    streetAddress,
    city: city.trim(),
    state: (addr.state || '').trim(),
    pincode: (addr.postcode || '').trim(),
  }
}

interface GeoapifyAddressInputProps {
  value: string
  onChange: (streetAddress: string) => void
  onAddressSelect?: (parsed: ParsedAddress) => void
  placeholder?: string
  required?: boolean
  id?: string
  className?: string
  style?: React.CSSProperties
  label?: React.ReactNode
  minLength?: number
  maxLength?: number
  disabled?: boolean
}

export default function GeoapifyAddressInput({
  value,
  onChange,
  onAddressSelect,
  placeholder = 'Start typing street address (city, pincode)',
  required,
  id,
  className = '',
  style,
  label,
  minLength = MIN_QUERY_LENGTH,
  maxLength = 300,
  disabled,
}: GeoapifyAddressInputProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
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

  const handleSelect = (result: NominatimResult) => {
    const parsed = parseGeoapifyFeature(result)
    onChange(parsed.streetAddress)
    onAddressSelect?.(parsed)
    setQuery(parsed.streetAddress)
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
    <div ref={wrapperRef} style={{ position: 'relative', overflow: 'visible' }}>
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
        aria-controls="address-suggestions"
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
          id="address-suggestions"
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.place_id}-${i}`}
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
