// A simple script to start the server with better error handling
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Log server startup information
console.log('==== Backend Server Startup ====');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_USER:', process.env.DB_USER);
console.log('- DB_NAME:', process.env.DB_NAME);
console.log('- DB_PASSWORD present:', !!process.env.DB_PASSWORD);

// Check if all required files exist
const requiredFiles = ['index.js', 'database.js', '.env', 'models/index.js'];
let missingFiles = false;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: Required file not found: ${file}`);
    missingFiles = true;
  } else {
    console.log(`File found: ${file}`);
  }
});

if (missingFiles) {
  console.error('Startup aborted due to missing files');
  process.exit(1);
}

// Start the actual server
try {
  console.log('Starting server...');
  require('./index.js');
  console.log('Server started successfully');
} catch (error) {
  console.error('Failed to start server:');
  console.error(error);
}
