const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    id: String, // We persist the frontend ID (q_xxx)
    type: { type: String, enum: ['MCQ', 'SHORT', 'LONG'], required: true },
    text: String,
    // MCQ specific
    options: [String],
    correctIndex: Number,
    explanation: String,
    // Subjective specific
    answerKey: String, // markdown
});

const ChapterSchema = new mongoose.Schema({
    id: String, // chap_xxx
    title: String,
    description: String,
    questions: [QuestionSchema]
});

// We are embedding chapters and questions because the expected data size is relatively small 
// per subject (hundreds, not millions) and it simplifies the "Local-First" to "Server" transition
// where the frontend expects a nested JSON structure.
const SubjectSchema = new mongoose.Schema({
    id: String, // sub_xxx
    name: String,
    chapters: [ChapterSchema]
});

module.exports = mongoose.model('Subject', SubjectSchema);
