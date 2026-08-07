const { StatusCodes } = require('http-status-codes')
const { loginSchema, registerSchema } = require('./auth.validation')
const { loginUser, registerUser } = require('./auth.service')

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
    const data = await loginUser({
      ...parsedInput.data,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    })

    if (!data) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful.',
      data,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { login, register }
