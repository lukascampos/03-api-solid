import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileService } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get user profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('Should be able to get the user profile', async () => {
    const userCreated = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('test123', 6),
    })

    const { user } = await sut.execute({
      userId: userCreated.id,
    })

    expect(user).toEqual(userCreated)
  })

  it('Should not be able to get the user profile if the user not exists', async () => {
    expect(() =>
      sut.execute({ userId: 'uuidNotExist' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
