import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from './ui/button'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 shadow-lg z-50"
      size="icon"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}
