const { z } = require('zod')

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5001),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
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

module.exports = parsedEnvironment.data
