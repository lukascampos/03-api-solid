import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { _env } from './env/Env'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(appRoutes)
app.register(fastifyJwt, {
  secret: _env.JWT_SECRET,
})

app.setErrorHandler((error, _req, rep) => {
  if (error instanceof ZodError) {
    return rep
      .status(400)
      .send({ message: 'Validation Error.', issues: error.format() })
  }

  if (_env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // log to an external tool
  }

  return rep.status(500).send({ message: 'Internal server error' })
})
