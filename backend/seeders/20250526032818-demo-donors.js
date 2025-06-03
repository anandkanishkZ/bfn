'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // First, we need to get the IDs of our demo users
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM users WHERE email IN ('donor@bfn.com', 'user@bfn.com')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (users.length > 0) {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      
      await queryInterface.bulkInsert('donors', [
        {
          user_id: users.find(u => u.email === 'donor@bfn.com')?.id || users[0].id,
          blood_type: 'A+',
          location: 'Kathmandu',
          phone_number: '9801234567',
          last_donation_date: threeMonthsAgo,
          is_available: true,
          created_at: now,
          updated_at: now
        },
        {
          user_id: users.find(u => u.email === 'user@bfn.com')?.id || users[1].id,
          blood_type: 'O-',
          location: 'Pokhara',
          phone_number: '9807654321',
          last_donation_date: null,
          is_available: true,
          created_at: now,
          updated_at: now
        }
      ], {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('donors', null, {});
  }
};
