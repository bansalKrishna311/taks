import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";


export const connect_db = async() =>{
    
}
dotenv.config();

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");  
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});