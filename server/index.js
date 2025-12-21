const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for potential large imports

// Database Connection
connectDB();

// Routes
// We will define these shortly
// Routes
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));

app.get('/', (req, res) => {
    res.send('PrepMate API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
