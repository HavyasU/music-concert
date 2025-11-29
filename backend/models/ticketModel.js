import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    attendeePhone: { type: String, required: true },
    ticketDate: { type: Date, default: Date.now },
    venue: {
        type: mongoose.Types.ObjectId,
        ref: "venues",
        required: true
    },
    concert: {
        type: mongoose.Types.ObjectId,
        ref: "concerts",
        required: true
    },
    price: { type: Number, required: true }
}, {
    timestamps: true
});

const ticketModel = mongoose.model('tickets', ticketSchema);

export default ticketModel;