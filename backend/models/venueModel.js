import mongoose from "mongoose";


const addressSchema = new mongoose.Schema(
    {
        city: { type: String },
        state: { type: String },
        pin_code: { type: Number }
    }
);

const venueSchema = new mongoose.Schema({
    name: "String",
    Address: addressSchema
}, {
    timestamps: true
});


const venueModel = mongoose.model('venues', venueSchema);


export default venueModel;