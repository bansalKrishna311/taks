import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";


export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
};

dotenv.config();

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");  
});




const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
};

start();