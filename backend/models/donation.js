'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    static associate(models) {
      Donation.belongsTo(models.Donor, {
        foreignKey: 'donor_id',
        as: 'donor'
      });
      Donation.belongsTo(models.BloodRequest, {
        foreignKey: 'request_id',
        as: 'request'
      });
    }
  }
  
  Donation.init({
    donor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'donors',
        key: 'id'
      }
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'blood_requests',
        key: 'id'
      }
    },
    donation_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Donation',
    tableName: 'donations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Donation;
};