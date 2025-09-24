import express from 'express';
import {
    registerUser, loginUser, updateUserProfile, getUserProfile
} from '../controllers/authController.js';
import { upload } from '../utils/uploadImage.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
// Private routes (require authentication)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('profileImage'), updateUserProfile);

export default router;