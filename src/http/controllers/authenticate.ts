import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'
import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const authenticateService = makeAuthenticateService()

    const { user } = await authenticateService.execute({ email, password })

    const refreshToken = await rep.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return rep.status(200).send({ refreshToken })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return rep.status(400).send({ message: err.message })
    }

    throw err
  }
}
