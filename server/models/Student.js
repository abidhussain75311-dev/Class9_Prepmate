const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    id: String,
    subjectId: String,
    chapterId: String,
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    date: Date,
    mode: String // 'practice' or 'exam'
});

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    results: [ResultSchema]
});

module.exports = mongoose.model('Student', StudentSchema);
