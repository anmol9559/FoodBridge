const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const { login, register, getMe, resubmitOrg } = require('../modules/auth/auth.controller')
const { authenticate } = require('../middlewares/auth.middleware')

const authRouter = Router()

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many registration attempts. Please try again later.' },
  },
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please try again later.' },
  },
})

authRouter.post('/register', registerLimiter, register)
authRouter.post('/login', loginLimiter, login)
authRouter.get('/me', authenticate, getMe)
authRouter.post('/organization/resubmit', authenticate, resubmitOrg)

module.exports = authRouter
