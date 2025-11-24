import mongoose from "mongoose";


const attendeesSchema = new mongoose.Schema({
    name: String,
    email: "String",
    phone: number,
}, {
    timestamps: true
});


const attendeesModel = mongoose.model('attendees', attendeesSchema);



export default attendeesModel;