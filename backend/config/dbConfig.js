import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const db = await mongoose.connect('mongodb+srv://music-concert:music-concert@music-concert.mej6ngc.mongodb.net/concert').then(() => {
            console.log("DB connected successfully");
        });
    } catch (error) {
        console.log(error);
    }
};