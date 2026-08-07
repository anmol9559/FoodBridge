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

const donationStatuses = ['AVAILABLE', 'RESERVED', 'APPROVED', 'PICKED_UP', 'COLLECTED', 'EXPIRED', 'CANCELLED', 'COMPLETED']


const listDonationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(donationStatuses).optional(),
  search: z.string().trim().max(191).optional(),
})

const updateDonationSchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty.').max(191).optional(),
    description: z.string().trim().max(65_535).nullable().optional(),
    quantity: z.number({ invalid_type_error: 'Quantity must be a number.' }).positive('Quantity must be greater than 0.').optional(),
    quantityUnit: z.string().trim().min(1, 'Quantity unit cannot be empty.').max(50).optional(),
    foodType: z.enum(foodTypes, { errorMap: () => ({ message: 'Invalid food type.' }) }).optional(),
    mealType: z.string().trim().max(50).nullable().optional(),
    packagingType: z.string().trim().max(100).nullable().optional(),
    isVegetarian: z.boolean().optional(),
    isVegan: z.boolean().optional(),
    estimatedServings: z
      .number({ invalid_type_error: 'Estimated servings must be a number.' })
      .int('Estimated servings must be an integer.')
      .positive('Estimated servings must be greater than 0.')
      .nullable()
      .optional(),
    cookedAt: z.coerce.date().nullable().optional(),
    expiresAt: z.coerce.date().optional(),
    pickupAddress: z.string().trim().max(65_535).nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    specialInstructions: z.string().trim().max(65_535).nullable().optional(),
    images: z.array(z.string().trim().url('Image must be a valid URL.')).optional(),
    status: z.enum(donationStatuses).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.cookedAt && data.expiresAt) {
        return new Date(data.expiresAt) > new Date(data.cookedAt)
      }
      return true
    },
    {
      message: 'Expiration time (expiresAt) must be after cooking time (cookedAt).',
      path: ['expiresAt'],
    },
  )

const reserveDonationSchema = z
  .object({
    notes: z.string().trim().max(65_535).optional(),
  })
  .strict()
  .optional()

const ngoListDonationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().max(191).optional(),
})

const reservationStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED']

const listNgoReservationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(reservationStatuses).optional(),
})

const listRestaurantReservationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(reservationStatuses).optional(),
})

module.exports = {
  createDonationSchema,
  listDonationsQuerySchema,
  updateDonationSchema,
  ngoListDonationsQuerySchema,
  reserveDonationSchema,
  listNgoReservationsQuerySchema,
  listRestaurantReservationsQuerySchema,
}








