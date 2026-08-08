import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '../components/layout/AuthLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { ProtectedRoute } from './ProtectedRoutes'
import { useAuth } from '../store/authStore'

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'

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

// Fallback Pages
import { UnauthorizedPage } from '../pages/UnauthorizedPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const AppRoutes: React.FC = () => {
  const { role } = useAuth()

  const getDefaultRedirect = () => {
    switch (role) {
      case 'ADMIN':
        return '/admin'
      case 'NGO':
        return '/ngo'
      case 'RESTAURANT':
      default:
        return '/restaurant'
    }
  }

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
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
          </Route>
        </Route>
      </Route>

      {/* Root Redirect & Fallbacks */}
      <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
