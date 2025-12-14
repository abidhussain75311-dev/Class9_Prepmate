import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { ShortQuestion, LongQuestion } from '../../types';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const SubjectiveView: React.FC = () => {
    const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
    const { data } = useData();

    const subject = data.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);
    const questions = (chapter?.questions.filter(q => q.type !== 'MCQ') || []) as (ShortQuestion | LongQuestion)[];

    const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());

    if (!subject || !chapter) return <div>Chapter not found</div>;
    if (questions.length === 0) return <div>No subjective questions available in this chapter.</div>;

    const toggleAnswer = (id: string) => {
        const newRevealed = new Set(revealedAnswers);
        if (newRevealed.has(id)) {
            newRevealed.delete(id);
        } else {
            newRevealed.add(id);
        }
        setRevealedAnswers(newRevealed);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    to={`/student/subjects/${subject.id}`}
                    className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Chapter
                </Link>
                <span className="text-sm font-medium text-slate-500">
                    {questions.length} Questions
                </span>
            </div>

            <div className="space-y-6">
                {questions.map((question, index) => {
                    const isRevealed = revealedAnswers.has(question.id);

                    return (
                        <div key={question.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${question.type === 'SHORT' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {question.type === 'SHORT' ? 'Short Answer' : 'Long Answer'}
                                    </span>
                                    <span className="text-slate-400 text-sm">Question {index + 1}</span>
                                </div>

                                <div className="text-lg font-medium text-slate-900 mb-4">
                                    <MarkdownRenderer>{question.text}</MarkdownRenderer>
                                </div>

                                <button
                                    onClick={() => toggleAnswer(question.id)}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                                >
                                    {isRevealed ? (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            Hide Answer
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            Show Answer
                                        </>
                                    )}
                                </button>
                            </div>

                            {isRevealed && (
                                <div className="bg-slate-50 p-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Model Answer
                                    </p>
                                    <div className="text-slate-700 leading-relaxed">
                                        <MarkdownRenderer>{question.answerKey}</MarkdownRenderer>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubjectiveView;
