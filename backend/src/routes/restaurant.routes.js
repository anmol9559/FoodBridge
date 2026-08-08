const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')
const { requireVerifiedOrganization } = require('../middlewares/verification.middleware')
const { validateParams, idParamSchema } = require('../middlewares/validate.middleware')
const {
  postDonation,
  listMyDonations,
  getSingleDonation,
  updateSingleDonation,
  deleteSingleDonation,
  listIncomingReservationsForRestaurant,
  confirmReservation,
  regeneratePin,
  rejectReservation,
} = require('../modules/donation/donation.controller')

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

restaurantRouter.get('/donations', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, listMyDonations)
restaurantRouter.get('/reservations', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, listIncomingReservationsForRestaurant)
restaurantRouter.patch('/reservations/:id/confirm', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, validateParams(idParamSchema), confirmReservation)
restaurantRouter.patch('/reservations/:id/regenerate-pin', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, validateParams(idParamSchema), regeneratePin)
restaurantRouter.patch('/reservations/:id/reject', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, validateParams(idParamSchema), rejectReservation)
restaurantRouter.get('/donations/:id', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, validateParams(idParamSchema), getSingleDonation)
restaurantRouter.post('/donations', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, postDonation)
restaurantRouter.put('/donations/:id', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, validateParams(idParamSchema), updateSingleDonation)
restaurantRouter.delete('/donations/:id', authenticate, requireRole('RESTAURANT'), requireVerifiedOrganization, validateParams(idParamSchema), deleteSingleDonation)

module.exports = restaurantRouter
