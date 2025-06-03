'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@bfn.com',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date()
      },
      {
        name: 'Regular User',
        email: 'user@bfn.com',
        password: hashedPassword,
        role: 'user',
        created_at: new Date()
      },
      {
        name: 'Donor User',
        email: 'donor@bfn.com',
        password: hashedPassword,
        role: 'user',
        created_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
