import mongoose from "mongoose";


const ticketSchema = mongoose.Schema({
    name: String,
    email: "String",
    phone: number,
    "date": Date,
    venue: {
        type: mongoose.Types.ObjectId,
        ref: "venues"
    },
    "concert": {
        type: mongoose.Types.ObjectId,
        ref: "concerts"
    }
}, {
    timestamps: true
});


const ticketModel = mongoose.model('tickets', ticketSchema);



export default ticketModel;