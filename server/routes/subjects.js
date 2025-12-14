const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// @route   GET /api/subjects
// @desc    Get all subjects (full hierarchy for now)
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json({ subjects: subjects, results: [] }); // Matching AppData structure part
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/subjects
// @desc    Create a new subject
router.post('/', async (req, res) => {
    // Only Admin should access - middleware can be added later
    try {
        const { id, name, chapters } = req.body;

        let subject = new Subject({
            id,
            name,
            chapters: chapters || []
        });

        await subject.save();
        res.json(subject);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/subjects/:id
// @desc    Update entire subject tree (Deep update/Sync)
// This is simplest for "Syncing" from the frontend 
router.put('/:id', async (req, res) => {
    try {
        const { name, chapters } = req.body;

        // Find by custom ID, not _id
        let subject = await Subject.findOne({ id: req.params.id });
        if (!subject) return res.status(404).json({ msg: 'Subject not found' });

        if (name) subject.name = name;
        if (chapters) subject.chapters = chapters;

        await subject.save();
        res.json(subject);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/subjects/:id
// @desc    Delete subject
router.delete('/:id', async (req, res) => {
    try {
        await Subject.findOneAndDelete({ id: req.params.id });
        res.json({ msg: 'Subject removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
