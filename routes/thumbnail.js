import { createThumbnail, deleteAllThumbnails, deleteThumbnail, getThumbnail, getThumbnails, updateThumbnail } from '../controllers/thumbnail.js'

const app = async fastify => {
    fastify.register(async fastify => {
        fastify.addHook('preHandler', fastify.authenticate)
        fastify.post('/', createThumbnail)
        fastify.get('/', getThumbnails)
        fastify.get('/:id', getThumbnail)
        fastify.put('/:id', updateThumbnail)
        fastify.delete('/:id', deleteThumbnail)
        fastify.delete('/', deleteAllThumbnails)
    })
}

export default app