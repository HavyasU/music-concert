import mongoose from "mongoose";


const sponsorsSchema = new mongoose.Schema({
    name: "String",
    amount: Number
}, {
    timestamps: true
});


const sponsorsModel = mongoose.model('sponsors', sponsorsSchema);



export default sponsorsModel;