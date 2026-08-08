const { StatusCodes } = require('http-status-codes')
const { getPublicPlatformStats } = require('./public.service')

async function getPublicStats(req, res, next) {
  try {
    const stats = await getPublicPlatformStats()

    return res.status(StatusCodes.OK).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { getPublicStats }
