const express = require('express');
const router = express.Router();
const AdminConfig = require('../models/AdminConfig');
require('dotenv').config();

// Helper to get passcode
const getPasscode = async () => {
    let config = await AdminConfig.findOne({ key: 'admin_passcode' });
    if (!config) {
        // Initialize if not exists
        const defaultPass = process.env.ADMIN_PASSCODE || 'admin123';
        config = new AdminConfig({ key: 'admin_passcode', value: defaultPass });
        await config.save();
    }
    return config.value;
};

// @route   POST /api/admin/login
// @desc    Verify admin passcode
router.post('/login', async (req, res) => {
    try {
        const { passcode } = req.body;
        const currentPasscode = await getPasscode();

        if (passcode === currentPasscode) {
            res.json({ success: true, token: 'mock-token-123' });
        } else {
            res.status(401).json({ success: false, msg: 'Invalid passcode' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/admin/update-passcode
// @desc    Update admin passcode
router.post('/update-passcode', async (req, res) => {
    try {
        const { newPasscode } = req.body;

        let config = await AdminConfig.findOne({ key: 'admin_passcode' });
        if (!config) {
            config = new AdminConfig({ key: 'admin_passcode', value: newPasscode });
        } else {
            config.value = newPasscode;
        }
        await config.save();

        res.json({ success: true, msg: 'Passcode updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
