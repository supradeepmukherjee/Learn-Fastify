import Fastify from "fastify"
import { configDotenv } from "dotenv"
import cors from "@fastify/cors"
import fastifySensible from "@fastify/sensible"
import mongo from "./plugins/mongo.js"

configDotenv()

const fastify = Fastify({ logger: true })

fastify.register(cors)
fastify.register(fastifySensible)
fastify.register(mongo)

fastify.get('/', async (req, res) => {
    try {
        const mongoose = fastify.mongoose
        const connectionState = mongoose.connection.readyState
        let status = ''
        if (connectionState === 0) status = 'disconnected'
        else if (connectionState === 1) status = 'connected'
        else if (connectionState === 2) status = 'connecting'
        else if (connectionState === 3) status = 'disconnecting'
        else status = 'unknown'
        res.send({ status })
    } catch (err) {
        fastify.log.error(err)
        res.status(500).send({ err })
        process.exit(1)
    }
})

const port = process.env.PORT

try {
    fastify.listen({ port })
    fastify.log.info(`Server is running on port ${port}`)
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}