require('dotenv').config()

const app = require('./app')
const env = require('./config/env')

const server = app.listen(env.PORT, () => {
  console.log(`FoodBridge API listening on port ${env.PORT}`)
})

function closeServer(signal) {
  console.log(`${signal} received; shutting down gracefully.`)
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => closeServer('SIGINT'))
process.on('SIGTERM', () => closeServer('SIGTERM'))
