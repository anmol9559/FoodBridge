const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')
const { authenticate } = require('../middlewares/auth.middleware')
const { requireRole } = require('../middlewares/role.middleware')
const { validateParams, idParamSchema } = require('../middlewares/validate.middleware')
const {
  getDashboardStats,
  listRestaurants,
  listNgos,
  listDonations,
  listReservations,
  listPendingOrganizations,
  verifyOrganization,
  rejectOrganization,
} = require('../modules/admin/admin.controller')

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
adminRouter.get('/reservations', authenticate, requireRole('ADMIN'), listReservations)
adminRouter.get('/organizations/pending', authenticate, requireRole('ADMIN'), listPendingOrganizations)
adminRouter.patch('/organizations/:id/verify', authenticate, requireRole('ADMIN'), validateParams(idParamSchema), verifyOrganization)
adminRouter.patch('/organizations/:id/reject', authenticate, requireRole('ADMIN'), validateParams(idParamSchema), rejectOrganization)

module.exports = adminRouter
