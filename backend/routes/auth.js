const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database'); // Updated to use Sequelize models

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Registration validation failed:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    console.log('Checking if user already exists...');
    
    try {
      // Check if the user already exists using Sequelize
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      console.log('Creating new user in database...');
      // Create user in the database using Sequelize
      // Password will be automatically hashed by the model hooks
      const newUser = await User.create({
        name,
        email,
        password,
        role: 'user'
      });
      
      console.log('User registered successfully:', newUser.id);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      res.status(500).json({ error: 'Database operation failed', details: dbError.message });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email using Sequelize
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Using the validatePassword method from our User model
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    res.json({ 
      token, 
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
