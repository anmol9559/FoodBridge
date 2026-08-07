const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')

const healthRouter = Router()

healthRouter.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({ success: true, data: { status: 'ok' } })
})

module.exports = healthRouter
