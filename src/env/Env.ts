import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

const env = envSchema.safeParse(process.env)

if (env.success === false) {
  console.error('❌ Invalid environment variables', env.error.format())

  throw new Error('Invalid environment variables.')
}

export const _env = env.data
