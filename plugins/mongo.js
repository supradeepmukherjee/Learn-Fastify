import fastifyPlugin from "fastify-plugin"
import mongoose from "mongoose"

export default fastifyPlugin(async (fastify, o) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        fastify.decorate('mongoose', mongoose)
        fastify.log.info('DB Connected')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})