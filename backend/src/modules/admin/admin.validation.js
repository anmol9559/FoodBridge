const { z } = require('zod')

const adminListRestaurantsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().max(191).optional(),
})

module.exports = {
  adminListRestaurantsQuerySchema,
}
