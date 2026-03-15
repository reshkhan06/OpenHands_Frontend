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
  const isDonateActive = location.pathname === '/donate'
  const navLink = (active: boolean) =>
    `nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-primary text-white shadow-sm'
        : 'text-slate-700 hover:bg-primary/10 hover:text-primary'
    }`
  const navDropdown = (active: boolean) =>
    `nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
      active ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'
    }`

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/98 shadow-sm border-b border-slate-200/80 transition-all ${
      isScrolled ? 'py-2 backdrop-blur-md' : 'py-3'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={navLink(isActive('/'))}>
              Home
            </Link>
            <Link to="/about" className={navLink(isActive('/about'))}>
              About
            </Link>
            {/* Donate Dropdown */}
            <div className="relative group">
              <button className={navDropdown(isDonateActive)}>
                Donate <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <h6 className="font-semibold mb-2 text-primary">Donation Types</h6>
                <Link to="/donate" className="block py-2 px-2 rounded-lg text-slate-700 hover:bg-primary/10 hover:text-primary transition">Food</Link>
                <Link to="/donate" className="block py-2 px-2 rounded-lg text-slate-700 hover:bg-primary/10 hover:text-primary transition">Clothes</Link>
                <Link to="/donate" className="block py-2 px-2 rounded-lg text-slate-700 hover:bg-primary/10 hover:text-primary transition">Books</Link>
                <hr className="my-3 border-slate-200" />
                <Link to="/register">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="sm">Start Donation</Button>
                </Link>
              </div>
            </div>
            <Link to="/ngos" className={navLink(isActive('/ngos'))}>
              NGOs
            </Link>
            <Link to="/feedback" className={navLink(isActive('/feedback'))}>
              Feedback
            </Link>
            <Link to="/contact" className={navLink(isActive('/contact'))}>
              Contact
            </Link>
            {/* Login Dropdown */}
            <div className="relative group ml-2">
              <Button size="sm" className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90">
                Login / Register <ChevronDown className="w-4 h-4" />
              </Button>
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <h6 className="font-semibold mb-3 text-slate-800">User Access</h6>
                <Link to="/login" className="block mb-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 mb-2">Login</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">Create Account</Button>
                </Link>
                <hr className="my-3 border-slate-200" />
                <p className="text-xs text-slate-500">Admins & NGOs have separate access</p>
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
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h5 className="text-primary font-semibold">Menu</h5>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-200">
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                <Link
                  to="/"
                  className={`block py-3 px-4 rounded-lg font-medium transition ${isActive('/') ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`block py-3 px-4 rounded-lg font-medium transition ${isActive('/about') ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => setIsDonateExpanded(!isDonateExpanded)}
                    className={`flex items-center justify-between w-full py-3 px-4 rounded-lg font-medium transition ${isDonateActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
                  >
                    Donate
                    <ChevronDown className={`w-5 h-5 transition-transform ${isDonateExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isDonateExpanded && (
                    <div className="pl-4 pb-2 space-y-1 mt-1">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider px-4 py-1">Donation Types</p>
                      <Link to="/donate" className="block py-2 px-4 rounded-lg text-slate-700 hover:bg-primary/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Food</Link>
                      <Link to="/donate" className="block py-2 px-4 rounded-lg text-slate-700 hover:bg-primary/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Clothes</Link>
                      <Link to="/donate" className="block py-2 px-4 rounded-lg text-slate-700 hover:bg-primary/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Books</Link>
                      <div className="pt-2">
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full bg-primary hover:bg-primary/90" size="sm">Start Donation</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/ngos"
                  className={`block py-3 px-4 rounded-lg font-medium transition ${isActive('/ngos') ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  NGOs
                </Link>
                <Link
                  to="/feedback"
                  className={`block py-3 px-4 rounded-lg font-medium transition ${isActive('/feedback') ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Feedback
                </Link>
                <Link
                  to="/contact"
                  className={`block py-3 px-4 rounded-lg font-medium transition ${isActive('/contact') ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">Create Account</Button>
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
