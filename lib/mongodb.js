import mongoose from 'mongoose';

// export const connectMongoDB = async () => {
//     if (mongoose.connections[0].readyState) {
//         return;
//     }
    
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.log("Error connecting to MongoDB: ", error);
//     }
// }

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

export async function connectMongoDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

if (process.env.NODE_ENV !== 'production') {
  global.mongoose = cached;
}