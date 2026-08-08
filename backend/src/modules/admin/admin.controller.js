const { StatusCodes } = require('http-status-codes')
const {
  adminListRestaurantsQuerySchema,
  adminListNgosQuerySchema,
  adminListDonationsQuerySchema,
  adminListReservationsQuerySchema,
  verifyOrganizationBodySchema,
} = require('./admin.validation')
const {
  getAdminDashboardStats,
  getRestaurantsForAdmin,
  getNgosForAdmin,
  getDonationsForAdmin,
  getReservationsForAdmin,
  getPendingOrganizationsForAdmin,
  verifyOrganizationForAdmin,
} = require('./admin.service')

async function getDashboardStats(req, res, next) {
  try {
    const stats = await getAdminDashboardStats()

    return res.status(StatusCodes.OK).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    return next(error)
  }
}

async function listRestaurants(req, res, next) {
  const parsedQuery = adminListRestaurantsQuerySchema.safeParse(req.query)

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
    const result = await getRestaurantsForAdmin(parsedQuery.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function listNgos(req, res, next) {
  const parsedQuery = adminListNgosQuerySchema.safeParse(req.query)

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
    const result = await getNgosForAdmin(parsedQuery.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function listDonations(req, res, next) {
  const parsedQuery = adminListDonationsQuerySchema.safeParse(req.query)

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
    const result = await getDonationsForAdmin(parsedQuery.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function listReservations(req, res, next) {
  const parsedQuery = adminListReservationsQuerySchema.safeParse(req.query)

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
    const result = await getReservationsForAdmin(parsedQuery.data)

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function listPendingOrganizations(req, res, next) {
  try {
    const { status, type, search } = req.query
    const result = await getPendingOrganizationsForAdmin({ status, type, search })
    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function verifyOrganization(req, res, next) {
  const { id } = req.params
  const parsedInput = verifyOrganizationBodySchema.safeParse(req.body)

  if (!parsedInput.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Organization verification data is invalid.',
        details: parsedInput.error.issues.map(({ path, message }) => ({
          field: path.join('.'),
          message,
        })),
      },
    })
  }

  try {
    const result = await verifyOrganizationForAdmin(id, parsedInput.data.status, parsedInput.data.reason)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Organization not found.',
        },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Organization status updated to ${parsedInput.data.status}.`,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function rejectOrganization(req, res, next) {
  const { id } = req.params
  const reason = req.body?.reason

  try {
    const result = await verifyOrganizationForAdmin(id, 'REJECTED', reason)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Organization not found.',
        },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Organization status updated to REJECTED.',
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getDashboardStats,
  listRestaurants,
  listNgos,
  listDonations,
  listReservations,
  listPendingOrganizations,
  verifyOrganization,
  rejectOrganization,
}
