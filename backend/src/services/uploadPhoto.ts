import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bodybuilding-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    format: 'webp', // Convert all uploads to WebP
    transformation: [{ width: '1000', crop: 'scale', quality: 'auto' }],
  } as any,
});

// Create multer upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
