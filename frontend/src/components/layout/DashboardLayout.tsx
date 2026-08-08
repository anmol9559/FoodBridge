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
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'Restaurants', path: '/admin/restaurants', icon: Building2 },
          { name: 'NGOs', path: '/admin/ngos', icon: Users },
          { name: 'Donations', path: '/admin/donations', icon: Package },
          { name: 'Reservations', path: '/admin/reservations', icon: CalendarCheck },
          { name: 'Pending Verifications', path: '/admin/verifications', icon: CheckCircle2 },
        ]
      case 'NGO':
        return [
          { name: 'Dashboard', path: '/ngo', icon: LayoutDashboard },
          { name: 'Browse Donations', path: '/ngo/donations', icon: Search },
          { name: 'My Reservations', path: '/ngo/reservations', icon: CalendarCheck },
        ]
      case 'RESTAURANT':
      default:
        return [
          { name: 'Dashboard', path: '/restaurant', icon: LayoutDashboard },
          { name: 'My Donations', path: '/restaurant/donations', icon: Package },
          { name: 'Incoming Reservations', path: '/restaurant/reservations', icon: CalendarCheck },
        ]
    }
  }

  const navLinks = getNavLinks()

  const getRoleBadgeColor = () => {
    switch (activeRole) {
      case 'ADMIN':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'NGO':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
      case 'RESTAURANT':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
              <Utensils className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">FoodBridge</span>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Active Role Badge */}
          <div className="relative">
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${getRoleBadgeColor()}`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Role: {activeRole}</span>
            </div>
          </div>

          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          {/* User Profile Summary */}
          <div className="hidden sm:flex items-center space-x-3 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col justify-between pt-16 lg:pt-0`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {activeRole} Navigation
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="text-slate-400 font-semibold">Active Organization</p>
              <p className="text-emerald-400 font-bold truncate">
                {activeRole === 'ADMIN'
                  ? 'FoodBridge System'
                  : organization?.name || user?.organizationId || 'Organization Profile'}
              </p>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
