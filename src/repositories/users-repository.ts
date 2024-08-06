import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findUserWithSameEmail(email: string): Promise<User | null>
}
