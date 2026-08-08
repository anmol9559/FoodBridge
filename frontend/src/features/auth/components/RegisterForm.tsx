import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User,
  Mail,
  Lock,
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  Utensils,
  HeartHandshake,
  Check,
  Globe,
  FileText,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react'
import { registerWizardSchema, RegisterWizardFormData } from '../auth.schemas'
import { registerApi } from '../../../api/auth.api'
import { RegisterInput } from '../../../types/auth'
import { LocationPicker, LocationData } from './LocationPicker'

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'USA/Canada (+1)' },
  { code: '+44', country: 'UK', label: 'United Kingdom (+44)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
]

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Image Preview States
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterWizardFormData>({
    resolver: zodResolver(registerWizardSchema),
    mode: 'onChange',
    defaultValues: {
      phoneCountryCode: '+91',
      role: 'RESTAURANT',
      country: 'India',
      organizationDescription: '',
    },
  })

  const formValues = watch()
  const passwordValue = watch('password') || ''
  const roleValue = watch('role')
  const descriptionValue = watch('organizationDescription') || ''

  // Password Strength Calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-800' }
    let score = 0
    if (pwd.length >= 12) score += 1
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1
    if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-400' }
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-400' }
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400' }
  }

  const pwdStrength = getPasswordStrength(passwordValue)

  // Profile Image Upload Handler
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setProfilePhotoPreview(url)
      setValue('profilePhotoUrl', url)
    }
  }

  // Logo Upload Handler
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
      setValue('organizationLogoUrl', url)
    }
  }

  // Location Selection Callback
  const handleLocationSelect = (loc: LocationData) => {
    if (loc.latitude) setValue('latitude', loc.latitude)
    if (loc.longitude) setValue('longitude', loc.longitude)
    if (loc.streetAddress) setValue('streetAddress', loc.streetAddress)
    if (loc.city) setValue('city', loc.city)
    if (loc.state) setValue('state', loc.state)
    if (loc.pincode && loc.pincode.length === 6) setValue('pincode', loc.pincode)
    if (loc.country) setValue('country', loc.country)
  }

  // Validate step fields before proceeding
  const handleNextStep = async () => {
    setErrorMessage(null)
    let fieldsToValidate: (keyof RegisterWizardFormData)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword']
    } else if (currentStep === 2) {
      fieldsToValidate = ['role', 'organizationName']
      if (formValues.organizationWebsiteUrl) fieldsToValidate.push('organizationWebsiteUrl')
    }

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid) {
      setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev))
    }
  }

  const handlePrevStep = () => {
    setErrorMessage(null)
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))
  }

  // Final Form Submission
  const onSubmit = async (data: RegisterWizardFormData) => {
    setErrorMessage(null)

    // Construct registration API payload
    const payload: RegisterInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: `${data.phoneCountryCode}${data.phone}`,
      role: data.role,
      organization: {
        name: data.organizationName,
        registrationNumber:
          data.role === 'RESTAURANT'
            ? data.fssaiNumber || data.organizationRegistrationNumber || undefined
            : data.ngoRegistrationNumber || data.organizationRegistrationNumber || undefined,
        email: data.email,
        phone: `${data.phoneCountryCode}${data.phone}`,
        description: data.organizationDescription || undefined,
        websiteUrl: data.organizationWebsiteUrl || undefined,
      },
    }

    // TODO: Backend Integration Notice
    // Coordinates (latitude, longitude) and extra fields (streetAddress, city, state, pincode, country, logo, avatar) are saved in frontend state.

    try {
      const response = await registerApi(payload)
      if (response.success) {
        setIsSuccess(true)
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const backendMessage =
        errorObj.response?.data?.error?.message ||
        errorObj.message ||
        'Registration failed. An organization or account with these details may already exist.'
      setErrorMessage(backendMessage)
    }
  }

  // ----------------------------------------------------
  // SUCCESS SCREEN
  // ----------------------------------------------------
  if (isSuccess) {
    return (
      <div className="bg-slate-900/90 border border-slate-800/80 p-8 rounded-3xl shadow-2xl backdrop-blur-2xl text-center space-y-5 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-white tracking-tight">✅ Registration Successful</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Thank you for registering with <strong className="text-white">FoodBridge</strong>.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-2.5">
          <p className="text-slate-400 leading-relaxed">
            Your organization <strong className="text-white">{formValues.organizationName}</strong> has been submitted for admin verification.
          </p>
          <div className="flex items-center space-x-2 pt-0.5">
            <span className="text-[11px] font-semibold text-slate-400">Current Status:</span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>🟡 Pending Verification</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            You will be able to access the platform after an administrator approves your organization.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3 px-5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            <span>Go to Login</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // ----------------------------------------------------
  // REGISTRATION WIZARD FORM (FIT DESKTOP VIEWPORT)
  // ----------------------------------------------------
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 p-5 sm:p-7 rounded-3xl shadow-2xl backdrop-blur-2xl space-y-4 w-full">
      {/* Header & Stepper Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>Register Organization</span>
          </h2>
          <p className="text-[11px] text-slate-400">Step {currentStep} of 3 — Fill in organization details</p>
        </div>

        {/* Premium Stepper Component */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
          <div className={`flex items-center space-x-1 ${currentStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 1 ? 'bg-emerald-500 text-slate-950' : currentStep > 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {currentStep > 1 ? <Check className="h-3 w-3" /> : '1'}
            </span>
            <span className="text-[11px] font-semibold hidden md:inline">Personal</span>
          </div>

          <div className={`h-0.5 w-6 ${currentStep >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

          <div className={`flex items-center space-x-1 ${currentStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 2 ? 'bg-emerald-500 text-slate-950' : currentStep > 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {currentStep > 2 ? <Check className="h-3 w-3" /> : '2'}
            </span>
            <span className="text-[11px] font-semibold hidden md:inline">Organization</span>
          </div>

          <div className={`h-0.5 w-6 ${currentStep === 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

          <div className={`flex items-center space-x-1 ${currentStep === 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
              3
            </span>
            <span className="text-[11px] font-semibold hidden md:inline">Address</span>
          </div>
        </div>
      </div>

      {/* Backend API Error Banner */}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-start space-x-2.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-xs">
        {/* ========================================================= */}
        {/* STEP 1: PERSONAL INFORMATION (COMPACT 2-COLUMN) */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Compact Profile Avatar Picker Header */}
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {profilePhotoPreview ? (
                    <img src={profilePhotoPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-200 text-xs">Profile Photo (Optional)</p>
                  <p className="text-[10px] text-slate-500">Upload user avatar picture</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-2.5 py-1 rounded-xl cursor-pointer transition flex items-center space-x-1 text-[11px]">
                  <Upload className="h-3 w-3 text-emerald-400" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="hidden" />
                </label>
                {profilePhotoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePhotoPreview(null)
                      setValue('profilePhotoUrl', '')
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  placeholder="John"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {errors.firstName && <p className="text-rose-400 mt-0.5 text-[10px]">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  placeholder="Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {errors.lastName && <p className="text-rose-400 mt-0.5 text-[10px]">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Row 2: Email & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="john.doe@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {errors.email && <p className="text-rose-400 mt-0.5 text-[10px]">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Phone Number *
                </label>
                <div className="flex space-x-1.5">
                  <select
                    {...register('phoneCountryCode')}
                    className="bg-slate-950 border border-slate-800 text-slate-200 font-semibold rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="9876543210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {errors.phone && <p className="text-rose-400 mt-0.5 text-[10px]">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                    Password *
                  </label>
                  {passwordValue && (
                    <span className={`font-bold text-[10px] ${pwdStrength.textColor}`}>{pwdStrength.label}</span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Min 12 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 mt-0.5 text-[10px]">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-rose-400 mt-0.5 text-[10px]">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: ORGANIZATION INFORMATION (COMPACT 2-COLUMN) */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Role Selection Cards */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                Organization Role *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center space-x-2.5 ${
                    roleValue === 'RESTAURANT'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input type="radio" value="RESTAURANT" {...register('role')} className="sr-only" />
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Utensils className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Restaurant Donor</p>
                    <p className="text-[10px] text-slate-400">Share surplus prepared food</p>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center space-x-2.5 ${
                    roleValue === 'NGO'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input type="radio" value="NGO" {...register('role')} className="sr-only" />
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">NGO Partner</p>
                    <p className="text-[10px] text-slate-400">Distribute meals to communities</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Row 1: Org Name & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    {...register('organizationName')}
                    placeholder="Green Bites Restaurant / City Hope"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {errors.organizationName && (
                  <p className="text-rose-400 mt-0.5 text-[10px]">{errors.organizationName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Website (Optional)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="url"
                    {...register('organizationWebsiteUrl')}
                    placeholder="https://www.example.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {errors.organizationWebsiteUrl && (
                  <p className="text-rose-400 mt-0.5 text-[10px]">{errors.organizationWebsiteUrl.message}</p>
                )}
              </div>
            </div>

            {/* Description & Logo Upload Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                    Description (Optional)
                  </label>
                  <span className="text-[10px] text-slate-500">{descriptionValue.length}/500</span>
                </div>
                <textarea
                  {...register('organizationDescription')}
                  rows={2}
                  maxLength={500}
                  placeholder="Brief description of operations or cause..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                    Logo (Optional)
                  </span>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null)
                        setValue('organizationLogoUrl', '')
                      }}
                      className="text-[9px] text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <label className="h-[62px] border border-dashed border-slate-800 hover:border-emerald-500 rounded-xl p-2 flex items-center justify-center space-x-2 cursor-pointer transition bg-slate-950">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-9 h-9 rounded-lg object-cover" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 text-emerald-400" />
                      <span className="text-[10px] text-slate-400 font-semibold">Select Logo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Conditional Registration Numbers */}
            {roleValue === 'RESTAURANT' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    GST Number
                  </label>
                  <input
                    type="text"
                    {...register('gstNumber')}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    FSSAI License No.
                  </label>
                  <input
                    type="text"
                    {...register('fssaiNumber')}
                    placeholder="14-digit FSSAI No."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    NGO Registration No.
                  </label>
                  <input
                    type="text"
                    {...register('ngoRegistrationNumber')}
                    placeholder="DARPAN / Reg No."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Trust Reg Number
                  </label>
                  <input
                    type="text"
                    {...register('trustRegistrationNumber')}
                    placeholder="Trust Registration No."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: ADDRESS & LOCATION (COMPACT 2-COLUMN) */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Interactive Location Picker */}
            <div>
              <LocationPicker
                initialLat={formValues.latitude || 28.6139}
                initialLng={formValues.longitude || 77.209}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            {/* Row 1: Street Address & Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Street Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    {...register('streetAddress')}
                    placeholder="Building No, Street Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {errors.streetAddress && (
                  <p className="text-rose-400 mt-0.5 text-[10px]">{errors.streetAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  {...register('landmark')}
                  placeholder="Near Metro / Bank"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Row 2: City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  City *
                </label>
                <input
                  type="text"
                  {...register('city')}
                  placeholder="New Delhi / Mumbai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {errors.city && <p className="text-rose-400 mt-0.5 text-[10px]">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  State *
                </label>
                <input
                  type="text"
                  {...register('state')}
                  placeholder="Delhi / Maharashtra"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {errors.state && <p className="text-rose-400 mt-0.5 text-[10px]">{errors.state.message}</p>}
              </div>
            </div>

            {/* Row 3: Pincode & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Pincode *
                </label>
                <input
                  type="text"
                  {...register('pincode')}
                  maxLength={6}
                  placeholder="110001"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {errors.pincode && <p className="text-rose-400 mt-0.5 text-[10px]">{errors.pincode.message}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Country
                </label>
                <input
                  type="text"
                  {...register('country')}
                  readOnly
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Compact Review Summary Card */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-1.5 text-slate-300 font-bold border-b border-slate-800 pb-1 text-[11px]">
                <FileText className="h-3.5 w-3.5 text-emerald-400" />
                <span>Account Review Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500">User: </span>
                  <span className="text-slate-200 font-semibold">{formValues.firstName} {formValues.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Role: </span>
                  <span className="text-emerald-400 font-bold">{formValues.role}</span>
                </div>
                <div className="col-span-2 truncate">
                  <span className="text-slate-500">Org: </span>
                  <span className="text-white font-semibold">{formValues.organizationName || 'N/A'}</span>
                </div>
                <div className="col-span-2 truncate">
                  <span className="text-slate-500">Address: </span>
                  <span className="text-slate-300">
                    {formValues.streetAddress}, {formValues.city}, {formValues.state} - {formValues.pincode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-xl flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 px-5 rounded-xl flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/20 text-xs"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 px-6 rounded-xl flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Footer Link */}
      <div className="pt-1 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-emerald-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}
