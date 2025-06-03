#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const { stdout, stderr } = await execPromise(command);
    console.log(stdout);
    if (stderr) console.error('stderr:', stderr);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function setupDatabase() {
  try {
    console.log('----- Database Setup -----');
    
    // Run migrations
    console.log('\n>> Running migrations...');
    await runCommand('npx sequelize-cli db:migrate');
    
    // Run seeders
    console.log('\n>> Running seeders...');
    await runCommand('npx sequelize-cli db:seed:all');
    
    console.log('\n----- Database setup completed successfully! -----');
  } catch (error) {
    console.error('\n----- Database setup failed! -----');
    console.error(error);
    process.exit(1);
  }
}

// Execute the setup
setupDatabase();
