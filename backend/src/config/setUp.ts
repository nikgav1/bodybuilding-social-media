import 'dotenv/config';
import connectDB from './db';
import { v2 as cloudinary } from 'cloudinary';

export default async function setUp(): Promise<void> {
  await connectDB();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Connected to Cloudinary');
}
