import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.get('/cookies', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = await reply.jwtSign({
      name: 'foo',
    })

    const refreshToken = await reply.jwtSign(
      {
        name: 'bar',
      },
      { expiresIn: '1d' },
    )

    reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true, // alternative CSRF protection
      })
      .code(200)
      .send({ token })
  })

  app.addHook('onRequest', (request) => request.jwtVerify({ onlyCookie: true }))

  app.get('/verifycookie', (request, reply) => {
    reply.send({ code: 'OK', message: request.cookies })
  })
}
