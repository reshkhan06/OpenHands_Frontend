import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  // Check if className contains text-white for dark backgrounds
  const isDark = className.includes('text-white')
  const textColor = isDark ? 'text-white' : 'text-primary'

  return (
    <Link to="/" className={`flex items-center gap-2 font-bold ${textColor} ${className}`}>
      {/* Try to load logo.jpeg, fallback to SVG, then to icon */}
      <div className="relative">
        <img
          src="/uploads/logo.jpeg"
          alt="OpenHands Logo"
          className={`${sizeClasses[size]} object-contain`}
          onError={(e) => {
            // Fallback to SVG if JPEG fails
            const target = e.target as HTMLImageElement
            target.src = '/uploads/openhands-logo.svg'
            target.onerror = () => {
              // Final fallback: hide image and show icon
              target.style.display = 'none'
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) fallback.classList.remove('hidden')
            }
          }}
        />
        {/* Fallback icon (hidden by default, shown if images fail) */}
        <div className={`${sizeClasses[size]} hidden items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-primary/10'}`}>
          <Heart className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} ${isDark ? 'text-white fill-white' : 'text-primary fill-primary'}`} />
        </div>
      </div>
      {showText && (
        <span className={textSizes[size]}>OpenHands</span>
      )}
    </Link>
  )
}
