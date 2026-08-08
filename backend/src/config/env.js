require('dotenv').config()
const { z } = require('zod')

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5001),
  CLIENT_URL: z.string().default('http://localhost:3000,http://localhost:5173'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().regex(/^[1-9]\d*[smhd]$/).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^[1-9]\d*[smhd]$/).default('30d'),
})

const parsedEnvironment = environmentSchema.safeParse(process.env)

if (!parsedEnvironment.success) {
  console.error('Invalid environment configuration:', parsedEnvironment.error.flatten().fieldErrors)
  process.exit(1)
}

const envData = parsedEnvironment.data

const rawOrigins = envData.CLIENT_URL ? envData.CLIENT_URL.split(',') : []
const defaultDevOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
]

const allowedOrigins = Array.from(
  new Set([...defaultDevOrigins, ...rawOrigins].map((url) => url.trim()).filter(Boolean))
)

module.exports = {
  ...envData,
  ALLOWED_ORIGINS: allowedOrigins,
}
