const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
// Default to 8080 to match our Docker configurations
const PORT = process.env.PORT || 8080; 
const ENV_MODE = process.env.NODE_ENV || 'production';

// 1. Serve the static frontend assets from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. API Endpoint that the frontend will query
app.get('/api/status', (req, res) => {
    res.json({
        message: "Hello from inside the Docker container!",
        status: "Online",
        environment: ENV_MODE,
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server successfully running on port ${PORT} in ${ENV_MODE} mode.`);
});