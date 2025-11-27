import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true
        },
        password: String,
        phone: Number
    },
    {
        timestamps: true
    }
);

export const adminModel = mongoose.model("admin", adminSchema);




