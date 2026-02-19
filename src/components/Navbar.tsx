import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Menu, X, ChevronDown } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDonateExpanded, setIsDonateExpanded] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) setIsDonateExpanded(false)
  }, [isMobileMenuOpen])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all ${
      isScrolled ? 'py-2 backdrop-blur-md bg-white/95' : 'py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}
            >
              About
            </Link>
            
            {/* Donate Dropdown */}
            <div className="relative group">
              <button className="nav-link text-gray-700 hover:text-primary flex items-center gap-1">
                Donate <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <h6 className="font-semibold mb-2 text-primary">Donation Types</h6>
                <Link to="/donate" className="block py-2 text-gray-700 hover:text-primary">Food</Link>
                <Link to="/donate" className="block py-2 text-gray-700 hover:text-primary">Clothes</Link>
                <Link to="/donate" className="block py-2 text-gray-700 hover:text-primary">Books</Link>
                <hr className="my-3" />
                <Link to="/register">
                  <Button className="w-full" size="sm">Start Donation</Button>
                </Link>
              </div>
            </div>

            <Link
              to="/ngos"
              className={`nav-link ${isActive('/ngos') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}
            >
              NGOs
            </Link>
            <Link
              to="/feedback"
              className={`nav-link ${isActive('/feedback') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}
            >
              Feedback
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${isActive('/contact') ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'}`}
            >
              Contact
            </Link>

            {/* Login Dropdown */}
            <div className="relative group">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                Login / Register <ChevronDown className="w-4 h-4" />
              </Button>
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <h6 className="font-semibold mb-3">User Access</h6>
                <Link to="/login" className="block mb-2">
                  <Button className="w-full mb-2">Login</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button variant="outline" className="w-full">Create Account</Button>
                </Link>
                <hr className="my-3" />
                <p className="text-xs text-gray-500">Admins & NGOs have separate access</p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white w-80 max-w-[90vw] h-[calc(100vh-4rem)] ml-auto overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b flex justify-between items-center">
                <h5 className="text-primary font-semibold">Menu</h5>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  to="/"
                  className="block py-3 px-4 rounded hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block py-3 px-4 rounded hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                {/* Donate dropdown (mobile) */}
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => setIsDonateExpanded(!isDonateExpanded)}
                    className="flex items-center justify-between w-full py-3 px-4 rounded hover:bg-gray-100 text-left font-medium"
                  >
                    Donate
                    <ChevronDown className={`w-5 h-5 transition-transform ${isDonateExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isDonateExpanded && (
                    <div className="pl-4 pb-2 space-y-1">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider px-4 py-1">Donation Types</p>
                      <Link to="/donate" className="block py-2 px-4 rounded hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Food</Link>
                      <Link to="/donate" className="block py-2 px-4 rounded hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Clothes</Link>
                      <Link to="/donate" className="block py-2 px-4 rounded hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Books</Link>
                      <div className="pt-2">
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full" size="sm">Start Donation</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/ngos"
                  className="block py-3 px-4 rounded hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  NGOs
                </Link>
                <Link
                  to="/feedback"
                  className="block py-3 px-4 rounded hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Feedback
                </Link>
                <Link
                  to="/contact"
                  className="block py-3 px-4 rounded hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-4 border-t">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full mb-2">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Create Account</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
