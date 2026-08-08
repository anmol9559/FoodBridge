const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')
const { validateParams, idParamSchema } = require('../middlewares/validate.middleware')
const {
  listAvailableDonationsForNgo,
  reserveDonation,
  listMyReservations,
  completePickup,
} = require('../modules/donation/donation.controller')

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
ngoRouter.post('/donations/:id/reserve', authenticate, requireRole('NGO'), validateParams(idParamSchema), reserveDonation)
ngoRouter.get('/reservations', authenticate, requireRole('NGO'), listMyReservations)
ngoRouter.patch('/reservations/:id/complete', authenticate, requireRole('NGO'), validateParams(idParamSchema), completePickup)

module.exports = ngoRouter





