import mongoose from "mongoose";

// Cache the connection on `globalThis` so Next.js dev hot-reloads don't open a new one each time.
let cached = globalThis._mongooseCache;
if (!cached) cached = globalThis._mongooseCache = { conn: null, promise: null };

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000 })
      .catch((err) => {
        cached.promise = null; // allow a retry on the next request
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
