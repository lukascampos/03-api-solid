import { UserEntity, UserProps } from '@/entities/User'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function registerService({ name, email, password }: UserProps) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail alredy exists')
  }

  const user = new UserEntity({ name, email, password })

  const passwordHash = await hash(user.getPassword, 6)

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name: user.getName,
    email: user.getEmail,
    password: passwordHash,
  })
}
