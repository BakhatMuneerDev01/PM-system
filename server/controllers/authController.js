import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { uploadToCloudinary } from '../utils/uploadImage.js';
import Patient from '../models/Patient.js';
import Visit from '../models/Visit.js';
import VisitNote from '../models/VisitNote.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: 'Please fill in all fields'
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }
        const userExists = await User.findOne({ $or: [{ username }, { email }] });

        if (userExists) {
            return res.status(400).json({
                message: userExists.email === email ? 'Email already registered' : 'Username already taken'
            })
        }
        // Create user
        const user = await User.create({
            username,
            email,
            password,
        })
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error.message)
        res.status(400).json({ message: 'Server error during registration' });
    }
};

/**
 * Authenticate user and get token
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: 'Please provide username/email and password' });
        }
        const user = await User.findOne({
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
        })
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                token: generateToken(user._id),
            })
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};

/**
 * Get user profile
 * @route GET /api/auth/profile
 * @access Private
 */
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error.message);
        res.status(500).json({ message: 'Server error getting profile' });
    }
}

/**
 * Update user profile - FIXED VERSION
 * @route PUT /api/auth/profile
 * @access Private
 */

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ CRITICAL FIX: Store original profileImage before any updates
        const originalProfileImage = user.profileImage;

        // Update basic fields
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

        // ✅ ENHANCED: Profile image handling with explicit preservation
        console.log('📄 Profile update - Image handling:', {
            hasFile: !!req.file,
            originalImage: originalProfileImage,
            fileDetails: req.file ? { name: req.file.originalname, size: req.file.size } : 'No file'
        });

        // ✅ CRITICAL: Only update profileImage if new file uploaded
        if (req.file && req.file.buffer) {
            try {
                console.log('🔤 Starting Cloudinary upload...');
                const uploadedUrl = await uploadToCloudinary(req.file.buffer, 'profiles');

                // ✅ Validate Cloudinary URL before saving
                if (uploadedUrl && uploadedUrl.startsWith('https://res.cloudinary.com/')) {
                    user.profileImage = uploadedUrl;
                    console.log('✅ New profile image uploaded:', uploadedUrl);
                } else {
                    console.warn('⚠️ Invalid Cloudinary URL, keeping original:', originalProfileImage);
                    user.profileImage = originalProfileImage; // ✅ Explicitly preserve
                }
            } catch (cloudinaryError) {
                console.error('❌ Cloudinary upload failed:', cloudinaryError.message);
                // ✅ CRITICAL: Explicitly preserve original image on error
                user.profileImage = originalProfileImage;
                console.log('ℹ️ Preserved original profile image due to upload error');
            }
        } else {
            // ✅ CRITICAL FIX: Explicitly preserve existing profileImage when no file uploaded
            user.profileImage = originalProfileImage;
            console.log('ℹ️ No new image uploaded - preserving existing:', originalProfileImage);
        }

        // Handle payment details
        if (req.body.paymentDetails) {
            try {
                const paymentDetails = JSON.parse(req.body.paymentDetails);
                user.paymentDetails = {
                    ...user.paymentDetails,
                    ...paymentDetails
                };
            } catch (parseError) {
                console.warn('⚠️ Failed to parse paymentDetails:', parseError.message);
            }
        }

        // Handle password change
        if (req.body.password && req.body.password.trim()) {
            user.password = req.body.password;
        }

        // ✅ Save with validation
        const updatedUser = await user.save();

        // ✅ CRITICAL: Verify profileImage is in response
        console.log('✅ User saved - profileImage in DB:', updatedUser.profileImage);

        // ✅ Response with explicit profileImage
        const responseData = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            profileImage: updatedUser.profileImage, // ✅ Always include, even if null
            paymentDetails: updatedUser.paymentDetails || {},
            token: generateToken(updatedUser._id),
        };

        console.log('✅ Response profileImage:', responseData.profileImage);

        res.json(responseData);

    } catch (error) {
        console.error('❌ Update profile error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Server error updating profile' });
    }
};
/**
 * Upload avatar/image
 * @route POST /api/auth/avatar-upload
 * @access Private
 */
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = await uploadToCloudinary(req.file.buffer, 'profiles');

        if (!imageUrl) {
            return res.status(400).json({ message: 'Error uploading image to cloud storage' });
        }

        // Update user's profile image
        const user = await User.findById(req.user._id);
        user.profileImage = imageUrl;
        await user.save();

        res.json({
            message: 'Avatar uploaded successfully',
            profileImage: imageUrl
        });
    } catch (error) {
        console.error('Avatar upload error:', error.message);
        res.status(500).json({ message: 'Server error uploading avatar' });
    }
};

/**
 * Create Stripe payment session
 * @route POST /api/auth/create-payment-session
 * @access Private
 */
const createPaymentSession = async (req, res) => {
    try {
        const { amount, currency = 'usd', paymentMethod } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        // Mock implementation - replace with actual Stripe integration
        const mockSession = {
            id: `cs_${Date.now()}`,
            amount: amount,
            currency: currency,
            status: 'requires_payment_method',
            client_secret: `pi_${Date.now()}_secret`,
        };

        res.json({
            sessionId: mockSession.id,
            clientSecret: mockSession.client_secret,
            status: mockSession.status
        });
    } catch (error) {
        console.error('Create payment session error:', error.message);
        res.status(500).json({ message: 'Server error creating payment session' });
    }
};

/**
 * Delete user account
 * @route DELETE /api/auth/account
 * @access Private
 */
const deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all user's data
        // Patients and their visits
        const patients = await Patient.find({ user: req.user._id });
        for (const patient of patients) {
            // Delete visits and visit notes
            const visits = await Visit.find({ patient: patient._id });
            for (const visit of visits) {
                if (visit.notes) {
                    await VisitNote.findByIdAndDelete(visit.notes);
                }
                await Visit.findByIdAndDelete(visit._id);
            }
            await Patient.findByIdAndDelete(patient._id);
        }

        // Delete user's conversations and messages
        await Conversation.deleteMany({ participants: req.user._id });
        await Message.deleteMany({ sender: req.user._id });

        // Finally delete the user
        await User.findByIdAndDelete(req.user._id);

        res.json({
            message: 'Account and all associated data deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Server error deleting account' });
    }
};

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    uploadAvatar,
    createPaymentSession,
    deleteUserAccount
};