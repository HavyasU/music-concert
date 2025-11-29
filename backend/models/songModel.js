import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: mongoose.Types.ObjectId, ref: 'artists' },
    duration: Number,
    genre: String,
    songUrl: String,
    playCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

const songModel = mongoose.model('songs', songSchema);

export default songModel;