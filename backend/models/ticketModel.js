import mongoose from "mongoose";


const ticketSchema = mongoose.Schema({
    "date": Date,
    "concert": mongoose.Types.ObjectId
}, {
    timestamps: true
});


const ticketModel = mongoose.model('tickets', ticketSchema);



export default ticketModel;