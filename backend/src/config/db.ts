import mongoose from 'mongoose';

export default async function connectDB(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI || '';
    if (!uri) {
      throw new Error(
        'Missing MongoDB connection string in environment variables'
      );
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}
