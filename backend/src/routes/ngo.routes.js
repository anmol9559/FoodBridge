const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')
const { listAvailableDonationsForNgo, reserveDonation } = require('../modules/donation/donation.controller')

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

ngoRouter.get('/donations', authenticate, requireRole('NGO'), listAvailableDonationsForNgo)
ngoRouter.post('/donations/:id/reserve', authenticate, requireRole('NGO'), reserveDonation)

module.exports = ngoRouter


