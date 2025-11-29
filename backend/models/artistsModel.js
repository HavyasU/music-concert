import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['solo', 'band', 'guest'], default: 'solo' },
    genres: [String],
    bio: String
}, {
    timestamps: true
});

const artistsModel = mongoose.model('artists', artistSchema);

export default artistsModel;