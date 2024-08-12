import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { randomUUID } from 'node:crypto'
import { CannotChekInTwiceInTheSameDayError } from './errors/cannot-checkin-twice-in-the-same-day-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: randomUUID(),
      gymId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(CannotChekInTwiceInTheSameDayError)
  })

  it('Should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 7, 13, 0, 0))

    await sut.execute({
      userId: 'gym01',
      gymId: 'user01',
    })

    vi.setSystemTime(new Date(2024, 7, 14, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'gym01',
      gymId: 'user01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
