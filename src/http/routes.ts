import { FastifyInstance } from 'fastify'
import { verifyJWT } from './middlewares/verify-jwt'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { refresh } from './controllers/refresh'
import { profile } from './controllers/profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
