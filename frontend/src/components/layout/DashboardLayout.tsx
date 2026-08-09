import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Utensils,
  LayoutDashboard,
  Package,
  CalendarCheck,
  Building2,
  Users,
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export const DashboardLayout: React.FC = () => {
  const { user, organization, role, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeRole = role || user?.role

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const getNavLinks = () => {
    switch (activeRole) {
      case 'ADMIN':
        return [
          { name: 'Analytics Overview', path: '/admin', icon: LayoutDashboard },
          { name: 'Restaurant Donors', path: '/admin/restaurants', icon: Building2 },
          { name: 'NGO Partners', path: '/admin/ngos', icon: Users },
          { name: 'Surplus Food Listings', path: '/admin/donations', icon: Package },
          { name: 'Reservation Audit', path: '/admin/reservations', icon: CalendarCheck },
          { name: 'Verification Approvals', path: '/admin/verifications', icon: CheckCircle2 },
        ]
      case 'NGO':
        return [
          { name: 'Impact Overview', path: '/ngo', icon: LayoutDashboard },
          { name: 'Browse Surplus Food', path: '/ngo/donations', icon: Search },
          { name: 'My Reservations', path: '/ngo/reservations', icon: CalendarCheck },
        ]
      case 'RESTAURANT':
      default:
        return [
          { name: 'Donor Overview', path: '/restaurant', icon: LayoutDashboard },
          { name: 'My Food Listings', path: '/restaurant/donations', icon: Package },
          { name: 'Incoming Bookings', path: '/restaurant/reservations', icon: CalendarCheck },
        ]
    }
  }

  const navLinks = getNavLinks()

  const getRoleBadgeStyle = () => {
    switch (activeRole) {
      case 'ADMIN':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      case 'NGO':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'RESTAURANT':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-[#090909] text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Glass Navigation Bar */}
      <header className="sticky top-0 z-40 glass-nav px-4 lg:px-8 py-3 flex items-center justify-between border-b border-[#2E2E2E]">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222222] transition"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-tr from-emerald-600 to-emerald-500 p-2.5 rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-200">
              <Utensils className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white dark:text-white light:text-neutral-900">
                FoodBridge
              </span>
              <span className="hidden sm:block text-[9px] font-bold text-emerald-500 uppercase tracking-widest -mt-1">
                NGO Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Active Role Pill */}
          <div className="relative hidden sm:block">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-bold ${getRoleBadgeStyle()}`}>
              <Shield className="h-3.5 w-3.5" />
              <span>{activeRole} ACCESS</span>
            </div>
          </div>

          <button className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#222222] transition relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </button>

          {/* User Profile Summary */}
          <div className="flex items-center space-x-3 pl-2 border-l border-[#2E2E2E]">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#141414] rounded-[14px] flex items-center justify-center font-bold text-emerald-400 text-xs">
                {user?.firstName?.[0] || 'U'}
              </div>
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-bold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-neutral-400 truncate max-w-[130px]">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0D0D0D] border-r border-[#2E2E2E] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col justify-between pt-16 lg:pt-0`}
        >
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
              <span>{activeRole} Navigation</span>
              <Sparkles className="h-3 w-3 text-emerald-500" />
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 stroke-[2.5]'
                      : 'text-neutral-300 hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Sidebar Footer Organization Info */}
          <div className="p-4 border-t border-[#2E2E2E]">
            <div className="p-3 rounded-2xl border border-[#2E2E2E] text-xs space-y-1 bg-[#181818]">
              <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider block">Organization Profile</span>
              <p className="text-emerald-400 font-bold truncate">
                {activeRole === 'ADMIN'
                  ? 'FoodBridge System Audit'
                  : organization?.name || user?.organizationId || 'Registered Organization'}
              </p>
              <div className="flex items-center space-x-1 text-[10px] text-neutral-400 pt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Verified Partner</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090909]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
