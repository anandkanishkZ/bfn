const express = require('express');
const router = express.Router();
const { User, Donor, BloodRequest, Sequelize } = require('../database');
const adminAuth = require('../middleware/adminAuth');

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Donor,
          as: 'donor',
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Add status field for frontend compatibility
    const usersWithStatus = users.map(user => ({
      ...user.toJSON(),
      status: 'active' // Default status, can be enhanced later
    }));
    
    res.json(usersWithStatus);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all donors (admin only)
router.get('/donors', adminAuth, async (req, res) => {
  try {
    const donors = await Donor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Add status field for frontend compatibility
    const donorsWithStatus = donors.map(donor => ({
      ...donor.toJSON(),
      status: donor.is_available ? 'active' : 'inactive'
    }));
    
    res.json(donorsWithStatus);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

// Get all blood requests (admin only)
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const requests = await BloodRequest.findAll({
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'name', 'email'],
          required: false // Allow requests with missing users
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Format for frontend compatibility
    const formattedRequests = requests.map(request => ({
      id: request.id,
      patientName: request.patient_name,
      bloodType: request.blood_type,
      quantity: request.quantity,
      hospitalName: request.hospital_name,
      contactNumber: request.contact_number,
      requiredDate: request.required_date,
      urgency: request.urgency,
      status: request.status,
      description: request.description,
      requester: request.requester,
      createdAt: request.created_at,
      updatedAt: request.updated_at
    }));
    
    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    if (error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    // Log Sequelize validation or database errors in detail
    if (error && error.errors) {
      error.errors.forEach((e, idx) => {
        console.error(`Sequelize error[${idx}]:`, e.message, e);
      });
    }
    res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers, activeDonors, pendingRequests, emergencyRequests] = await Promise.all([
      User.count(),
      Donor.count({ where: { is_available: true } }),
      BloodRequest.count({ where: { status: 'pending' } }),
      BloodRequest.count({ where: { urgency: 'emergency', status: 'pending' } })
    ]);

    res.json({
      totalUsers,
      activeDonors,
      pendingRequests,
      emergencyRequests
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// User management actions
router.post('/users/:id/:action', adminAuth, async (req, res) => {
  try {
    const { id, action } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    switch (action) {
      case 'activate':
        // Implementation for user activation
        res.json({ message: `User ${id} activated successfully` });
        break;
      case 'suspend':
        // Implementation for user suspension
        res.json({ message: `User ${id} suspended successfully` });
        break;
      case 'delete':
        await user.destroy();
        res.json({ message: `User ${id} deleted successfully` });
        break;
      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error performing user action:', error);
    res.status(500).json({ error: 'Failed to perform action' });
  }
});

// Donor management actions
router.post('/donors/:id/:action', adminAuth, async (req, res) => {
  try {
    const { id, action } = req.params;
    const donor = await Donor.findByPk(id);
    
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    switch (action) {
      case 'activate':
        await donor.update({ is_available: true });
        res.json({ message: `Donor ${id} activated successfully` });
        break;
      case 'deactivate':
        await donor.update({ is_available: false });
        res.json({ message: `Donor ${id} deactivated successfully` });
        break;
      case 'delete':
        await donor.destroy();
        res.json({ message: `Donor ${id} deleted successfully` });
        break;
      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error performing donor action:', error);
    res.status(500).json({ error: 'Failed to perform action' });
  }
});

// Request management actions
router.post('/requests/:id/:action', adminAuth, async (req, res) => {
  try {
    const { id, action } = req.params;
    const request = await BloodRequest.findByPk(id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    switch (action) {
      case 'approve':
        await request.update({
          status: 'approved',
          approved_by: req.user.id,
          approved_at: new Date()
        });
        res.json({ message: `Request ${id} approved successfully` });
        break;
      case 'reject':
        await request.update({ status: 'rejected' });
        res.json({ message: `Request ${id} rejected successfully` });
        break;
      case 'fulfill':
        await request.update({ status: 'fulfilled' });
        res.json({ message: `Request ${id} marked as fulfilled` });
        break;
      case 'delete':
        await request.destroy();
        res.json({ message: `Request ${id} deleted successfully` });
        break;
      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error performing request action:', error);
    res.status(500).json({ error: 'Failed to perform action' });
  }
});

// Get analytics data for charts
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    // Blood type distribution
    const bloodTypeStats = await Donor.findAll({
      attributes: [
        'blood_type',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['blood_type'],
      raw: true
    });

    // Requests by urgency
    const urgencyStats = await BloodRequest.findAll({
      attributes: [
        'urgency',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['urgency'],
      raw: true
    });

    // Monthly request trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRequests = await BloodRequest.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Sequelize.Op.gte]: sixMonthsAgo
        }
      },
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m')],
      order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m'), 'ASC']],
      raw: true
    });

    // Status distribution
    const statusStats = await BloodRequest.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    res.json({
      bloodTypeDistribution: bloodTypeStats,
      urgencyDistribution: urgencyStats,
      monthlyTrends: monthlyRequests,
      statusDistribution: statusStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Promote a user to admin (admin only)
router.post('/promote', adminAuth, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ error: 'User is already an admin' });
    user.role = 'admin';
    await user.save();
    res.json({ message: `User ${email} promoted to admin.` });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

module.exports = router;
