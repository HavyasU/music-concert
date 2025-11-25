import express from "express";

const server = express();
const port = 8000;



const serverListen = () => {
    console.log("Server is Runnning!");
};

server.listen(port, serverListen);