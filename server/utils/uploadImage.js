// utils/fileUpload.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// --- Multer Setup (temporary local storage) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./public/temp";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });

// --- Cloudinary Setup ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Utility Function ---
// In uploadImage.js - IMPROVED VERSION:
export const uploadToCloudinary = async (file, folder = "healthcare-profiles") => {
  if (!file) return null;

  try {
    let result;
    
    // If it's a file path (string)
    if (typeof file === 'string') {
      result = await cloudinary.uploader.upload(file, { folder });
      fs.unlinkSync(file); // Remove temp file
    } 
    // If it's a buffer (from memory)
    else if (Buffer.isBuffer(file)) {
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file);
      });
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};