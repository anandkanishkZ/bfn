const mysql = require('mysql2/promise');
const path = require('path');

// Check if dotenv is properly loaded
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.warn('Warning: Some database environment variables are missing. Loading .env file explicitly...');
  
  // Try to load .env explicitly
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

// Load environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || 'bfn';

console.log(`Database config: Host=${DB_HOST}, User=${DB_USER}, DB=${DB_NAME}, Password length=${DB_PASSWORD ? DB_PASSWORD.length : 0}`);

// Create database if it doesn't exist
async function initDatabase() {
  try {
    // First connect without specifying a database to create the database if needed
    const tempPool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 2,
      queueLimit: 0
    });

    console.log('Attempting to connect to MySQL to check if database exists...');
    
    // Check if database exists, create if not
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`Ensured database ${DB_NAME} exists`);
    
    // Now create the tables if they don't exist
    await tempPool.query(`USE ${DB_NAME}`);
    
    // Create users table if it doesn't exist
    await tempPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Ensured users table exists');
    
    // Release the temporary pool
    await tempPool.end();
    console.log('Database initialization complete');
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err; // Re-throw to handle it in the calling function
  }
}

// Now create the main connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection and initialize the database
async function setup() {
  try {
    await initDatabase();
    const connection = await pool.getConnection();
    console.log('Connected to the MySQL database successfully');
    connection.release();
  } catch (err) {
    console.error('Database setup error:', err);
  }
}

setup();

module.exports = pool;
