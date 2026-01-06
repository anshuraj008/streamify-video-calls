import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
      bufferCommands: false, // Disable buffering for serverless
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    throw error;
  }
};
