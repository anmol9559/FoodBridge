import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Utensils,
  ShieldCheck,
  Activity,
  Users,
  Building2,
  PackageCheck,
  Sun,
  Moon,
  LogIn,
  ArrowRight,
  MapPin,
  KeyRound,
  CheckCircle2,
  Menu,
  X,
  Lock,
  ChevronDown,
  Award,
  Play,
  Mail,
  Phone,
  Send,
  Check,
  Heart,
  Globe,
  Share2,
  MessageSquare,
} from 'lucide-react'
import { getPublicStatsApi } from '../../api/public.api'
import { useTheme } from '../../context/ThemeContext'

export const AuthLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(location.pathname === '/login')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  // Sync modal state with URL path
  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLoginModalOpen(true)
    } else {
      setIsLoginModalOpen(false)
    }
  }, [location.pathname])

  // Track scroll position to adjust navbar & active section indicator
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = ['hero', 'impact', 'trust', 'features', 'how-it-works']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginModalOpen) {
        closeLoginModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLoginModalOpen])

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    navigate('/login')
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
    navigate('/')
  }

  const { data: stats, isLoading } = useQuery({
    queryKey: ['publicStats'],
    queryFn: getPublicStatsApi,
    refetchInterval: 30000,
  })

  // If path is /register, render the registration wizard directly
  const isRegisterPage = location.pathname === '/register'

  const navItems = [
    { id: 'hero', label: 'Home', href: '#hero' },
    { id: 'impact', label: 'Live Impact', href: '#impact' },
    { id: 'trust', label: 'Trust & Safety', href: '#trust' },
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090909] text-slate-900 dark:text-neutral-100 font-sans relative selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      {/* FIXED TOP GLASS NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#111111]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#2E2E2E] shadow-md shadow-slate-200/50 dark:shadow-black/50'
            : 'bg-white/80 dark:bg-[#090909]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#2E2E2E] shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            {/* <div className="bg-gradient-to-tr from-emerald-600 to-emerald-400 p-2.5 rounded-2xl border border-emerald-500/20 shadow-md shadow-emerald-500/10 dark:shadow-lg dark:shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <Utensils className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div> */}
            <div>
              <img
                src="../../public/Mainlogo.png"
                alt="Vitaran Logo"
                className="h-10 w-auto object-contain rounded-lg shadow-md shadow-emerald-500/20 dark:shadow-lg dark:shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Vitaran
              </span>
              <span className="block text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-widest -mt-1">
                Anna Raksha Platform • India
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-extrabold">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 transition-colors duration-200 ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-in fade-in zoom-in-95" />
                  )}
                </a>
              )
            })}
          </nav>

          {/* Right Action Buttons & Theme Switcher */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 hover:text-emerald-600 dark:hover:text-amber-300 transition shadow-sm"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-emerald-600" />}
            </button>

            {/* Login Button */}
            <button
              onClick={openLoginModal}
              className="h-10 px-4 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-xs flex items-center space-x-1.5 transition shadow-sm"
            >
              <LogIn className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Sign In</span>
            </button>

            {/* Register CTA */}
            <Link
              to="/register"
              className="hidden sm:flex h-10 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs items-center space-x-2 transition shadow-lg shadow-emerald-500/25 stroke-[2.5]"
            >
              <span>Register Organization</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-nav p-6 border-b border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-4">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-2xl text-center text-xs"
              >
                Register Organization
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* RENDER REGISTRATION WIZARD DIRECTLY IF PATH IS /register */}
      {isRegisterPage ? (
        <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
          <Outlet />
        </div>
      ) : (
        /* FULL SCREEN SAAS LANDING PAGE CONTENT */
        <main className="relative z-10">
          {/* 1. HERO SECTION */}
          <section
            id="hero"
            className="relative h-screen min-h-[720px] flex flex-col justify-between pt-28 sm:pt-32 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src="/hero-child.jpg"
                alt="Indian Child Praying over Grains"
                className="w-full h-full object-cover object-[80%_center] lg:object-right filter brightness-[0.55] contrast-[1.12] scale-105 animate-float-slow"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/90 sm:via-[#090909]/75 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#090909] via-transparent to-[#090909]/70 z-10" />
            </div>

            {/* Empty top placeholder */}
            <div />

            {/* Hero Content */}
            <div className="relative z-20 max-w-7xl mx-auto w-full my-auto">
              <div className="max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold backdrop-blur-md animate-pulse-glow shadow-lg shadow-emerald-500/10">
                  <span className="text-sm">🇮🇳</span>
                  <span>India's Smart Food Redistribution Platform</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-lg">
                  Every Meal Saved{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Can Change a Life.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-medium leading-relaxed drop-shadow max-w-2xl">
                  Vitaran connects verified Indian restaurants, hotels, caterers, and NGOs to eliminate food waste across India with real-time tracking and 6-digit pickup verification.
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-sm flex items-center justify-center space-x-3 transition shadow-xl shadow-emerald-500/30 stroke-[2.5]"
                  >
                    <span>Register Organization</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-extrabold px-7 py-4 rounded-2xl text-sm flex items-center justify-center space-x-2 transition backdrop-blur-xl"
                  >
                    <Play className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                    <span>Learn How It Works</span>
                  </a>

                  <button
                    onClick={openLoginModal}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-4 rounded-2xl text-sm flex items-center justify-center space-x-2 transition backdrop-blur-md"
                  >
                    <LogIn className="h-4 w-4 text-emerald-400" />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scroll Indicator Arrow */}
            <div className="relative z-20 flex flex-col items-center justify-center space-y-1 animate-bounce cursor-pointer pb-2">
              <a href="#impact" className="text-slate-300 hover:text-emerald-400 transition text-[11px] font-bold uppercase tracking-widest flex flex-col items-center">
                <span>Explore Impact</span>
                <ChevronDown className="h-5 w-5 text-emerald-400" />
              </a>
            </div>
          </section>

          {/* 2. LIVE PLATFORM IMPACT METRICS */}
          <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
            <div className="text-center space-y-2 mb-12">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-xs tracking-widest block">
                Live Database Verification
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Real-Time Impact Metrics Across India</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-2 hover:border-emerald-500/40 transition group">
                <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
                  <Building2 className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Verified Donors</span>
                </div>
                <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                  {isLoading ? '...' : (stats?.verifiedRestaurants ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Indian Restaurants & Hotels</p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-2 hover:border-cyan-500/40 transition group">
                <div className="flex items-center space-x-3 text-cyan-600 dark:text-cyan-400">
                  <Users className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Accredited NGOs</span>
                </div>
                <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                  {isLoading ? '...' : (stats?.verifiedNgos ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Distribution Partners</p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-2 hover:border-teal-500/40 transition group">
                <div className="flex items-center space-x-3 text-teal-600 dark:text-teal-400">
                  <PackageCheck className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Completed Pickups</span>
                </div>
                <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                  {isLoading ? '...' : (stats?.completedPickups ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Verified Handoffs</p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-2 hover:border-amber-500/40 transition group">
                <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
                  <Utensils className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Meals Rescued</span>
                </div>
                <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                  {isLoading ? '...' : (stats?.mealsSaved ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Nutritional Servings Saved</p>
              </div>
            </div>
          </section>

          {/* 3. TRUST & COMPLIANCE SECTION */}
          <section id="trust" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center space-y-3 mb-12">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <Award className="h-3.5 w-3.5" />
                <span>Enterprise Governance</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Designed for Trust & Safety</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Built to satisfy strict food handling guidelines, document validation, and auditability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">FSSAI Inspired Standards</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Requires cooked time, expiry countdowns, packaging type, and temperature advisories for all food items.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Admin Verified NGOs</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every NGO must submit registration certificates and government proof before requesting food.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3">
                <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 w-fit">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">6-Digit Pickup PIN</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Prevents unauthorized collection. PIN is generated by restaurant and verified by NGO upon arrival.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Government & CSR Ready</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Complete audit trails detailing meals saved, donor metrics, and recipient proof for CSR reporting.
                </p>
              </div>
            </div>
          </section>

          {/* 4. REDESIGNED FEATURE CARDS */}
          <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center space-y-3 mb-12">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-xs tracking-widest block">
                Platform Capabilities
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Comprehensive SaaS Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-2.5 text-slate-950 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verified Organization Network</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Admin document validation for food donors and recipient NGOs before granting platform access.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 p-2.5 text-slate-950 flex items-center justify-center">
                  <Activity className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Surplus Tracking</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Real-time listing of cooked meals, bakery items, packaged food, servings, and live expiry countdowns.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 p-2.5 text-slate-950 flex items-center justify-center">
                  <KeyRound className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">6-Digit Pickup Verification PIN</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automated PIN issuance upon confirmation, 24-hour expiration countdown, and instant clearing on completion.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 p-2.5 text-slate-950 flex items-center justify-center">
                  <MapPin className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Google Maps Navigation</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Embedded OpenStreetMap map previews and one-click directions to exact restaurant pickup addresses.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-2.5 text-slate-950 flex items-center justify-center">
                  <Lock className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Secure Resubmission Workflow</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Allows rejected organizations to edit registration documents and resubmit without data loss.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 p-2.5 text-slate-950 flex items-center justify-center">
                  <Building2 className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Analytics Dashboards</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Comprehensive metric cards, monthly food rescue graphs, and audit streams for Admins, Donors, and NGOs.
                </p>
              </div>
            </div>
          </section>

          {/* 5. HOW IT WORKS */}
          <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center space-y-3 mb-12">
              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold uppercase text-xs tracking-widest block">
                Logistics Workflow
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How Vitrana Works</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 border-emerald-500/30 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
                  01
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Donation Created</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Restaurant posts surplus meals with servings count, cooked time, and expiry date.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 border-cyan-500/30 relative">
                <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
                  02
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">NGO Reserves</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Verified NGO browses available listings and reserves meals for distribution.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 border-amber-500/30 relative">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
                  03
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">PIN Issued</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Restaurant confirms booking and backend generates a 24h 6-digit verification PIN code.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-3 border-teal-500/30 relative">
                <div className="w-8 h-8 rounded-full bg-teal-300 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
                  04
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Verified Handoff</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  NGO arrives, verifies PIN, collects warm food, and distributes meals to children and families.
                </p>
              </div>
            </div>
          </section>

          {/* 6. PREMIUM SAAS FOOTER */}
          <footer id="contact" className="border-t border-slate-200 dark:border-[#2E2E2E] bg-white dark:bg-[#090909] transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
              {/* NEWSLETTER CARD */}
              <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="space-y-1.5 text-center md:text-left">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <Send className="h-3.5 w-3.5" />
                    <span>Stay Updated</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    Subscribe to Impact Updates
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
                    Receive monthly surplus food redistribution updates, CSR reporting metrics, and platform features.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setNewsletterSubscribed(true)
                    setTimeout(() => setNewsletterSubscribed(false), 4000)
                  }}
                  className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto"
                >
                  <div className="relative w-full sm:w-72">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-6 py-2.5 rounded-2xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/25 shrink-0"
                  >
                    {newsletterSubscribed ? (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>Subscribed!</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* 5-COLUMN MAIN FOOTER CONTENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
                {/* Column 1: Brand & Badges */}
                <div className="lg:col-span-1 space-y-4">
                  <Link to="/" className="flex items-center space-x-3 group">
                    {/* <div className="bg-gradient-to-tr from-emerald-600 to-emerald-400 p-2.5 rounded-2xl border border-emerald-500/20 shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
                      <Utensils className="h-5 w-5 text-slate-950 stroke-[2.5]" />
                    </div> */}
                    <div>
                      <img
                        src="../../public/Mainlogo.png"
                        alt="Vitrana Logo"
                        className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none"
                      />
                    </div>
                    <div>
                      <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Vitrana
                      </span>
                      <span className="block text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-widest -mt-1">
                        Anna Raksha Platform • India
                      </span>
                    </div>
                  </Link>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Connecting restaurants, hotels, caterers and NGOs to eliminate food waste across India.
                  </p>

                  <div className="space-y-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 pt-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Verified Organizations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Secure Pickup Verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Zero Food Waste Mission</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Quick Links
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <li>
                      <a href="#hero" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        How It Works
                      </a>
                    </li>
                    <li>
                      <a href="#trust" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Trust & Safety
                      </a>
                    </li>
                    <li>
                      <a href="#impact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Live Impact
                      </a>
                    </li>
                    <li>
                      <Link to="/register" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition font-bold text-emerald-600 dark:text-emerald-400">
                        Register Organization
                      </Link>
                    </li>
                    <li>
                      <button onClick={openLoginModal} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                        Sign In
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Platform Scope */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Platform
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <li>
                      <button onClick={openLoginModal} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                        Restaurant Portal
                      </button>
                    </li>
                    <li>
                      <button onClick={openLoginModal} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                        NGO Dashboard
                      </button>
                    </li>
                    <li>
                      <button onClick={openLoginModal} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                        Admin Dashboard
                      </button>
                    </li>
                    <li>
                      <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Donation Tracking
                      </a>
                    </li>
                    <li>
                      <a href="#trust" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        PIN Verification
                      </a>
                    </li>
                    <li>
                      <a href="#trust" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Organization Approval
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Resources */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Resources
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <li>
                      <a href="#trust" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        FSSAI Compliance FAQ
                      </a>
                    </li>
                    <li>
                      <a href="#trust" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#trust" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <a href="#contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a href="#contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                        Help & Support
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 5: Contact Info & Modern Social Links */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Contact Us
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <p className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>support@foodbridge.in</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>+91 98765 43210</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>India</span>
                    </p>
                  </div>

                  {/* Social Icon Links (SVG based) */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-2">Connect</span>
                    <div className="flex items-center space-x-2">
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noreferrer"
                        className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 hover:scale-110 hover:-rotate-3 transition-all duration-200 shadow-sm"
                        title="LinkedIn"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 hover:scale-110 hover:rotate-3 transition-all duration-200 shadow-sm"
                        title="GitHub"
                      >
                        <Share2 className="h-4 w-4" />
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 hover:scale-110 hover:-rotate-3 transition-all duration-200 shadow-sm"
                        title="Instagram"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                      <a
                        href="mailto:support@foodbridge.in"
                        className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 hover:scale-110 hover:rotate-3 transition-all duration-200 shadow-sm"
                        title="Email Support"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* EXTRA PILL BADGES */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
                <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>FSSAI Inspired Standards</span>
                </span>
                <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center space-x-1.5">
                  <Heart className="h-3.5 w-3.5 fill-teal-500/20" />
                  <span>UN SDG Goal 2: Zero Hunger</span>
                </span>
                <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center space-x-1.5">
                  <Utensils className="h-3.5 w-3.5" />
                  <span>Food Waste Reduction</span>
                </span>
                <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>Nationwide Community Impact</span>
                </span>
              </div>

              {/* BOTTOM BAR */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div>© 2026 FoodBridge. All rights reserved.</div>
                <div className="flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>for Zero Hunger in India</span>
                </div>
                <div className="font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  Version v1.0.0
                </div>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* LOGIN MODAL DIALOG */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          {/* Backdrop Click Handler */}
          <div className="fixed inset-0" onClick={closeLoginModal} />

          {/* Modal Content Box */}
          <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 duration-200">
            <button
              onClick={closeLoginModal}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-md"
              title="Close Modal (ESC)"
            >
              <X className="h-5 w-5" />
            </button>

            <Outlet />
          </div>
        </div>
      )}
    </div>
  )
}
