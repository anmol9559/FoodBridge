const { z } = require('zod')
const { StatusCodes } = require('http-status-codes')

const idParamSchema = z.object({
  id: z.string().trim().min(1, 'ID parameter is required.').max(128, 'ID parameter is too long.'),
})

const donationIdParamSchema = z.object({
  donationId: z.string().trim().min(1, 'Donation ID is required.').max(128, 'Donation ID is too long.'),
})

const reservationIdParamSchema = z.object({
  reservationId: z.string().trim().min(1, 'Reservation ID is required.').max(128, 'Reservation ID is too long.'),
})

function validateParams(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.params)

    if (!parsed.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid route parameters.',
          details: parsed.error.issues.map(({ path, message }) => ({
            field: path.join('.'),
            message,
          })),
        },
      })
    }

    req.params = parsed.data
    return next()
  }
}

module.exports = {
  idParamSchema,
  donationIdParamSchema,
  reservationIdParamSchema,
  validateParams,
}
