import { forgotPassword, login, logout, register, resetPassword } from '../controllers/auth.js'

const app = async (fastify, o) => {
    fastify.post('/register', register)
    fastify.post('/login', login)
    fastify.put('/forgot-password', forgotPassword)
    fastify.put('/reset-password/:token', resetPassword)
    fastify.get('/logout', { preHandler: [fastify.authenticate] }, logout)
}

export default app