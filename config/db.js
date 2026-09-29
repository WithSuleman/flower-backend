import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn('⚠️ Warning: MONGO_URI not found in environment variables. Using in-memory fallback data.');
      return null;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🌸 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Return null instead of terminating to allow graceful fallback
    return null;
  }
};

export default connectDB;
