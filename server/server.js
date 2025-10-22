// server.js - UPDATED
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { configureCloudinary } from './utils/uploadImage.js'; // Import the configuration function

// Load env variables FIRST
dotenv.config();

// Configure Cloudinary AFTER environment variables are loaded
try {
    configureCloudinary();
    console.log('Cloudinary configuration completed successfully');
} catch (error) {
    console.error('Cloudinary configuration failed:', error.message);
    console.log('Image uploads will use fallback avatars');
}

// create server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log('Database connection failed', err);
        process.exit(1);
    });