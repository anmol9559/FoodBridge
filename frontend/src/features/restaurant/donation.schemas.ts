import { z } from 'zod'

export const foodTypes = ['COOKED', 'PACKAGED', 'RAW', 'BAKERY', 'BEVERAGE', 'OTHER'] as const

export const donationFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.').max(191),
    description: z.string().trim().max(5000).optional().or(z.literal('')),
    quantity: z.coerce.number({ invalid_type_error: 'Quantity must be a number.' }).positive('Quantity must be greater than 0.'),
    quantityUnit: z.string().trim().min(1, 'Quantity unit is required.').max(50),
    foodType: z.enum(foodTypes, { errorMap: () => ({ message: 'Please select a valid food type.' }) }),
    mealType: z.string().trim().max(50).optional().or(z.literal('')),
    packagingType: z.string().trim().max(100).optional().or(z.literal('')),
    isVegetarian: z.boolean().default(false),
    isVegan: z.boolean().default(false),
    estimatedServings: z.coerce
      .number({ invalid_type_error: 'Estimated servings must be a number.' })
      .int('Estimated servings must be an integer.')
      .positive('Estimated servings must be greater than 0.')
      .optional()
      .or(z.literal(0).transform(() => undefined)),
    cookedAt: z.string().optional().or(z.literal('')),
    expiresAt: z.string().min(1, 'Expiration date & time is required.'),
    pickupAddress: z.string().trim().max(1000).optional().or(z.literal('')),
    specialInstructions: z.string().trim().max(1000).optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (!data.cookedAt || !data.expiresAt) return true
      return new Date(data.expiresAt) > new Date(data.cookedAt)
    },
    {
      message: 'Expiration time must be after cooking time.',
      path: ['expiresAt'],
    }
  )
  .refine(
    (data) => {
      if (!data.expiresAt) return true
      return new Date(data.expiresAt) > new Date()
    },
    {
      message: 'Expiration time must be in the future.',
      path: ['expiresAt'],
    }
  )

export type DonationFormData = z.infer<typeof donationFormSchema>
