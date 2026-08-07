const { StatusCodes } = require('http-status-codes')

function notFoundHandler(req, res) {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} was not found.` },
  })
}

function errorHandler(error, req, res, _next) {
  console.error(error)
  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.expose ? error.message : 'An unexpected error occurred.',
    },
  })
}

module.exports = { errorHandler, notFoundHandler }
