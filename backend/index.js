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

// Enable CORS for all origins in development, specific origins in production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://taks-frontend.vercel.app',
     
      'https://taks-frontend-gamma.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false, // Set to false for Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.sendStatus(200);
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