'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('blood_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      patient_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      blood_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      hospital_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      required_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      urgency: {
        type: Sequelize.ENUM('normal', 'urgent', 'emergency'),
        defaultValue: 'normal'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'fulfilled', 'rejected'),
        defaultValue: 'pending'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blood_requests');
  }
};
