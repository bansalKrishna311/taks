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

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://taks-frontend-gamma.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware for Vercel
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.get("/", (req, res) => {
    res.json({ message: "Task Management API is running!" });  
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

// Add error handler AFTER routes
app.use(errorHandler);

// Connect to MongoDB when app starts
if (process.env.MONGO_URI) {
    connectDB(process.env.MONGO_URI);
}

const start = async () => {
    try {
        if (!process.env.VERCEL) {
            // Only start server locally, Vercel handles this
            await connectDB(process.env.MONGO_URI);
            app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
        }
    } catch (err) {
        console.error('Failed to start', err);
        process.exit(1);
    }
};

// Export for Vercel
export default app;

// Start server only if not on Vercel
if (!process.env.VERCEL) {
    start();
}