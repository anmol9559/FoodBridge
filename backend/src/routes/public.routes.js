const { Router } = require('express')
const { getPublicStats } = require('../modules/public/public.controller')

const publicRouter = Router()

publicRouter.get('/stats', getPublicStats)

module.exports = publicRouter
