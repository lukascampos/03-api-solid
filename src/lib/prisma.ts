import { _env } from '@/env/Env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: _env.NODE_ENV === 'dev' ? ['query'] : [''],
})
