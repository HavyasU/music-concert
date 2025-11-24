import mongoose from "mongoose";


const ticketSchema = mongoose.Schema({
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