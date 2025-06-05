'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BloodRequest extends Model {
    static associate(models) {
      // A blood request belongs to a user (requester)
      BloodRequest.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'requester'
      });
    }
  }
  
  BloodRequest.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    patient_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    blood_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    hospital_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    required_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    urgency: {
      type: DataTypes.ENUM('normal', 'urgent', 'emergency'),
      defaultValue: 'normal'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'fulfilled', 'rejected'),
      defaultValue: 'pending'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'BloodRequest',
    tableName: 'blood_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return BloodRequest;
};
