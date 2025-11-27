import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import { connectDB } from "./config/dbConfig.js";

const server = express();
const port = 8000;


server.use(express.json());
server.use(express.urlencoded({ extended: true }));




server.use('/admin', adminRoutes);
// server.use('/user', adminRoutes);
// server.use('/concert', adminRoutes);
// server.use('/admin', adminRoutes);
// server.use('/admin', adminRoutes);


const serverListen = async () => {
    await connectDB();
    console.log("Server is Runnning!");
};

server.listen(port, serverListen);