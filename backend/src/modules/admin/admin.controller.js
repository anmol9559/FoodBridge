const { StatusCodes } = require('http-status-codes')
const {
  adminListRestaurantsQuerySchema,
  adminListNgosQuerySchema,
  adminListDonationsQuerySchema,
} = require('./admin.validation')
const {
  getAdminDashboardStats,
  getRestaurantsForAdmin,
  getNgosForAdmin,
  getDonationsForAdmin,
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

module.exports = {
  getDashboardStats,
  listRestaurants,
  listNgos,
  listDonations,
}



