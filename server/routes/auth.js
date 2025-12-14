const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   POST /api/auth/register
// @desc    Register a new student
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let student = await Student.findOne({ email });
        if (student) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        student = new Student({
            name,
            email,
            password
        });

        await student.save();

        // Return simple user object (excluding password)
        res.json({
            id: student._id,
            name: student.name,
            email: student.email,
            results: student.results
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Auth student & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Simple password match (In production use bcrypt)
        if (password !== student.password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        res.json({
            id: student._id,
            name: student.name,
            email: student.email,
            results: student.results
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
