const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   POST /api/student/results
// @desc    Save quiz result
router.post('/results', async (req, res) => {
    const { email, result } = req.body; // Expecting email to identify user for now (simple)

    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        student.results.push(result);
        await student.save();

        res.json(student.results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
