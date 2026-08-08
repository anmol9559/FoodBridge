const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')
const { validateParams, idParamSchema } = require('../middlewares/validate.middleware')
const {
  postDonation,
  listMyDonations,
  getSingleDonation,
  updateSingleDonation,
  deleteSingleDonation,
  listIncomingReservationsForRestaurant,
  confirmReservation,
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

restaurantRouter.get('/donations', authenticate, requireRole('RESTAURANT'), listMyDonations)
restaurantRouter.get('/reservations', authenticate, requireRole('RESTAURANT'), listIncomingReservationsForRestaurant)
restaurantRouter.patch('/reservations/:id/confirm', authenticate, requireRole('RESTAURANT'), validateParams(idParamSchema), confirmReservation)
restaurantRouter.patch('/reservations/:id/reject', authenticate, requireRole('RESTAURANT'), validateParams(idParamSchema), rejectReservation)
restaurantRouter.get('/donations/:id', authenticate, requireRole('RESTAURANT'), validateParams(idParamSchema), getSingleDonation)
restaurantRouter.post('/donations', authenticate, requireRole('RESTAURANT'), postDonation)
restaurantRouter.put('/donations/:id', authenticate, requireRole('RESTAURANT'), validateParams(idParamSchema), updateSingleDonation)
restaurantRouter.delete('/donations/:id', authenticate, requireRole('RESTAURANT'), validateParams(idParamSchema), deleteSingleDonation)

module.exports = restaurantRouter










