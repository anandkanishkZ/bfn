// Load Sequelize models
const db = require('./models');

// Ensure database and tables are properly set up
async function initializeDatabase() {
  try {
    // Sync all defined models to the DB
    console.log('Syncing Sequelize models with the database...');
    await db.sequelize.sync();
    console.log('Database synchronization complete.');
    return true;
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}

// Initialize the database
async function setup() {
  try {
    await initializeDatabase();
    console.log('Connected to the MySQL database successfully with Sequelize');
  } catch (err) {
    console.error('Database setup error:', err);
  }
}

// Run setup
setup();

module.exports = db;
