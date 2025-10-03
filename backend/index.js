import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from './routes/auth.routes.js';
import usersRouter from './routes/user.routes.js';
import tasksRouter from './routes/tasks.routes.js';
import errorHandler from "./middlewares/error.middleware.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello World");  
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/tasks', tasksRouter);


export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error', err);
        throw err;
    }
};
// Add error handler BEFORE starting the server
app.use(errorHandler);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT || process.env.PORT, () => console.log(`Server running at http://localhost:${PORT} `));
    } catch (err) {
        console.error('Failed to start', err);
        process.exit(1);
    }
};

start();