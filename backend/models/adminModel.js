import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
    username: {
        type: "String",
        unique: true
    },
    email: String,
    password: string
}, {
    timestamps: true
});


const adminModel = mongoose.model('admins', adminSchema);



export default adminModel;