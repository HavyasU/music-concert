import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin_code: { type: Number }
});

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    address: addressSchema
}, {
    timestamps: true
});

const venueModel = mongoose.model('venues', venueSchema);

export default venueModel;