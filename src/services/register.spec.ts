import { describe, it, expect } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlredyExistsError } from './errors/user-alredy-exists-error'

describe('Register Service', () => {
  it('Should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { userCreated } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test123',
    })

    expect(userCreated.id).toEqual(expect.any(String))
  })

  it('Should hash user password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { userCreated } = await registerService.execute({
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
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const email = 'johndoe@example.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: 'test123',
    })

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: 'test123',
      }),
    ).rejects.toBeInstanceOf(UserAlredyExistsError)
  })
})
