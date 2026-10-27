import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectDB, getDatabaseStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import finderRoutes from './routes/finderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Attempt non-blocking connection to local MongoDB
connectDB();

// ==========================================
// Security & Utility Middlewares
// ==========================================

// Helmet for security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable Cross-Origin Resource Sharing for our frontend
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// General rate limiter to prevent abusive request floods
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});
app.use('/api', generalLimiter);

// Specific stricter limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: 'Too many login/registration attempts. Please wait a few minutes.',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Built-in JSON body parser middleware with safe request size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Simple request logger for debugging during development
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// Routes
// ==========================================

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    project: 'TATVA Nutrition Backend API',
    tagline: 'Pure by Principle.',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Mandatory Health-check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDatabaseStatus();

  res.status(200).json({
    success: true,
    message: 'TATVA Nutrition API is healthy and operational',
    tagline: 'Pure by Principle.',
    timestamp: new Date().toISOString(),
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    serverUptimeSeconds: Math.floor(process.uptime()),
    database: {
      type: 'MongoDB',
      managedVia: 'MongoDB Compass',
      status: dbStatus.state,
      connected: dbStatus.isConnected,
      databaseName: dbStatus.databaseName,
      connectionUri: dbStatus.uri,
    },
  });
});

// Mount domain routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/product-finder', finderRoutes);
app.use('/api/admin', adminRoutes);

// 404 Not Found Handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const isMongooseTimeout =
    err.name === 'MongooseError' ||
    err.message?.includes('buffering timed out') ||
    err.name === 'MongoServerSelectionError';

  const status = isMongooseTimeout ? 503 : err.status || 500;
  const errorMsg = isMongooseTimeout
    ? 'Database connection is initializing. Please wait a moment and try again.'
    : err.name || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: errorMsg,
    message: err.message || 'An unexpected error occurred on the server',
  });
});

// ==========================================
// Start Server Listener
// ==========================================
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` TATVA Nutrition API Server is running!`);
  console.log(` Tagline: Pure by Principle.`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(
    ` MongoDB Target: ${
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tatva_nutrition'
    }`
  );
  console.log(` CORS Allowed Origin: ${CLIENT_URL}`);
  console.log(`===============================================`);
});

export default app;
