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
    
    // Only two types: donor (donate items) and ngo (receive items). user = donor.
    const roleMapping: { [key: string]: string } = {
      'user': 'donor',
      'donor': 'donor',
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
