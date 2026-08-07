const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')

const ngoRouter = Router()

ngoRouter.get('/test', authenticate, requireRole('NGO'), (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'NGO access granted.',
    data: {
      userId: req.user.id,
      role: req.user.role,
    },
  })
})

module.exports = ngoRouter
