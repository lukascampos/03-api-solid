import fastify from 'fastify'
import { appRoutes } from './http/routes'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { _env } from './env/Env'

export const app = fastify()

app.register(appRoutes)
app.register(fastifyJwt, {
  secret: _env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})
app.register(fastifyCookie)
