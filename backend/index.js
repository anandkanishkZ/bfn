require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// Import the database with Sequelize models
const db = require('./database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const donorsRoutes = require('./routes/donors');
const adminRoutes = require('./routes/admin');
const bloodRequestsRoutes = require('./routes/bloodRequests');

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    credentials: true, // Allow cookies if needed
}));
app.options('*', cors());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/donors', donorsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blood-requests', bloodRequestsRoutes);

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 5000;

// First ensure database connection is established
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try a different port.`);
        // Try an alternative port
        const altPort = parseInt(PORT) + 1;
        console.log(`Attempting to use port ${altPort} instead...`);
        app.listen(altPort, () => {
          console.log(`Server is running on alternative port ${altPort}`);
        }).on('error', (altErr) => {
          console.error('Failed to start server on alternative port:', altErr);
          process.exit(1);
        });
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

// Test Sequelize initialization
db.sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));
