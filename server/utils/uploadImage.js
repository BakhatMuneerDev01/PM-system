// server/utils/uploadImage.js - COMPLETE REWRITE

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from 'stream';

// Use memory storage
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

// Initialize Cloudinary configuration
let cloudinaryConfigured = false;

export const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // ✅ CRITICAL: Validate environment variables
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('❌ CLOUDINARY CONFIG MISSING: Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
  }

  // ✅ CRITICAL: Validate cloud name is not placeholder
  if (cloudName.includes('your_cloud_name') || cloudName === 'your_cloud_name') {
    throw new Error('❌ INVALID CLOUDINARY_CLOUD_NAME: Replace "your_cloud_name" with actual Cloudinary cloud name from dashboard');
  }

  console.log('✅ Configuring Cloudinary with:', {
    cloud_name: cloudName,
    api_key: `${apiKey.substring(0, 5)}...`,
    api_secret: 'Set'
  });

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  cloudinaryConfigured = true;
  console.log('✅ Cloudinary configured successfully');
};

// ✅ ENHANCED: Upload function with proper error handling
export const uploadToCloudinary = async (fileBuffer, folder = "healthcare-profiles") => {
  if (!fileBuffer) {
    throw new Error('❌ No file buffer provided');
  }

  // ✅ Verify Cloudinary is configured
  if (!cloudinaryConfigured) {
    throw new Error('❌ Cloudinary not configured. Call configureCloudinary() first.');
  }

  // ✅ CRITICAL: Verify configuration is valid
  const config = cloudinary.config();
  if (!config.cloud_name || config.cloud_name.includes('your_cloud_name')) {
    throw new Error('❌ Invalid Cloudinary configuration - cloud_name is placeholder or missing');
  }

  try {
    console.log('📤 Uploading to Cloudinary:', {
      folder,
      cloud_name: config.cloud_name,
      bufferSize: fileBuffer.length
    });

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
            console.error("❌ Cloudinary upload error:", error);
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (!result || !result.secure_url) {
            console.error("❌ Cloudinary returned no URL");
            reject(new Error('Cloudinary upload failed: No URL returned'));
          } else {
            // ✅ CRITICAL: Validate returned URL
            if (result.secure_url.includes('your_cloud_name')) {
              console.error("❌ Cloudinary returned placeholder URL:", result.secure_url);
              reject(new Error('Cloudinary configuration error: Invalid cloud name'));
            } else {
              console.log("✅ Cloudinary upload successful:", result.secure_url);
              resolve(result.secure_url);
            }
          }
        }
      );

      // Convert buffer to stream and upload
      const bufferStream = Readable.from(fileBuffer);
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("❌ Cloudinary upload exception:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};