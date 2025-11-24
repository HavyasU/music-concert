import express from "express";


const app = express();
const port = 8000;



const listenCB = () => {
    console.log("Server is Listning!");
};
app.listen(port, listenCB);