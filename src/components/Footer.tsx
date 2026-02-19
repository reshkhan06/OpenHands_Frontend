import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="footer-gradient text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo className="text-white" size="md" />
            </div>
            <p className="text-white/75 mb-4">Verified NGOs. Transparent donations.</p>
            <div className="mt-4">
              <p className="text-white/75 text-sm font-bold mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a href="#" className="text-white/75 hover:text-white transition text-xl">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/75 hover:text-white transition text-xl">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/75 hover:text-white transition text-xl">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/75 hover:text-white transition text-xl">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="font-bold mb-3">Quick Links</h6>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/75 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/75 hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link to="/ngos" className="text-white/75 hover:text-white transition">Our NGOs</Link>
              </li>
              <li>
                <Link to="/donate" className="text-white/75 hover:text-white transition">Make a Donation</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h6 className="font-bold mb-3">Support</h6>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-white/75 hover:text-white transition">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/75 hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/75 hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link to="/feedback" className="text-white/75 hover:text-white transition">Feedback</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h6 className="font-bold mb-3">Newsletter</h6>
            <p className="text-white/75 text-sm mb-4">
              Subscribe to get updates on our latest campaigns and impact stories.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/30 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-primary rounded font-semibold hover:bg-white/90 transition text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/75">
          <p>© 2024 OpenHands. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Empowering communities through transparent giving</p>
        </div>
      </div>
    </footer>
  )
}
