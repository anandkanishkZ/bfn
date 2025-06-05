const jwt = require('jsonwebtoken');
const { User } = require('../database');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Extract token from "Bearer TOKEN" format
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify the user exists and is admin
        const user = await User.findByPk(verified.id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }
        
        req.user = verified;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = adminAuth;
