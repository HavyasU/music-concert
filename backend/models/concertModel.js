import mongoose from "mongoose";

const concertSchema = new mongoose.Schema({
    name: { type: String, required: true },
    venue: {
        type: mongoose.Types.ObjectId,
        ref: "venues",
        required: true
    },
    concertDate: { type: Date, required: true },
    concertTime: { type: String, required: true },
    description: String,
    artists: [{ type: mongoose.Types.ObjectId, ref: 'artists' }],
    sponsors: [{ type: mongoose.Types.ObjectId, ref: 'sponsors' }],
    playlist: [{ type: mongoose.Types.ObjectId, ref: 'songs' }],
    ticketPrice: { type: Number, required: true },
    capacity: { type: Number, required: true }
}, {
    timestamps: true
});

const concertModel = mongoose.model('concerts', concertSchema);

export default concertModel;