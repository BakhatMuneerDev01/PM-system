import { v2 as cloudinary } from 'cloudinary';
const uploadToCloudinary = async (localFilePath) => {
    if(!localFilePath) return null;
    try {
        const uploadeResult = await cloudinary.uploader.upload(localFilePath);

    } catch (error) {
        
    }
};
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export default uploadToCloudinary;