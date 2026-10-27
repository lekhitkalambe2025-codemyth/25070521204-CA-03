import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses MONGO_URI from .env (defaults to local MongoDB Compass instance)
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tatva_nutrition';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Successfully connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Notice: Could not connect to ${mongoURI}`);
    console.warn(`[MongoDB] Reason: ${error.message}`);
    console.warn(`[MongoDB] Will retry connection in 5 seconds...`);

    // Auto-retry connection every 5 seconds until connected
    setTimeout(() => {
      if (mongoose.connection.readyState === 0) {
        connectDB();
      }
    }, 5000);

    return false;
  }
};

mongoose.connection.on('connected', () => {
  console.log('[MongoDB] Connection state: CONNECTED');
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection state: DISCONNECTED. Attempting reconnection...');
  setTimeout(() => {
    if (mongoose.connection.readyState === 0) {
      connectDB();
    }
  }, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection Error:', err.message);
});

/**
 * Helper function to retrieve database connection status for health checks
 */
export const getDatabaseStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'unknown',
    isConnected: stateCode === 1,
    databaseName: mongoose.connection.name || 'tatva_nutrition',
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tatva_nutrition',
  };
};

export default connectDB;
