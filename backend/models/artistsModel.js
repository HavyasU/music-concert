import mongoose from "mongoose";


const artistSchema = new mongoose.Schema({
    name: "String",
    showsCount: Number,
    isGuest: boolean,
}, {
    timestamps: true
});


const artistsModel = mongoose.model('artists', artistSchema);



export default artistsModel;