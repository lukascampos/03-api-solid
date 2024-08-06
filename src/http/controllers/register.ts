import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlredyExistsError } from '@/services/errors/user-alredy-exists-error'
import { RegisterService } from '@/services/register'
import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(usersRepository)

    await registerService.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlredyExistsError) {
      return rep.status(409).send({ message: err.message })
    }

    return rep.status(500).send()
  }

  return rep.status(201).send()
}
