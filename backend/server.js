require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const todoRoutes = require('./routes/todos');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tododb';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// Serve the static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/todos', todoRoutes);

// Simple health check endpoint (useful for Docker healthchecks / uptime checks)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: NODE_ENV,
    dbState: mongoose.connection.readyState, // 1 = connected
  });
});

// Fallback to index.html for any non-API route (single-page app style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB, then start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${NODE_ENV}]`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
