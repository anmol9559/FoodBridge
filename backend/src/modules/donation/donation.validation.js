const { z } = require('zod')

const foodTypes = ['COOKED', 'PACKAGED', 'RAW', 'BAKERY', 'BEVERAGE', 'OTHER']

const createDonationSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.').max(191),
    description: z.string().trim().max(65_535).optional(),
    quantity: z.number({ invalid_type_error: 'Quantity must be a number.' }).positive('Quantity must be greater than 0.'),
    quantityUnit: z.string().trim().min(1, 'Quantity unit is required.').max(50),
    foodType: z.enum(foodTypes, { errorMap: () => ({ message: 'Invalid food type.' }) }),
    mealType: z.string().trim().max(50).optional(),
    packagingType: z.string().trim().max(100).optional(),
    isVegetarian: z.boolean().default(false),
    isVegan: z.boolean().default(false),
    estimatedServings: z
      .number({ invalid_type_error: 'Estimated servings must be a number.' })
      .int('Estimated servings must be an integer.')
      .positive('Estimated servings must be greater than 0.')
      .optional(),
    cookedAt: z.coerce.date().optional(),
    expiresAt: z.coerce.date({ required_error: 'Expires at date is required.' }),
    pickupAddress: z.string().trim().max(65_535).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    specialInstructions: z.string().trim().max(65_535).optional(),
    images: z.array(z.string().trim().url('Image must be a valid URL.')).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (!data.cookedAt) return true
      return new Date(data.expiresAt) > new Date(data.cookedAt)
    },
    {
      message: 'Expiration time (expiresAt) must be after cooking time (cookedAt).',
      path: ['expiresAt'],
    },
  )
  .refine(
    (data) => new Date(data.expiresAt) > new Date(),
    {
      message: 'Expiration time (expiresAt) must be in the future.',
      path: ['expiresAt'],
    },
  )

const donationStatuses = ['AVAILABLE', 'RESERVED', 'APPROVED', 'PICKED_UP', 'COLLECTED', 'EXPIRED', 'CANCELLED']

const listDonationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(donationStatuses).optional(),
  search: z.string().trim().max(191).optional(),
})

module.exports = { createDonationSchema, listDonationsQuerySchema }

