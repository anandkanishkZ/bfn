const { Sequelize } = require('sequelize');
const config = require('./config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false, // Disable logging in production
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Initialize models
const models = {
  User: require('./models/user')(sequelize, Sequelize.DataTypes),
  Donor: require('./models/donor')(sequelize, Sequelize.DataTypes),
  BloodRequest: require('./models/bloodRequest')(sequelize, Sequelize.DataTypes),
  Donation: require('./models/donation')(sequelize, Sequelize.DataTypes),
  Notification: require('./models/notification')(sequelize, Sequelize.DataTypes)
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
  testConnection
};