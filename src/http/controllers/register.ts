import { FastifyRequest, FastifyReply } from 'fastify'

import { User } from '@/User'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'

export async function register(req: FastifyRequest, rep: FastifyReply) {
   const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
   })

   const { name, email, password } = registerBodySchema.parse(req.body)

   const userWithSameEmail = await prisma.user.findUnique({
      where: {
         email,
      }
   })

   if(userWithSameEmail){
      return rep.status(409).send()
   }

   const user = new User(name, email, password)

   const passwordHash = await hash(user.getPassword, 6)

   await prisma.user.create({
      data: {
         name: user.getName,
         email: user.getEmail,
         password: passwordHash,
      },
   })

   return rep.status(201).send()
}
