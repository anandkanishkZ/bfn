const jwt = require('jsonwebtoken');
const { User } = require('../database');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Access denied' });

    // Extract token from "Bearer TOKEN" format
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        
        // Verify the user exists in database
        const user = await User.findByPk(verified.id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }
        
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};