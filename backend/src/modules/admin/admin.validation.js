const { z } = require('zod')

const adminListRestaurantsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().max(191).optional(),
})

const adminListNgosQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().max(191).optional(),
})

const adminListDonationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().max(191).optional(),
})

const reservationStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED', 'REJECTED']

const adminListReservationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(reservationStatuses).optional(),
})

const verifyOrganizationBodySchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status must be VERIFIED or REJECTED.' }),
  }),
  reason: z.string().trim().optional(),
})

module.exports = {
  adminListRestaurantsQuerySchema,
  adminListNgosQuerySchema,
  adminListDonationsQuerySchema,
  adminListReservationsQuerySchema,
  verifyOrganizationBodySchema,
}
