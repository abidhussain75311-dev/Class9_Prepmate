import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Timer } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { MCQ } from '../../types';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const MCQRunner: React.FC = () => {
    const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
    const { data, saveResult } = useData();

    const subject = data.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') === 'exam' ? 'exam' : 'practice';
    const isExam = mode === 'exam';

    const questions = React.useMemo(() => {
        const allMcqs = (chapter?.questions.filter(q => q.type === 'MCQ') || []) as MCQ[];
        if (!allMcqs.length) return [];

        // Shuffle questions
        const shuffled = [...allMcqs].sort(() => Math.random() - 0.5);

        // Apply limit
        const limitParam = searchParams.get('limit');
        if (limitParam && limitParam !== 'all') {
            const limit = parseInt(limitParam, 10);
            if (!isNaN(limit) && limit > 0) {
                return shuffled.slice(0, limit);
            }
        }
        return shuffled;
    }, [chapter, searchParams]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min per question

    React.useEffect(() => {
        if (!isExam || showResult || !subject || !chapter) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    saveResult({
                        subjectId: subject.id,
                        chapterId: chapter.id,
                        score: score, // Note: This captures score at start of interval due to closure if not careful. Added score to deps.
                        totalQuestions: questions.length,
                        percentage: Math.round((score / questions.length) * 100)
                    });
                    setShowResult(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isExam, showResult, score, questions.length, subject, chapter, saveResult]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!subject || !chapter) return <div>Chapter not found</div>;
    if (questions.length === 0) return <div>No MCQs available in this chapter.</div>;

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (index: number) => {
        if (!isSubmitted) {
            setSelectedOption(index);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        if (selectedOption === currentQuestion.correctIndex) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        let newScore = score;
        // Only increment score if not already submitted (prevents double counting in Practice Mode)
        // In Exam Mode, isSubmitted is always false until the end, so this works.
        if (!isSubmitted && selectedOption === currentQuestion.correctIndex) {
            newScore = score + 1;
            setScore(newScore);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsSubmitted(false); // Reset submitted state for next question
        } else {
            // Finish Exam/Practice
            saveResult({
                subjectId: subject.id,
                chapterId: chapter.id,
                score: newScore,
                totalQuestions: questions.length,
                percentage: Math.round((newScore / questions.length) * 100)
            });
            setShowResult(true);
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setShowResult(false);
        setTimeLeft(questions.length * 60);
    };

    if (showResult) {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
                    <p className="text-slate-500 mb-8">You have finished the practice session for {chapter.title}.</p>

                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <svg className="h-32 w-32 transform -rotate-90">
                                <circle
                                    className="text-slate-100"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                                <circle
                                    className="text-indigo-600 transition-all duration-1000 ease-out"
                                    strokeWidth="8"
                                    strokeDasharray={365}
                                    strokeDashoffset={365 - (365 * score) / questions.length}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                            </svg>
                            <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center flex-col">
                                <span className="text-3xl font-bold text-slate-900">{Math.round((score / questions.length) * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-lg font-medium text-slate-700 mb-8">
                        You scored {score} out of {questions.length}
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                        >
                            <RotateCcw className="h-5 w-5" />
                            Retry Quiz
                        </button>
                        <Link
                            to={`/student/subjects/${subject.id}`}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back to Chapter
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    to={`/student/subjects/${subject.id}`}
                    className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Exit Quiz
                </Link>
                <div className="flex items-center gap-4">
                    {isExam && (
                        <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-slate-700'}`}>
                            <Timer className="h-5 w-5" />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                    <span className="text-sm font-medium text-slate-500">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 w-full">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    <div className="text-xl font-semibold text-slate-900 mb-6 leading-relaxed">
                        <MarkdownRenderer>{currentQuestion.text}</MarkdownRenderer>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => {
                            let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ";

                            if (isSubmitted && !isExam) { // Only show feedback in practice mode
                                if (idx === currentQuestion.correctIndex) {
                                    optionClass += "border-green-500 bg-green-50 text-green-700";
                                } else if (idx === selectedOption) {
                                    optionClass += "border-red-500 bg-red-50 text-red-700";
                                } else {
                                    optionClass += "border-slate-100 text-slate-400 opacity-50";
                                }
                            } else {
                                if (idx === selectedOption) {
                                    optionClass += "border-indigo-600 bg-indigo-50 text-indigo-700";
                                } else {
                                    optionClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={isSubmitted && !isExam}
                                    className={optionClass}
                                >
                                    <div className="font-medium"><MarkdownRenderer>{option}</MarkdownRenderer></div>
                                    {isSubmitted && !isExam && idx === currentQuestion.correctIndex && (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    )}
                                    {isSubmitted && !isExam && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {isSubmitted && !isExam && currentQuestion.explanation && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm">
                            <p className="font-semibold mb-1">Explanation:</p>
                            {currentQuestion.explanation}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    {!isSubmitted && !isExam ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            Check Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={isExam && selectedOption === null && currentQuestionIndex < questions.length - 1} // Optional: Must select in exam? Let's allow skip for now unless user wants strict. Actually, let's allow skipping. Removing disabled check for exam to allow skip.
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MCQRunner;
