const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
const { PrismaClient } = require('../../generated/prisma')
const env = require('../config/env')

const databaseUrl = new URL(env.DATABASE_URL)

if (databaseUrl.protocol !== 'mysql:') {
  throw new Error('DATABASE_URL must use the mysql:// protocol.')
}

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: databaseUrl.port ? Number(databaseUrl.port) : 3306,
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1),
  connectionLimit: 10,
})

const prisma = new PrismaClient({ adapter })

module.exports = prisma
