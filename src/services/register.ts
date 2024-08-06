import { UserEntity, UserProps } from '@/entities/User'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlredyExistsError } from './errors/user-alredy-exists-error'

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: UserProps) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlredyExistsError()
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
