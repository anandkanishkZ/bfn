const { User } = require('../database'); // Updated to use Sequelize models

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `req.user` is populated by the auth middleware
        
        // Find user by id using Sequelize
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Exclude password from the response
        });
        
        if (!user) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body; // Add other fields as needed
        
        // Update user with Sequelize
        const [updatedRows] = await User.update(
            { name, email },
            { where: { id: userId } }
        );
        
        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};