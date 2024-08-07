import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('Should be able to authenticate', async () => {
    const userCreated = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('test123', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: 'test123',
    })

    expect(user).toEqual(userCreated)
  })

  it('Should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@wrongemail.com',
      password: await hash('test123', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'test123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('testWrongPassword', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'test123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
