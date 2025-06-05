const express = require('express');
const router = express.Router();
const { BloodRequest, User } = require('../database');
const authenticate = require('../middleware/authenticate');

// Get all blood requests (public with filters)
router.get('/', async (req, res) => {
  try {
    const { blood_type, urgency, status } = req.query;
    
    const whereClause = {};
    
    if (blood_type) {
      whereClause.blood_type = blood_type;
    }
    
    if (urgency) {
      whereClause.urgency = urgency;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    const requests = await BloodRequest.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    res.status(500).json({ error: 'Failed to fetch blood requests' });
  }
});

// Create a new blood request
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      patient_name,
      blood_type,
      quantity,
      hospital_name,
      contact_number,
      required_date,
      urgency,
      description
    } = req.body;
    
    const newRequest = await BloodRequest.create({
      user_id: userId,
      patient_name,
      blood_type,
      quantity: quantity || 1,
      hospital_name,
      contact_number,
      required_date,
      urgency: urgency || 'normal',
      description
    });
    
    // Fetch the created request with user information
    const request = await BloodRequest.findByPk(newRequest.id, {
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['name', 'email']
        }
      ]
    });
    
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).json({ error: 'Failed to create blood request', details: error.message });
  }
});

// Get blood request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['name', 'email']
        }
      ]
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Blood request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching blood request:', error);
    res.status(500).json({ error: 'Failed to fetch blood request' });
  }
});

// Update blood request
router.put('/:id', authenticate, async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;
    
    const request = await BloodRequest.findOne({
      where: {
        id: requestId,
        user_id: userId
      }
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Blood request not found or unauthorized' });
    }
    
    const {
      patient_name,
      blood_type,
      quantity,
      hospital_name,
      contact_number,
      required_date,
      urgency,
      description
    } = req.body;
    
    await request.update({
      patient_name: patient_name || request.patient_name,
      blood_type: blood_type || request.blood_type,
      quantity: quantity !== undefined ? quantity : request.quantity,
      hospital_name: hospital_name || request.hospital_name,
      contact_number: contact_number || request.contact_number,
      required_date: required_date || request.required_date,
      urgency: urgency || request.urgency,
      description: description !== undefined ? description : request.description
    });
    
    res.json(request);
  } catch (error) {
    console.error('Error updating blood request:', error);
    res.status(500).json({ error: 'Failed to update blood request' });
  }
});

// Delete blood request
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;
    
    const request = await BloodRequest.findOne({
      where: {
        id: requestId,
        user_id: userId
      }
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Blood request not found or unauthorized' });
    }
    
    await request.destroy();
    res.json({ message: 'Blood request deleted successfully' });
  } catch (error) {
    console.error('Error deleting blood request:', error);
    res.status(500).json({ error: 'Failed to delete blood request' });
  }
});

module.exports = router;
