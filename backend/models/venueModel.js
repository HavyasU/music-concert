import mongoose from "mongoose";


const addressSchema = mongoose.Schema(
    {
        city: { type: String },
        state: { type: String },
        pin_code: { type: Number }
    }
);

const venueSchema = mongoose.Schema({
    name: "String",
    Address: addressSchema
}, {
    timestamps: true
});


const venueModel = mongoose.model('venues', venueSchema);


export default venueModel;