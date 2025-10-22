// utils/uploadImage.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from 'stream';

// Use memory storage instead of disk storage for better performance
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Initialize Cloudinary configuration - this will be called from server.js
let cloudinaryConfigured = false;

export const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log('Configuring Cloudinary with:', {
    cloud_name: cloudName,
    api_key: apiKey ? `${apiKey.substring(0, 5)}...` : 'Missing',
    api_secret: apiSecret ? 'Set' : 'Missing'
  });

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary configuration is incomplete. Check your environment variables.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  cloudinaryConfigured = true;
  console.log('Cloudinary configured successfully');
};

// Improved upload function that works with buffers
export const uploadToCloudinary = async (fileBuffer, folder = "healthcare-profiles") => {
  if (!fileBuffer) {
    throw new Error('No file buffer provided');
  }

  // Verify Cloudinary is configured
  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary not configured. Call configureCloudinary() first.');
  }

  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto" },
            { format: "jpg" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            console.log("Cloudinary upload successful:", result.secure_url);
            resolve(result.secure_url);
          }
        }
      );

      // Convert buffer to stream and upload
      const bufferStream = Readable.from(fileBuffer);
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Cloudinary upload exception:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};