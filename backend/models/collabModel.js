import mongoose from "mongoose";


const collaborationsSchema = new mongoose.Schema({
    artists: [{
        type: mongoose.Types.ObjectId,
        ref: "artists",
    }],
    concertId: {
        type: mongoose.Types.ObjectId,
        ref: "concerts"
    }
}, {
    timestamps: true
});


const collaborationsModel = mongoose.model('collaborations', collaborationsSchema);



export default collaborationsModel;