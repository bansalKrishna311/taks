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

// Allow all CORS - simple and works everywhere
app.use(cors());
app.use(express.json());

// Handle preflight requests
app.options('*', cors());

app.get("/", (req, res) => {
    res.json({ 
        message: "Task Management API is running!",
        timestamp: new Date().toISOString(),
        cors: "enabled"
    });  
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/tasks', tasksRouter);

export const connectDB = async (uri) => {
    try {
        if (!uri) {
            console.log('No MongoDB URI provided, skipping connection');
            return;
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error', err);
        // Just log the error, don't crash the app
    }
};

// Add error handler AFTER routes
app.use(errorHandler);

// Initialize MongoDB connection for production
if (process.env.MONGO_URI) {
    connectDB(process.env.MONGO_URI).catch(err => {
        console.error('MongoDB connection failed:', err);
    });
}

// Start server (for both local and production)
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
export default app;