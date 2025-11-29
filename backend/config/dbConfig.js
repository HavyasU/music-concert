import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://music-concert:music-concert@music-concert.mej6ngc.mongodb.net/concert';
        await mongoose.connect(mongoURI);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
        // Continue startup even if MongoDB is not available
        console.log("Server will continue without database connection");
    }
};