import { describe, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Service', () => {
  it('Should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

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
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

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
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

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
