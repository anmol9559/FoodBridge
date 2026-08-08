import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../types'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role, organization, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <p className="text-xs font-medium">Validating authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Redirect unverified non-admin organizations
  if (role !== 'ADMIN') {
    if (organization?.verificationStatus === 'REJECTED') {
      return <Navigate to="/verification-rejected" replace />
    }
    if (organization?.verificationStatus === 'PENDING') {
      return <Navigate to="/verification-pending" replace />
    }
  }

  return <Outlet />
}
