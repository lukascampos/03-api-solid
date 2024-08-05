import { FastifyRequest, FastifyReply } from 'fastify'

import { User } from '@/User'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function register(req: FastifyRequest, rep: FastifyReply) {
   const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
   })

   const { name, email, password } = registerBodySchema.parse(req.body)

   const user = new User(name, email, password)

   await prisma.user.create({
      data: {
         name: user.getName,
         email: user.getEmail,
         password: user.getPassword,
      },
   })

   return rep.status(201).send()
}
