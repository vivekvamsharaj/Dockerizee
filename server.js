const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
// Read from environment variable, fallback to 8080
const PORT = process.env.PORT || 8080; 
const ENV_MODE = process.env.NODE_ENV || 'production';

// Serve frontend static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API route that the frontend calls
app.get('/api/status', (req, res) => {
    res.json({
        message: "Hello from inside the Docker container!",
        status: "Online",
        environment: ENV_MODE
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${ENV_MODE} mode.`);
});