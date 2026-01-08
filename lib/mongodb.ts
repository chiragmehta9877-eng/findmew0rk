import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://chiragmehtaa:Nd0OjDrZC00MusR2@cluster0.vmkhfa6.mongodb.net/ecocareers?appName=Cluster0';

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}