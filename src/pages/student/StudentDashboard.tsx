import React from 'react';
import { Link } from 'react-router-dom';
import { Book, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

const StudentDashboard: React.FC = () => {
    const { data } = useData();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to PrepMate</h1>
                    <p className="text-lg text-slate-600">Select a subject to start practicing.</p>
                </div>
                <Link
                    to="/student/analytics"
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-indigo-600 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm font-medium"
                >
                    <Book className="h-5 w-5" />
                    View Performance
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.subjects.map((subject) => (
                    <Link
                        key={subject.id}
                        to={`/student/subjects/${subject.id}`}
                        className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                <Book className="h-8 w-8 text-indigo-600" />
                            </div>
                            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {subject.chapters.length} Chapters
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            {subject.name}
                        </h3>

                        <div className="flex items-center text-slate-500 text-sm group-hover:text-indigo-600 transition-colors">
                            Start Practicing
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                    </Link>
                ))}

                {data.subjects.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-2">No subjects available yet.</p>
                        <p className="text-sm text-slate-400">Ask your admin to add some content.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
