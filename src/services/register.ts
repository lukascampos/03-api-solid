import { UserEntity, UserProps } from '@/entities/User'
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: UserProps) {
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

    await this.usersRepository.create({
      name: user.getName,
      email: user.getEmail,
      password: passwordHash,
    })
  }
}
