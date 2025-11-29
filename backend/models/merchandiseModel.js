import mongoose from "mongoose";

const merchandiseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    itemsSold: { type: Number, default: 0 },
    isSoldOut: { type: Boolean, default: false },
    concert: {
        type: mongoose.Types.ObjectId,
        ref: "concerts",
        required: true
    }
}, {
    timestamps: true
});

const merchandiseModel = mongoose.model('merchandises', merchandiseSchema);

export default merchandiseModel;