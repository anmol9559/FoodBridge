const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const env = require('../config/env')
const prisma = require('../lib/prisma')

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token is required.',
      },
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: 'foodbridge-api',
      audience: 'foodbridge-web',
    })

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.sub,
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
      },
    })

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User account is inactive or no longer exists.',
        },
      })
    }

    req.user = user
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Authentication token has expired.',
        },
      })
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Authentication token is invalid.',
      },
    })
  }
}

module.exports = { authenticate }
