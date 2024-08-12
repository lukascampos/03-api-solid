export class CannotChekInTwiceInTheSameDayError extends Error {
  constructor() {
    super('You cannot checkin twice in the same day.')
  }
}
