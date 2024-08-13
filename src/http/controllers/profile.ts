import { makeGetUserProfileService } from '@/services/factories/make-get-user-profile-service'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(req: FastifyRequest, rep: FastifyReply) {
  await req.jwtVerify()

  const getUserProfile = makeGetUserProfileService()

  const { user } = await getUserProfile.execute({
    userId: req.user.sub,
  })

  return rep.status(200).send({
    user: {
      ...user,
      password: undefined,
    },
  })
}
