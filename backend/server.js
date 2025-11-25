import express from "express";
import { homeRouter } from "./routes/homeRoutes.js";

const server = express();
const port = 8000;


server.use('/', homeRouter);

const serverListen = () => {
    console.log("Server is Runnning!");
};

server.listen(port, serverListen);