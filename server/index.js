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
const router = express.Router();
router.use('/subjects', require('./routes/subjects'));
router.use('/admin', require('./routes/admin'));
router.use('/auth', require('./routes/auth'));
router.use('/student', require('./routes/student'));

// Mount router at both standard API path and Netlify Function path
app.use('/api', router);
app.use('/.netlify/functions/api', router);

app.get('/', (req, res) => {
    res.send('PrepMate API is running');
});

const PORT = process.env.PORT || 5000;

// Export for Vercel (Serverless)
module.exports = app;

// Listen only for local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}
