import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'

const jwt = fp(async fastify => {
    fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET })
    fastify.decorate('authenticate', async (req, res) => {
        try {
            await req.jwtVerify()
        } catch (err) {
            res.send(err)
        }
    })
})

export default jwt