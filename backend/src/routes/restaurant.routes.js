const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')
const {
  postDonation,
  listMyDonations,
  getSingleDonation,
  updateSingleDonation,
  deleteSingleDonation,
  listIncomingReservationsForRestaurant,
  confirmReservation,
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
restaurantRouter.patch('/reservations/:id/confirm', authenticate, requireRole('RESTAURANT'), confirmReservation)
restaurantRouter.get('/donations/:id', authenticate, requireRole('RESTAURANT'), getSingleDonation)
restaurantRouter.post('/donations', authenticate, requireRole('RESTAURANT'), postDonation)
restaurantRouter.put('/donations/:id', authenticate, requireRole('RESTAURANT'), updateSingleDonation)
restaurantRouter.delete('/donations/:id', authenticate, requireRole('RESTAURANT'), deleteSingleDonation)

module.exports = restaurantRouter








