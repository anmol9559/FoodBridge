const { StatusCodes } = require('http-status-codes')
const prisma = require('../lib/prisma')

async function requireVerifiedOrganization(req, res, next) {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required.',
      },
    })
  }

  // ADMIN role bypasses organization verification requirement
  if (req.user.role === 'ADMIN') {
    return next()
  }

  if (!req.user.organizationId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      error: {
        code: 'ORGANIZATION_NOT_VERIFIED',
        message: 'Your organization verification is pending approval by an administrator.',
      },
    })
  }

  const organization = await prisma.organization.findUnique({
    where: { id: req.user.organizationId },
    select: { verificationStatus: true },
  })

  if (!organization || organization.verificationStatus !== 'VERIFIED') {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      error: {
        code: 'ORGANIZATION_NOT_VERIFIED',
        message: 'Your organization verification is pending approval by an administrator.',
      },
    })
  }

  return next()
}

module.exports = { requireVerifiedOrganization }
