import jwt from 'json-web-token';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split('')[1];
            // Verify token
            const decoded = jwt.verify(token, provess.env.JWT_SECRET);
            // Get user from token and add to request object
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Toke verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
}

export { protect, admin };