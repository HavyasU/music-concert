import mongoose from "mongoose";


const merchandiseSchema = new mongoose.Schema({
    name: "String",
    price: Number,
    stockQuantity: Number,
    itemsSold: Number,
    isSoldOut: boolean,
    concert: {
        type: mongoose.Types.ObjectId,
        ref: "concerts"
    }
}, {
    timestamps: true
});


const merchandiseModel = mongoose.model('merchandises', merchandiseSchema);



export default merchandiseModel;