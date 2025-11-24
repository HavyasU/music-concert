import mongoose from "mongoose";


const concertSchema = mongoose.Schema({
    name: String,
    venue: mongoose.Types.ObjectId,
    artists: [{ type: mongoose.Types.ObjectId, ref: 'artists' }],
    sponsors: [{ type: mongoose.Types.ObjectId, ref: 'sponsors' }],
    playlist: [{ type: mongoose.Types.ObjectId, ref: 'playlists' }],
    merchandise: [{ type: mongoose.Types.ObjectId, ref: 'merchandise' }],
}, {
    timestamps: true
});


const ticketModel = mongoose.model('tickets', ticketSchema);



export default ticketModel;