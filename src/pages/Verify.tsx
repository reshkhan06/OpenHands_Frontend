import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import Logo from '@/components/Logo'
import { verifyEmail } from '@/api/auth'

export default function Verify() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        setMessage('No verification token provided.')
        return
      }

      try {
        const response = await verifyEmail(token)
        setStatus('success')
        setMessage(response.message || 'Email verified successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (err) {
        setStatus('error')
        const errorMessage = err instanceof Error ? err.message : 'Verification failed'
        setMessage(errorMessage)
        console.error('Verification error:', err)
      }
    }

    verifyToken()
  }, [searchParams, navigate])

  return (
    <div className="pt-16 hero-gradient min-h-screen py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <Logo size="lg" />
              </div>

              {status === 'loading' && (
                <>
                  <Loader className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                  <h2 className="text-2xl font-bold mb-2">Verifying Email</h2>
                  <p className="text-gray-600">Please wait while we verify your email address...</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2 text-green-700">Email Verified!</h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                  <p className="text-sm text-gray-500 mb-4">Redirecting to login in 3 seconds...</p>
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Go to Login
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2 text-red-700">Verification Failed</h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                  <div className="space-y-2">
                    <Button onClick={() => navigate('/login')} className="w-full">
                      Go to Login
                    </Button>
                    <Button onClick={() => navigate('/register')} variant="outline" className="w-full">
                      Register Again
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
