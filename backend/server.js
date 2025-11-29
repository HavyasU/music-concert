import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import concertRoutes from "./routes/concertRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import attendeeRoutes from "./routes/attendeesRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import sponsorRoutes from "./routes/sponsorRoutes.js";
import merchandiseRoutes from "./routes/merchandiseRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import { connectDB } from "./config/dbConfig.js";

const server = express();
const port = process.env.PORT || 8000;

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

// Routes
server.use('/api/admin', adminRoutes);
server.use('/api/concerts', concertRoutes);
server.use('/api/artists', artistRoutes);
server.use('/api/attendees', attendeeRoutes);
server.use('/api/analytics', analyticsRoutes);
server.use('/api/venues', venueRoutes);
server.use('/api/sponsors', sponsorRoutes);
server.use('/api/merchandise', merchandiseRoutes);
server.use('/api/songs', songRoutes);

// Health check
server.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
});

const serverListen = async () => {
    await connectDB();
    console.log("Server is Running!");
};

server.listen(port, serverListen);