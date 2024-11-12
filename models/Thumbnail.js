import mongoose from "mongoose";

const thumbnailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FastifyUser',
        required: true
    },
    vidName: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    version:  String,
    paid: {
        type: Boolean,
        default: false
    },
})

export const Thumbnail = mongoose.model('FastifyThumbnail', thumbnailSchema)