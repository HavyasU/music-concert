import mongoose from "mongoose";


const songSchema = new mongoose.Schema({
    name: String,
    songUrl: String,
}, {
    timestamps: true
});


const songModel = mongoose.model('songs', songSchema);



export default songModel;