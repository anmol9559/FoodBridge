const { StatusCodes } = require('http-status-codes')
const { createDonationSchema } = require('./donation.validation')
const { createDonation } = require('./donation.service')

async function postDonation(req, res, next) {
  const parsedInput = createDonationSchema.safeParse(req.body)

  if (!parsedInput.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Food donation data is invalid.',
        details: parsedInput.error.issues.map(({ path, message }) => ({
          field: path.join('.'),
          message,
        })),
      },
    })
  }

  if (!req.user.organizationId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'ORGANIZATION_REQUIRED',
        message: 'Authenticated restaurant user is not associated with an organization.',
      },
    })
  }

  try {
    const donation = await createDonation(req.user.organizationId, parsedInput.data)

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Food donation created successfully.',
      data: donation,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { postDonation }
