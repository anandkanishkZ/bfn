const express = require('express');
const router = express.Router();
const { Donor, User, Sequelize } = require('../database'); // Updated to use Sequelize models
const Op = Sequelize.Op;
const authenticate = require('../middleware/authenticate');

// Get all donors (public endpoint)
router.get('/', async (req, res) => {
  try {
    // Extract query parameters
    const { blood_type, location, is_available } = req.query;
    
    // Build where clause based on query parameters
    const whereClause = {};
    
    if (blood_type) {
      whereClause.blood_type = blood_type;
    }
    
    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }
    
    if (is_available !== undefined) {
      whereClause.is_available = is_available === 'true';
    }
    
    // Get all donors using Sequelize with user information and filtering
    const results = await Donor.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'] // Include only necessary user fields
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving donors', details: err.message });
  }
});

// Add a new donor (protected endpoint)
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { blood_type, location, phone_number, last_donation_date, is_available } = req.body;
    
    // Check if user already has a donor profile
    const existingDonor = await Donor.findOne({ where: { user_id: userId } });
    
    if (existingDonor) {
      return res.status(400).json({ error: 'User already has a donor profile' });
    }
    
    // Create a new donor using Sequelize
    const newDonor = await Donor.create({
      user_id: userId,
      blood_type,
      location,
      phone_number,
      last_donation_date: last_donation_date || null,
      is_available: is_available !== undefined ? is_available : true
    });
    
    // Fetch the newly created donor with user information
    const donor = await Donor.findByPk(newDonor.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ]
    });
    
    res.status(201).json(donor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating donor', details: err.message });
  }
});

// Get donor by ID
router.get('/:id', async (req, res) => {
  try {
    const donorId = req.params.id;
    
    const donor = await Donor.findByPk(donorId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ]
    });
    
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }
    
    res.json(donor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving donor', details: err.message });
  }
});

// Update donor profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    const donorId = req.params.id;
    const userId = req.user.id;
    
    // Find donor and ensure it belongs to the authenticated user
    const donor = await Donor.findOne({ 
      where: { 
        id: donorId,
        user_id: userId 
      }
    });
    
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found or unauthorized' });
    }
    
    // Update donor fields
    const { blood_type, location, phone_number, last_donation_date, is_available } = req.body;
    
    const updatedDonor = await donor.update({
      blood_type: blood_type || donor.blood_type,
      location: location || donor.location,
      phone_number: phone_number || donor.phone_number,
      last_donation_date: last_donation_date !== undefined ? last_donation_date : donor.last_donation_date,
      is_available: is_available !== undefined ? is_available : donor.is_available
    });
    
    res.json(updatedDonor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating donor', details: err.message });
  }
});

module.exports = router;
