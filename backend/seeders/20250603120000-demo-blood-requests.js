'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const urgencies = ['normal', 'urgent', 'emergency'];
    const statuses = ['pending', 'approved', 'fulfilled', 'rejected'];
    const hospitals = [
      'Bir Hospital',
      'Tribhuvan University Teaching Hospital',
      'Patan Hospital',
      'Civil Hospital',
      'Nepal Red Cross Blood Bank',
      'Kathmandu Medical College',
      'Grande International Hospital'
    ];

    const bloodRequests = [];
    
    for (let i = 1; i <= 50; i++) {
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180)); // Random date within last 6 months
      
      bloodRequests.push({
        user_id: Math.floor(Math.random() * 10) + 1, // Assuming we have users with IDs 1-10
        patient_name: `Patient ${i}`,
        blood_type: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
        quantity: Math.floor(Math.random() * 5) + 1,
        hospital_name: hospitals[Math.floor(Math.random() * hospitals.length)],
        contact_number: `98${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
        required_date: new Date(createdDate.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date within 30 days of creation
        urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: `Medical emergency requiring blood transfusion for Patient ${i}`,
        created_at: createdDate,
        updated_at: createdDate
      });
    }

    await queryInterface.bulkInsert('blood_requests', bloodRequests, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('blood_requests', null, {});
  }
};
