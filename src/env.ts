import { z } from 'zod'

const envSchema = z.object({
  JWT_SECRET_KEY: z.string(),
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  RESEND_API_KEY: z.string(),
  DATABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
