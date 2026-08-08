const { StatusCodes } = require('http-status-codes')
const { loginSchema, registerSchema } = require('./auth.validation')
const { loginUser, registerUser, getCurrentUser, resubmitOrganization } = require('./auth.service')

async function register(req, res, next) {
  const parsedInput = registerSchema.safeParse(req.body)

  if (!parsedInput.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Registration data is invalid.',
        details: parsedInput.error.issues.map(({ path, message }) => ({ field: path.join('.'), message })),
      },
    })
  }

  try {
    const data = await registerUser(parsedInput.data)

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Registration submitted successfully. Your organization is pending verification.',
      data,
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        error: {
          code: 'DUPLICATE_RECORD',
          message: 'An account or organization with this unique value already exists.',
        },
      })
    }

    return next(error)
  }
}

async function login(req, res, next) {
  const parsedInput = loginSchema.safeParse(req.body)

  if (!parsedInput.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Login data is invalid.',
        details: parsedInput.error.issues.map(({ path, message }) => ({ field: path.join('.'), message })),
      },
    })
  }

  try {
    const result = await loginUser({
      ...parsedInput.data,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    })

    if (!result || result.error === 'INVALID_CREDENTIALS') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      })
    }

    if (result.error === 'ORGANIZATION_PENDING') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          code: 'ORGANIZATION_PENDING',
          message: result.message || 'Your organization is waiting for admin approval.',
        },
      })
    }

    if (result.error === 'ORGANIZATION_REJECTED') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: {
          code: 'ORGANIZATION_REJECTED',
          message: result.message || 'Your organization has been rejected by the administrator.',
        },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful.',
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

async function getMe(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.id)

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User profile not found.' },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    })
  } catch (error) {
    return next(error)
  }
}

async function resubmitOrg(req, res, next) {
  try {
    const { name, phone, description, websiteUrl, registrationNumber } = req.body
    const updated = await resubmitOrganization({
      userId: req.user.id,
      name,
      phone,
      description,
      websiteUrl,
      registrationNumber,
    })

    if (!updated) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: { code: 'ORGANIZATION_NOT_FOUND', message: 'Organization details could not be found.' },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Organization details updated and resubmitted for verification.',
      data: updated,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { login, register, getMe, resubmitOrg }
