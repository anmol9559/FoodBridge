import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerWizardSchema = z
  .object({
    // Step 1: Personal Information
    firstName: z.string().trim().min(1, 'First name is required.').max(100),
    lastName: z.string().trim().min(1, 'Last name is required.').max(100),
    email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(191),
    phoneCountryCode: z.string().default('+91'),
    phone: z
      .string()
      .trim()
      .min(10, 'Phone number must be at least 10 digits.')
      .max(15, 'Phone number cannot exceed 15 digits.')
      .regex(/^\d+$/, 'Phone number must contain digits only.'),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters long.')
      .max(72, 'Password cannot exceed 72 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    profilePhotoUrl: z.string().optional().or(z.literal('')),

    // Step 2: Organization Information
    role: z.enum(['RESTAURANT', 'NGO'], {
      errorMap: () => ({ message: 'Please select a valid role.' }),
    }),
    organizationName: z.string().trim().min(1, 'Organization name is required.').max(191),
    organizationDescription: z.string().trim().max(500, 'Description cannot exceed 500 characters.').optional().or(z.literal('')),
    organizationLogoUrl: z.string().optional().or(z.literal('')),
    organizationWebsiteUrl: z.string().trim().url('Invalid website URL.').optional().or(z.literal('')),

    // Conditional Organization Fields
    gstNumber: z.string().trim().max(50).optional().or(z.literal('')),
    fssaiNumber: z.string().trim().max(50).optional().or(z.literal('')),
    ngoRegistrationNumber: z.string().trim().max(50).optional().or(z.literal('')),
    trustRegistrationNumber: z.string().trim().max(50).optional().or(z.literal('')),
    organizationRegistrationNumber: z.string().trim().max(100).optional().or(z.literal('')),

    // Step 3: Address & Location
    streetAddress: z.string().trim().min(1, 'Street address is required.').max(500),
    landmark: z.string().trim().max(191).optional().or(z.literal('')),
    city: z.string().trim().min(1, 'City is required.').max(100),
    state: z.string().trim().min(1, 'State is required.').max(100),
    pincode: z
      .string()
      .trim()
      .min(6, 'Pincode must be 6 digits.')
      .max(6, 'Pincode must be 6 digits.')
      .regex(/^\d+$/, 'Pincode must contain digits only.'),
    country: z.string().trim().default('India'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type RegisterWizardFormData = z.infer<typeof registerWizardSchema>

// Deprecated alias for backwards compatibility
export const registerSchema = registerWizardSchema
export type RegisterFormData = RegisterWizardFormData
