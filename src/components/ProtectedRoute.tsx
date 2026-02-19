import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated, getUserRole } from '@/api/auth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Check if specific role is required
  if (requiredRole) {
    const userRole = getUserRole()
    
    // Map user roles to dashboard roles
    const roleMapping: { [key: string]: string } = {
      'donor': 'user',
      'user': 'user',
      'ngo_representative': 'ngo',
      'ngo': 'ngo',
      'admin': 'admin',
    }

    const mappedUserRole = roleMapping[userRole || ''] || userRole

    if (mappedUserRole !== requiredRole) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
