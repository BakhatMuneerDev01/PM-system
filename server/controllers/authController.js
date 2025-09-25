import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { uploadToCloudinary } from '../utils/uploadImage.js';
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
            password, // Password will be hashed by the pre-save middleware
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
        // find user by email or password
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
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Update basic fields
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            // Update payment details if provided
            if (req.body.paymentDetails) {
                user.paymentDetails = {
                    ...user.paymentDetails,
                    ...req.body.paymentDetails
                };
            }

            // Handle profile image upload
            if (req.file) {
                try {
                    const imageUrl = await uploadToCloudinary(req.file.buffer, 'profiles');
                    user.profileImage = imageUrl;
                } catch (uploadError) {
                    console.error('Image upload error:', uploadError.message);
                    return res.status(400).json({ message: 'Error uploading image' });
                }
            }

            // Update password if provided
            if (req.body.password) {
                if (req.body.password.length < 6) {
                    return res.status(400).json({ message: 'Password must be at least 6 characters' });
                }
                user.password = req.body.password; // Will be hashed by pre-save middleware
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                phoneNumber: updatedUser.phoneNumber,
                profileImage: updatedUser.profileImage,
                paymentDetails: updatedUser.paymentDetails,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
