import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    website: String,
    logo: String
}, {
    timestamps: true
});

const sponsorModel = mongoose.model('sponsors', sponsorSchema);

export default sponsorModel;