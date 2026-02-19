import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getAuthToken, getUserRole, isAuthenticated, clearAuthData } from '@/api/auth'

export function useAuth() {
  const navigate = useNavigate()

  const logout = useCallback(() => {
    clearAuthData()
    navigate('/', { replace: true })
  }, [navigate])

  const redirectToDashboard = useCallback(() => {
    const role = getUserRole()
    
    const roleMapping: { [key: string]: string } = {
      'donor': '/dashboard/user',
      'user': '/dashboard/user',
      'ngo_representative': '/dashboard/ngo',
      'ngo': '/dashboard/ngo',
      'admin': '/dashboard/admin',
    }

    const dashboardUrl = roleMapping[role || ''] || '/dashboard/user'
    navigate(dashboardUrl, { replace: true })
  }, [navigate])

  return {
    user: getCurrentUser(),
    token: getAuthToken(),
    role: getUserRole(),
    isAuthenticated: isAuthenticated(),
    logout,
    redirectToDashboard,
  }
}
