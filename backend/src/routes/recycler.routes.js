const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')

const recyclerRouter = Router()

recyclerRouter.get('/test', authenticate, requireRole('RECYCLER'), (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Recycler access granted.',
    data: {
      userId: req.user.id,
      role: req.user.role,
    },
  })
})

module.exports = recyclerRouter
