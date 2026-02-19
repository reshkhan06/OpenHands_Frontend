import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Logo from '@/components/Logo'
import { login } from '@/api/auth'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Call login API
      const response = await login({
        email: formData.email,
        password: formData.password,
      })

      // Store token in localStorage
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('token_type', response.token_type)

      // Store user info if available
      let userRole = 'user' // default role
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        // Determine user role from response
        userRole = response.user.role || response.user.user_type || 'user'
      }

      // Store remember me preference
      if (formData.remember) {
        localStorage.setItem('rememberEmail', formData.email)
      }

      // Show success message
      // alert('Login successful!')

      // Navigate to appropriate dashboard based on user role
      if (userRole === 'admin') {
        navigate('/dashboard/admin')
      } else if (userRole === 'ngo') {
        navigate('/dashboard/ngo')
      } else {
        navigate('/dashboard/user')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div className="hidden lg:block">
            <img
              src="/pic1.jpeg"
              alt="Login illustration"
              className="w-full rounded-2xl shadow-xl max-h-[500px] object-cover"
              onError={(e) => {
                const target = e.currentTarget
                if (!target.src.endsWith('photo-1559027615')) target.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
              }}
            />
          </div>
          <div>
            <Card className="border-0 shadow-xl">
              <CardHeader className="hero-gradient text-white text-center py-8">
                <div className="mb-4 flex justify-center">
                  <Logo className="text-white" size="lg" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="opacity-90">Sign in to your account to continue</p>
              </CardHeader>
              <CardContent className="p-8">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Mail className="w-4 h-4 inline mr-2 text-primary" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      <Lock className="w-4 h-4 inline mr-2 text-primary" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.remember}
                        onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Remember me</span>
                    </label>
                    <Link to="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
                <div className="text-center mt-6 space-y-2">
                  <p className="text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-semibold hover:underline">
                      Create Account
                    </Link>
                  </p>
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      ← Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
