const { StatusCodes } = require('http-status-codes')
const { createDonationSchema, listDonationsQuerySchema } = require('./donation.validation')
const { createDonation, getRestaurantDonations, getDonationById } = require('./donation.service')

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

async function listMyDonations(req, res, next) {
  const parsedQuery = listDonationsQuerySchema.safeParse(req.query)

  if (!parsedQuery.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query parameters are invalid.',
        details: parsedQuery.error.issues.map(({ path, message }) => ({
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
    const result = await getRestaurantDonations(req.user.organizationId, parsedQuery.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function getSingleDonation(req, res, next) {
  try {
    const { id } = req.params
    const donation = await getDonationById(id)

    if (!donation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Food donation not found.',
        },
      })
    }

    if (donation.restaurantId !== req.user.organizationId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to view this donation.',
        },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: donation,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { postDonation, listMyDonations, getSingleDonation }


