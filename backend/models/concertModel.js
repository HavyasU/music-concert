import mongoose from "mongoose";


const concertSchema = new mongoose.Schema({
    name: String,
    venue: {
        type: mongoose.Types.ObjectId,
        ref: "venues"
    },
    artistsType: {
        type: String,
        enum: ["solo", "band"]
    },
    concertDate: Date,
    concertTime: Date,
    artists: [{ type: mongoose.Types.ObjectId, ref: 'artists' }],
    sponsors: [{ type: mongoose.Types.ObjectId, ref: 'sponsors' }],
    playlist: [{ type: mongoose.Types.ObjectId, ref: 'songs' }],
}, {
    timestamps: true
});


const concertModel = mongoose.model('concerts', concertSchema);



export default concertModel;