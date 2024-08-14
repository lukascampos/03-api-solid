import fastify from 'fastify'
import { appRoutes } from './http/routes'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(appRoutes)
app.register(fastifyJwt, {
  secret: 'foobar',
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})
app.register(fastifyCookie)
