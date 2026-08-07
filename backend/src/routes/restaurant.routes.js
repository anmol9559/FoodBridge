const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')

const restaurantRouter = Router()

restaurantRouter.get('/test', authenticate, requireRole('RESTAURANT'), (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Restaurant access granted.',
    data: {
      userId: req.user.id,
      role: req.user.role,
    },
  })
})

module.exports = restaurantRouter
