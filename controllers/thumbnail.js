import { pipeline } from 'stream'
import util from 'util'
import fs from 'fs'
import { Thumbnail } from '../models/Thumbnail.js'

const asyncPipeline = util.promisify(pipeline)

const createThumbnail = async (req, res) => {
    try {
        const parts = req.part()
        let fields = {}
        let fileName = ''
        for await (const p of parts) {
            if (p.file) {
                fileName = `${Date.now()}-${p.filename}`
                await asyncPipeline(p.file, fs.createWriteStream(path.join(__dirname, '..', 'uploads', 'thumbnails', fileName)))
            } else fields[p.filename] = p.value
        }
        const thumbnail = new Thumbnail({
            user: req.user.id,
            vidName: fields.videoName,
            version: fields.version,
            img: `/uploads/thumbnail/` + fileName,
            paid: fields.paid === 'true'
        })
        await thumbnail.save()
        res.code(201).send({ thumbnail, msg: 'Thumbnail Created Successfully' })
    } catch (err) {
        reply.send(err)
    }
}

const getThumbnails = async (req, res) => {
    try {
        const thumbnails = await Thumbnail.find({ user: req.user.id })
        res.code(200).send({ thumbnails })
    } catch (err) {
        reply.send(err)
    }
}

const getThumbnail = async (req, res) => {
    try {
        const thumbnail = await Thumbnail.findOne({
            _id: req.params.id,
            user: req.user.id
        })
        if (!thumbnail) return res.notFound('Thumbnail not found')
        res.code(200).send({ thumbnail })
    } catch (err) {
        reply.send(err)
    }
}

const updateThumbnail = async (req, res) => {
    try {
        const thumbnail = await Thumbnail.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id

            },
            req.body,
            { new: true }
        )
        if (!thumbnail) return res.notFound('Thumbnail not found')
        res.code(200).send({ thumbnail, msg: 'Thumbnail Updated Successfully' })
    } catch (err) {
        reply.send(err)
    }
}

const deleteThumbnail = async (req, res) => {
    try {
        const thumbnail = await Thumbnail.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id

        })
        if (!thumbnail) return res.notFound('Thumbnail not found')
        fs.unlink(path.join(__dirname, '..', 'uploads', 'thumbnails', path.basename(thumbnail.img)), err => {
            if (err) fastify.error(err)
        })
        res.code(200).send({ msg: 'Thumbnail Deleted Successfully' })
    } catch (err) {
        reply.send(err)
    }
}

const deleteAllThumbnails = async (req, res) => {
    try {
        const thumbnails = await Thumbnail.find({ user: req.user.id })
        await Thumbnail.deleteMany({ user: req.user.id })
        for (const t of thumbnails) {
            fs.unlink(path.join(__dirname, '..', 'uploads', 'thumbnails', path.basename(t.img)), err => {
                if (err) fastify.error(err)
            })
        }
        res.code(200).send({ msg: 'All Thumbnails Deleted Successfully' })
    } catch (err) {
        reply.send(err)
    }
}

export { createThumbnail, getThumbnails, getThumbnail, updateThumbnail, deleteThumbnail, deleteAllThumbnails }