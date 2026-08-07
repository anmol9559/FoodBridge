const { z } = require('zod')

const optionalText = (maxLength) => z.string().trim().max(maxLength).transform((value) => value || undefined).optional()

const passwordSchema = z.string()
  .min(12, 'Password must contain at least 12 characters.')
  .max(72, 'Password must contain at most 72 characters.')
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'Password must not exceed 72 bytes.')

const organizationRoles = ['RESTAURANT', 'NGO', 'RECYCLER']

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(191),
  password: passwordSchema,
  phone: optionalText(30),
  role: z.enum(organizationRoles),
  organization: z.object({
    name: z.string().trim().min(1).max(191),
    registrationNumber: optionalText(100),
    email: z.string().trim().toLowerCase().email().max(191).optional(),
    phone: optionalText(30),
    description: optionalText(65_535),
    websiteUrl: z.string().trim().url().max(2048).optional(),
  }).strict(),
}).strict()

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(191),
  password: z.string().min(1).max(72),
}).strict()

module.exports = { loginSchema, registerSchema }


