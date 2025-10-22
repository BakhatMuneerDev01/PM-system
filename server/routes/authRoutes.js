import express from 'express';
import {
    registerUser,
    loginUser,
    updateUserProfile,
    getUserProfile,
    uploadAvatar,
    createPaymentSession,
    deleteUserAccount // ADD THIS IMPORT
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

// Avatar upload route
router.post('/avatar-upload', protect, upload.single('avatar'), uploadAvatar);

// Payment routes
router.post('/create-payment-session', protect, createPaymentSession);

// Delete account route - FIXED: Ensure proper function reference
router.delete('/account', protect, deleteUserAccount); // REMOVE ANY QUOTES OR INCORRECT SYNTAX

export default router;