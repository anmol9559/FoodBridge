const { StatusCodes } = require('http-status-codes')

function requireRole(...roles) {
  const allowedRoles = roles.flat()

  return (req, res, next) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource.',
        },
      })
    }

    return next()
  }
}

module.exports = { requireRole }
