import React, { useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, PlayCircle, Timer, Printer, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useData } from '../../context/DataContext';
import TestPaper from '../../components/TestPaper';

const ChapterSelect: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const { data } = useData();
    const printRef = useRef<HTMLDivElement>(null);
    const [printChapterId, setPrintChapterId] = React.useState<string | null>(null);
    const [randomizedChapter, setRandomizedChapter] = React.useState<any>(null);

    // Quiz Config State
    const [configChapter, setConfigChapter] = React.useState<{ id: string, title: string } | null>(null);
    const [configMode, setConfigMode] = React.useState<'practice' | 'exam'>('practice');

    const subject = data.subjects.find(s => s.id === subjectId);

    // We need to render the TestPaper but hide it from view, only used for printing
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `PrepMate - ${subject?.name} - ${randomizedChapter?.title || 'Test Paper'}`,
    });

    const triggerPrint = (chapterId: string) => {
        const chapter = subject?.chapters.find(c => c.id === chapterId);
        if (!chapter) return;

        // Filter and randomize questions
        const mcqs = (chapter.questions || []).filter(q => q.type === 'MCQ');
        const shorts = (chapter.questions || []).filter(q => q.type === 'SHORT');
        const longs = (chapter.questions || []).filter(q => q.type === 'LONG');

        // Randomize array helper
        const shuffle = (array: any[]) => {
            return array.sort(() => Math.random() - 0.5);
        };

        const selectedMcqs = shuffle([...mcqs]).slice(0, 10);
        const selectedShorts = shuffle([...shorts]).slice(0, 5);
        const selectedLongs = shuffle([...longs]).slice(0, 3);

        const combinedQuestions = [...selectedMcqs, ...selectedShorts, ...selectedLongs];

        setRandomizedChapter({
            ...chapter,
            questions: combinedQuestions
        });

        setPrintChapterId(chapterId);
    };

    // Effect to trigger print once the chapter is selected and component re-renders
    React.useEffect(() => {
        if (printChapterId && randomizedChapter) {
            handlePrint();
            setPrintChapterId(null); // Reset after printing
            setRandomizedChapter(null);
        }
    }, [printChapterId, randomizedChapter, handlePrint]);

    const handleStartQuiz = (limit: number | 'all') => {
        if (!configChapter || !subject) return;
        navigate(`/student/subjects/${subject.id}/chapters/${configChapter.id}/mcq?mode=${configMode}&limit=${limit}`);
    };

    if (!subject) {
        return <div className="p-8 text-center">Subject not found</div>;
    }

    return (
        <div className="space-y-6">
            <Link
                to="/"
                className="flex items-center text-slate-500 hover:text-slate-900 transition-colors inline-block"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Subjects
            </Link>

            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{subject.name}</h1>
                <p className="text-slate-600">Select a chapter to practice questions.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {(subject.chapters || []).map((chapter) => {
                    const mcqCount = (chapter.questions || []).filter(q => q.type === 'MCQ').length;
                    const subjectiveCount = (chapter.questions || []).filter(q => q.type !== 'MCQ').length;

                    return (
                        <div key={chapter.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <FileText className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{chapter.title}</h3>
                                        <div className="flex gap-3 text-sm text-slate-500">
                                            <span>{mcqCount} MCQs</span>
                                            <span>•</span>
                                            <span>{subjectiveCount} Subjective</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {mcqCount > 0 && (
                                        <div className="flex gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setConfigChapter({ id: chapter.id, title: chapter.title });
                                                        setConfigMode('practice');
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                                                >
                                                    <PlayCircle className="h-4 w-4" />
                                                    Practice
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setConfigChapter({ id: chapter.id, title: chapter.title });
                                                        setConfigMode('exam');
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                                >
                                                    <Timer className="h-4 w-4" />
                                                    Exam Mode
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {subjectiveCount > 0 && (
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/student/subjects/${subject.id}/chapters/${chapter.id}/subjective`}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                                            >
                                                <FileText className="h-4 w-4" />
                                                View Questions
                                            </Link>
                                            <button
                                                onClick={() => triggerPrint(chapter.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                                                title="Download PDF Test Paper"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                    {mcqCount === 0 && subjectiveCount === 0 && (
                                        <span className="text-sm text-slate-400 italic px-4 py-2">No questions available</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {(subject.chapters || []).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No chapters available for this subject.</p>
                    </div>
                )}
            </div>

            {/* Hidden Test Paper for Printing */}
            <div className="hidden">
                {randomizedChapter && (
                    <TestPaper
                        ref={printRef}
                        subject={subject}
                        chapter={randomizedChapter}
                    />
                )}
            </div>
            {/* Quiz Configuration Modal */}
            {configChapter && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">
                                {configMode === 'practice' ? 'Practice Session' : 'Exam Mode'}
                            </h3>
                            <button
                                onClick={() => setConfigChapter(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-slate-600 mb-6">
                                How many questions would you like to attempt?
                            </p>

                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => handleStartQuiz(10)}
                                    className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-medium text-slate-700 transition-colors flex justify-between items-center group"
                                >
                                    <span>10 Questions</span>
                                    <span className="text-slate-400 group-hover:text-indigo-600">→</span>
                                </button>
                                <button
                                    onClick={() => handleStartQuiz(20)}
                                    className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-medium text-slate-700 transition-colors flex justify-between items-center group"
                                >
                                    <span>20 Questions</span>
                                    <span className="text-slate-400 group-hover:text-indigo-600">→</span>
                                </button>
                                <button
                                    onClick={() => handleStartQuiz('all')}
                                    className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-medium text-slate-700 transition-colors flex justify-between items-center group"
                                >
                                    <span>All Available Questions</span>
                                    <span className="text-slate-400 group-hover:text-indigo-600">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterSelect;
