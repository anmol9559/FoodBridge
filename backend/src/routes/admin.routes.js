const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')
const { getDashboardStats, listRestaurants, listNgos, listDonations } = require('../modules/admin/admin.controller')

const adminRouter = Router()

adminRouter.get('/test', authenticate, requireRole('ADMIN'), (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: 'Admin access granted.',
    data: {
      userId: req.user.id,
      role: req.user.role,
    },
  })
})

adminRouter.get('/dashboard', authenticate, requireRole('ADMIN'), getDashboardStats)
adminRouter.get('/restaurants', authenticate, requireRole('ADMIN'), listRestaurants)
adminRouter.get('/ngos', authenticate, requireRole('ADMIN'), listNgos)
adminRouter.get('/donations', authenticate, requireRole('ADMIN'), listDonations)

module.exports = adminRouter




