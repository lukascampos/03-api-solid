import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlredyExistsError } from './errors/user-alredy-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('Should be able to register', async () => {
    const { userCreated } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test123',
    })

    expect(userCreated.id).toEqual(expect.any(String))
  })

  it('Should hash user password', async () => {
    const { userCreated } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test123',
    })

    const isPasswordCorrectlyHashed = await compare(
      'test123',
      userCreated.password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: 'test123',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: 'test123',
      }),
    ).rejects.toBeInstanceOf(UserAlredyExistsError)
  })
})
