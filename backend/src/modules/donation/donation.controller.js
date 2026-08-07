const { StatusCodes } = require('http-status-codes')
const {
  createDonationSchema,
  listDonationsQuerySchema,
  updateDonationSchema,
  ngoListDonationsQuerySchema,
  listNgoReservationsQuerySchema,
  listRestaurantReservationsQuerySchema,
} = require('./donation.validation')
const {
  createDonation,
  getRestaurantDonations,
  getDonationById,
  updateDonation,
  softDeleteDonation,
  getAvailableDonationsForNgo,
  reserveDonationForNgo,
  getNgoReservations,
  getRestaurantReservations,
  confirmReservationForRestaurant,
} = require('./donation.service')

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

async function updateSingleDonation(req, res, next) {
  const { id } = req.params
  const parsedInput = updateDonationSchema.safeParse(req.body)

  if (!parsedInput.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Donation update data is invalid.',
        details: parsedInput.error.issues.map(({ path, message }) => ({
          field: path.join('.'),
          message,
        })),
      },
    })
  }

  try {
    const existingDonation = await getDonationById(id)

    if (!existingDonation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Food donation not found.',
        },
      })
    }

    if (existingDonation.restaurantId !== req.user.organizationId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this donation.',
        },
      })
    }

    const updatedDonation = await updateDonation(id, parsedInput.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Food donation updated successfully.',
      data: updatedDonation,
    })
  } catch (error) {
    return next(error)
  }
}

async function deleteSingleDonation(req, res, next) {
  try {
    const { id } = req.params
    const existingDonation = await getDonationById(id)

    if (!existingDonation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Food donation not found.',
        },
      })
    }

    if (existingDonation.restaurantId !== req.user.organizationId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this donation.',
        },
      })
    }

    await softDeleteDonation(id)

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Food donation deleted successfully.',
    })
  } catch (error) {
    return next(error)
  }
}

async function listAvailableDonationsForNgo(req, res, next) {
  const parsedQuery = ngoListDonationsQuerySchema.safeParse(req.query)

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

  try {
    const result = await getAvailableDonationsForNgo(parsedQuery.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function reserveDonation(req, res, next) {
  if (!req.user.organizationId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'ORGANIZATION_REQUIRED',
        message: 'Authenticated NGO user is not associated with an organization.',
      },
    })
  }

  const { id } = req.params

  try {
    const result = await reserveDonationForNgo({
      donationId: id,
      ngoId: req.user.organizationId,
      userId: req.user.id,
      notes: req.body?.notes,
    })

    if (result.status === 'NOT_FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Food donation not found.',
        },
      })
    }

    if (result.status === 'UNAVAILABLE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          code: 'UNAVAILABLE',
          message: 'Food donation is already reserved or unavailable.',
        },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Food donation reserved successfully.',
      data: result.reservation,
    })
  } catch (error) {
    return next(error)
  }
}

async function listMyReservations(req, res, next) {
  if (!req.user.organizationId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'ORGANIZATION_REQUIRED',
        message: 'Authenticated NGO user is not associated with an organization.',
      },
    })
  }

  const parsedQuery = listNgoReservationsQuerySchema.safeParse(req.query)

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

  try {
    const result = await getNgoReservations(req.user.organizationId, parsedQuery.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function listIncomingReservationsForRestaurant(req, res, next) {
  if (!req.user.organizationId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'ORGANIZATION_REQUIRED',
        message: 'Authenticated restaurant user is not associated with an organization.',
      },
    })
  }

  const parsedQuery = listRestaurantReservationsQuerySchema.safeParse(req.query)

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

  try {
    const result = await getRestaurantReservations(req.user.organizationId, parsedQuery.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function confirmReservation(req, res, next) {
  if (!req.user.organizationId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'ORGANIZATION_REQUIRED',
        message: 'Authenticated restaurant user is not associated with an organization.',
      },
    })
  }

  const { id } = req.params

  try {
    const result = await confirmReservationForRestaurant({
      reservationId: id,
      restaurantId: req.user.organizationId,
    })

    if (result.status === 'NOT_FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Reservation not found.',
        },
      })
    }

    if (result.status === 'FORBIDDEN') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to confirm this reservation.',
        },
      })
    }

    if (result.status === 'INVALID_STATUS') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Only pending reservations can be confirmed.',
        },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Reservation confirmed successfully.',
      data: result.data,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  postDonation,
  listMyDonations,
  getSingleDonation,
  updateSingleDonation,
  deleteSingleDonation,
  listAvailableDonationsForNgo,
  reserveDonation,
  listMyReservations,
  listIncomingReservationsForRestaurant,
  confirmReservation,
}









