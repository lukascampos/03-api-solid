import { UserEntity, UserProps } from '@/entities/User'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlredyExistsError } from './errors/user-alredy-exists-error'
import { User } from '@prisma/client'

interface RegisterServiceResponse {
  userCreated: User
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: UserProps): Promise<RegisterServiceResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlredyExistsError()
    }

    const user = new UserEntity({ name, email, password })

    const passwordHash = await hash(user.getPassword, 6)

    const userCreated = await this.usersRepository.create({
      name: user.getName,
      email: user.getEmail,
      password: passwordHash,
    })

    return { userCreated }
  }
}
