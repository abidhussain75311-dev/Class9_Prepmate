import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Edit2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { QuestionType, MCQ, ShortQuestion, LongQuestion, AnyQuestion } from '../../types';
import RichTextEditor from '../../components/RichTextEditor';

const QuestionEditor: React.FC = () => {
    const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
    const navigate = useNavigate();
    const { data, addQuestion, updateQuestion, deleteQuestion } = useData();

    const subject = data.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newQuestionType, setNewQuestionType] = useState<QuestionType>('MCQ');

    // Form State
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '', '']);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [answerKey, setAnswerKey] = useState('');
    const [explanation, setExplanation] = useState('');

    if (!subject || !chapter) {
        return <div>Chapter not found</div>;
    }

    const resetForm = () => {
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectIndex(0);
        setAnswerKey('');
        setExplanation('');
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (question: AnyQuestion) => {
        setEditingId(question.id);
        setNewQuestionType(question.type);
        setQuestionText(question.text);

        if (question.type === 'MCQ') {
            setOptions((question as MCQ).options);
            setCorrectIndex((question as MCQ).correctIndex);
            setExplanation((question as MCQ).explanation || '');
        } else {
            setAnswerKey((question as ShortQuestion | LongQuestion).answerKey);
        }

        setIsAdding(true);
    };

    const handleAddQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting question form', { editingId, newQuestionType });

        let newQuestion: Omit<AnyQuestion, 'id'>;

        if (newQuestionType === 'MCQ') {
            newQuestion = {
                type: 'MCQ',
                text: questionText,
                options: options.filter(o => o.trim() !== ''),
                correctIndex,
                explanation: explanation.trim() || undefined
            } as Omit<MCQ, 'id'>;
        } else if (newQuestionType === 'SHORT') {
            newQuestion = {
                type: 'SHORT',
                text: questionText,
                answerKey: answerKey
            } as Omit<ShortQuestion, 'id'>;
        } else {
            newQuestion = {
                type: 'LONG',
                text: questionText,
                answerKey: answerKey
            } as Omit<LongQuestion, 'id'>;
        }

        console.log('New question payload:', newQuestion);

        if (editingId) {
            console.log('Updating existing question', editingId);
            updateQuestion(subject.id, chapter.id, editingId, newQuestion);
        } else {
            console.log('Adding new question');
            addQuestion(subject.id, chapter.id, newQuestion);
        }
        resetForm();
    };

    const handleDelete = (questionId: string) => {
        if (window.confirm('Delete this question?')) {
            deleteQuestion(subject.id, chapter.id, questionId);
        }
    };

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate(`/admin/subjects/${subject.id}`)}
                className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Chapters
            </button>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{chapter.title} - Questions</h1>
                    <p className="text-slate-500">Manage questions for {chapter.title}</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => {
                            resetForm();
                            setIsAdding(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Question
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
                    <h2 className="text-lg font-semibold mb-4">Add New Question</h2>
                    <form onSubmit={handleAddQuestion}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Question Type</label>
                                <select
                                    value={newQuestionType}
                                    onChange={(e) => setNewQuestionType(e.target.value as QuestionType)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="MCQ">Multiple Choice (MCQ)</option>
                                    <option value="SHORT">Short Answer</option>
                                    <option value="LONG">Long Answer</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
                            <RichTextEditor
                                value={questionText}
                                onChange={setQuestionText}
                                placeholder="Enter the question here... (Supports Markdown & Math)"
                                rows={4}
                            />
                        </div>

                        {newQuestionType === 'MCQ' && (
                            <div className="space-y-3 mb-4">
                                <label className="block text-sm font-medium text-slate-700">Options</label>
                                {options.map((option, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="correctOption"
                                            checked={correctIndex === idx}
                                            onChange={() => setCorrectIndex(idx)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...options];
                                                newOptions[idx] = e.target.value;
                                                setOptions(newOptions);
                                            }}
                                            required
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder={`Option ${idx + 1}`}
                                        />
                                    </div>
                                ))}
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Explanation (Optional)</label>
                                    <textarea
                                        value={explanation}
                                        onChange={(e) => setExplanation(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Explain why this is the correct answer..."
                                    />
                                </div>
                            </div>
                        )}

                        {(newQuestionType === 'SHORT' || newQuestionType === 'LONG') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Answer Key / Model Answer</label>
                                <RichTextEditor
                                    value={answerKey}
                                    onChange={setAnswerKey}
                                    placeholder="Enter the ideal answer or key points..."
                                    rows={5}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <Save className="h-4 w-4" />
                                {editingId ? 'Update Question' : 'Save Question'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {chapter.questions.map((question, index) => (
                    <div key={question.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${question.type === 'MCQ' ? 'bg-blue-100 text-blue-700' :
                                        question.type === 'SHORT' ? 'bg-green-100 text-green-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                        {question.type}
                                    </span>
                                    <span className="text-slate-400 text-sm">Question {index + 1}</span>
                                </div>
                                <p className="text-slate-900 font-medium mb-3">{question.text}</p>

                                {question.type === 'MCQ' && (
                                    <div className="space-y-1 pl-4 border-l-2 border-slate-100">
                                        {(question as MCQ).options.map((opt, idx) => (
                                            <div key={idx} className={`text-sm ${idx === (question as MCQ).correctIndex ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                                                {String.fromCharCode(65 + idx)}. {opt}
                                                {idx === (question as MCQ).correctIndex && " ✓"}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {(question.type === 'SHORT' || question.type === 'LONG') && (
                                    <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                                        <strong>Answer Key:</strong> {(question as ShortQuestion).answerKey}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(question)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(question.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {chapter.questions.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No questions added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionEditor;
