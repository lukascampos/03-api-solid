import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((userEmail) => userEmail.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.users.find((userId) => userId.id === id)

    if (!user) {
      return null
    }

    return user
  }
}
