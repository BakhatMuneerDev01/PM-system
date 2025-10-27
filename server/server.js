// Load env variables FIRST
dotenv.config();
// server.js - UPDATED
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { configureCloudinary } from './utils/uploadImage.js'; // Import the configuration function

// ✅ CRITICAL: Validate Cloudinary config before starting server
try {
    console.log('🔧 Validating Cloudinary configuration...');

    // Check environment variables exist
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('❌ Missing Cloudinary environment variables');
    }

    // Check for placeholder values
    if (process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name')) {
        throw new Error('❌ CLOUDINARY_CLOUD_NAME contains placeholder value "your_cloud_name" - Replace with actual cloud name from Cloudinary dashboard');
    }

    configureCloudinary();
    console.log('✅ Cloudinary configuration validated successfully');
} catch (error) {
    console.error('❌ CRITICAL: Cloudinary configuration failed:', error.message);
    console.error('📋 Fix instructions:');
    console.error('   1. Go to https://cloudinary.com/console');
    console.error('   2. Copy your Cloud Name, API Key, and API Secret');
    console.error('   3. Update server/.env with actual values');
    console.error('   4. Restart the server');
    process.exit(1); // ✅ Prevent server from starting with invalid config
}

// create server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// basic testing routes
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the PM System API',
        status: 'Server is running successfully',
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not Configured'
    })
});

// Import and use routes
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import visitRoutes from './routes/visitRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Add this with other route imports
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Connect to database first, then start server
connectDB()
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} `);
        });
    })
    .catch((err) => {
        console.log('Database connection failed', err);
        process.exit(1);
    });