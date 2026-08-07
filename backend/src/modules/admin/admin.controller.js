const { StatusCodes } = require('http-status-codes')
const { getAdminDashboardStats } = require('./admin.service')

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

module.exports = {
  getDashboardStats,
}
