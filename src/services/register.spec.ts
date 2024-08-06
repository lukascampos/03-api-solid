import { describe, it, expect } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'

describe('Register Service', () => {
  it('Should hash user password', async () => {
    const registerService = new RegisterService({
      async findByEmail() {
        return null
      },

      async create(data) {
        return {
          id: 'user1',
          name: data.name,
          email: data.email,
          password: data.password,
          created_at: new Date(),
        }
      },
    })

    const { userCreated } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'test123',
    })

    const isPasswordCorrectlyHashed = await compare(
      'test123',
      userCreated.password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
