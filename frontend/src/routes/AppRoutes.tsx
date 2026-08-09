import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '../components/layout/AuthLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { ProtectedRoute } from './ProtectedRoutes'
import { useAuth } from '../hooks/useAuth'

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { OrganizationPendingPage } from '../pages/auth/OrganizationPendingPage'
import { OrganizationRejectedPage } from '../pages/auth/OrganizationRejectedPage'

// Restaurant Pages
import { RestaurantDashboardPage } from '../pages/restaurant/RestaurantDashboardPage'
import { RestaurantDonationsPage } from '../pages/restaurant/RestaurantDonationsPage'
import { RestaurantReservationsPage } from '../pages/restaurant/RestaurantReservationsPage'

// NGO Pages
import { NgoDashboardPage } from '../pages/ngo/NgoDashboardPage'
import { NgoBrowseDonationsPage } from '../pages/ngo/NgoBrowseDonationsPage'
import { NgoReservationsPage } from '../pages/ngo/NgoReservationsPage'

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminRestaurantsPage } from '../pages/admin/AdminRestaurantsPage'
import { AdminNgosPage } from '../pages/admin/AdminNgosPage'
import { AdminDonationsPage } from '../pages/admin/AdminDonationsPage'
import { AdminReservationsPage } from '../pages/admin/AdminReservationsPage'
import { AdminPendingVerificationsPage } from '../pages/admin/AdminPendingVerificationsPage'

// Fallback Pages
import { UnauthorizedPage } from '../pages/UnauthorizedPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// Public Auth Route Component
const PublicAuthRoute: React.FC = () => {
  const { isAuthenticated, role, organization, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated && role) {
    if (role !== 'ADMIN') {
      if (organization?.verificationStatus === 'REJECTED') {
        return <Navigate to="/verification-rejected" replace />
      }
      if (organization?.verificationStatus === 'PENDING') {
        return <Navigate to="/verification-pending" replace />
      }
    }
    const defaultPath =
      role === 'ADMIN' ? '/admin' : role === 'NGO' ? '/ngo' : '/restaurant'
    return <Navigate to={defaultPath} replace />
  }

  return <AuthLayout />
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth & Landing Routes (/, /login, /register) */}
      <Route element={<PublicAuthRoute />}>
        <Route path="/" element={null} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Dedicated Verification Status Pages */}
      <Route path="/verification-pending" element={<OrganizationPendingPage />} />
      <Route path="/verification-rejected" element={<OrganizationRejectedPage />} />

      {/* Protected Dashboard Routes (/admin, /restaurant, /ngo) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Restaurant Scope */}
          <Route element={<ProtectedRoute allowedRoles={['RESTAURANT', 'ADMIN']} />}>
            <Route path="/restaurant" element={<RestaurantDashboardPage />} />
            <Route path="/restaurant/donations" element={<RestaurantDonationsPage />} />
            <Route path="/restaurant/reservations" element={<RestaurantReservationsPage />} />
          </Route>

          {/* NGO Scope */}
          <Route element={<ProtectedRoute allowedRoles={['NGO', 'ADMIN']} />}>
            <Route path="/ngo" element={<NgoDashboardPage />} />
            <Route path="/ngo/donations" element={<NgoBrowseDonationsPage />} />
            <Route path="/ngo/reservations" element={<NgoReservationsPage />} />
          </Route>

          {/* Admin Scope */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/restaurants" element={<AdminRestaurantsPage />} />
            <Route path="/admin/ngos" element={<AdminNgosPage />} />
            <Route path="/admin/donations" element={<AdminDonationsPage />} />
            <Route path="/admin/reservations" element={<AdminReservationsPage />} />
            <Route path="/admin/verifications" element={<AdminPendingVerificationsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Role Unauthorized Fallback */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
