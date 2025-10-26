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

        // Update basic fields
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

        // FIX: Properly handle payment details with country preservation
        if (req.body.paymentDetails) {
            let paymentDetails;
            try {
                paymentDetails = typeof req.body.paymentDetails === 'string'
                    ? JSON.parse(req.body.paymentDetails)
                    : req.body.paymentDetails;

                // CRITICAL FIX: Preserve ALL existing payment details and only update provided fields
                user.paymentDetails = {
                    enableAutoPayout: paymentDetails.enableAutoPayout ?? user.paymentDetails?.enableAutoPayout ?? false,
                    notifyNewPayments: paymentDetails.notifyNewPayments ?? user.paymentDetails?.notifyNewPayments ?? false,
                    cardHolderName: paymentDetails.cardHolderName ?? user.paymentDetails?.cardHolderName ?? '',
                    creditCardNumber: paymentDetails.creditCardNumber ?? user.paymentDetails?.creditCardNumber ?? '',
                    country: paymentDetails.country ?? user.paymentDetails?.country ?? '' // FIX: Preserve country
                };
            } catch (parseError) {
                console.error('Payment details parse error:', parseError);
                return res.status(400).json({ message: 'Invalid payment details format' });
            }
        }

        // CRITICAL FIX: Only update profile image if a new file is uploaded
        if (req.file) {
            try {
                console.log('New profile image detected, uploading to Cloudinary...');

                let imageUrl;
                try {
                    imageUrl = await uploadToCloudinary(req.file.buffer, 'profiles');
                    console.log('Cloudinary upload successful:', imageUrl);

                    // Only update if upload was successful
                    if (imageUrl) {
                        user.profileImage = imageUrl;
                    }
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload failed:', cloudinaryError.message);
                    // FIX: Don't use fallback avatar - keep existing image
                    console.log('Keeping existing profile image due to upload failure');
                }
            } catch (uploadError) {
                console.error('Image upload error (non-critical):', uploadError);
                // FIX: Don't modify profileImage on error - preserve existing
            }
        }
        // FIX: If no new file is uploaded, explicitly preserve the existing profileImage
        // This prevents it from being overwritten or removed

        // Update password if provided
        if (req.body.password && req.body.password.trim() !== '') {
            if (req.body.password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        // FIX: Ensure profileImage is always returned in response
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            profileImage: updatedUser.profileImage, // CRITICAL: Always return current image
            paymentDetails: updatedUser.paymentDetails,
            token: generateToken(updatedUser._id),
        });

    } catch (error) {
        console.error('Update profile error:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
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